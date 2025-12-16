import { TaskService } from '../src/services/task.service';
import { Priority, Status } from '@prisma/client';

// Mock the entire database config module
jest.mock('../src/config/database', () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

// Mock the repositories
jest.mock('../src/repositories/task.repository');
jest.mock('../src/repositories/user.repository');

import { TaskRepository } from '../src/repositories/task.repository';
import { UserRepository } from '../src/repositories/user.repository';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepo: jest.Mocked<TaskRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create mock instances
    mockTaskRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByAssignee: jest.fn(),
      findByCreator: jest.fn(),
      findOverdue: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createAuditLog: jest.fn(),
    } as any;

    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    } as any;

    // Create service instance and inject mocks
    taskService = new TaskService();
    (taskService as any).taskRepo = mockTaskRepo;
    (taskService as any).userRepo = mockUserRepo;
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTask = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2025-12-31'),
        priority: 'HIGH' as Priority,
        status: 'TODO' as Status,
        creatorId: 'user-123',
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: mockUser,
        assignedTo: null,
      };

      mockTaskRepo.create.mockResolvedValue(mockTask as any);
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockTaskRepo.createAuditLog.mockResolvedValue(undefined);

      const result = await taskService.createTask(
        {
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2025-12-31T00:00:00Z',
          priority: 'HIGH',
          status: 'TODO',
        },
        'user-123'
      );

      expect(result).toEqual(mockTask);
      expect(mockTaskRepo.create).toHaveBeenCalledTimes(1);
      expect(mockTaskRepo.createAuditLog).toHaveBeenCalledTimes(1);
    });

    it('should throw error if assigned user does not exist', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        taskService.createTask(
          {
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2025-12-31T00:00:00Z',
            priority: 'HIGH',
            status: 'TODO',
            assignedToId: 'invalid-user',
          },
          'user-123'
        )
      ).rejects.toThrow('Assigned user not found');

      expect(mockUserRepo.findById).toHaveBeenCalledWith('invalid-user');
    });
  });

  describe('updateTask', () => {
    it('should update task and create audit log', async () => {
      const existingTask = {
        id: 'task-123',
        title: 'Old Title',
        status: 'TODO' as Status,
        priority: 'LOW' as Priority,
        assignedToId: null,
        description: 'Test',
        dueDate: new Date(),
        creatorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...existingTask,
        status: 'IN_PROGRESS' as Status,
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepo.findById.mockResolvedValue(existingTask as any);
      mockTaskRepo.update.mockResolvedValue(updatedTask as any);
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockTaskRepo.createAuditLog.mockResolvedValue(undefined);

      const result = await taskService.updateTask(
        'task-123',
        { status: 'IN_PROGRESS' },
        'user-123'
      );

      expect(result.task.status).toBe('IN_PROGRESS');
      expect(mockTaskRepo.createAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task-123',
          action: 'UPDATED',
          field: 'status',
          oldValue: 'TODO',
          newValue: 'IN_PROGRESS',
        })
      );
    });

    it('should throw error if task does not exist', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);

      await expect(
        taskService.updateTask('invalid-task', { status: 'COMPLETED' }, 'user-123')
      ).rejects.toThrow('Task not found');
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard data with correct filtering', async () => {
      const mockAssignedTasks = [
        { 
          id: 'task-1', 
          assignedToId: 'user-123', 
          status: 'TODO' as Status,
          creatorId: 'user-456',
        },
        { 
          id: 'task-2', 
          assignedToId: 'user-123', 
          status: 'COMPLETED' as Status,
          creatorId: 'user-456',
        },
      ];

      const mockCreatedTasks = [
        { 
          id: 'task-3', 
          creatorId: 'user-123',
          status: 'TODO' as Status,
        }
      ];

      const mockOverdueTasks = [
        { 
          id: 'task-4', 
          assignedToId: 'user-123', 
          creatorId: 'user-456',
          dueDate: new Date('2023-01-01'),
          status: 'TODO' as Status,
        },
        { 
          id: 'task-5', 
          assignedToId: 'other-user',
          creatorId: 'user-456',
          dueDate: new Date('2023-01-01'),
          status: 'TODO' as Status,
        },
      ];

      mockTaskRepo.findByAssignee.mockResolvedValue(mockAssignedTasks as any);
      mockTaskRepo.findByCreator.mockResolvedValue(mockCreatedTasks as any);
      mockTaskRepo.findOverdue.mockResolvedValue(mockOverdueTasks as any);

      const result = await taskService.getDashboard('user-123');

      expect(result.assignedTasks).toHaveLength(2);
      expect(result.createdTasks).toHaveLength(1);
      expect(result.overdueTasks).toHaveLength(1); // Only tasks for this user
      expect(result.stats.totalAssigned).toBe(2);
      expect(result.stats.completedTasks).toBe(1);
    });
  });
});