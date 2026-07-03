namespace PharmacyService.Models
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string SenderPassword { get; set; }
        public bool EnableSsl { get; set; }
        public int LowStockThreshold { get; set; } = 10;
    }
}
