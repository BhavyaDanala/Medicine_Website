using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyService.Migrations
{
    /// <inheritdoc />
    public partial class AddPharmacyTimings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClosingTime",
                table: "Pharmacies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OpeningTime",
                table: "Pharmacies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosingTime",
                table: "Pharmacies");

            migrationBuilder.DropColumn(
                name: "OpeningTime",
                table: "Pharmacies");
        }
    }
}
