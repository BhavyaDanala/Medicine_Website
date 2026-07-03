using MediatR;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetAllInventoryForAdminQuery : IRequest<List<PharmacyMedicine>>
    {
    }
}
