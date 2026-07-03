using System;
using System.Collections.Generic;
using System.Linq;

namespace MedicineService.Common
{
    public class FuzzySearchResult
    {
        public string MedicineName { get; set; }
        public int MedicineId { get; set; }
        public string Category { get; set; }
        public string Manufacturer { get; set; }
        public int Distance { get; set; }
        public double SimilarityScore { get; set; }
    }

    public class FuzzySearchService
    {
        /// <summary>
        /// Calculate Levenshtein distance between two strings
        /// </summary>
        public int CalculateLevenshteinDistance(string source, string target)
        {
            if (string.IsNullOrEmpty(source))
                return target?.Length ?? 0;
            if (string.IsNullOrEmpty(target))
                return source.Length;

            int sourceLength = source.Length;
            int targetLength = target.Length;

            // Create distance matrix
            int[,] distance = new int[sourceLength + 1, targetLength + 1];

            // Initialize first row and column
            for (int i = 0; i <= sourceLength; i++)
                distance[i, 0] = i;
            for (int j = 0; j <= targetLength; j++)
                distance[0, j] = j;

            // Fill the matrix
            for (int i = 1; i <= sourceLength; i++)
            {
                for (int j = 1; j <= targetLength; j++)
                {
                    int cost = (source[i - 1] == target[j - 1]) ? 0 : 1;

                    distance[i, j] = Math.Min(
                        Math.Min(
                            distance[i - 1, j] + 1,      // Deletion
                            distance[i, j - 1] + 1       // Insertion
                        ),
                        distance[i - 1, j - 1] + cost    // Substitution
                    );
                }
            }

            return distance[sourceLength, targetLength];
        }

        /// <summary>
        /// Calculate similarity score (0.0 to 1.0) based on Levenshtein distance
        /// </summary>
        public double CalculateSimilarity(string source, string target)
        {
            if (string.IsNullOrEmpty(source) && string.IsNullOrEmpty(target))
                return 1.0;
            if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target))
                return 0.0;

            int maxLength = Math.Max(source.Length, target.Length);
            if (maxLength == 0)
                return 1.0;

            int distance = CalculateLevenshteinDistance(source, target);
            return 1.0 - ((double)distance / maxLength);
        }

        /// <summary>
        /// Find fuzzy matches for a search term
        /// </summary>
        public List<FuzzySearchResult> FindFuzzyMatches(
            string searchTerm,
            List<Models.Medicine> medicines,
            int maxResults = 5,
            double minSimilarity = 0.3)
        {
            if (string.IsNullOrWhiteSpace(searchTerm) || medicines == null || !medicines.Any())
                return new List<FuzzySearchResult>();

            string normalizedSearch = searchTerm.Trim().ToLower();

            var results = medicines.Select(medicine =>
            {
                string normalizedName = medicine.MedicineName?.ToLower() ?? "";
                
                // Calculate distance and similarity
                int distance = CalculateLevenshteinDistance(normalizedSearch, normalizedName);
                double similarity = CalculateSimilarity(normalizedSearch, normalizedName);

                // Bonus for partial matches (substring containment)
                if (normalizedName.Contains(normalizedSearch) || normalizedSearch.Contains(normalizedName))
                {
                    similarity = Math.Max(similarity, 0.7); // Minimum boost
                }

                // Bonus for matching start of word
                if (normalizedName.StartsWith(normalizedSearch))
                {
                    similarity = Math.Min(1.0, similarity + 0.2);
                }

                return new FuzzySearchResult
                {
                    MedicineName = medicine.MedicineName,
                    MedicineId = medicine.MedicineId,
                    Category = medicine.Category,
                    Manufacturer = medicine.Manufacturer,
                    Distance = distance,
                    SimilarityScore = similarity
                };
            })
            .Where(r => r.SimilarityScore >= minSimilarity)
            .OrderByDescending(r => r.SimilarityScore)
            .ThenBy(r => r.Distance)
            .Take(maxResults)
            .ToList();

            return results;
        }

        /// <summary>
        /// Get the best match suggestion for "Did you mean?" feature
        /// </summary>
        public string GetBestMatchSuggestion(string searchTerm, List<Models.Medicine> medicines)
        {
            var matches = FindFuzzyMatches(searchTerm, medicines, maxResults: 1, minSimilarity: 0.5);
            return matches.FirstOrDefault()?.MedicineName;
        }
    }
}
