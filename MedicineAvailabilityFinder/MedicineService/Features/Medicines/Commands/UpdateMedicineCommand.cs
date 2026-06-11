using MediatR;
using MedicineService.Features.Medicines.Dtos;

namespace MedicineService.Features.Medicines.Commands
{
    public class UpdateMedicineCommand : IRequest<bool>
    {
        public UpdateMedicineDto Medicine { get; set; }
    }
}