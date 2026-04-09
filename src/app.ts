import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { registry } from "./config/metrics";
import { requestId } from "./middlewares/request-id";
import { requestLogger } from "./middlewares/request-logger";
import { metricsMiddleware } from "./middlewares/metrics";
import { errorHandler } from "./middlewares/error-handler";
import { apiLimiter } from "./middlewares/rate-limiter";
import { createHealthRouter } from "./controllers/health.controller";
import { createV1Router } from "./routes/v1";

export function createApp() {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(compression());
  app.use(express.json());
  app.use(requestId);
  app.use(requestLogger);
  app.use(metricsMiddleware);
  app.use(apiLimiter);

  // Health & readiness probes (no rate limit, no auth)
  app.use("/", createHealthRouter());

  // Prometheus metrics endpoint
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", registry.contentType);
    res.end(await registry.metrics());
  });

  // API docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API v1 routes
  app.use("/api/v1", createV1Router());

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
