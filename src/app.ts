import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { requestLogger } from "./middlewares/request-logger";
import { errorHandler } from "./middlewares/error-handler";
import { createTaskRouter } from "./controllers/task.controller";

export function createApp() {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(requestLogger);

  // Health check (outside /api/v1 for load balancer probes)
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // API docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API routes
  app.use("/api/v1/tasks", createTaskRouter());

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
