using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductTypeAndProductRepositorySupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasIncludedDishes = table.Column<bool>(type: "bit", nullable: false),
                    HasExtraDishes = table.Column<bool>(type: "bit", nullable: false),
                    HasFreebies = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTypes", x => x.Id);
                });

            migrationBuilder.Sql(@"
                SET IDENTITY_INSERT ProductTypes ON;
                INSERT INTO ProductTypes (Id, TypeName, Description, HasIncludedDishes, HasExtraDishes, HasFreebies, IsActive)
                VALUES
                (1, 'lechon_package', 'Lechon package products with dishes and freebies', 1, 1, 1, 1),
                (2, 'belly_package', 'Belly package products with dishes and freebies', 1, 1, 1, 1),
                (3, 'lechon_only', 'Lechon only products', 0, 1, 1, 1),
                (4, 'belly_only', 'Belly only products', 0, 1, 1, 1),
                (5, 'dish_only', 'Dish only products', 0, 1, 0, 1);
                SET IDENTITY_INSERT ProductTypes OFF;
            ");

            migrationBuilder.AddColumn<int>(
                name: "ProductTypeId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE Products
                SET ProductTypeId = CASE
                    WHEN ProductName LIKE '%Belly Package%' THEN 2
                    WHEN ProductName LIKE '%Belly%' THEN 4
                    WHEN ProductName LIKE '%Lechon Package%' THEN 1
                    WHEN ProductName LIKE '%Lechon%' THEN 3
                    ELSE 3
                END
                WHERE ProductTypeId IS NULL;
            ");

            migrationBuilder.AlterColumn<int>(
                name: "ProductTypeId",
                table: "Products",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductTypeId",
                table: "Products",
                column: "ProductTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId",
                table: "Products",
                column: "ProductTypeId",
                principalTable: "ProductTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "ProductTypes");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductTypeId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductTypeId",
                table: "Products");
        }
    }
}
