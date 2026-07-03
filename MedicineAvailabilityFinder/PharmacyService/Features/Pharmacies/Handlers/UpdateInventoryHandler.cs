using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Services;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class UpdateInventoryHandler : IRequestHandler<UpdateInventoryCommand, bool>
    {
        private readonly ApplicationDbContext _context;
        private readonly NotificationService _notificationService;
        private readonly EmailNotificationService _emailNotificationService;

        public UpdateInventoryHandler(
            ApplicationDbContext context,
            NotificationService notificationService,
            EmailNotificationService emailNotificationService)
        {
            _context = context;
            _notificationService = notificationService;
            _emailNotificationService = emailNotificationService;
        }

        public async Task<bool> Handle(
            UpdateInventoryCommand request,
            CancellationToken cancellationToken)
        {
            var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.UserId == request.UserId);

            if (pharmacy == null)
            {
                return false;
            }

            var inventory = await _context.PharmacyMedicines
                .FirstOrDefaultAsync(
                    x => x.Id == request.InventoryId
                      && x.PharmacyId == pharmacy.PharmacyId);

            if (inventory == null)
                return false;

            inventory.Quantity = request.Quantity;
            inventory.Price = request.Price;
            inventory.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Get the low stock threshold
            var threshold = _emailNotificationService.GetLowStockThreshold();
            Console.WriteLine($"[UpdateInventory] Quantity: {inventory.Quantity}, Threshold: {threshold}");

            if (inventory.Quantity < threshold)
            {
                Console.WriteLine($"[UpdateInventory] Low stock detected! Sending alerts.");

                // Send low stock alert via SignalR/NotificationService
                await _notificationService.SendLowStockAlert(
                    pharmacy.PharmacyName,
                    $"Medicine {inventory.MedicineId}",
                    inventory.Quantity);

                // Send email notification if pharmacy has an email
                Console.WriteLine($"[UpdateInventory] Pharmacy Email: '{pharmacy.Email}'");
                if (!string.IsNullOrEmpty(pharmacy.Email))
                {
                    try
                    {
                        Console.WriteLine($"[UpdateInventory] Sending email to {pharmacy.Email}");
                        await _emailNotificationService.SendLowStockEmail(
                            pharmacy.Email,
                            pharmacy.PharmacyName,
                            $"Medicine {inventory.MedicineId}",
                            inventory.Quantity,
                            pharmacy.PharmacyId,
                            inventory.MedicineId);
                    }
                    catch (Exception ex)
                    {
                        // Log the error but don't fail the inventory update
                        // The email notification service already logs failures
                        Console.WriteLine($"[UpdateInventory] Failed to send low stock email: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine($"[UpdateInventory] SKIPPING email - Pharmacy has no email address configured!");
                }
            }
            else
            {
                await _notificationService.SendStockUpdate(
                    $"Medicine {inventory.MedicineId}",
                    inventory.Quantity);
            }

            return true;
        }
    }
}