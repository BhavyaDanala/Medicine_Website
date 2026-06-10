using DashboardService.Features.Dashboard.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace DashboardService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }


        [Authorize(Roles ="Admin")]
        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
        {
            var result = await _mediator.Send(new GetDashboardSummaryQuery());

            return Ok(result);

        }

    }
}