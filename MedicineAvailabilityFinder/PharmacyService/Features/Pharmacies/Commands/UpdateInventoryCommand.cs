using MediatR;

namespace PharmacyService.Features.Pharmacies.Commands
{
    public class UpdateInventoryCommand : IRequest<bool>
    {
        public int InventoryId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }
    }
}