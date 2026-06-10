using MediatR;
using Microsoft.EntityFrameworkCore;
using PharmacyService.Data;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Features.Pharmacies.Queries;

namespace PharmacyService.Features.Pharmacies.Handlers
{
    public class GetLowStockHandler: IRequestHandler<GetLowStockQuery, List<LowStockDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetLowStockHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<LowStockDto>> Handle(GetLowStockQuery request,CancellationToken cancellationToken)
        {
            return await (
                from pm in _context.PharmacyMedicines
                join p in _context.Pharmacies
                    on pm.PharmacyId equals p.PharmacyId
                join m in _context.Medicines
                    on pm.MedicineId equals m.MedicineId

                where pm.Quantity < request.Threshold
                select new LowStockDto
                {
                    PharmacyName = p.PharmacyName,
                    MedicineName = m.MedicineName,
                    Quantity = pm.Quantity,
                    LastUpdated = pm.LastUpdated
                }
            ).ToListAsync();
        }
    }
}