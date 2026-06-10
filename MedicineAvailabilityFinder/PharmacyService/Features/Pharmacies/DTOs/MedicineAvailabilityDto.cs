namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class MedicineAvailabilityDto
    {
        public string PharmacyName { get; set; }

        public string MedicineName { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}