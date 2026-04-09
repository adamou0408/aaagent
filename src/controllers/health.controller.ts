import { Router } from "express";
import { AppDataSource } from "../config/data-source";

export function createHealthRouter(): Router {
  const router = Router();

  // Liveness probe — is the process alive?
  router.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    });
  });

  // Readiness probe — can the service handle requests?
  router.get("/ready", async (_req, res) => {
    const checks: Record<string, string> = {};

    // Database connectivity
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query("SELECT 1");
        checks.database = "ok";
      } else {
        checks.database = "not_initialized";
      }
    } catch {
      checks.database = "error";
    }

    const allOk = Object.values(checks).every((v) => v === "ok");
    res.status(allOk ? 200 : 503).json({
      status: allOk ? "ready" : "not_ready",
      checks,
    });
  });

  return router;
}
