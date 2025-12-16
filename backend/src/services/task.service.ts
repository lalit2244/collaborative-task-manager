import { TaskRepository, TaskFilters } from '../repositories/task.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateTaskInput, UpdateTaskInput } from '../dto/task.dto';
import { Priority, Status } from '@prisma/client';

export class TaskService {
  private taskRepo: TaskRepository;
  private userRepo: UserRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
    this.userRepo = new UserRepository();
  }

  /**
   * Create a new task
   * Validates assignee existence if provided
   */
  async createTask(data: CreateTaskInput, creatorId: string) {
    // Validate assignee if provided
    if (data.assignedToId) {
      const assignee = await this.userRepo.findById(data.assignedToId);
      if (!assignee) {
        throw new Error('Assigned user not found');
      }
    }

    const task = await this.taskRepo.create({
      ...data,
      dueDate: new Date(data.dueDate),
      priority: data.priority as Priority,
      status: (data.status as Status) || 'TODO',
      creatorId,
      assignedToId: data.assignedToId || null,
    });

    // Create audit log
    const creator = await this.userRepo.findById(creatorId);
    await this.taskRepo.createAuditLog({
      taskId: task.id,
      action: 'CREATED',
      userId: creatorId,
      userName: creator!.name,
    });

    return task;
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  /**
   * Get all tasks with filters
   */
  async getAllTasks(filters: TaskFilters) {
    return this.taskRepo.findAll(filters);
  }

  /**
   * Get dashboard data for user
   */
  async getDashboard(userId: string) {
    const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
      this.taskRepo.findByAssignee(userId),
      this.taskRepo.findByCreator(userId),
      this.taskRepo.findOverdue(),
    ]);

    // Filter overdue tasks assigned to or created by user
    const userOverdueTasks = overdueTasks.filter(
      (task) => task.assignedToId === userId || task.creatorId === userId
    );

    return {
      assignedTasks,
      createdTasks,
      overdueTasks: userOverdueTasks,
      stats: {
        totalAssigned: assignedTasks.length,
        totalCreated: createdTasks.length,
        totalOverdue: userOverdueTasks.length,
        completedTasks: assignedTasks.filter((t) => t.status === 'COMPLETED').length,
      },
    };
  }

  /**
   * Update task
   * Creates audit log for changes and handles assignment notifications
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskInput,
    userId: string
  ) {
    const existingTask = await this.taskRepo.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Validate assignee if being updated
    if (data.assignedToId !== undefined) {
      if (data.assignedToId) {
        const assignee = await this.userRepo.findById(data.assignedToId);
        if (!assignee) {
          throw new Error('Assigned user not found');
        }
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.priority) updateData.priority = data.priority as Priority;
    if (data.status) updateData.status = data.status as Status;
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;

    const updatedTask = await this.taskRepo.update(taskId, updateData);

    // Create audit logs
    const user = await this.userRepo.findById(userId);
    const auditPromises = [];

    if (data.status && data.status !== existingTask.status) {
      auditPromises.push(
        this.taskRepo.createAuditLog({
          taskId,
          action: 'UPDATED',
          field: 'status',
          oldValue: existingTask.status,
          newValue: data.status,
          userId,
          userName: user!.name,
        })
      );
    }

    if (data.priority && data.priority !== existingTask.priority) {
      auditPromises.push(
        this.taskRepo.createAuditLog({
          taskId,
          action: 'UPDATED',
          field: 'priority',
          oldValue: existingTask.priority,
          newValue: data.priority,
          userId,
          userName: user!.name,
        })
      );
    }

    if (data.assignedToId !== undefined && data.assignedToId !== existingTask.assignedToId) {
      auditPromises.push(
        this.taskRepo.createAuditLog({
          taskId,
          action: 'UPDATED',
          field: 'assignedTo',
          oldValue: existingTask.assignedToId || 'none',
          newValue: data.assignedToId || 'none',
          userId,
          userName: user!.name,
        })
      );
    }

    await Promise.all(auditPromises);

    return {
      task: updatedTask,
      wasReassigned:
        data.assignedToId !== undefined && data.assignedToId !== existingTask.assignedToId,
      newAssigneeId: data.assignedToId,
    };
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    return this.taskRepo.delete(taskId);
  }
}