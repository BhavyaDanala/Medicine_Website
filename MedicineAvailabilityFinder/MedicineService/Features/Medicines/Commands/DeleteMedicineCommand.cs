using MediatR;

namespace MedicineService.Features.Medicines.Commands
{
    public class DeleteMedicineCommand : IRequest<bool>
    {
        public int MedicineId { get; set; }
    }
}