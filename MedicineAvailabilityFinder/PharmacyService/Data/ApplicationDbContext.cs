using Microsoft.EntityFrameworkCore;
using PharmacyService.Features.Pharmacies.DTOs;
using PharmacyService.Models;

namespace PharmacyService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        //public DbSet<LowStockDto> lowStocks { get; set; }/
        public DbSet<Pharmacy> Pharmacies { get; set; }

        public DbSet<PharmacyMedicine> PharmacyMedicines { get; set; }

        public DbSet<NotificationLog> NotificationLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PharmacyMedicine>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            base.OnModelCreating(modelBuilder);
        }

    }
}