using AuthService.Data;
using AuthService.Features.Auth.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, string>
    {
        private readonly ApplicationDbContext _context;

        public ResetPasswordHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            // OTP-based reset (new flow)
            if (!string.IsNullOrEmpty(request.Email) && !string.IsNullOrEmpty(request.OtpCode))
            {
                var otpRecord = await _context.OtpVerifications
                    .Where(o => o.Email == request.Email
                        && o.Purpose == "ForgotPassword"
                        && o.IsUsed
                        && o.ExpiresAt > DateTime.UtcNow.AddMinutes(-15))
                    .OrderByDescending(o => o.ExpiresAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                    throw new Exception("OTP session expired. Please request a new OTP.");

                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
                if (user == null)
                    throw new Exception("User not found");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                return "Password Reset Successfully";
            }

            // Legacy token-based reset (fallback)
            var userByToken = await _context.Users
                .FirstOrDefaultAsync(x => x.ResetToken == request.Token);

            if (userByToken == null)
                throw new Exception("Invalid Token");

            if (userByToken.ResetTokenExpiry < DateTime.UtcNow)
                throw new Exception("Token Expired");

            userByToken.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            userByToken.ResetToken = null;
            userByToken.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "Password Reset Successfully";
        }
    }
}