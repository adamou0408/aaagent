import { TaskService, CreateTaskDto, UpdateTaskDto } from "../../src/services/task.service";
import { TaskRepository } from "../../src/repositories/task.repository";
import { Task, TaskStatus } from "../../src/entities/task.entity";

// Mock the logger to avoid noise in tests
jest.mock("../../src/config/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

function createMockTask(overrides: Partial<Task> = {}): Task {
  const task = new Task();
  task.id = "550e8400-e29b-41d4-a716-446655440000";
  task.title = "Test task";
  task.description = null;
  task.status = TaskStatus.PENDING;
  task.priority = 0;
  task.createdAt = new Date("2026-01-01");
  task.updatedAt = new Date("2026-01-01");
  return Object.assign(task, overrides);
}

describe("TaskService", () => {
  let service: TaskService;
  let mockRepo: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStatus: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TaskRepository>;

    service = new TaskService(mockRepo);
  });

  describe("getAllTasks", () => {
    it("should return all tasks from repository", async () => {
      const tasks = [createMockTask(), createMockTask({ id: "id-2", title: "Second" })];
      mockRepo.findAll.mockResolvedValue(tasks);

      const result = await service.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no tasks exist", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await service.getAllTasks();

      expect(result).toEqual([]);
    });
  });

  describe("getTaskById", () => {
    it("should return a task when found", async () => {
      const task = createMockTask();
      mockRepo.findById.mockResolvedValue(task);

      const result = await service.getTaskById(task.id);

      expect(result).toEqual(task);
      expect(mockRepo.findById).toHaveBeenCalledWith(task.id);
    });

    it("should return null when task not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await service.getTaskById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getTasksByStatus", () => {
    it("should return tasks filtered by status", async () => {
      const tasks = [createMockTask({ status: TaskStatus.IN_PROGRESS })];
      mockRepo.findByStatus.mockResolvedValue(tasks);

      const result = await service.getTasksByStatus(TaskStatus.IN_PROGRESS);

      expect(result).toEqual(tasks);
      expect(mockRepo.findByStatus).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
    });
  });

  describe("createTask", () => {
    it("should create a task with provided data", async () => {
      const dto: CreateTaskDto = { title: "New task", description: "Details", priority: 5 };
      const created = createMockTask({ title: dto.title, description: dto.description!, priority: dto.priority });
      mockRepo.create.mockResolvedValue(created);

      const result = await service.createTask(dto);

      expect(result.title).toBe("New task");
      expect(result.priority).toBe(5);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
    });

    it("should create a task with only required fields", async () => {
      const dto: CreateTaskDto = { title: "Minimal task" };
      const created = createMockTask({ title: dto.title });
      mockRepo.create.mockResolvedValue(created);

      const result = await service.createTask(dto);

      expect(result.title).toBe("Minimal task");
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const existing = createMockTask();
      const dto: UpdateTaskDto = { status: TaskStatus.DONE };
      const updated = createMockTask({ status: TaskStatus.DONE });

      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.updateTask(existing.id, dto);

      expect(result?.status).toBe(TaskStatus.DONE);
      expect(mockRepo.update).toHaveBeenCalledWith(existing.id, dto);
    });

    it("should return null when updating nonexistent task", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await service.updateTask("nonexistent", { title: "Updated" });

      expect(result).toBeNull();
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should return true when task is deleted", async () => {
      mockRepo.delete.mockResolvedValue(true);

      const result = await service.deleteTask("some-id");

      expect(result).toBe(true);
      expect(mockRepo.delete).toHaveBeenCalledWith("some-id");
    });

    it("should return false when task does not exist", async () => {
      mockRepo.delete.mockResolvedValue(false);

      const result = await service.deleteTask("nonexistent");

      expect(result).toBe(false);
    });
  });
});
