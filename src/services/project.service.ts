import { Project } from "../entities/project.entity";
import { ProjectRepository } from "../repositories/project.repository";
import { PaginationParams, PaginatedResponse, createPaginatedResponse } from "../utils/pagination";
import { logger } from "../config/logger";

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export class ProjectService {
  private projectRepo: ProjectRepository;

  constructor(projectRepo?: ProjectRepository) {
    this.projectRepo = projectRepo ?? new ProjectRepository();
  }

  async getAllProjects(params: PaginationParams): Promise<PaginatedResponse<Project>> {
    const [data, total] = await this.projectRepo.findAll(params);
    return createPaginatedResponse(data, total, params);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectRepo.findById(id);
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    logger.info("Creating project", { name: dto.name });
    return this.projectRepo.create(dto);
  }

  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project | null> {
    const existing = await this.projectRepo.findById(id);
    if (!existing) return null;

    logger.info("Updating project", { id, changes: dto });
    return this.projectRepo.update(id, dto);
  }

  async deleteProject(id: string): Promise<boolean> {
    logger.info("Deleting project", { id });
    return this.projectRepo.delete(id);
  }
}
