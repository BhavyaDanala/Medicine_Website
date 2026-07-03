using MediatR;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetNotificationHistoryQuery : IRequest<List<NotificationLog>>
    {
        public int? PharmacyId { get; set; }
        public int? UserId { get; set; }
        public string NotificationType { get; set; }
        public int? Limit { get; set; } = 50;
    }
}
