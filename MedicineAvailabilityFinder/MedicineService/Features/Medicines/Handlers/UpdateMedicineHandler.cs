using MediatR;
using MedicineService.Data;
using MedicineService.Features.Medicines.Commands;
using Microsoft.EntityFrameworkCore;

namespace MedicineService.Features.Medicines.Handlers
{
    public class UpdateMedicineHandler
        : IRequestHandler<UpdateMedicineCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        public UpdateMedicineHandler(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(
            UpdateMedicineCommand request,
            CancellationToken cancellationToken)
        {
            var medicine =
                await _context.Medicines
                .FirstOrDefaultAsync(
                    x => x.MedicineId ==
                    request.Medicine.MedicineId);

            if (medicine == null)
            {
                return false;
            }

            medicine.MedicineName = request.Medicine.MedicineName;

            medicine.Category = request.Medicine.Category;

            medicine.Manufacturer = request.Medicine.Manufacturer;

            medicine.Symptoms = request.Medicine.Symptoms;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}