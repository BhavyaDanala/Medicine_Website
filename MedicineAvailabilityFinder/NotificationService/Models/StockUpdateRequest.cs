namespace NotificationService.Models
{
    public class StockUpdateRequest
    {
        public string MedicineName { get; set; }

        public int Quantity { get; set; }

        public string Message { get; set; }
    }
}