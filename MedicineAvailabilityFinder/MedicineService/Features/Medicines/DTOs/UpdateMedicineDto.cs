namespace MedicineService.Features.Medicines.Dtos
{
    public class UpdateMedicineDto
    {
        public int MedicineId { get; set; }

        public string MedicineName { get; set; }

        public string Category { get; set; }

        public string Manufacturer { get; set; }

        public string Symptoms { get; set; }
    }
}