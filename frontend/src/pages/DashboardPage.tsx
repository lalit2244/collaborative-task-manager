import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { useDashboard } from '../hooks/useTasks';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, AlertCircle, CheckCircle, Clock, ListTodo, Edit, Trash2 } from 'lucide-react';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import { Task } from '../types';

export const DashboardPage: React.FC = () => {
  const { dashboard, isLoading } = useDashboard();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('task:assigned', (data) => {
      setNotifications((prev) => [data, ...prev]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== data));
      }, 5000);
    });

    return () => {
      socket.off('task:assigned');
    };
  }, []);

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Task Card Component with Action Buttons
  const TaskCardWithActions = ({ task }: { task: Task }) => {
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
      <Card className="hover:shadow-lg transition-all group relative">
        <CardContent className="p-4">
          {/* Action Buttons - Show on Hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={(e) => handleEdit(task, e)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleDelete(task.id, e)}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-16">
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
              <Clock className="w-4 h-4" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            {task.assignedTo && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {task.assignedTo.name}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Notifications */}
      {notifications.map((notification, idx) => (
        <div
          key={idx}
          className="fixed top-20 right-4 z-50 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-md"
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your task overview</p>
          </div>
          <Button 
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }} 
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Assigned Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboard?.stats.totalAssigned || 0}
                  </p>
                </div>
                <ListTodo className="w-10 h-10 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Created Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboard?.stats.totalCreated || 0}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboard?.stats.completedTasks || 0}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Overdue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboard?.stats.totalOverdue || 0}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Lists */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {dashboard && dashboard.overdueTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Overdue Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.overdueTasks.map((task) => (
                  <TaskCardWithActions key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Assigned Tasks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks Assigned to You</h2>
            {dashboard && dashboard.assignedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.assignedTasks.map((task) => (
                  <TaskCardWithActions key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No tasks assigned to you yet
                </CardContent>
              </Card>
            )}
          </div>

          {/* Created Tasks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks You Created</h2>
            {dashboard && dashboard.createdTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.createdTasks.map((task) => (
                  <TaskCardWithActions key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  You haven't created any tasks yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </CardHeader>
            <CardContent>
              <TaskForm
                task={editingTask || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};