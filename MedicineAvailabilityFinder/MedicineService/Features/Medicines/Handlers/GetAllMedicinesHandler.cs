using MediatR;
using Microsoft.EntityFrameworkCore;
using MedicineService.Data;
using MedicineService.Features.Medicines.Queries;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Handlers
{
    public class GetAllMedicinesHandler : IRequestHandler<GetAllMedicinesQuery, List<Medicine>>
    {
        private readonly ApplicationDbContext _context;

        public GetAllMedicinesHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Medicine>> Handle(GetAllMedicinesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Medicines.ToListAsync();
        }
    }
}