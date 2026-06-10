using DashboardService.Features.Dashboard.DTOs;
using MediatR;

namespace DashboardService.Features.Dashboard.Queries
{
    public class GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>
    {
    }
}