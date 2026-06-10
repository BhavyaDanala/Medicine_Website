namespace PharmacyService.Models
{
    public class PharmacyMedicine
    {
        public int Id { get; set; }

        public int PharmacyId { get; set; }

        public int MedicineId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}