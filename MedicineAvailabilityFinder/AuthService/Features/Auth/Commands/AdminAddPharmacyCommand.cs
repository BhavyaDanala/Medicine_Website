using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class AdminAddPharmacyCommand : IRequest<int>
    {
        public string? PharmacyName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? OpeningTime { get; set; }
        public string? ClosingTime { get; set; }
    }
}
