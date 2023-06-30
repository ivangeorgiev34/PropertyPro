using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropertyPro.Infrastructure.Migrations
{
    public partial class AddImagesToPropertyEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "FirstImage",
                table: "Properties",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "SecondImage",
                table: "Properties",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ThirdImage",
                table: "Properties",
                type: "varbinary(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstImage",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "SecondImage",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "ThirdImage",
                table: "Properties");
        }
    }
}
