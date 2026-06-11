using MediatR;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;
using Microsoft.EntityFrameworkCore;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetNearbyPharmaciesHandler :
        IRequestHandler<GetNearbyPharmaciesQuery,
        List<NearbyPharmacyDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetNearbyPharmaciesHandler(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NearbyPharmacyDto>> Handle(GetNearbyPharmaciesQuery request,
            CancellationToken cancellationToken)

        {
            var pharmacies =
                await _context.Pharmacies.ToListAsync();

            var result = pharmacies.Select(p => 
            
            new NearbyPharmacyDto
                {
                    PharmacyId = p.PharmacyId,
                    PharmacyName = p.PharmacyName,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,

                    DistanceKm =
                        Math.Sqrt(
                            Math.Pow(
                                p.Latitude -
                                request.UserLatitude, 2)
                            +
                            Math.Pow(
                                p.Longitude -
                                request.UserLongitude, 2))
                            * 111
                })
                .OrderBy(x => x.DistanceKm)
                .ToList();

            return result;
        }
    }
}