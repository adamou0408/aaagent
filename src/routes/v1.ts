import { Router } from "express";
import { createTaskRouter } from "../controllers/task.controller";
import { createAuthRouter } from "../controllers/auth.controller";
import { createProjectRouter } from "../controllers/project.controller";
import { authLimiter } from "../middlewares/rate-limiter";

export function createV1Router(): Router {
  const router = Router();

  router.use("/auth", authLimiter, createAuthRouter());
  router.use("/tasks", createTaskRouter());
  router.use("/projects", createProjectRouter());

  return router;
}
