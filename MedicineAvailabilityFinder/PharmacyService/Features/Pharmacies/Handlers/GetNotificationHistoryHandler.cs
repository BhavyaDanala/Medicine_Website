using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Queries;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetNotificationHistoryHandler : IRequestHandler<GetNotificationHistoryQuery, List<NotificationLog>>
    {
        private readonly ApplicationDbContext _context;

        public GetNotificationHistoryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationLog>> Handle(
            GetNotificationHistoryQuery request,
            CancellationToken cancellationToken)
        {
            var query = _context.NotificationLogs.AsQueryable();

            // If UserId is provided, find the pharmacy for that user
            if (request.UserId.HasValue)
            {
                var pharmacy = await _context.Pharmacies
                    .FirstOrDefaultAsync(p => p.UserId == request.UserId.Value, cancellationToken);

                if (pharmacy != null)
                {
                    query = query.Where(n => n.PharmacyId == pharmacy.PharmacyId);
                }
            }
            // Otherwise use PharmacyId directly
            else if (request.PharmacyId.HasValue)
            {
                query = query.Where(n => n.PharmacyId == request.PharmacyId.Value);
            }

            // Filter by notification type if specified
            if (!string.IsNullOrEmpty(request.NotificationType))
            {
                query = query.Where(n => n.NotificationType == request.NotificationType);
            }

            // Order by most recent first and limit results
            var results = await query
                .OrderByDescending(n => n.SentAt)
                .Take(request.Limit ?? 50)
                .ToListAsync(cancellationToken);

            return results;
        }
    }
}
