import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { seedUsers } from "./user.seed";
import { seedProjects } from "./project.seed";
import { seedTasks } from "./task.seed";

async function seed() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected for seeding");

    await seedUsers();
    const projects = await seedProjects();
    await seedTasks(projects);

    logger.info("Seeding complete");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    logger.error("Seeding failed", { error: (err as Error).message });
    process.exit(1);
  }
}

seed();
