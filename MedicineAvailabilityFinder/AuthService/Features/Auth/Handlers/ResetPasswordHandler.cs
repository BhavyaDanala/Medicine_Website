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

        public async Task<string> Handle( ResetPasswordCommand request, CancellationToken cancellationToken)

        {
            var user =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.ResetToken == request.Token);

            if (user == null)
            {
                throw new Exception("Invalid Token");
            }

            if (user.ResetTokenExpiry < DateTime.UtcNow)
            {
                throw new Exception("Token Expired");
            }

            user.PasswordHash =BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "Password Reset Successfully";
        }
    }
}