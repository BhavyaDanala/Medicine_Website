namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class UpdatePharmacyDto
    {
        public int PharmacyId { get; set; }

        public string PharmacyName { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}