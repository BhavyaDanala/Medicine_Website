using MediatR;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Models;
using Microsoft.EntityFrameworkCore;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class AddInventoryHandler
        : IRequestHandler<AddInventoryCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public AddInventoryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(
    AddInventoryCommand request,
    CancellationToken cancellationToken)
        {
            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(
                    p => p.UserId == request.UserId);

            if (pharmacy == null)
            {
                throw new Exception("Pharmacy not found");
            }

            var inventory = new PharmacyMedicine
            {
                PharmacyId = pharmacy.PharmacyId,
                MedicineId = request.MedicineId,
                Quantity = request.Quantity,
                Price = request.Price,
                LastUpdated = DateTime.UtcNow
            };

            _context.PharmacyMedicines.Add(inventory);

            await _context.SaveChangesAsync();

            return inventory.Id;
        }
    }
}