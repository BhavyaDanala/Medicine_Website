using MediatR;

namespace MedicineService.Features.Medicines.Commands
{
    public class AddMedicineCommand : IRequest<int>
    {
        public string MedicineName { get; set; }

        public string Category { get; set; }

        public string Manufacturer { get; set; }
    }
}