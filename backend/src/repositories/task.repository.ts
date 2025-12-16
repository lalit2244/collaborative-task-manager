import prisma from '../config/database';
import { Task, Priority, Status } from '@prisma/client';

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export class TaskRepository {
  /**
   * Create a new task
   */
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId?: string | null;
  }): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Find task by ID with relations
   */
  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Find all tasks with filters
   */
  async findAll(filters: TaskFilters = {}): Promise<Task[]> {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = filters;

    // Build where clause conditionally - only include fields if they exist
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    return prisma.task.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { [sortBy]: order },
    });
  }

  /**
   * Find tasks assigned to user
   */
  async findByAssignee(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Find tasks created by user
   */
  async findByCreator(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find overdue tasks
   */
  async findOverdue(): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Update task
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      dueDate: Date;
      priority: Priority;
      status: Status;
      assignedToId: string | null;
    }>
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Delete task
   */
  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }

  /**
   * Create audit log entry
   */
  async createAuditLog(data: {
    taskId: string;
    action: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
    userId: string;
    userName: string;
  }): Promise<void> {
    await prisma.auditLog.create({ data });
  }
}