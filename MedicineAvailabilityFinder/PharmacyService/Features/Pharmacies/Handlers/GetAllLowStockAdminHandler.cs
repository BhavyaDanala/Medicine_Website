using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using MedicineService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;
using ApplicationDbContext = PharmacyService.Data.ApplicationDbContext;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetAllLowStockForAdminHandler : IRequestHandler<GetAllLowStockAdminQuery, List<LowStockDto>>
    {
        private readonly ApplicationDbContext _context;
        private readonly MedicineService.Data.ApplicationDbContext _medicineContext;

        public GetAllLowStockForAdminHandler(ApplicationDbContext context, MedicineService.Data.ApplicationDbContext medicineContext)
        {
            _context = context;
            _medicineContext = medicineContext;
        }

        public async Task<List<LowStockDto>> Handle(GetAllLowStockAdminQuery request, CancellationToken cancellationToken)
        {
            var lowStockPharmacyMedicines = await _context.PharmacyMedicines
                .Where(pm => pm.Quantity < request.Threshold)
                .ToListAsync(cancellationToken);

            var pharmacyIds = lowStockPharmacyMedicines.Select(pm => pm.PharmacyId).Distinct().ToList();
            var medicineIds = lowStockPharmacyMedicines.Select(pm => pm.MedicineId).Distinct().ToList();

            var pharmacies = await _context.Pharmacies
                .Where(p => pharmacyIds.Contains(p.PharmacyId))
                .ToListAsync(cancellationToken);

            var medicines = await _medicineContext.Medicines
                .Where(m => medicineIds.Contains(m.MedicineId))
                .ToListAsync(cancellationToken);

            return (
                from pm in lowStockPharmacyMedicines
                join p in pharmacies on pm.PharmacyId equals p.PharmacyId
                join m in medicines on pm.MedicineId equals m.MedicineId
                select new LowStockDto
                {
                    PharmacyName = p.PharmacyName,
                    MedicineName = m.MedicineName,
                    Quantity = pm.Quantity,
                    LastUpdated = pm.LastUpdated
                }
            ).ToList();
        }
    }
}