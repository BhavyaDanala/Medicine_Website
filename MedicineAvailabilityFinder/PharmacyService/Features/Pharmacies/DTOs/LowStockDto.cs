namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class LowStockDto
    {
        public string PharmacyName { get; set; }

        public string MedicineName { get; set; }

        public int Quantity { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}