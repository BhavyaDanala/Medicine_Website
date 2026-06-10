using DashboardService.Features.Dashboard.DTOs;
using DashboardService.Features.Dashboard.Queries;
using DashboardService.Services;
using MediatR;

namespace DashboardService.Features.Dashboard.Handlers
{
    public class GetDashboardSummaryHandler :
        IRequestHandler<GetDashboardSummaryQuery,
        DashboardSummaryDto>
    {
        private readonly DashboardAggregatorService _dashboardService;

        public GetDashboardSummaryHandler(DashboardAggregatorService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        public async Task<DashboardSummaryDto> Handle(
            GetDashboardSummaryQuery request,
            CancellationToken cancellationToken)
        {
            return await _dashboardService.GetDashboardSummary();
        }
    }
}