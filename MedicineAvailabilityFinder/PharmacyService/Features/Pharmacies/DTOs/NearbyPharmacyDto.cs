namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class NearbyPharmacyDto
    {
        public int PharmacyId { get; set; }

        public string PharmacyName { get; set; }

        public string Address { get; set; }

        public double DistanceKm { get; set; }
    }
}