import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Task, TaskStatus } from "../entities/task.entity";

export class TaskRepository {
  private repo: Repository<Task>;

  constructor() {
    this.repo = AppDataSource.getRepository(Task);
  }

  findAll(): Promise<Task[]> {
    return this.repo.find({ order: { priority: "DESC", createdAt: "DESC" } });
  }

  findById(id: string): Promise<Task | null> {
    return this.repo.findOneBy({ id });
  }

  findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.repo.find({
      where: { status },
      order: { priority: "DESC" },
    });
  }

  create(data: Partial<Task>): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
