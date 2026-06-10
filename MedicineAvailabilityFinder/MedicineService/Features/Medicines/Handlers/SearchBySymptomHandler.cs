using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Handlers
{
    public class SearchBySymptomHandler: IRequestHandler<SearchBySymptomQuery,List<Medicine>>
    {
        private readonly ApplicationDbContext _context;

        public SearchBySymptomHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Medicine>> Handle(SearchBySymptomQuery request,CancellationToken cancellationToken)
        {
            return await _context.Medicines
                .Where(x => x.Symptoms.ToLower().Contains(request.Symptom.ToLower()))
                .ToListAsync();
        }
    }
}