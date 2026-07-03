using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        var handler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; }
        };
        var client = new HttpClient(handler);

        // 1. Login as admin
        var loginData = new { Email = "dhanalabhavya1555@gmail.com", Password = "Admin@123" };
        var loginJson = JsonSerializer.Serialize(loginData);
        var loginContent = new StringContent(loginJson, Encoding.UTF8, "application/json");

        var loginRes = await client.PostAsync("https://localhost:7240/api/Auth/login", loginContent);
        if (!loginRes.IsSuccessStatusCode)
        {
            Console.WriteLine("LOGIN FAILED: " + await loginRes.Content.ReadAsStringAsync());
            return;
        }

        var token = await loginRes.Content.ReadAsStringAsync();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // 2. Add pharmacy
        var addData = new
        {
            PharmacyName = "Test Pharmacy",
            Email = "newpharmacytest1@pharmacy.com",
            PhoneNumber = "1234567890",
            Address = "Test Address",
            Latitude = 12.3,
            Longitude = 45.6,
            OpeningTime = "08:00",
            ClosingTime = "20:00"
        };
        var addJson = JsonSerializer.Serialize(addData);
        var addContent = new StringContent(addJson, Encoding.UTF8, "application/json");

        var addRes = await client.PostAsync("https://localhost:7240/api/Auth/admin-add-pharmacy", addContent);
        Console.WriteLine("STATUS: " + (int)addRes.StatusCode);
        Console.WriteLine("BODY: " + await addRes.Content.ReadAsStringAsync());
    }
}
