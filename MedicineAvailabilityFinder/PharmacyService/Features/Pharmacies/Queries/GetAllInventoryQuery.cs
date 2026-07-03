using MediatR;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetAllInventoryQuery : IRequest<List<PharmacyMedicine>>
    {
        public int? UserId { get; set; }
        public int? PharmacyId { get; set; }
    }
}