using MediatR;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Queries
{
    public class SearchBySymptomQuery : IRequest<SearchBySymptomResult>
    {
        public string Symptom { get; set; }
    }

    public class SearchBySymptomResult
    {
        public List<Medicine> Medicines { get; set; } = new List<Medicine>();
        public List<string> DetectedSymptoms { get; set; } = new List<string>();
    }
}