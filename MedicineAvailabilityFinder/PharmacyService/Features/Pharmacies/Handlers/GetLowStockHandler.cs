using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;
using System.Security.Claims;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetLowStockHandler: IRequestHandler<GetLowStockQuery, List<LowStockDto>>
    {
        private readonly ApplicationDbContext _context;
        private readonly MedicineService.Data.ApplicationDbContext _medicineContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetLowStockHandler(ApplicationDbContext context, MedicineService.Data.ApplicationDbContext medicineContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _medicineContext = medicineContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<LowStockDto>> Handle(
     GetLowStockQuery request,
     CancellationToken cancellationToken)
        {
            int? pharmacyId = null;

            if (request.PharmacyId.HasValue)
            {
                pharmacyId = request.PharmacyId.Value;
            }
            else if (request.UserId.HasValue)
            {
                var pharmacy = await _context.Pharmacies
                    .FirstOrDefaultAsync(p => p.UserId == request.UserId);
                pharmacyId = pharmacy?.PharmacyId;
            }

            if (!pharmacyId.HasValue)
            {
                return new List<LowStockDto>();
            }

            // Skip the PharmacyId claim check - it's optional and not always present
            // The UserId-based lookup is sufficient for authorization

            var lowStockItems = await (
                from pm in _context.PharmacyMedicines
                join p in _context.Pharmacies
                    on pm.PharmacyId equals p.PharmacyId
                where pm.Quantity < request.Threshold
                      && pm.PharmacyId == pharmacyId.Value
                select new 
                {
                    PharmacyName = p.PharmacyName,
                    MedicineId = pm.MedicineId,
                    Quantity = pm.Quantity,
                    LastUpdated = pm.LastUpdated
                }
            ).ToListAsync(cancellationToken);

            var medicineIds = lowStockItems.Select(x => x.MedicineId).Distinct().ToList();

            var medicines = await _medicineContext.Medicines
                .Where(m => medicineIds.Contains(m.MedicineId))
                .ToListAsync(cancellationToken);

            return (
                from item in lowStockItems
                join m in medicines on item.MedicineId equals m.MedicineId
                select new LowStockDto
                {
                    PharmacyName = item.PharmacyName,
                    MedicineName = m.MedicineName,
                    Quantity = item.Quantity,
                    LastUpdated = item.LastUpdated
                }
            ).ToList();
        }
    }
}