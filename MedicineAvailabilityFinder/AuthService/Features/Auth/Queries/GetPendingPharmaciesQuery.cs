using MediatR;

namespace AuthService.Features.Auth.Queries
{
    public class GetPendingPharmaciesQuery : IRequest<List<PendingPharmacyDto>>
    {
    }

    public class PendingPharmacyDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int? PharmacyId { get; set; }
        public string ApprovalStatus { get; set; }
    }
}
