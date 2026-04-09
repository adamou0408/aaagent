import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, name: "password_hash" })
  passwordHash!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;
}
