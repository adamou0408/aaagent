import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddPerformanceIndexes1713000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      "tasks",
      new TableIndex({ name: "IDX_tasks_status", columnNames: ["status"] }),
    );
    await queryRunner.createIndex(
      "tasks",
      new TableIndex({ name: "IDX_tasks_project_id", columnNames: ["project_id"] }),
    );
    await queryRunner.createIndex(
      "tasks",
      new TableIndex({ name: "IDX_tasks_priority", columnNames: ["priority"] }),
    );
    await queryRunner.createIndex(
      "users",
      new TableIndex({ name: "IDX_users_email", columnNames: ["email"] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("users", "IDX_users_email");
    await queryRunner.dropIndex("tasks", "IDX_tasks_priority");
    await queryRunner.dropIndex("tasks", "IDX_tasks_project_id");
    await queryRunner.dropIndex("tasks", "IDX_tasks_status");
  }
}
