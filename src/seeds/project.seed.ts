import { AppDataSource } from "../config/data-source";
import { Project } from "../entities/project.entity";
import { logger } from "../config/logger";

export async function seedProjects(): Promise<Project[]> {
  const repo = AppDataSource.getRepository(Project);
  const count = await repo.count();
  if (count > 0) {
    logger.info("Projects already seeded, skipping");
    return repo.find();
  }

  const projects = await repo.save([
    repo.create({ name: "Backend API", description: "Core REST API development" }),
    repo.create({ name: "Frontend App", description: "Web application frontend" }),
    repo.create({ name: "Infrastructure", description: "DevOps and deployment" }),
  ]);
  logger.info("Seeded 3 projects");
  return projects;
}
