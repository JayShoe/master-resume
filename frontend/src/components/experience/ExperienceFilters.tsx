'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, X } from 'lucide-react';

interface ExperienceFiltersProps {
  positions: any[];
  skills: any[];
  onFiltersChange?: (filters: FilterState) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (sort: SortOption) => void;
}

export interface FilterState {
  industries: string[];
  roleTypes: string[];
  skills: string[];
  technologies: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}

export type SortOption = 'date-desc' | 'date-asc' | 'relevance' | 'impact';

export default function ExperienceFilters({ 
  positions, 
  skills, 
  onFiltersChange, 
  onSearchChange, 
  onSortChange 
}: ExperienceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filters, setFilters] = useState<FilterState>({
    industries: [],
    roleTypes: [],
    skills: [],
    technologies: [],
    dateRange: {}
  });

  // Extract unique values for filters
  const uniqueIndustries = Array.from(new Set(
    positions.flatMap(p => p.company?.industry ? [p.company.industry] : [])
  )).filter(Boolean);

  const uniqueRoleTypes = Array.from(new Set(
    positions.map(p => p.employment_type).filter(Boolean)
  ));

  const uniqueSkills = skills.map(s => s.name);

  const uniqueTechnologies = Array.from(new Set(
    positions.flatMap(p => p.technologies_used || [])
  )).filter(Boolean);

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  useEffect(() => {
    onSearchChange?.(searchTerm);
  }, [searchTerm, onSearchChange]);

  useEffect(() => {
    onSortChange?.(sortBy);
  }, [sortBy, onSortChange]);

  const handleFilterToggle = (category: keyof FilterState, value: string) => {
    if (category === 'dateRange') return;

    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      industries: [],
      roleTypes: [],
      skills: [],
      technologies: [],
      dateRange: {}
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(f => 
    Array.isArray(f) ? f.length > 0 : Object.keys(f).length > 0
  ) || searchTerm;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6 mb-8">
      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search positions, companies, skills, or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary min-w-[140px]"
        >
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Earliest First</option>
          <option value="relevance">Most Relevant</option>
          <option value="impact">Highest Impact</option>
        </select>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
            isFilterOpen 
              ? 'bg-primary text-white border-primary' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {isFilterOpen && (
        <div className="border-t pt-6 space-y-6">
          {/* Industries */}
          {uniqueIndustries.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Industry</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueIndustries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleFilterToggle('industries', industry)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.industries.includes(industry)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Role Types */}
          {uniqueRoleTypes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Employment Type</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueRoleTypes.map(roleType => (
                  <button
                    key={roleType}
                    onClick={() => handleFilterToggle('roleTypes', roleType)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                      filters.roleTypes.includes(roleType)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {roleType.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {uniqueSkills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Skills</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {uniqueSkills.slice(0, 20).map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleFilterToggle('skills', skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.skills.includes(skill)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {uniqueTechnologies.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Technologies</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {uniqueTechnologies.slice(0, 20).map(tech => (
                  <button
                    key={tech}
                    onClick={() => handleFilterToggle('technologies', tech)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.technologies.includes(tech)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.industries.map(industry => (
              <span key={`industry-${industry}`} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {industry}
                <button onClick={() => handleFilterToggle('industries', industry)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.roleTypes.map(roleType => (
              <span key={`role-${roleType}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs">
                {roleType.replace('_', ' ')}
                <button onClick={() => handleFilterToggle('roleTypes', roleType)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.skills.map(skill => (
              <span key={`skill-${skill}`} className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs">
                {skill}
                <button onClick={() => handleFilterToggle('skills', skill)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.technologies.map(tech => (
              <span key={`tech-${tech}`} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-xs">
                {tech}
                <button onClick={() => handleFilterToggle('technologies', tech)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}