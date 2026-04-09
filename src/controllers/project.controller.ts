import { Router, Request, Response } from "express";
import { z } from "zod";
import { ProjectService } from "../services/project.service";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middlewares/validate";
import { paginationSchema } from "../utils/pagination";

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
});

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all projects (paginated)
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [ASC, DESC], default: DESC }
 *     responses:
 *       200:
 *         description: Paginated list of projects
 *   post:
 *     summary: Create a project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Project created
 */
export function createProjectRouter(): Router {
  const router = Router();
  const service = new ProjectService();

  router.get("/", asyncHandler(async (req: Request, res: Response) => {
    const params = paginationSchema.parse(req.query);
    const result = await service.getAllProjects(params);
    res.json(result);
  }));

  router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const project = await service.getProjectById(id);
    if (!project) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
      return;
    }
    res.json({ data: project });
  }));

  router.post(
    "/",
    validate(createProjectSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const project = await service.createProject(req.body);
      res.status(201).json({ data: project });
    }),
  );

  router.patch(
    "/:id",
    validate(updateProjectSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id as string;
      const project = await service.updateProject(id, req.body);
      if (!project) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
        return;
      }
      res.json({ data: project });
    }),
  );

  router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await service.deleteProject(id);
    if (!deleted) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
      return;
    }
    res.status(204).send();
  }));

  return router;
}
