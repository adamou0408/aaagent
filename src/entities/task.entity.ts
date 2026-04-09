import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Project } from "./project.entity";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

@Entity("tasks")
export class Task extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Column({ type: "int", default: 0 })
  priority!: number;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId!: string | null;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "SET NULL" })
  @JoinColumn({ name: "project_id" })
  project!: Project | null;
}
