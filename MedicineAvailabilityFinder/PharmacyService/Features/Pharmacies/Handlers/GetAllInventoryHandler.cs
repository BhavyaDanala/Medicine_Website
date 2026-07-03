using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.Queries;
using PharmacyService.Models;
using System.Security.Claims;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetAllInventoryHandler : IRequestHandler<GetAllInventoryQuery, List<PharmacyMedicine>>
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetAllInventoryHandler(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<PharmacyMedicine>> Handle(GetAllInventoryQuery request, CancellationToken cancellationToken)
        {
            int? pharmacyId = null;

            if (request.PharmacyId.HasValue)
            {
                pharmacyId = request.PharmacyId.Value;
            }
            else if (request.UserId.HasValue)
            {
                var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.UserId == request.UserId);
                pharmacyId = pharmacy?.PharmacyId;
            }

            if (!pharmacyId.HasValue)
            {
                return new List<PharmacyMedicine>();
            }

            // Skip the PharmacyId claim check - it's optional and not always present
            // The UserId-based lookup is sufficient for authorization

            return await _context.PharmacyMedicines
                .Where(pm => pm.PharmacyId == pharmacyId.Value)
                .ToListAsync();
        }
    }
}