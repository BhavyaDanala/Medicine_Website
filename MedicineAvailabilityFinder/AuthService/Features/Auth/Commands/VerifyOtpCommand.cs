using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class VerifyOtpCommand : IRequest<bool>
    {
        public string Email { get; set; }

        public string OtpCode { get; set; }

        public string Purpose { get; set; } // "Register" or "ForgotPassword"
    }
}
