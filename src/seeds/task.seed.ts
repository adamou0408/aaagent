import { AppDataSource } from "../config/data-source";
import { Task, TaskStatus } from "../entities/task.entity";
import { Project } from "../entities/project.entity";
import { logger } from "../config/logger";

export async function seedTasks(projects: Project[]) {
  const repo = AppDataSource.getRepository(Task);
  const count = await repo.count();
  if (count > 0) {
    logger.info("Tasks already seeded, skipping");
    return;
  }

  const [backend, frontend, infra] = projects;

  await repo.save([
    repo.create({ title: "Set up authentication", status: TaskStatus.DONE, priority: 10, projectId: backend?.id }),
    repo.create({ title: "Implement CRUD endpoints", status: TaskStatus.DONE, priority: 8, projectId: backend?.id }),
    repo.create({ title: "Add pagination", status: TaskStatus.IN_PROGRESS, priority: 7, projectId: backend?.id }),
    repo.create({ title: "Write unit tests", status: TaskStatus.IN_PROGRESS, priority: 9, projectId: backend?.id }),
    repo.create({ title: "Design landing page", status: TaskStatus.PENDING, priority: 6, projectId: frontend?.id }),
    repo.create({ title: "Set up CI/CD pipeline", status: TaskStatus.DONE, priority: 10, projectId: infra?.id }),
    repo.create({ title: "Configure monitoring", status: TaskStatus.PENDING, priority: 5, projectId: infra?.id }),
  ]);
  logger.info("Seeded 7 tasks");
}
