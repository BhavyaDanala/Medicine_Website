using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Services;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class UpdateInventoryHandler : IRequestHandler<UpdateInventoryCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        private readonly NotificationService _notificationService;

        public UpdateInventoryHandler(ApplicationDbContext context, NotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<bool> Handle(
     UpdateInventoryCommand request,
     CancellationToken cancellationToken)
        {
            var inventory = await _context.PharmacyMedicines
                .FirstOrDefaultAsync(x => x.Id == request.InventoryId);

            if (inventory == null)
                return false;

            inventory.Quantity = request.Quantity;
            inventory.Price = request.Price;
            inventory.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            if (inventory.Quantity < 10)
            {
                await _notificationService.SendLowStockAlert(
                    $"Pharmacy {inventory.PharmacyId}",
                    $"Medicine {inventory.MedicineId}",
                    inventory.Quantity);
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