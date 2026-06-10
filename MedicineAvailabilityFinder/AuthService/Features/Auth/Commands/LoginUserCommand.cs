using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class LoginUserCommand : IRequest<string>
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }
}