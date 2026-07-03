using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetPriceComparisonQuery : IRequest<List<PriceComparisonDto>>
    {
        public string MedicineName { get; set; }
        public double? UserLatitude { get; set; }
        public double? UserLongitude { get; set; }
    }
}
