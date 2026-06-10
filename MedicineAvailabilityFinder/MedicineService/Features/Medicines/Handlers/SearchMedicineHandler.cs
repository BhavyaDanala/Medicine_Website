using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Handlers
{
    public class SearchMedicineHandler
        : IRequestHandler<SearchMedicineQuery, List<Medicine>>
    {
        private readonly ApplicationDbContext _context;

        public SearchMedicineHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Medicine>> Handle
        (
            SearchMedicineQuery request,
            CancellationToken cancellationToken
        )
        {
            return await _context.Medicines
                .Where(x => x.MedicineName.Contains(request.SearchTerm))
                .ToListAsync();
        }
    }
}