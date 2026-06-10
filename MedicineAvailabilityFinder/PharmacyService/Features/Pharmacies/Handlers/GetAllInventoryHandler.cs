using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Queries;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetAllInventoryHandler : IRequestHandler<GetAllInventoryQuery, List<PharmacyMedicine>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllInventoryHandler( ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PharmacyMedicine>> Handle(GetAllInventoryQuery request, CancellationToken cancellationToken)
        {
            return await _context.PharmacyMedicines.ToListAsync();
        }
    }
}