using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class ResetPasswordCommand : IRequest<string>
    {
        public string? Token { get; set; }

        public string? Email { get; set; }

        public string? OtpCode { get; set; }

        public string NewPassword { get; set; }
    }
}