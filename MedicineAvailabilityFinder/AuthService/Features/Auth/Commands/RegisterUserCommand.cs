using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class RegisterUserCommand : IRequest<int>
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }
    }
}