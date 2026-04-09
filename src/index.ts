import "reflect-metadata";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { AppDataSource } from "./config/data-source";
import { createApp } from "./app";

const app = createApp();

// Start server
async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected");

    await AppDataSource.runMigrations();
    logger.info("Migrations executed");
  } catch (err) {
    logger.warn("Database not available, running without persistence", {
      error: (err as Error).message,
    });
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
    logger.info(`API docs available at http://localhost:${env.PORT}/docs`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          logger.info("Database connection closed");
        }
      } catch (err) {
        logger.error("Error during shutdown", {
          error: (err as Error).message,
        });
      }
      process.exit(0);
    });

    // Force shutdown after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap();
