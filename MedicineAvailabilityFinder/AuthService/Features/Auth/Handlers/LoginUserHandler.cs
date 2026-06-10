using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class LoginUserHandler :
        IRequestHandler<LoginUserCommand, string>
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public LoginUserHandler(
            ApplicationDbContext context,
            JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<string> Handle(
            LoginUserCommand request,
            CancellationToken cancellationToken)
        {
            var user =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == request.Email);

            if (user == null)
            {
                throw new Exception(
                    "Invalid Email");
            }

            bool isValid =
                BCrypt.Net.BCrypt.Verify(
                    request.Password,
                    user.PasswordHash);

            if (!isValid)
            {
                throw new Exception(
                    "Invalid Password");
            }

            return _jwtService.GenerateToken(user);
        }
    }
}