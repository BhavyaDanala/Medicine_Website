using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class UpdatePharmacyHandler
        : IRequestHandler<UpdatePharmacyCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        public UpdatePharmacyHandler(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(
            UpdatePharmacyCommand request,
            CancellationToken cancellationToken)
        {
            var pharmacy =
                await _context.Pharmacies
                .FirstOrDefaultAsync(
                    x => x.PharmacyId ==
                    request.Pharmacy.PharmacyId);

            if (pharmacy == null)
            {
                return false;
            }

            pharmacy.PharmacyName = request.Pharmacy.PharmacyName;

            pharmacy.Address = request.Pharmacy.Address;

            pharmacy.PhoneNumber =  request.Pharmacy.PhoneNumber;

            pharmacy.Latitude = request.Pharmacy.Latitude;

            pharmacy.Longitude = request.Pharmacy.Longitude;


            await _context.SaveChangesAsync();

            return true;
        }
    }
}