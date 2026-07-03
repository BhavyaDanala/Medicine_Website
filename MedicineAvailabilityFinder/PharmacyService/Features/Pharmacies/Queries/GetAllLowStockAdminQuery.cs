using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetAllLowStockAdminQuery:IRequest<List<LowStockDto>>
    {
        public int Threshold { get; set; } = 5;
    }
}
