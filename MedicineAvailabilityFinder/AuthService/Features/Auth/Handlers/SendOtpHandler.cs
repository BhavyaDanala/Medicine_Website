using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Models;
using AuthService.Services;
using MediatR;

namespace AuthService.Features.Auth.Handlers
{
    public class SendOtpHandler : IRequestHandler<SendOtpCommand, string>
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public SendOtpHandler(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<string> Handle(SendOtpCommand request, CancellationToken cancellationToken)
        {
            var otp = new Random().Next(100000, 999999).ToString();
            Console.WriteLine("[INFO] OTP Generated");

            var otpRecord = new OtpVerification
            {
                Email = request.Email,
                OtpCode = BCrypt.Net.BCrypt.HashPassword(otp),
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false,
                Purpose = request.Purpose
            };

            _context.OtpVerifications.Add(otpRecord);
            await _context.SaveChangesAsync();
            Console.WriteLine("[INFO] OTP Saved To Database");

            Console.WriteLine("[INFO] Calling Email Service");
            await _emailService.SendOtpEmail(request.Email, otp, request.Purpose);
            Console.WriteLine("[INFO] Email Service Completed");

            return "OTP sent successfully";
        }
    }
}
