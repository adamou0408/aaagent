import { Router, Request, Response } from "express";
import { z } from "zod";
import { TaskService } from "../services/task.service";
import { TaskStatus } from "../entities/task.entity";

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, in_progress, done]
 *         priority:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export function createTaskRouter(): Router {
  const router = Router();
  const service = new TaskService();

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: List all tasks
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, in_progress, done]
   *     responses:
   *       200:
   *         description: List of tasks
   */
  router.get("/", async (req: Request, res: Response) => {
    const { status } = req.query;
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      const tasks = await service.getTasksByStatus(status as TaskStatus);
      res.json({ data: tasks });
      return;
    }
    const tasks = await service.getAllTasks();
    res.json({ data: tasks });
  });

  /**
   * @swagger
   * /tasks/{id}:
   *   get:
   *     summary: Get a task by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Task details
   *       404:
   *         description: Task not found
   */
  router.get("/:id", async (req: Request, res: Response) => {
    const task = await service.getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ data: task });
  });

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Create a new task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title]
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               priority:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Task created
   */
  router.post("/", async (req: Request, res: Response) => {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const task = await service.createTask(parsed.data);
    res.status(201).json({ data: task });
  });

  /**
   * @swagger
   * /tasks/{id}:
   *   patch:
   *     summary: Update a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [pending, in_progress, done]
   *               priority:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Task updated
   *       404:
   *         description: Task not found
   */
  router.patch("/:id", async (req: Request, res: Response) => {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const task = await service.updateTask(req.params.id, parsed.data);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ data: task });
  });

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Task deleted
   *       404:
   *         description: Task not found
   */
  router.delete("/:id", async (req: Request, res: Response) => {
    const deleted = await service.deleteTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(204).send();
  });

  return router;
}
