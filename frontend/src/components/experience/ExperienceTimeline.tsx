'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceFilters, { FilterState, SortOption } from './ExperienceFilters';
import PositionCard from './PositionCard';
import AccomplishmentModal from './AccomplishmentModal';

interface ExperienceTimelineProps {
  positions: any[];
  skills: any[];
}

export default function ExperienceTimeline({ positions, skills }: ExperienceTimelineProps) {
  const [filters, setFilters] = useState<FilterState>({
    industries: [],
    roleTypes: [],
    skills: [],
    technologies: [],
    dateRange: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [selectedAccomplishment, setSelectedAccomplishment] = useState<any>(null);

  // Filter and sort positions
  const filteredAndSortedPositions = useMemo(() => {
    let filtered = [...positions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(position => 
        position.primary_title?.toLowerCase().includes(searchLower) ||
        position.title?.toLowerCase().includes(searchLower) ||
        position.company?.name?.toLowerCase().includes(searchLower) ||
        position.description?.toLowerCase().includes(searchLower) ||
        position.location?.toLowerCase().includes(searchLower) ||
        position.employment_type?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filters
    if (filters.industries.length > 0) {
      filtered = filtered.filter(position => 
        position.company?.industry && filters.industries.includes(position.company.industry)
      );
    }

    if (filters.roleTypes.length > 0) {
      filtered = filtered.filter(position => 
        position.employment_type && filters.roleTypes.includes(position.employment_type)
      );
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter(position =>
        position.skills_demonstrated?.some((skill: any) => 
          filters.skills.includes(skill.name)
        )
      );
    }

    if (filters.technologies.length > 0) {
      filtered = filtered.filter(position =>
        position.technologies_used?.some((tech: string) => 
          filters.technologies.includes(tech)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime();
        case 'date-asc':
          return new Date(a.start_date || '').getTime() - new Date(b.start_date || '').getTime();
        case 'relevance':
          // Sort by number of matching skills/technologies
          const aMatches = (a.skills_demonstrated?.length || 0) + (a.technologies_used?.length || 0);
          const bMatches = (b.skills_demonstrated?.length || 0) + (b.technologies_used?.length || 0);
          return bMatches - aMatches;
        case 'impact':
          // Sort by number of accomplishments (assuming higher accomplishments = higher impact)
          return (b.accomplishments?.length || 0) - (a.accomplishments?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [positions, filters, searchTerm, sortBy]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const handleAccomplishmentClick = useCallback((accomplishment: any) => {
    setSelectedAccomplishment(accomplishment);
  }, []);

  return (
    <>
      {/* Filters */}
      <ExperienceFilters
        positions={positions}
        skills={skills}
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedPositions.length} of {positions.length} positions
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Professional Timeline */}
      <div className="relative">
        {/* Sophisticated Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-navy-800 via-blue-600 to-emerald-600 hidden md:block rounded-full shadow-sm" />
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-500 to-emerald-400 hidden md:block rounded-full" />

        {/* Position Cards with Enhanced Animations */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="relative group"
              >
                {/* Professional Timeline Dot */}
                <div className="absolute left-6 top-8 w-6 h-6 bg-white border-4 border-navy-800 rounded-full z-10 hidden md:block shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-full h-full rounded-full transition-all duration-300 ${
                    position.is_current 
                      ? 'bg-emerald-500 animate-pulse shadow-emerald-300 shadow-lg' 
                      : 'bg-blue-600 group-hover:bg-blue-500'
                  }`} />
                </div>

                {/* Enhanced Position Card Container */}
                <div className="md:ml-20 relative">
                  {/* Connection Line from Dot to Card */}
                  <div className="absolute -left-6 top-8 w-6 h-0.5 bg-navy-300 hidden md:block"></div>
                  
                  <PositionCard
                    position={position}
                    skills={skills}
                    onAccomplishmentClick={handleAccomplishmentClick}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedPositions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No positions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Accomplishment Modal */}
      <AccomplishmentModal
        accomplishment={selectedAccomplishment}
        onClose={() => setSelectedAccomplishment(null)}
      />
    </>
  );
}