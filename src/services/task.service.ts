import { Task, TaskStatus } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";
import { PaginationParams, PaginatedResponse, createPaginatedResponse } from "../utils/pagination";
import { logger } from "../config/logger";

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: number;
  projectId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  projectId?: string | null;
}

export class TaskService {
  private taskRepo: TaskRepository;

  constructor(taskRepo?: TaskRepository) {
    this.taskRepo = taskRepo ?? new TaskRepository();
  }

  async getAllTasks(params?: PaginationParams): Promise<PaginatedResponse<Task>> {
    const [data, total] = await this.taskRepo.findAll(params);
    const p = params ?? { page: 1, limit: total || 1, sort: "createdAt", order: "DESC" as const };
    return createPaginatedResponse(data, total, p);
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
