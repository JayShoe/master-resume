'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, TrendingUp, Calendar, Target } from 'lucide-react';

interface AccomplishmentModalProps {
  accomplishment: any;
  onClose: () => void;
}

export default function AccomplishmentModal({ accomplishment, onClose }: AccomplishmentModalProps) {
  useEffect(() => {
    if (accomplishment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [accomplishment]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (accomplishment) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [accomplishment, onClose]);

  if (!accomplishment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full">
                  {accomplishment.category || 'Achievement'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {accomplishment.title}
              </h2>
              {accomplishment.date && (
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(accomplishment.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            {accomplishment.description && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Description
                </h3>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: accomplishment.description }}
                />
              </div>
            )}

            {/* Impact Metrics */}
            {accomplishment.impact_metrics && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Impact & Results
                </h3>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {accomplishment.impact_metrics}
                  </p>
                </div>
              </div>
            )}

            {/* Achievement Type */}
            {accomplishment.achievement_type && (
              <div>
                <h3 className="font-semibold mb-2">Type</h3>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize">
                  {accomplishment.achievement_type.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Organization */}
            {accomplishment.organization && (
              <div>
                <h3 className="font-semibold mb-2">Organization</h3>
                <p className="text-muted-foreground">{accomplishment.organization}</p>
              </div>
            )}

            {/* URL */}
            {accomplishment.url && (
              <div>
                <h3 className="font-semibold mb-2">Learn More</h3>
                <a
                  href={accomplishment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  View Details
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            )}

            {/* Skills & Technologies */}
            {(accomplishment.skills?.length > 0 || accomplishment.technologies?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accomplishment.skills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Related Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {accomplishment.skills.map((skill: any, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md"
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {accomplishment.technologies?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {accomplishment.technologies.map((tech: any, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-md"
                        >
                          {tech.name || tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Projects */}
            {accomplishment.projects?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Related Projects</h3>
                <div className="space-y-3">
                  {accomplishment.projects.map((project: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">{project.name || project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}