namespace PharmacyService.Models
{
    public class NotificationLog
    {
        public int Id { get; set; }
        public int PharmacyId { get; set; }
        public int MedicineId { get; set; }
        public string PharmacyName { get; set; }
        public string PharmacyEmail { get; set; }
        public string MedicineName { get; set; }
        public int Quantity { get; set; }
        public DateTime SentAt { get; set; }
        public string NotificationType { get; set; } // "LowStock", "StockUpdate"
        public bool EmailSent { get; set; }
        public string EmailError { get; set; }
    }
}
