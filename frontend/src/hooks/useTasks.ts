import useSWR, { mutate } from 'swr';
import api from '../lib/api';
import { Task, DashboardData } from '../types';
import { useEffect } from 'react';
import { getSocket } from '../lib/socket';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const useTasks = (filters?: {
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: string;
}) => {
  const queryString = filters
    ? '?' + new URLSearchParams(filters as any).toString()
    : '';
  
  const { data, error, isLoading } = useSWR<Task[]>(
    `/tasks${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTaskCreated = (task: Task) => {
      mutate(`/tasks${queryString}`);
    };

    const handleTaskUpdated = (task: Task) => {
      mutate(`/tasks${queryString}`);
    };

    const handleTaskDeleted = ({ taskId }: { taskId: string }) => {
      mutate(`/tasks${queryString}`);
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [queryString]);

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate: () => mutate(`/tasks${queryString}`),
  };
};

export const useTask = (id: string) => {
  const { data, error, isLoading } = useSWR<Task>(
    id ? `/tasks/${id}` : null,
    fetcher
  );

  return {
    task: data,
    isLoading,
    isError: error,
  };
};

export const useDashboard = () => {
  const { data, error, isLoading } = useSWR<DashboardData>(
    '/tasks/dashboard',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = () => {
      mutate('/tasks/dashboard');
    };

    socket.on('task:created', handleUpdate);
    socket.on('task:updated', handleUpdate);
    socket.on('task:deleted', handleUpdate);

    return () => {
      socket.off('task:created', handleUpdate);
      socket.off('task:updated', handleUpdate);
      socket.off('task:deleted', handleUpdate);
    };
  }, []);

  return {
    dashboard: data,
    isLoading,
    isError: error,
  };
};

export const useUsers = () => {
  const { data, error, isLoading } = useSWR('/users', fetcher);

  return {
    users: data,
    isLoading,
    isError: error,
  };
};