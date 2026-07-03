namespace PharmacyService.Features.Pharmacies.DTOs
{
    public class PriceComparisonDto
    {
        public string PharmacyName { get; set; }
        public decimal Price { get; set; }
        public double? DistanceKm { get; set; }
        public int Quantity { get; set; }
        public string OpeningTime { get; set; }
        public string ClosingTime { get; set; }
    }
}
