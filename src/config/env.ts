import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .default("info"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default("aaagent"),
  DB_PASSWORD: z.string().default("changeme"),
  DB_DATABASE: z.string().default("aaagent"),
  DB_POOL_SIZE: z.coerce.number().default(10),
  DB_CONNECTION_TIMEOUT: z.coerce.number().default(10000),

  CORS_ORIGIN: z.string().default("*"),

  JWT_SECRET: z.string().default("dev-secret-change-in-production"),
  JWT_EXPIRATION: z.string().default("24h"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 min
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export const env = envSchema.parse(process.env);
