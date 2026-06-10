using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetNearbyPharmaciesQuery : IRequest<List<NearbyPharmacyDto>>
    {
        public double UserLatitude { get; set; }

        public double UserLongitude { get; set; }
    }
}
