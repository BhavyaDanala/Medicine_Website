using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetPriceComparisonHandler :
        IRequestHandler<GetPriceComparisonQuery, List<PriceComparisonDto>>
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public GetPriceComparisonHandler(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<List<PriceComparisonDto>> Handle(
            GetPriceComparisonQuery request,
            CancellationToken cancellationToken)
        {
            // Step 1: Find the medicine by name
            var medicines = await _httpClient.GetFromJsonAsync<List<MedicineDto>>
            (
                $"https://localhost:7194/api/Medicines/search?searchTerm={Uri.EscapeDataString(request.MedicineName)}"
            );

            if (medicines == null || !medicines.Any())
            {
                return new List<PriceComparisonDto>();
            }

            var medicineIds = medicines.Select(x => x.MedicineId).ToList();

            // Step 2: Get all pharmacies with inventory for this medicine
            var inventoryWithPharmacies = await (
                from pm in _context.PharmacyMedicines
                join p in _context.Pharmacies
                    on pm.PharmacyId equals p.PharmacyId
                where medicineIds.Contains(pm.MedicineId)
                   && pm.Quantity > 0
                select new
                {
                    p.PharmacyId,
                    p.PharmacyName,
                    p.Latitude,
                    p.Longitude,
                    p.OpeningTime,
                    p.ClosingTime,
                    pm.Quantity,
                    pm.Price
                }
            ).ToListAsync(cancellationToken);

            if (!inventoryWithPharmacies.Any())
            {
                return new List<PriceComparisonDto>();
            }

            // Step 3: Calculate distance if user location provided
            var results = inventoryWithPharmacies.Select(x =>
            {
                double? distanceKm = null;
                if (request.UserLatitude.HasValue && request.UserLongitude.HasValue)
                {
                    distanceKm = CalculateHaversineDistance(
                        request.UserLatitude.Value,
                        request.UserLongitude.Value,
                        x.Latitude,
                        x.Longitude);
                }

                return new PriceComparisonDto
                {
                    PharmacyName = x.PharmacyName,
                    Price = x.Price,
                    DistanceKm = distanceKm,
                    Quantity = x.Quantity,
                    OpeningTime = x.OpeningTime,
                    ClosingTime = x.ClosingTime
                };
            })
            .OrderBy(x => x.Price) // Sort by cheapest first
            .ToList();

            return results;
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadiusKm = 6371.0;

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            lat1 = ToRadians(lat1);
            lat2 = ToRadians(lat2);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadiusKm * c;
        }

        private double ToRadians(double angle)
        {
            return angle * Math.PI / 180.0;
        }
    }
}
