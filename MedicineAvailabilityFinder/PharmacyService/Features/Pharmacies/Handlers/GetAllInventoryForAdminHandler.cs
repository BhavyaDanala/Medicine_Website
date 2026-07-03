using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Queries;
using PharmacyService.Models;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetAllInventoryForAdminHandler : IRequestHandler<GetAllInventoryForAdminQuery, List<PharmacyMedicine>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllInventoryForAdminHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PharmacyMedicine>> Handle(GetAllInventoryForAdminQuery request, CancellationToken cancellationToken)
        {
            return await _context.PharmacyMedicines.ToListAsync();
        }
    }
}
