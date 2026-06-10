using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class ForgotPasswordCommand : IRequest<string>
    {
        public string Email { get; set; }
    }
}