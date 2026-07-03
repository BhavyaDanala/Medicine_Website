using DashboardService.Features.Dashboard.DTOs;
using System.Net.Http.Json;
using System.Security.Claims;

namespace DashboardService.Services
{
    public class DashboardAggregatorService
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DashboardAggregatorService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummary()
        {
            var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            var pharmacyIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("PharmacyId")?.Value;
            var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

            Console.WriteLine($"=== Dashboard Summary Debug ===");
            Console.WriteLine($"Auth Header: {authHeader?.Substring(0, Math.Min(50, authHeader.Length))}...");
            Console.WriteLine($"Role Claim: {roleClaim}");
            Console.WriteLine($"PharmacyId Claim: {pharmacyIdClaim}");

            if (!string.IsNullOrEmpty(authHeader))
            {
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", authHeader);
            }

            List<object> medicines = null;
            List<object> pharmacies = null;
            List<object> inventory = null;
            List<object> lowStock = null;

            try
            {
                medicines = await _httpClient.GetFromJsonAsync<List<object>>("https://localhost:7194/api/Medicines");
                Console.WriteLine($"Medicines Count: {medicines?.Count ?? 0}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching medicines: {ex.Message}");
            }

            try
            {
                pharmacies = await _httpClient.GetFromJsonAsync<List<object>>("https://localhost:7191/api/Pharmacies");
                Console.WriteLine($"Pharmacies Count: {pharmacies?.Count ?? 0}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching pharmacies: {ex.Message}");
            }

            var inventoryUrl = roleClaim == "Admin" 
                ? "https://localhost:7191/api/Pharmacies/inventory/all"
                : "https://localhost:7191/api/Pharmacies/inventory";

            if (!string.IsNullOrEmpty(pharmacyIdClaim) && roleClaim != "Admin")
            {
                inventoryUrl += $"?pharmacyId={pharmacyIdClaim}";
            }

            Console.WriteLine($"Inventory URL: {inventoryUrl}");

            try
            {
                inventory = await _httpClient.GetFromJsonAsync<List<object>>(inventoryUrl);
                Console.WriteLine($"Inventory Count: {inventory?.Count ?? 0}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching inventory: {ex.Message}");
            }

            var lowStockUrl = roleClaim == "Admin"
                ? "https://localhost:7191/api/Pharmacies/low-stocks/admin"
                : "https://localhost:7191/api/Pharmacies/low-stock";

            if (!string.IsNullOrEmpty(pharmacyIdClaim) && roleClaim != "Admin")
            {
                lowStockUrl += $"?pharmacyId={pharmacyIdClaim}";
            }

            Console.WriteLine($"Low Stock URL: {lowStockUrl}");

            try
            {
                lowStock = await _httpClient.GetFromJsonAsync<List<object>>(lowStockUrl);
                Console.WriteLine($"Low Stock Count: {lowStock?.Count ?? 0}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching low stock: {ex.Message}");
            }

            Console.WriteLine($"=== End Debug ===");

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