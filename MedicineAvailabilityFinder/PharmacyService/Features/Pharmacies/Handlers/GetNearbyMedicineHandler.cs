using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetNearbyMedicineHandler :
        IRequestHandler<GetNearbyMedicineQuery, List<NearbyMedicineDto>>
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public GetNearbyMedicineHandler(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<List<NearbyMedicineDto>> Handle(
            GetNearbyMedicineQuery request,
            CancellationToken cancellationToken)
        {
            // Step 1: Find the medicine by name
            var medicines = await _httpClient.GetFromJsonAsync<List<MedicineDto>>
            (
                $"https://localhost:7194/api/Medicines/search?searchTerm={Uri.EscapeDataString(request.MedicineName)}"
            );

            if (medicines == null || !medicines.Any())
            {
                return new List<NearbyMedicineDto>();
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
                    p.Address,
                    p.Latitude,
                    p.Longitude,
                    p.OpeningTime,
                    p.ClosingTime,
                    pm.Quantity,
                    pm.Price,
                    pm.MedicineId
                }
            ).ToListAsync(cancellationToken);

            if (!inventoryWithPharmacies.Any())
            {
                return new List<NearbyMedicineDto>();
            }

            // Step 3: Calculate distance for each pharmacy and create result
            var results = inventoryWithPharmacies
                .Select(x =>
                {
                    var distanceKm = CalculateHaversineDistance(
                        request.Latitude,
                        request.Longitude,
                        x.Latitude,
                        x.Longitude);

                    return new NearbyMedicineDto
                    {
                        PharmacyName = x.PharmacyName,
                        DistanceKm = distanceKm,
                        Quantity = x.Quantity,
                        Price = x.Price,
                        OpeningTime = x.OpeningTime,
                        ClosingTime = x.ClosingTime
                    };
                })
                .OrderBy(x => x.DistanceKm) // Sort by nearest first
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
