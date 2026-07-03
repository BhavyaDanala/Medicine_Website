using MediatR;

namespace MedicineService.Features.Medicines.Queries
{
    public class GetMedicineSuggestionsQuery : IRequest<List<string>>
    {
        public string Query { get; set; }
    }
}
