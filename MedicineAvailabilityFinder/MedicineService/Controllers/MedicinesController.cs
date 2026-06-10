using MediatR;
using Microsoft.AspNetCore.Mvc;
using MedicineService.Features.Medicines.Commands;
using MedicineService.Features.Medicines.Queries;

namespace MedicineService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MedicinesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicine
            (AddMedicineCommand command)
        {
            var medicineId = await _mediator.Send(command);

            return Ok(new
            {
                Message = "Medicine Added Successfully",
                MedicineId = medicineId
            });
        }


        [HttpGet("search")]

        public async Task<IActionResult> SearchMedicine
            ([FromQuery] string searchTerm)
        {
            var result = await _mediator.Send(
                new SearchMedicineQuery
                {
                    SearchTerm = searchTerm
                });
            return Ok(result);
        }


        //To get the medicine by symptom
        [HttpGet("symptom-search")]
        public async Task<IActionResult> SearchBySymptom( [FromQuery] string symptom)
        {
            var result = await _mediator.Send(
                new SearchBySymptomQuery
                {
                    Symptom = symptom
                });

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _mediator.Send(
                    new GetAllMedicinesQuery());

            return Ok(result);
        }
    }
}