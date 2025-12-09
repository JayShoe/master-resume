'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, Building } from 'lucide-react';
import { formatDateRange } from '@/lib/api';
import type { Education } from '@/lib/directus';

interface EducationTimelineProps {
  education: Education[];
  experience: any[];
  skills: any[];
}

export default function EducationTimeline({ education, experience, skills }: EducationTimelineProps) {
  const sortedEducation = [...education].sort((a, b) => 
    new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime()
  );

  const getEducationLevel = (degree: string | null | undefined): { level: number; color: string; icon: string } => {
    const lower = (degree || '').toLowerCase();
    if (lower.includes('phd') || lower.includes('doctorate')) {
      return { level: 4, color: 'text-purple-600', icon: '🎓' };
    }
    if (lower.includes('master') || lower.includes('mba') || lower.includes('ms') || lower.includes('ma')) {
      return { level: 3, color: 'text-blue-600', icon: '🏆' };
    }
    if (lower.includes('bachelor') || lower.includes('bs') || lower.includes('ba')) {
      return { level: 2, color: 'text-green-600', icon: '📚' };
    }
    if (lower.includes('associate') || lower.includes('aa') || lower.includes('as')) {
      return { level: 1, color: 'text-orange-600', icon: '📖' };
    }
    return { level: 0, color: 'text-gray-600', icon: '🎯' };
  };

  const getGradeDisplay = (grade: string | null) => {
    if (!grade) return null;
    
    // Handle GPA format
    if (grade.includes('.') && parseFloat(grade) <= 4.0) {
      return `GPA: ${grade}/4.0`;
    }
    
    // Handle percentage
    if (grade.includes('%')) {
      return grade;
    }
    
    // Handle letter grades
    if (grade.match(/^[A-F][+-]?$/)) {
      return `Grade: ${grade}`;
    }
    
    return grade;
  };

  return (
    <div className="space-y-8">
      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-8">
          {sortedEducation.map((edu, index) => {
            const { level, color, icon } = getEducationLevel(edu.degree_type || edu.field_of_study || '');
            
            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start"
              >
                {/* Timeline dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full bg-white border-2 border-current ${color} z-10`}>
                  <div className="absolute inset-1 rounded-full bg-current opacity-30"></div>
                </div>
                
                {/* Content */}
                <div className="ml-16 bg-white rounded-lg border shadow-sm p-6 w-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{edu.degree_type} {edu.field_of_study}</h3>
                        <p className="text-lg font-medium text-primary">{edu.institution}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {formatDateRange(edu.start_date || '', edu.graduation_date || undefined, false)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Field of Study */}
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Field of Study:</span>
                      <span className="text-gray-600">{edu.field_of_study}</span>
                    </div>

                    {/* Institution Details */}
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Institution:</span>
                      <span className="text-gray-600">{edu.institution}</span>
                    </div>

                    {/* Summary */}
                    {edu.summary && (
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-700">Summary:</span>
                          <p className="text-gray-600 mt-1">{edu.summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {edu.description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                      </div>
                    )}

                    {/* Status indicator */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${!edu.graduation_date ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <span className="text-sm font-medium">
                          {!edu.graduation_date ? 'Currently Enrolled' : 'Completed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Level {level + 1}</span>
                        {edu.start_date && new Date(edu.start_date).getFullYear() !== new Date().getFullYear() && (
                          <span>{new Date().getFullYear() - new Date(edu.start_date).getFullYear()} years ago</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Education Stats */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Education Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{education.length}</p>
            <p className="text-xs text-muted-foreground">Total Degrees</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...education.map(edu => getEducationLevel(edu.degree_type).level)) + 1}
            </p>
            <p className="text-xs text-muted-foreground">Highest Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(education.map(edu => edu.field_of_study)).size}
            </p>
            <p className="text-xs text-muted-foreground">Fields of Study</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {education.filter(edu => !edu.graduation_date).length}
            </p>
            <p className="text-xs text-muted-foreground">Currently Enrolled</p>
          </div>
        </div>

        {/* Fields of Study */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Areas of Study</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(education.map(edu => edu.field_of_study))).map(field => (
              <span
                key={field}
                className="px-3 py-1 bg-white rounded-full text-sm font-medium border"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}