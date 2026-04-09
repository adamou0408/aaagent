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

  CORS_ORIGIN: z.string().default("*"),
});

export const env = envSchema.parse(process.env);
