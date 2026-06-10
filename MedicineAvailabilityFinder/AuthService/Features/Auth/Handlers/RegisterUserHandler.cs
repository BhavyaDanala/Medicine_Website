using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class RegisterUserHandler :
        IRequestHandler<RegisterUserCommand, int>
    {
        private readonly ApplicationDbContext _context;

        public RegisterUserHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(RegisterUserCommand request,CancellationToken cancellationToken)
        {
            var existingUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == request.Email);

            if (existingUser != null)
            {
                throw new Exception(
                    "User already exists");
            }

            var user = new User
            {
                Name = request.Name,

                Email = request.Email,

                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),

                Role = request.Role
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return user.UserId;
        }
    }
}