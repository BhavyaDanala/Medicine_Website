using MediatR;
using PharmacyService.Features.Pharmacies.DTOs;

namespace PharmacyService.Features.Pharmacies.Queries
{
    public class GetNearbyMedicineQuery : IRequest<List<NearbyMedicineDto>>
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string MedicineName { get; set; }
    }
}
