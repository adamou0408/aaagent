import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./task.entity";

@Entity("projects")
export class Project extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
