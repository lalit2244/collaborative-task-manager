export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: User;
  assignedToId: string | null;
  assignedTo: User | null;
  auditLogs?: AuditLog[];
}

export interface AuditLog {
  id: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface DashboardData {
  assignedTasks: Task[];
  createdTasks: Task[];
  overdueTasks: Task[];
  stats: {
    totalAssigned: number;
    totalCreated: number;
    totalOverdue: number;
    completedTasks: number;
  };
}