using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Handlers;
using PharmacyService.Features.Pharmacies.Queries;
using System.Security.Claims;

namespace PharmacyService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmaciesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context;

        public PharmaciesController(IMediator mediator, ApplicationDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }
    
        [HttpPost]
        public async Task<IActionResult> AddPharmacy(AddPharmacyCommand command)
        {
            if (string.IsNullOrWhiteSpace(command.OpeningTime))
                return BadRequest("OpeningTime cannot be empty");
                
            if (string.IsNullOrWhiteSpace(command.ClosingTime))
                return BadRequest("ClosingTime cannot be empty");

            if (DateTime.TryParse(command.OpeningTime, out var openTime) && DateTime.TryParse(command.ClosingTime, out var closeTime))
            {
                if (closeTime.TimeOfDay <= openTime.TimeOfDay)
                    return BadRequest("ClosingTime must be later than OpeningTime");
            }

            var pharmacyId =
                await _mediator.Send(command);

            return Ok(new
            {
                Message = "Pharmacy Added Successfully",
                PharmacyId = pharmacyId
            });
        }


        //To add the inventory
        //[Authorize(Roles = "Admin,Pharmacy")]
        [HttpPost("inventory")]
        public async Task<IActionResult> AddInventory(AddInventoryCommand command)
        {
            var userId = int.Parse(
                User.Claims.First(
                    c => c.Type.Contains("nameidentifier")
                ).Value);

            command.UserId = userId;

            var inventoryId =
                await _mediator.Send(command);

            return Ok(new
            {
                Message = "Inventory Added Successfully",
                InventoryId = inventoryId
            });
        }

        [HttpGet("medicine-availability")]
        public async Task<IActionResult> SearchMedicineAvailability([FromQuery] string medicineName)
        {
            var result = await _mediator.Send(
                new SearchMedicineAvailabilityQuery
                {
                    MedicineName = medicineName
                });

            return Ok(result);
        }
        //[HttpGet("inventory/all")]
        //public async Task<IActionResult> GetAllInventorys()
        //{
        //    var result = await _mediator.Send(new GetAllInventoryForAdminQuery());
        //    return Ok(result);
        //}


        //to update the inventory
        //[Authorize(Roles="Admin,Pharmacy")]
        [HttpPut("update-inventory")]
        public async Task<IActionResult> UpdateInventory(UpdateInventoryCommand command)
        {
            var userId = int.Parse(
                User.Claims.First(
                    c => c.Type.Contains("nameidentifier")
                ).Value);

            command.UserId = userId;

            var updated =
                await _mediator.Send(command);

            if (!updated)
            {
                return NotFound("Inventory record not found");
            }

            return Ok(new
            {
                Message = "Inventory Updated Successfully"
            });
        }

        //To get the list of all pharmacies
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(
                new GetAllPharmaciesQuery());

            return Ok(result);
        }


        //Low Stock detection
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock([FromQuery] int threshold = 5, [FromQuery] int? pharmacyId = null)
        {
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.Contains("nameidentifier"))?.Value;
                if (!string.IsNullOrEmpty(userIdClaim))
                {
                    userId = int.Parse(userIdClaim);
                }
            }

            var result = await _mediator.Send(
                new GetLowStockQuery
                {
                    Threshold = threshold,
                    UserId = userId,
                    PharmacyId = pharmacyId
                });

            return Ok(result);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("low-stocks/admin")]
        public async Task<IActionResult> GetLowStocksAll()
        {
            var result = await _mediator.Send(new GetAllLowStockAdminQuery());
            return Ok(result);
        }


        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyPharmacies( [FromQuery] double latitude,[FromQuery] double longitude)
        {
            var result = await _mediator.Send(
                new GetNearbyPharmaciesQuery
                {
                    UserLatitude = latitude,
                    UserLongitude = longitude
                });

            return Ok(result);
        }

        [HttpGet("nearby-medicine")]
        public async Task<IActionResult> GetNearbyMedicine(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] string medicineName)
        {
            var result = await _mediator.Send(
                new GetNearbyMedicineQuery
                {
                    Latitude = latitude,
                    Longitude = longitude,
                    MedicineName = medicineName
                });

            return Ok(result);
        }

        [HttpGet("price-comparison")]
        public async Task<IActionResult> GetPriceComparison(
            [FromQuery] string medicineName,
            [FromQuery] double? latitude = null,
            [FromQuery] double? longitude = null)
        {
            var result = await _mediator.Send(
                new GetPriceComparisonQuery
                {
                    MedicineName = medicineName,
                    UserLatitude = latitude,
                    UserLongitude = longitude
                });

            return Ok(result);
        }

        //To get all inventories
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory([FromQuery] int? pharmacyId = null)
        {
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.Contains("nameidentifier"))?.Value;
                if (!string.IsNullOrEmpty(userIdClaim))
                {
                    userId = int.Parse(userIdClaim);
                }
            }

            var result = await _mediator.Send(
                new GetAllInventoryQuery
                {
                    UserId = userId,
                    PharmacyId = pharmacyId
                });

            return Ok(result);
        }

        //To get all inventories for Admin (no pharmacy filtering)
        [Authorize(Roles ="Admin")]
        [HttpGet("inventory/all")]
        public async Task<IActionResult> GetAllInventoryForAdmin()
        {
            var result = await _mediator.Send(new GetAllInventoryForAdminQuery());
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePharmacy(UpdatePharmacyDto dto)

        {
            var result =
                await _mediator.Send(
                    new UpdatePharmacyCommand
                    {
                        Pharmacy = dto
                    });

            if (!result)
            {
                return NotFound();
            }

            return Ok("Pharmacy Updated Successfully");
        }


        [HttpGet("notification-history")]
        public async Task<IActionResult> GetNotificationHistory([FromQuery] int? limit = 50)
        {
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.Contains("nameidentifier"))?.Value;
                if (!string.IsNullOrEmpty(userIdClaim))
                {
                    userId = int.Parse(userIdClaim);
                }
            }

            var result = await _mediator.Send(
                new GetNotificationHistoryQuery
                {
                    UserId = userId,
                    Limit = limit
                });

            return Ok(result);
        }

        [HttpPut("set-email")]
        public async Task<IActionResult> SetPharmacyEmail([FromBody] SetPharmacyEmailDto dto)
        {
            var userId = int.Parse(
                User.Claims.First(c => c.Type.Contains("nameidentifier")).Value);

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (pharmacy == null)
                return NotFound("Pharmacy not found for this user");

            pharmacy.Email = dto.Email;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Pharmacy email updated successfully", Email = dto.Email });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePharmacy(int id)
        {
            var result =
                await _mediator.Send(
                    new DeletePharmacyCommand
                    {
                        PharmacyId = id
                    });

            if (!result)
            {
                return NotFound();
            }

            return Ok("Pharmacy Deleted Successfully");
        }
    }
}