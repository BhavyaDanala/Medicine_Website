namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class MedicineDto
    {
        public int MedicineId { get; set; }

        public string MedicineName { get; set; }

        public string Category { get; set; }

        public string Manufacturer { get; set; }
    }
}