using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetAllPharmaciesQuery: IRequest<List<PharmacyDto>>
    {
    }
}