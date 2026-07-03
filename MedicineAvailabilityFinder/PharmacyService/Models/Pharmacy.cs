namespace PharmacyService.Models
{
    public class Pharmacy
    {
        public int PharmacyId { get; set; }

        public string PharmacyName { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int UserId { get; set; }

        public string OpeningTime { get; set; }

        public string ClosingTime { get; set; }
    }
}