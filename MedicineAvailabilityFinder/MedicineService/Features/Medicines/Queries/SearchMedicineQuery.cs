using MediatR;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Queries
{
    public class SearchMedicineQuery:IRequest<List<Medicine>>
    {
        public string SearchTerm { get; set; }
    }
}
