using MediatR;
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
            var medicine = new Medicine
            {
                MedicineName = request.MedicineName,
                Category = request.Category,
                Manufacturer = request.Manufacturer
            };

            _context.Medicines.Add(medicine);

            await _context.SaveChangesAsync();

            return medicine.MedicineId;
        }
    }
}