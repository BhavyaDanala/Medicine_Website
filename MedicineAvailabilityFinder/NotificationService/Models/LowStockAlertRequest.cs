namespace NotificationService.Models
{
    public class LowStockAlertRequest
    {
        public string PharmacyName { get; set; }

        public string MedicineName { get; set; }

        public int Quantity { get; set; }
    }
}