import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Project } from "../entities/project.entity";
import { PaginationParams, buildPaginationOptions } from "../utils/pagination";

export class ProjectRepository {
  private repo: Repository<Project>;

  constructor() {
    this.repo = AppDataSource.getRepository(Project);
  }

  async findAll(params: PaginationParams): Promise<[Project[], number]> {
    const options = buildPaginationOptions(params, ["createdAt", "updatedAt", "name"]);
    return this.repo.findAndCount({
      ...options,
      relations: ["tasks"],
    });
  }

  findById(id: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["tasks"],
    });
  }

  create(data: Partial<Project>): Promise<Project> {
    const project = this.repo.create(data);
    return this.repo.save(project);
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
