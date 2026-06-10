using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;
using NotificationService.Models;

namespace NotificationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly IHubContext<StockHub> _hubContext;

        public NotificationsController(IHubContext<StockHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("stock-update")]
        public async Task<IActionResult> SendStockUpdate(StockUpdateRequest request)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate",request);

            return Ok();
        }


        [HttpPost("low-stock-alert")]
        public async Task<IActionResult> LowStockAlert(LowStockAlertRequest request)
        {
            await _hubContext.Clients.All.SendAsync( "ReceiveLowStockAlert",
                new
                {
                    request.PharmacyName,
                    request.MedicineName,
                    request.Quantity,
                    Message = "Low Stock Alert"
                });

            return Ok("Low Stock Alert Sent");
        }
    }
}