using System.Text;
using System.Text.Json;

namespace PharmacyService.Services
{
    public class NotificationService
    {
        private readonly HttpClient _httpClient;

        public NotificationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SendStockUpdate( string medicineName, int quantity)
        {
            var payload = new
            {
                medicineName,
                quantity,
                message = $"{medicineName} stock updated"
            };

            var json = JsonSerializer.Serialize(payload);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

            await _httpClient.PostAsync(
                "https://localhost:7097/api/Notifications/stock-update",
                content);
        }

        public async Task SendLowStockAlert(string pharmacyName, string medicineName, int quantity)
        {
            var payload = new
            {
                pharmacyName,
                medicineName,
                quantity
            };

            var json = JsonSerializer.Serialize(payload);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            await _httpClient.PostAsync(
                "https://localhost:7097/api/Notifications/low-stock-alert",
                content);
        }
    }
}