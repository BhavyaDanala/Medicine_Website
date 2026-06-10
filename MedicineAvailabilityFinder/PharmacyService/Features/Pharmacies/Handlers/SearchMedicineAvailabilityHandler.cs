using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class SearchMedicineAvailabilityHandler :
        IRequestHandler<SearchMedicineAvailabilityQuery,
        List<MedicineAvailabilityDto>>
    {
        private readonly ApplicationDbContext _context;

        public SearchMedicineAvailabilityHandler(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MedicineAvailabilityDto>> Handle(
            SearchMedicineAvailabilityQuery request,
            CancellationToken cancellationToken)
        {
            return await (
                from pm in _context.PharmacyMedicines
                join p in _context.Pharmacies
                    on pm.PharmacyId equals p.PharmacyId
                join m in _context.Medicines
                    on pm.MedicineId equals m.MedicineId
                where m.MedicineName.Contains(request.MedicineName)&& pm.Quantity > 0
                select new MedicineAvailabilityDto
                {
                    PharmacyName = p.PharmacyName,
                    MedicineName = m.MedicineName,
                    Quantity = pm.Quantity,
                    Price = pm.Price,
                    LastUpdated = pm.LastUpdated
                }
            ).ToListAsync();
        }
    }
}