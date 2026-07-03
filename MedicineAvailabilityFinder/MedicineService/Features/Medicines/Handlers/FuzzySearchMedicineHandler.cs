using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Common;
using MedicineService.Features.Medicines.Queries;

namespace MedicineService.Features.Medicines.Handlers
{
    public class FuzzySearchMedicineHandler
        : IRequestHandler<FuzzySearchMedicineQuery, FuzzySearchMedicineResult>
    {
        private readonly ApplicationDbContext _context;
        private readonly FuzzySearchService _fuzzySearchService;

        public FuzzySearchMedicineHandler(ApplicationDbContext context, FuzzySearchService fuzzySearchService)
        {
            _context = context;
            _fuzzySearchService = fuzzySearchService;
        }

        public async Task<FuzzySearchMedicineResult> Handle(
            FuzzySearchMedicineQuery request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                return new FuzzySearchMedicineResult();
            }

            // Get all medicines for fuzzy matching
            var allMedicines = await _context.Medicines.ToListAsync(cancellationToken);

            // First, try exact/substring matches (existing behavior)
            var normalizedSearch = request.SearchTerm.Trim().ToLower();
            var exactMatches = allMedicines
                .Where(m => m.MedicineName.ToLower().Contains(normalizedSearch))
                .Select(m => new FuzzySearchResult
                {
                    MedicineName = m.MedicineName,
                    MedicineId = m.MedicineId,
                    Category = m.Category,
                    Manufacturer = m.Manufacturer,
                    Distance = 0,
                    SimilarityScore = 1.0
                })
                .ToList();

            // Then, find fuzzy matches
            var fuzzyMatches = _fuzzySearchService.FindFuzzyMatches(
                request.SearchTerm,
                allMedicines,
                request.MaxResults,
                request.MinSimilarity
            );

            // Filter out exact matches from fuzzy results to avoid duplicates
            var exactMatchNames = exactMatches.Select(e => e.MedicineName.ToLower()).ToHashSet();
            fuzzyMatches = fuzzyMatches
                .Where(f => !exactMatchNames.Contains(f.MedicineName.ToLower()))
                .Take(request.MaxResults)
                .ToList();

            // Get suggestion for "Did you mean?" if no exact matches found
            string suggestion = null;
            if (!exactMatches.Any() && fuzzyMatches.Any())
            {
                suggestion = fuzzyMatches.First().MedicineName;
            }

            return new FuzzySearchMedicineResult
            {
                ExactMatches = exactMatches,
                FuzzyMatches = fuzzyMatches,
                Suggestion = suggestion
            };
        }
    }
}
