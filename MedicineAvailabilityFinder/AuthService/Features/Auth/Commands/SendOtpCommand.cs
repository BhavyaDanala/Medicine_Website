using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class SendOtpCommand : IRequest<string>
    {
        public string Email { get; set; }

        public string Purpose { get; set; } // "Register" or "ForgotPassword"
    }
}
