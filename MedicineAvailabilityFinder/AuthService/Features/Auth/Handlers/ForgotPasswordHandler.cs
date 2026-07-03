using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Models;
using AuthService.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, string>
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public ForgotPasswordHandler(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<string> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            var otp = new Random().Next(100000, 999999).ToString();

            var otpRecord = new OtpVerification
            {
                Email = request.Email,
                OtpCode = BCrypt.Net.BCrypt.HashPassword(otp),
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false,
                Purpose = "ForgotPassword"
            };

            _context.OtpVerifications.Add(otpRecord);
            await _context.SaveChangesAsync();

            await _emailService.SendOtpEmail(request.Email, otp, "ForgotPassword");

            return "OTP sent to your email";
        }
    }
}
