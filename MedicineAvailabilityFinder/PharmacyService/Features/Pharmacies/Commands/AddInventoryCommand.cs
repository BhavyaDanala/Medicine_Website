using MediatR;

namespace PharmacyService.Features.Pharmacies.Commands
{
    public class AddInventoryCommand : IRequest<int>
    {
        public int PharmacyId { get; set; }

        public int MedicineId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public int UserId { get; set; }
    }
}