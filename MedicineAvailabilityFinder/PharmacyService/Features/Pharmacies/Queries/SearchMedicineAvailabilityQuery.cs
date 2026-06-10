using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class SearchMedicineAvailabilityQuery
        : IRequest<List<MedicineAvailabilityDto>>
    {
        public string MedicineName { get; set; }
    }
}