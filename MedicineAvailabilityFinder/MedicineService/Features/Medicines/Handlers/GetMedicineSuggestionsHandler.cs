using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;

namespace MedicineService.Features.Medicines.Handlers
{
    public class GetMedicineSuggestionsHandler
        : IRequestHandler<GetMedicineSuggestionsQuery, List<string>>
    {
        private readonly ApplicationDbContext _context;

        public GetMedicineSuggestionsHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> Handle(
            GetMedicineSuggestionsQuery request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return new List<string>();
            }

            var query = request.Query.Trim().ToLower();

            // Search for medicines with case-insensitive matching
            var suggestions = await _context.Medicines
                .Where(x => x.MedicineName.ToLower().Contains(query))
                .Select(x => x.MedicineName)
                .Distinct()
                .ToListAsync(cancellationToken);

            // Sort by best match (exact match first, then starts with, then contains)
            var sortedSuggestions = suggestions
                .OrderBy(x =>
                {
                    var nameLower = x.ToLower();
                    if (nameLower == query) return 0; // Exact match
                    if (nameLower.StartsWith(query)) return 1; // Starts with
                    return 2; // Contains
                })
                .ThenBy(x => x) // Alphabetical order for same priority
                .Take(5) // Top 5 results
                .ToList();

            return sortedSuggestions;
        }
    }
}
