namespace AuthService.Models
{
    public class OtpVerification
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string OtpCode { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public string Purpose { get; set; } // "Register" or "ForgotPassword"
    }
}
