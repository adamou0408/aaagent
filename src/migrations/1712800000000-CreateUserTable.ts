import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1712800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM ('user', 'admin')`,
    );

    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "255",
          },
          {
            name: "role",
            type: "user_role_enum",
            default: `'user'`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
