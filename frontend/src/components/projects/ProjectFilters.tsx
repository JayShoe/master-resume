'use client'

import React from 'react';
import { X, Calendar, Code, Briefcase, Filter } from 'lucide-react';

interface FilterState {
  search: string;
  technologies: string[];
  projectTypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
  status: string[];
}

interface FilterOptions {
  projectTypes: string[];
  statuses: string[];
  technologies: string[];
}

interface ProjectFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  options: FilterOptions;
}

export default function ProjectFilters({ filters, onFiltersChange, options }: ProjectFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'technologies' | 'projectTypes' | 'status', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      technologies: [],
      projectTypes: [],
      dateRange: { start: '', end: '' },
      status: []
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.technologies.length > 0 ||
      filters.projectTypes.length > 0 ||
      filters.status.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Project Types */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <Briefcase className="inline h-4 w-4 mr-2" />
            Project Type
          </label>
          <div className="space-y-2">
            {options.projectTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.projectTypes.includes(type)}
                  onChange={() => toggleArrayFilter('projectTypes', type)}
                  className="rounded border-border text-primary focus:ring-primary mr-2"
                />
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <Calendar className="inline h-4 w-4 mr-2" />
            Status
          </label>
          <div className="space-y-2">
            {options.statuses.map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleArrayFilter('status', status)}
                  className="rounded border-border text-primary focus:ring-primary mr-2"
                />
                <span className="text-sm capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <Code className="inline h-4 w-4 mr-2" />
            Technologies
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {options.technologies.length > 0 ? (
              options.technologies.map((tech) => (
                <label key={tech} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.technologies.includes(tech)}
                    onChange={() => toggleArrayFilter('technologies', tech)}
                    className="rounded border-border text-primary focus:ring-primary mr-2"
                  />
                  <span className="text-sm">{tech}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No technologies available</p>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <Calendar className="inline h-4 w-4 mr-2" />
            Date Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">End Date</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.projectTypes.map((type) => (
              <span
                key={`type-${type}`}
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <button
                  onClick={() => toggleArrayFilter('projectTypes', type)}
                  className="ml-2 hover:text-primary/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.status.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                <span className="capitalize">{status}</span>
                <button
                  onClick={() => toggleArrayFilter('status', status)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.technologies.map((tech) => (
              <span
                key={`tech-${tech}`}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {tech}
                <button
                  onClick={() => toggleArrayFilter('technologies', tech)}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.dateRange.start && (
              <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                After: {new Date(filters.dateRange.start).toLocaleDateString()}
                <button
                  onClick={() => updateFilter('dateRange', { ...filters.dateRange, start: '' })}
                  className="ml-2 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.dateRange.end && (
              <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Before: {new Date(filters.dateRange.end).toLocaleDateString()}
                <button
                  onClick={() => updateFilter('dateRange', { ...filters.dateRange, end: '' })}
                  className="ml-2 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}