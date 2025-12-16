import React from 'react';
import { Task } from '../../types';
import { format } from 'date-fns';
import { X, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </h3>
              <p className={`text-gray-900 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                {format(new Date(task.dueDate), 'PPP p')}
                {isOverdue && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Overdue
                  </span>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned To
              </h3>
              <p className="text-gray-900">
                {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Created By
              </h3>
              <p className="text-gray-900">{task.creator.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Created
              </h3>
              <p className="text-gray-900">{format(new Date(task.createdAt), 'PPP')}</p>
            </div>
          </div>

          {/* Activity Log */}
          {task.auditLogs && task.auditLogs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Log</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {task.auditLogs.map((log) => (
                  <div key={log.id} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3 py-1">
                    <span className="font-medium">{log.userName}</span> {log.action.toLowerCase()}
                    {log.field && (
                      <span>
                        {' '}{log.field}: <span className="text-gray-400">{log.oldValue}</span> → <span className="font-medium">{log.newValue}</span>
                      </span>
                    )}
                    <span className="text-gray-400 ml-2">
                      {format(new Date(log.createdAt), 'PPp')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete Task
          </Button>
          <Button onClick={onEdit}>
            Edit Task
          </Button>
        </div>
      </div>
    </div>
  );
};