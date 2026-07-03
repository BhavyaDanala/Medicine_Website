using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Handlers
{
    public class SearchBySymptomHandler : IRequestHandler<SearchBySymptomQuery, SearchBySymptomResult>
    {
        private readonly ApplicationDbContext _context;

        public SearchBySymptomHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SearchBySymptomResult> Handle(SearchBySymptomQuery request, CancellationToken cancellationToken)
        {
            // Parse symptoms from input (supports commas, spaces, multiple spaces)
            var symptoms = ParseSymptoms(request.Symptom);

            if (!symptoms.Any())
            {
                return new SearchBySymptomResult
                {
                    Medicines = new List<Medicine>(),
                    DetectedSymptoms = new List<string>()
                };
            }

            // Get all medicines and filter client-side for multiple symptom matching
            var allMedicines = await _context.Medicines.ToListAsync(cancellationToken);

            // Find medicines that match ANY of the symptoms (OR logic)
            var matchingMedicines = allMedicines
                .Where(medicine =>
                {
                    var medicineSymptoms = medicine.Symptoms?.ToLower() ?? "";
                    return symptoms.Any(symptom => medicineSymptoms.Contains(symptom.ToLower()));
                })
                .GroupBy(m => m.MedicineId) // Remove duplicates by MedicineId
                .Select(g => g.First())
                .ToList();

            return new SearchBySymptomResult
            {
                Medicines = matchingMedicines,
                DetectedSymptoms = symptoms
            };
        }

        /// <summary>
        /// Parse symptoms from input string supporting commas, spaces, and multiple spaces
        /// Examples: "fever,cough" -> ["fever", "cough"]
        ///           "fever cough" -> ["fever", "cough"]
        ///           "fever  headache  cough" -> ["fever", "headache", "cough"]
        /// </summary>
        private List<string> ParseSymptoms(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return new List<string>();

            // Replace commas with spaces, then split by whitespace
            var normalized = input
                .Replace(',', ' ')  // Convert commas to spaces
                .Replace("  ", " ") // Replace multiple spaces with single space (multiple passes)
                .Replace("  ", " ")
                .Replace("  ", " ")
                .Trim();

            // Split by whitespace and remove empty entries
            var symptoms = normalized
                .Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLower())
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Distinct() // Remove duplicates
                .ToList();

            return symptoms;
        }
    }
}