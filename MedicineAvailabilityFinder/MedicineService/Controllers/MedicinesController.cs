using MediatR;
using MedicineService.Features.Medicines.Commands;
using MedicineService.Features.Medicines.Dtos;
using MedicineService.Features.Medicines.Queries;
using Microsoft.AspNetCore.Mvc;


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
            try
            {
                var medicineId = await _mediator.Send(command);

                return Ok(new
                {
                    Message = "Medicine Added Successfully",
                    MedicineId = medicineId
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
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

        [HttpGet("suggest")]
        public async Task<IActionResult> GetMedicineSuggestions([FromQuery] string q)
        {
            var result = await _mediator.Send(
                new GetMedicineSuggestionsQuery
                {
                    Query = q
                });
            return Ok(result);
        }

        [HttpGet("symptom-suggest")]
        public async Task<IActionResult> GetSymptomSuggestions([FromQuery] string q)
        {
            var result = await _mediator.Send(
                new GetSymptomSuggestionsQuery
                {
                    Query = q
                });
            return Ok(result);
        }

        [HttpGet("fuzzy-search")]
        public async Task<IActionResult> FuzzySearchMedicine([FromQuery] string searchTerm)
        {
            var result = await _mediator.Send(
                new FuzzySearchMedicineQuery
                {
                    SearchTerm = searchTerm,
                    MaxResults = 5,
                    MinSimilarity = 0.3
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

        [HttpPut]
        public async Task<IActionResult> UpdateMedicine(UpdateMedicineDto dto)
        {
            var result =
                await _mediator.Send(
                    new UpdateMedicineCommand
                    {
                        Medicine = dto
                    });

            if (!result)
            {
                return NotFound();
            }

            return Ok("Medicine Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var result =
                await _mediator.Send(
                    new DeleteMedicineCommand
                    {
                        MedicineId = id
                    });

            if (!result)
            {
                return NotFound();
            }

            return Ok("Medicine Deleted Successfully");
        }
    }
}