import React from 'react';
import { Task } from '../../types';
import { format } from 'date-fns';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
            {task.title}
          </h3>
          {isOverdue && (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
          </div>
          {task.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{task.assignedTo.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};