using AuthService.Data;
using AuthService.Features.Auth.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, string>
    {
        private readonly ApplicationDbContext _context;

        public ForgotPasswordHandler( ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)

        {
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == request.Email);

            if (user == null)
            {
                throw new Exception( "User not found");
            }

            var token = Guid.NewGuid().ToString();

            user.ResetToken = token;

            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            return $"https://localhost:5001/reset-password?token={token}";
        }
    }
}
