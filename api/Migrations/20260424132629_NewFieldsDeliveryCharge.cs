using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class NewFieldsDeliveryCharge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxAmount",
                table: "DeliveryCharges");

            migrationBuilder.RenameColumn(
                name: "MinAmount",
                table: "DeliveryCharges",
                newName: "Surcharge");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "DeliveryCharges",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "AreaType",
                table: "DeliveryCharges",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "BaseFee",
                table: "DeliveryCharges",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CityName",
                table: "DeliveryCharges",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "DeliveryCharges");

            migrationBuilder.DropColumn(
                name: "AreaType",
                table: "DeliveryCharges");

            migrationBuilder.DropColumn(
                name: "BaseFee",
                table: "DeliveryCharges");

            migrationBuilder.DropColumn(
                name: "CityName",
                table: "DeliveryCharges");

            migrationBuilder.RenameColumn(
                name: "Surcharge",
                table: "DeliveryCharges",
                newName: "MinAmount");

            migrationBuilder.AddColumn<decimal>(
                name: "MaxAmount",
                table: "DeliveryCharges",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
