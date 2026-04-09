import { Router, Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middlewares/validate";

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered
 *       409:
 *         description: Email already registered
 *
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *       401:
 *         description: Invalid credentials
 */
export function createAuthRouter(): Router {
  const router = Router();
  const service = new AuthService();

  router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const user = await service.register(req.body);
      res.status(201).json({ data: user });
    }),
  );

  router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await service.login(req.body);
      res.json({ data: result });
    }),
  );

  return router;
}
