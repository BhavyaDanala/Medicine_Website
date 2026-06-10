using MediatR;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Queries
{
    public class SearchBySymptomQuery: IRequest<List<Medicine>>
    {
        public string Symptom { get; set; }
    }
}