using AuthService.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Queries
{
    public class GetPendingPharmaciesHandler : IRequestHandler<GetPendingPharmaciesQuery, List<PendingPharmacyDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetPendingPharmaciesHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PendingPharmacyDto>> Handle(GetPendingPharmaciesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Where(u => u.Role == "Pharmacy" && u.ApprovalStatus == "Pending")
                .Select(u => new PendingPharmacyDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    RegistrationDate = u.CreatedAt,
                    PharmacyId = u.PharmacyId,
                    ApprovalStatus = u.ApprovalStatus
                })
                .ToListAsync(cancellationToken);
        }
    }
}
