using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class ActivatePharmacyHandler : IRequestHandler<ActivatePharmacyCommand, bool>
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public ActivatePharmacyHandler(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<bool> Handle(ActivatePharmacyCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                throw new Exception("Invalid activation token.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ActivationToken == request.Token);

            if (user == null || user.ActivationTokenExpiry < DateTime.UtcNow)
            {
                throw new Exception("Activation token is invalid or has expired.");
            }

            if (!IsValidPassword(request.Password))
            {
                throw new Exception("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.ActivationToken = null;
            user.ActivationTokenExpiry = null;
            user.IsActivated = true;
            user.IsActive = true;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            await _emailService.SendPharmacyActivationSuccessEmail(user.Email, user.Name);

            return true;
        }

        private bool IsValidPassword(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8) return false;
            if (!password.Any(char.IsUpper)) return false;
            if (!password.Any(char.IsLower)) return false;
            if (!password.Any(char.IsDigit)) return false;
            if (!password.Any(ch => !char.IsLetterOrDigit(ch))) return false;
            return true;
        }
    }
}
