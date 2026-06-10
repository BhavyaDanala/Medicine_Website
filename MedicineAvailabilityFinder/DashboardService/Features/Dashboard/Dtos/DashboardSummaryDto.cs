namespace DashboardService.Features.Dashboard.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalMedicines { get; set; }

        public int TotalPharmacies { get; set; }

        public int TotalInventoryRecords { get; set; }

        public int LowStockCount { get; set; }
    }
}