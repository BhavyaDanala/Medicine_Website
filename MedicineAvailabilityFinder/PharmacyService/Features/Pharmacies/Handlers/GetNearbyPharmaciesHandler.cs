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

                    DistanceKm = CalculateHaversineDistance(
                        request.UserLatitude,
                        request.UserLongitude,
                        p.Latitude,
                        p.Longitude)
                })
                .OrderBy(x => x.DistanceKm)
                .ToList();

            return result;
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadiusKm = 6371.0;

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            lat1 = ToRadians(lat1);
            lat2 = ToRadians(lat2);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadiusKm * c;
        }

        private double ToRadians(double angle)
        {
            return angle * Math.PI / 180.0;
        }
    }
}