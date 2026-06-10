using DashboardService.Features.Dashboard.DTOs;
using System.Net.Http.Json;

namespace DashboardService.Services
{
    public class DashboardAggregatorService
    {
        private readonly HttpClient _httpClient;

        public DashboardAggregatorService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        public async Task<DashboardSummaryDto>
    GetDashboardSummary()
        {
            var medicines =
                await _httpClient
                .GetFromJsonAsync<List<object>>
                ("https://localhost:7194/api/Medicines");

            var pharmacies =
                await _httpClient
                .GetFromJsonAsync<List<object>>
                ("https://localhost:7191/api/Pharmacies");

            var inventory =
                await _httpClient
                .GetFromJsonAsync<List<object>>
                ("https://localhost:7191/api/Pharmacies/inventory");

            var lowStock =
                await _httpClient
                .GetFromJsonAsync<List<object>>
                ("https://localhost:7191/api/Pharmacies/low-stock");

            return new DashboardSummaryDto
            {
                TotalMedicines =
                    medicines?.Count ?? 0,

                TotalPharmacies =
                    pharmacies?.Count ?? 0,

                TotalInventoryRecords =
                    inventory?.Count ?? 0,

                LowStockCount =
                    lowStock?.Count ?? 0
            };
        }


    }
}