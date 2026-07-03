using MediatR;

namespace AuthService.Features.Auth.Commands
{
    public class UpdatePharmacyApprovalCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public string ApprovalStatus { get; set; } // "Approved" or "Rejected"
    }
}
