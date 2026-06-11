using MediatR;
using MedicineService.Data;
using MedicineService.Features.Medicines.Commands;
using Microsoft.EntityFrameworkCore;

namespace MedicineService.Features.Medicines.Handlers
{
    public class DeleteMedicineHandler : IRequestHandler<DeleteMedicineCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        public DeleteMedicineHandler( ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteMedicineCommand request, CancellationToken cancellationToken)
        {
            var medicine =
                await _context.Medicines
                .FirstOrDefaultAsync(
                    x => x.MedicineId ==
                    request.MedicineId);

            if (medicine == null)
            {
                return false;
            }

            _context.Medicines.Remove(medicine);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}