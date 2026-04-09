import { Task, TaskStatus } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";
import { logger } from "../config/logger";

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
}

export class TaskService {
  private taskRepo: TaskRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepo.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepo.findById(id);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepo.findByStatus(status);
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    logger.info("Creating task", { title: dto.title });
    return this.taskRepo.create(dto);
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    const existing = await this.taskRepo.findById(id);
    if (!existing) return null;

    logger.info("Updating task", { id, changes: dto });
    return this.taskRepo.update(id, dto);
  }

  async deleteTask(id: string): Promise<boolean> {
    logger.info("Deleting task", { id });
    return this.taskRepo.delete(id);
  }
}
