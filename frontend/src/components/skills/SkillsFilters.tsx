'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, BarChart3, Grid, Calendar } from 'lucide-react';
import { groupSkillsByCategory } from '@/lib/api';
import type { Skills } from '@/lib/directus';

interface SkillsFiltersProps {
  skills: Skills[];
  onFilter?: (filteredSkills: Skills[]) => void;
}

interface FilterState {
  search: string;
  categories: Set<string>;
  proficiencyRange: [number, number];
  sortBy: 'name' | 'proficiency' | 'category';
  sortOrder: 'asc' | 'desc';
}

export default function SkillsFilters({ skills, onFilter }: SkillsFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: new Set(),
    proficiencyRange: [1, 10],
    sortBy: 'proficiency',
    sortOrder: 'desc',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const skillsByCategory = groupSkillsByCategory(skills);
  const categories = Object.keys(skillsByCategory);

  const applyFilters = useCallback((newFilters: FilterState) => {
    let filtered = skills.filter(skill => {
      // Search filter
      if (newFilters.search && !skill.name.toLowerCase().includes(newFilters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (newFilters.categories.size > 0 && !newFilters.categories.has(skill.category || '')) {
        return false;
      }

      // Proficiency range filter
      if ((skill.proficiency_level || 0) < newFilters.proficiencyRange[0] || 
          (skill.proficiency_level || 0) > newFilters.proficiencyRange[1]) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (newFilters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'proficiency':
          comparison = (a.proficiency_level || 0) - (b.proficiency_level || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }

      return newFilters.sortOrder === 'asc' ? comparison : -comparison;
    });

    onFilter?.(filtered);
  }, [skills, onFilter]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const toggleCategory = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    updateFilter('categories', newCategories);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      categories: new Set(),
      proficiencyRange: [1, 10],
      sortBy: 'proficiency',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    applyFilters(resetFilters);
  };

  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    filters.categories.size +
    (filters.proficiencyRange[0] !== 1 || filters.proficiencyRange[1] !== 10 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border shadow-sm mb-6">
      {/* Filter Toggle and Summary */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Grid className="w-4 h-4" />
              {skills.length} Skills
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {categories.length} Categories
            </span>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t"
        >
          <div className="p-6 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Skills</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search by skill name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categories ({filters.categories.size} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.categories.has(category)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {category} ({skillsByCategory[category]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Proficiency Range */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Proficiency Range: {filters.proficiencyRange[0]} - {filters.proficiencyRange[1]}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={filters.proficiencyRange[0]}
                    onChange={(e) => updateFilter('proficiencyRange', [
                      Math.min(parseInt(e.target.value), filters.proficiencyRange[1]),
                      filters.proficiencyRange[1]
                    ])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {filters.proficiencyRange[0]}</span>
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={filters.proficiencyRange[1]}
                    onChange={(e) => updateFilter('proficiencyRange', [
                      filters.proficiencyRange[0],
                      Math.max(parseInt(e.target.value), filters.proficiencyRange[0])
                    ])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Max: {filters.proficiencyRange[1]}</span>
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="proficiency">Proficiency Level</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => updateFilter('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}