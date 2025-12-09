'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Award,
  Briefcase,
  Clock
} from 'lucide-react';
import { formatDateRange } from '@/lib/api';

interface PositionCardProps {
  position: any;
  skills: any[];
  onAccomplishmentClick?: (accomplishment: any) => void;
}

export default function PositionCard({ position, skills, onAccomplishmentClick }: PositionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);

  const dateRange = formatDateRange(
    position.start_date,
    position.end_date,
    position.is_current
  );

  const technologies = position.technologies_used || [];
  const displayTechnologies = showAllTechnologies ? technologies : technologies.slice(0, 6);

  return (
    <motion.div
      layout
      className="bg-white border border-navy-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
    >
      {/* Main Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            {/* Professional Position Title & Current Badge */}
            <div className="flex items-start gap-3 mb-3">
              <h3 className="text-xl font-bold text-navy-900 text-professional group-hover:text-blue-700 transition-colors duration-300">
                {position.primary_title || position.title}
              </h3>
              {position.is_current && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full animate-pulse border border-emerald-200">
                  Current Role
                </span>
              )}
            </div>

            {/* Enhanced Company Info */}
            <div className="flex items-center gap-2 mb-3 text-navy-600">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-blue-700">{position.company?.name || 'Company'}</span>
              {position.company?.industry && (
                <>
                  <span className="text-navy-400">•</span>
                  <span className="text-sm text-navy-500 font-medium">{position.company.industry}</span>
                </>
              )}
            </div>

            {/* Professional Employment Type & Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="capitalize font-medium">{position.employment_type?.replace('_', ' ')}</span>
              </div>
              {position.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{position.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-medium">{dateRange}</span>
              </div>
            </div>
          </div>

          {/* Company Logo Placeholder */}
          {position.company?.logo ? (
            <img
              src={position.company.logo}
              alt={`${position.company.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {position.company?.name?.charAt(0) || 'C'}
            </div>
          )}
        </div>

        {/* Description */}
        {position.description && (
          <div 
            className="text-muted-foreground mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: position.description }}
          />
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {displayTechnologies.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 6 && (
                <button
                  onClick={() => setShowAllTechnologies(!showAllTechnologies)}
                  className="px-2 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs rounded-md font-medium transition-colors"
                >
                  {showAllTechnologies 
                    ? `Show Less` 
                    : `+${technologies.length - 6} more`
                  }
                </button>
              )}
            </div>
          </div>
        )}

        {/* Skills Demonstrated */}
        {position.skills_demonstrated?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Skills Demonstrated</h4>
            <div className="flex flex-wrap gap-2">
              {position.skills_demonstrated.slice(0, 8).map((skill: any, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-md font-medium"
                >
                  {skill.name || skill}
                </span>
              ))}
              {position.skills_demonstrated.length > 8 && (
                <span className="px-2 py-1 text-green-600 text-xs rounded-md font-medium">
                  +{position.skills_demonstrated.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Accomplishments Preview */}
        {position.accomplishments?.length > 0 && (
          <div className="mb-4">
            {position.summary && (
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold">
                  {position.summary}
                </h4>
              </div>
            )}
            <div className="space-y-2">
              {position.accomplishments.slice(0, isExpanded ? undefined : 2).map((accomplishment: any, index: number) => (
                <div
                  key={index}
                  onClick={() => onAccomplishmentClick?.(accomplishment)}
                  className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    {accomplishment.title}
                  </h5>
                  <p className="text-sm text-amber-700 dark:text-amber-300 line-clamp-2">
                    {accomplishment.description?.replace(/<[^>]*>/g, '') || accomplishment.impact_metrics}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {(position.accomplishments?.length > 2 || position.key_responsibilities?.length > 0) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show More Details
              </>
            )}
          </button>
        )}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4"
          >
            {/* Key Responsibilities */}
            {position.key_responsibilities?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {position.key_responsibilities.map((responsibility: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Accomplishments */}
            {position.accomplishments?.length > 2 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  All Accomplishments
                </h4>
                <div className="space-y-2">
                  {position.accomplishments.slice(2).map((accomplishment: any, index: number) => (
                    <div
                      key={index + 2}
                      onClick={() => onAccomplishmentClick?.(accomplishment)}
                      className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        {accomplishment.title}
                      </h5>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {accomplishment.description?.replace(/<[^>]*>/g, '') || accomplishment.impact_metrics}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Website Link */}
            {position.company?.website && (
              <div className="mt-4 pt-4 border-t">
                <a
                  href={position.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit {position.company.name}
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}