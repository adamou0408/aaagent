import request from "supertest";
import { createApp } from "../../src/app";
import { Express } from "express";

// Mock TypeORM to avoid needing a real database
jest.mock("../../src/config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    isInitialized: false,
    query: jest.fn(),
  },
}));

// Mock the logger
jest.mock("../../src/config/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock the TaskRepository
const mockTasks = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Test task",
    description: null,
    status: "pending",
    priority: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

jest.mock("../../src/repositories/task.repository", () => ({
  TaskRepository: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue([mockTasks, mockTasks.length]),
    findById: jest.fn().mockImplementation((id: string) =>
      id === mockTasks[0].id ? Promise.resolve(mockTasks[0]) : Promise.resolve(null),
    ),
    findByStatus: jest.fn().mockResolvedValue(mockTasks),
    create: jest.fn().mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ ...mockTasks[0], ...data }),
    ),
    update: jest.fn().mockImplementation((id: string, data: Record<string, unknown>) =>
      id === mockTasks[0].id
        ? Promise.resolve({ ...mockTasks[0], ...data })
        : Promise.resolve(null),
    ),
    delete: jest.fn().mockImplementation((id: string) =>
      Promise.resolve(id === mockTasks[0].id),
    ),
  })),
}));

describe("Task API", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/v1/tasks", () => {
    it("should return list of tasks", async () => {
      const res = await request(app).get("/api/v1/tasks");

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GET /api/v1/tasks/:id", () => {
    it("should return a task by id", async () => {
      const res = await request(app).get(
        `/api/v1/tasks/${mockTasks[0].id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(mockTasks[0].id);
    });

    it("should return 404 for nonexistent task", async () => {
      const res = await request(app).get(
        "/api/v1/tasks/00000000-0000-0000-0000-000000000000",
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });
  });

  describe("POST /api/v1/tasks", () => {
    it("should create a task with valid data", async () => {
      const res = await request(app)
        .post("/api/v1/tasks")
        .send({ title: "New task", priority: 3 });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("New task");
    });

    it("should return 400 for missing title", async () => {
      const res = await request(app)
        .post("/api/v1/tasks")
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 for invalid priority", async () => {
      const res = await request(app)
        .post("/api/v1/tasks")
        .send({ title: "Bad priority", priority: 99 });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/v1/tasks/:id", () => {
    it("should update an existing task", async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${mockTasks[0].id}`)
        .send({ status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("done");
    });

    it("should return 404 for nonexistent task", async () => {
      const res = await request(app)
        .patch("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
        .send({ title: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/tasks/:id", () => {
    it("should delete an existing task", async () => {
      const res = await request(app).delete(
        `/api/v1/tasks/${mockTasks[0].id}`,
      );

      expect(res.status).toBe(204);
    });

    it("should return 404 for nonexistent task", async () => {
      const res = await request(app).delete(
        "/api/v1/tasks/00000000-0000-0000-0000-000000000000",
      );

      expect(res.status).toBe(404);
    });
  });
});
