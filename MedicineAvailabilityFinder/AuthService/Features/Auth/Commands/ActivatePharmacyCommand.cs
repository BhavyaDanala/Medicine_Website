using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class ActivatePharmacyCommand : IRequest<bool>
    {
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
