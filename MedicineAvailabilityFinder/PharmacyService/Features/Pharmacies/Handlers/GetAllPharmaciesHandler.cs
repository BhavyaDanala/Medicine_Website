using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetAllPharmaciesHandler :IRequestHandler<GetAllPharmaciesQuery,List<PharmacyDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllPharmaciesHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PharmacyDto>> Handle(GetAllPharmaciesQuery request,CancellationToken cancellationToken)
        {
            return await _context.Pharmacies
                .Select(p => new PharmacyDto
                {
                    PharmacyId = p.PharmacyId,
                    PharmacyName = p.PharmacyName,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude
                })
                .ToListAsync();
        }
    }
}