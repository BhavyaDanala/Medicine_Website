namespace AuthService.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string Role { get; set; }

        public DateTime CreatedAt { get; set; }  = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public string? ResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }

    }
}