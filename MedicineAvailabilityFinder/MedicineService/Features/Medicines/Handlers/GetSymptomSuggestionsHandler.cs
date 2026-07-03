using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;

namespace MedicineService.Features.Medicines.Handlers
{
    public class GetSymptomSuggestionsHandler : IRequestHandler<GetSymptomSuggestionsQuery, List<string>>
    {
        private readonly ApplicationDbContext _context;

        public GetSymptomSuggestionsHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> Handle(GetSymptomSuggestionsQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return new List<string>();
            }

            var query = request.Query.Trim().ToLower();

            // Fetch all medicines' symptoms
            var allSymptomsData = await _context.Medicines
                .Where(m => !string.IsNullOrEmpty(m.Symptoms))
                .Select(m => m.Symptoms)
                .ToListAsync(cancellationToken);

            var uniqueSymptoms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var symptomStr in allSymptomsData)
            {
                var parts = symptomStr.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    var cleanPart = part.Trim();
                    if (!string.IsNullOrEmpty(cleanPart) && cleanPart.ToLower().Contains(query))
                    {
                        // Capitalize first letter for better UI presentation
                        if (cleanPart.Length > 0)
                        {
                            cleanPart = char.ToUpper(cleanPart[0]) + cleanPart.Substring(1).ToLower();
                        }
                        uniqueSymptoms.Add(cleanPart);
                    }
                }
            }

            var sortedSuggestions = uniqueSymptoms
                .OrderBy(x =>
                {
                    var nameLower = x.ToLower();
                    if (nameLower == query) return 0;
                    if (nameLower.StartsWith(query)) return 1;
                    return 2;
                })
                .ThenBy(x => x)
                .Take(5)
                .ToList();

            return sortedSuggestions;
        }
    }
}
