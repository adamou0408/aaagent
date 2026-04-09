import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/user.entity";
import { logger } from "../config/logger";

export async function seedUsers() {
  const repo = AppDataSource.getRepository(User);
  const count = await repo.count();
  if (count > 0) {
    logger.info("Users already seeded, skipping");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 12);
  await repo.save([
    repo.create({
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
    }),
    repo.create({
      email: "user@example.com",
      passwordHash: await bcrypt.hash("user1234", 12),
      role: UserRole.USER,
    }),
  ]);
  logger.info("Seeded 2 users");
}
