using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class SearchMedicineAvailabilityHandler :
        IRequestHandler<SearchMedicineAvailabilityQuery,
        List<MedicineAvailabilityDto>>
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public SearchMedicineAvailabilityHandler(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
        }

        //    public async Task<List<MedicineAvailabilityDto>> Handle(
        //SearchMedicineAvailabilityQuery request,
        //CancellationToken cancellationToken)
        //    {
        //        return new List<MedicineAvailabilityDto>();
        //    }

        public async Task<List<MedicineAvailabilityDto>> Handle(
    SearchMedicineAvailabilityQuery request,
    CancellationToken cancellationToken)
        {
            var medicines =
                await _httpClient.GetFromJsonAsync<List<MedicineDto>>
                (
                    $"https://localhost:7194/api/Medicines/search?searchTerm={request.MedicineName}"
                );

            if (medicines == null || !medicines.Any())
            {
                return new List<MedicineAvailabilityDto>();
            }

            var medicineIds =
                medicines.Select(x => x.MedicineId).ToList();

            var inventoryData = await (
                from pm in _context.PharmacyMedicines
                join p in _context.Pharmacies
                    on pm.PharmacyId equals p.PharmacyId

                where medicineIds.Contains(pm.MedicineId)
                   && pm.Quantity > 0

                select new
                {
                    p.PharmacyName,
                    p.OpeningTime,
                    p.ClosingTime,
                    pm.MedicineId,
                    pm.Quantity,
                    pm.Price,
                    pm.LastUpdated

                }
            ).ToListAsync();

            var result = inventoryData
                .Select(x => new MedicineAvailabilityDto
                {
                    PharmacyName = x.PharmacyName,
                    MedicineName = medicines
                        .First(m => m.MedicineId == x.MedicineId)
                        .MedicineName,
                    Quantity = x.Quantity,
                    Price = x.Price,
                    LastUpdated = x.LastUpdated,

                    OpeningTime = x.OpeningTime,
                    ClosingTime = x.ClosingTime


                })
                .ToList();

            return result;
        }
    }
}