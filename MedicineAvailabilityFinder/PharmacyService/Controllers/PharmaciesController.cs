using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyService.Features.Pharmacies.Commands;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmaciesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PharmaciesController(IMediator mediator)
        {
            _mediator = mediator;
        }
    
        [HttpPost]
        public async Task<IActionResult> AddPharmacy(AddPharmacyCommand command)
        {
            var pharmacyId =
                await _mediator.Send(command);

            return Ok(new
            {
                Message = "Pharmacy Added Successfully",
                PharmacyId = pharmacyId
            });
        }

        
        //To add the inventory
        [Authorize(Roles ="Admin,Pharmacy")]
        [HttpPost("inventory")]
        public async Task<IActionResult> AddInventory(AddInventoryCommand command)
        {
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


        //to update the inventory
        [Authorize(Roles="Admin,Pharmacy")]
        [HttpPut("update-inventory")]
        public async Task<IActionResult> UpdateInventory(UpdateInventoryCommand command)
        {
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
        public async Task<IActionResult> GetLowStock([FromQuery] int threshold = 5)
        {
            var result = await _mediator.Send(
                new GetLowStockQuery
                {
                    Threshold = threshold
                });

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

        //To get all inventories
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory()
        {
            var result =
                await _mediator.Send(
                    new GetAllInventoryQuery());

            return Ok(result);
        }
    }
}