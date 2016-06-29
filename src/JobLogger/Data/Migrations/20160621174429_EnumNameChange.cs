using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace JobLogger.Migrations
{
    public partial class EnumNameChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MeansType",
                table: "JobLogs",
                newName: "ContactMeans"
                );

            migrationBuilder.RenameColumn(
                name: "MethodType",
                table: "JobLogs",
                newName: "ContactType"
                );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ContactMeans",
                table: "JobLogs",
                newName: "MeansType"
                );

            migrationBuilder.RenameColumn(
                name: "ContactType",
                table: "JobLogs",
                newName: "MethodType"
                );
        }
    }
}
