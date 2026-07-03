using MediatR;
using System.Collections.Generic;

namespace MedicineService.Features.Medicines.Queries
{
    public class GetSymptomSuggestionsQuery : IRequest<List<string>>
    {
        public string Query { get; set; }
    }
}
