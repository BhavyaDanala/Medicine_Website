using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Commands
{
    public class UpdatePharmacyCommand : IRequest<bool>
    {
        public UpdatePharmacyDto Pharmacy { get; set; }
    }
}