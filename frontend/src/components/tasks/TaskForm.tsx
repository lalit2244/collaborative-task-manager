import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useUsers } from '../../hooks/useTasks';
import api from '../../lib/api';
import { Task } from '../../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  assignedToId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onCancel }) => {
  const { users } = useUsers();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
          priority: task.priority,
          status: task.status,
          assignedToId: task.assignedToId || '',
        }
      : {
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date().toISOString().slice(0, 16),
        },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert the datetime-local format to ISO 8601
      const isoDate = new Date(data.dueDate).toISOString();
      
      const payload = {
        title: data.title,
        description: data.description,
        dueDate: isoDate,
        priority: data.priority,
        status: data.status,
        assignedToId: data.assignedToId || null,
      };

      console.log('Submitting payload:', payload); // Debug log

      if (task) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting task:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details?.[0]?.message ||
                          'An error occurred while saving the task';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter task title"
        maxLength={100}
      />

      <TextArea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Enter task description"
        rows={4}
      />

      <Input
        type="datetime-local"
        label="Due Date"
        {...register('dueDate')}
        error={errors.dueDate?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          {...register('priority')}
          error={errors.priority?.message}
          options={[
            { value: 'LOW', label: 'Low' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'HIGH', label: 'High' },
            { value: 'URGENT', label: 'Urgent' },
          ]}
        />

        <Select
          label="Status"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { value: 'TODO', label: 'To Do' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'REVIEW', label: 'Review' },
            { value: 'COMPLETED', label: 'Completed' },
          ]}
        />
      </div>

      <Select
        label="Assign To"
        {...register('assignedToId')}
        options={[
          { value: '', label: 'Unassigned' },
          ...(users?.map((user: any) => ({
            value: user.id,
            label: user.name,
          })) || []),
        ]}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};