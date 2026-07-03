using AuthService.Data;
using AuthService.Features.Auth.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class VerifyOtpHandler : IRequestHandler<VerifyOtpCommand, bool>
    {
        private readonly ApplicationDbContext _context;

        public VerifyOtpHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
        {
            var otpRecord = await _context.OtpVerifications
                .Where(o => o.Email == request.Email
                    && o.Purpose == request.Purpose
                    && !o.IsUsed
                    && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.ExpiresAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                return false;

            var isValid = BCrypt.Net.BCrypt.Verify(request.OtpCode, otpRecord.OtpCode);

            if (!isValid)
                return false;

            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
