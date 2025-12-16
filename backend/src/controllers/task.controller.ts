import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskService } from '../services/task.service';
import { TaskFilterInput } from '../dto/task.dto';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.createTask(req.body, req.user!.id);
      
      // Emit socket event for real-time update
      const io = req.app.get('io');
      io.emit('task:created', task);

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const filters: TaskFilterInput = {
        status: req.query.status as any,
        priority: req.query.priority as any,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
      };

      const tasks = await this.taskService.getAllTasks(filters);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dashboard = await this.taskService.getDashboard(req.user!.id);
      res.status(200).json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.taskService.updateTask(
        req.params.id,
        req.body,
        req.user!.id
      );

      // Emit socket event for real-time update
      const io = req.app.get('io');
      io.emit('task:updated', result.task);

      // Send notification if task was reassigned
      if (result.wasReassigned && result.newAssigneeId) {
        io.to(`user:${result.newAssigneeId}`).emit('task:assigned', {
          task: result.task,
          message: `You have been assigned to task: ${result.task.title}`,
        });
      }

      res.status(200).json({
        message: 'Task updated successfully',
        task: result.task,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params.id);

      // Emit socket event for real-time update
      const io = req.app.get('io');
      io.emit('task:deleted', { taskId: req.params.id });

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
