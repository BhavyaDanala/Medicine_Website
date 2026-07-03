using MediatR;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class AddPharmacyHandler
        : IRequestHandler<AddPharmacyCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public AddPharmacyHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(AddPharmacyCommand request,CancellationToken cancellationToken)
        {
            var pharmacy = new Pharmacy
            {
                PharmacyName = request.PharmacyName,
                Address = request.Address,
                PhoneNumber = request.PhoneNumber,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                UserId = request.UserId,
                Email = request.Email ?? string.Empty,
                OpeningTime = request.OpeningTime ?? string.Empty,
                ClosingTime = request.ClosingTime ?? string.Empty


            };

            _context.Pharmacies.Add(pharmacy);

            await _context.SaveChangesAsync();

            return pharmacy.PharmacyId;
        }
    }
}