using MediatR;

namespace PharmacyService.Features.Pharmacies.Commands
{
    public class DeletePharmacyCommand : IRequest<bool>
    {
        public int PharmacyId { get; set; }
    }
}