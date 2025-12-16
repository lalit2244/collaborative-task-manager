import React from 'react';
import { Select } from '../ui/Select';

interface TaskFiltersProps {
  filters: {
    status?: string;
    priority?: string;
    sortBy?: string;
    order?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select
        label="Status"
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'TODO', label: 'To Do' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'REVIEW', label: 'Review' },
          { value: 'COMPLETED', label: 'Completed' },
        ]}
      />

      <Select
        label="Priority"
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value || undefined })}
        options={[
          { value: '', label: 'All Priorities' },
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' },
        ]}
      />

      <Select
        label="Sort By"
        value={filters.sortBy || 'createdAt'}
        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        options={[
          { value: 'createdAt', label: 'Created Date' },
          { value: 'dueDate', label: 'Due Date' },
          { value: 'priority', label: 'Priority' },
          { value: 'status', label: 'Status' },
        ]}
      />

      <Select
        label="Order"
        value={filters.order || 'desc'}
        onChange={(e) => onFilterChange({ ...filters, order: e.target.value })}
        options={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ]}
      />
    </div>
  );
};
