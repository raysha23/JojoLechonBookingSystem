using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class NewTablesForDoubleBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDishes_Dishes_DishId",
                table: "OrderDishes");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDishes_Orders_OrderId",
                table: "OrderDishes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderDishes",
                table: "OrderDishes");

            migrationBuilder.RenameTable(
                name: "OrderDishes",
                newName: "OrderDish");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDishes_OrderId",
                table: "OrderDish",
                newName: "IX_OrderDish_OrderId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDishes_DishId",
                table: "OrderDish",
                newName: "IX_OrderDish_DishId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderDish",
                table: "OrderDish",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UpgradeAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItemDishes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    DishId = table.Column<int>(type: "int", nullable: false),
                    DishType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsExtra = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemDishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemDishes_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItemDishes_OrderItems_OrderItemId",
                        column: x => x.OrderItemId,
                        principalTable: "OrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemDishes_DishId",
                table: "OrderItemDishes",
                column: "DishId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemDishes_OrderItemId",
                table: "OrderItemDishes",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDish_Dishes_DishId",
                table: "OrderDish",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDish_Orders_OrderId",
                table: "OrderDish",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDish_Dishes_DishId",
                table: "OrderDish");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDish_Orders_OrderId",
                table: "OrderDish");

            migrationBuilder.DropTable(
                name: "OrderItemDishes");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderDish",
                table: "OrderDish");

            migrationBuilder.RenameTable(
                name: "OrderDish",
                newName: "OrderDishes");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDish_OrderId",
                table: "OrderDishes",
                newName: "IX_OrderDishes_OrderId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDish_DishId",
                table: "OrderDishes",
                newName: "IX_OrderDishes_DishId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderDishes",
                table: "OrderDishes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDishes_Dishes_DishId",
                table: "OrderDishes",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDishes_Orders_OrderId",
                table: "OrderDishes",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
