using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Commands;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Handlers
{
    public class AddMedicineHandler
        : IRequestHandler<AddMedicineCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public AddMedicineHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle
            (AddMedicineCommand request,
             CancellationToken cancellationToken)
        {
            var exists = await _context.Medicines
                .AnyAsync(m => m.MedicineName.ToLower() == request.MedicineName.ToLower(), cancellationToken);

            if (exists)
            {
                throw new InvalidOperationException("A medicine with this name already exists.");
            }
            var medicine = new Medicine
            {
                MedicineName = request.MedicineName,
                Category = request.Category,
                Manufacturer = request.Manufacturer,
                Symptoms = request.Symptoms
            };

            _context.Medicines.Add(medicine);

            await _context.SaveChangesAsync();

            return medicine.MedicineId;
        }
    }
}