using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class NewTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsExtra",
                table: "OrderDishes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryChargeId",
                table: "Orders",
                column: "DeliveryChargeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryCharges_DeliveryChargeId",
                table: "Orders",
                column: "DeliveryChargeId",
                principalTable: "DeliveryCharges",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryCharges_DeliveryChargeId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryChargeId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "IsExtra",
                table: "OrderDishes");
        }
    }
}
