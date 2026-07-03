using MediatR;
using MedicineService.Common;

namespace MedicineService.Features.Medicines.Queries
{
    public class FuzzySearchMedicineQuery : IRequest<FuzzySearchMedicineResult>
    {
        public string SearchTerm { get; set; }
        public int MaxResults { get; set; } = 5;
        public double MinSimilarity { get; set; } = 0.3;
    }

    public class FuzzySearchMedicineResult
    {
        public List<FuzzySearchResult> ExactMatches { get; set; } = new List<FuzzySearchResult>();
        public List<FuzzySearchResult> FuzzyMatches { get; set; } = new List<FuzzySearchResult>();
        public string Suggestion { get; set; }
        public bool HasExactMatches => ExactMatches != null && ExactMatches.Any();
        public bool HasFuzzyMatches => FuzzyMatches != null && FuzzyMatches.Any();
    }
}
