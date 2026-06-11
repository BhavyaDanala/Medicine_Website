using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class DeletePharmacyHandler : IRequestHandler<DeletePharmacyCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        public DeletePharmacyHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle( DeletePharmacyCommand request, CancellationToken cancellationToken)
        {
            var pharmacy =
                await _context.Pharmacies
                .FirstOrDefaultAsync(
                    x => x.PharmacyId ==
                    request.PharmacyId);

            if (pharmacy == null)
            {
                return false;
            }

            _context.Pharmacies.Remove(pharmacy);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}