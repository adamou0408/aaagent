import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateProjectAndLinkTask1712900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projects",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    // Add project_id to tasks
    await queryRunner.addColumn(
      "tasks",
      new TableColumn({
        name: "project_id",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "tasks",
      new TableForeignKey({
        columnNames: ["project_id"],
        referencedTableName: "projects",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    // Add soft delete to tasks
    await queryRunner.addColumn(
      "tasks",
      new TableColumn({
        name: "deleted_at",
        type: "timestamp",
        isNullable: true,
      }),
    );

    // Add soft delete to users
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "deleted_at",
        type: "timestamp",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove soft delete from users
    await queryRunner.dropColumn("users", "deleted_at");

    // Remove soft delete from tasks
    await queryRunner.dropColumn("tasks", "deleted_at");

    // Remove foreign key and column from tasks
    const table = await queryRunner.getTable("tasks");
    const fk = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("project_id") !== -1,
    );
    if (fk) await queryRunner.dropForeignKey("tasks", fk);
    await queryRunner.dropColumn("tasks", "project_id");

    await queryRunner.dropTable("projects");
  }
}
