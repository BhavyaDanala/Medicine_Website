using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class RegisterUserCommand : IRequest<int>
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }

        // Pharmacy-specific fields
        public string? PharmacyName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string? OpeningTime { get; set; }

        public string? ClosingTime { get; set; }
    }
}