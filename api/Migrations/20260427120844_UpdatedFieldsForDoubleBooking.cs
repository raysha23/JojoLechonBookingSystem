using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedFieldsForDoubleBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Products_ProductId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "OrderDish");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ProductId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "SubmittedByType",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "DeliveryCharges");

            migrationBuilder.RenameColumn(
                name: "DishType",
                table: "OrderItemDishes",
                newName: "DishName");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "OrderItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DishId1",
                table: "OrderItemDishes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "OrderItemDishes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemDishes_DishId1",
                table: "OrderItemDishes",
                column: "DishId1");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItemDishes_Dishes_DishId1",
                table: "OrderItemDishes",
                column: "DishId1",
                principalTable: "Dishes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItemDishes_Dishes_DishId1",
                table: "OrderItemDishes");

            migrationBuilder.DropIndex(
                name: "IX_OrderItemDishes_DishId1",
                table: "OrderItemDishes");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "DishId1",
                table: "OrderItemDishes");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "OrderItemDishes");

            migrationBuilder.RenameColumn(
                name: "DishName",
                table: "OrderItemDishes",
                newName: "DishType");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubmittedByType",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "DeliveryCharges",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "OrderDish",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DishId = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    DishType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsExtra = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDish", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDish_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDish_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ProductId",
                table: "Orders",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDish_DishId",
                table: "OrderDish",
                column: "DishId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDish_OrderId",
                table: "OrderDish",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Products_ProductId",
                table: "Orders",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
