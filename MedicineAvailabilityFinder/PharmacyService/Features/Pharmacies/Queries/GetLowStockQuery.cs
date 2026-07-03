using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetLowStockQuery: IRequest<List<LowStockDto>>
    {
        public int Threshold { get; set; } = 5;
        public int? UserId { get; set; }
        public int? PharmacyId { get; set; }
    }
}