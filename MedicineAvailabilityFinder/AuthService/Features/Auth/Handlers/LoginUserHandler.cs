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

            if (user.PasswordHash == "PENDING_ACTIVATION")
            {
                throw new Exception("Your account setup is not completed yet. Please create your password using the activation link sent to your email.");
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

            if (user.Role == "Pharmacy")
            {
                if (user.ApprovalStatus == "Pending")
                {
                    throw new Exception("Your pharmacy account is pending admin approval.");
                }
                if (user.ApprovalStatus == "Rejected")
                {
                    throw new Exception("Your pharmacy registration request was rejected. Please contact the administrator.");
                }
            }

            return _jwtService.GenerateToken(user);
        }
    }
}