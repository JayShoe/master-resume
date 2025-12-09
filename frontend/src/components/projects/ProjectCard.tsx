'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ExternalLink, Github, Clock, User, Building, Star } from 'lucide-react';
import { Projects } from '@/types/generated-schema';

interface ProjectCardProps {
  project: Projects;
  viewMode: 'grid' | 'list' | 'masonry';
  onClick: () => void;
}

export default function ProjectCard({ project, viewMode, onClick }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'archived':
        return 'bg-navy-100 text-navy-800 border-navy-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getProjectTypeIcon = (type: string | null | undefined) => {
    switch (type) {
      case 'professional':
        return <Building className="h-4 w-4" />;
      case 'personal':
        return <User className="h-4 w-4" />;
      case 'open_source':
        return <Github className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const renderGridCard = () => (
    <div 
      className="group bg-white border border-navy-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {!imageError && (
          <Image
            src={project.project_url || '/api/placeholder/400/240'}
            alt={project.name || 'Project image'}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted-foreground/20"></div>
          </div>
        )}

        {/* Fallback when image fails */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/20">
              {project.name?.charAt(0) || 'P'}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status || 'Draft'}
          </span>
        </div>

        {/* Enhanced Featured badge */}
        {project.is_featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-amber-400 text-amber-900 px-2 py-1 rounded-full flex items-center space-x-1 border border-amber-500 shadow-sm">
              <Star className="h-3 w-3" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Professional project type and date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-navy-600">
            <span className="text-blue-500">{getProjectTypeIcon(project.project_type)}</span>
            <span className="capitalize font-medium">{project.project_type || 'Project'}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-navy-500">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="font-medium">{formatDate(project.start_date)}</span>
          </div>
        </div>

        {/* Enhanced Title */}
        <h3 className="text-lg font-bold mb-2 text-navy-900 group-hover:text-blue-700 transition-colors text-professional">
          {project.name}
        </h3>

        {/* Enhanced Role */}
        {project.role && (
          <p className="text-sm text-blue-600 font-semibold mb-2">{project.role}</p>
        )}

        {/* Enhanced Description */}
        <p className="text-navy-600 text-sm mb-4 line-clamp-3 text-body">
          {project.description}
        </p>

        {/* Professional Technology tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* This would need to be populated from relations */}
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium border border-emerald-200 text-technical">
            React
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium border border-emerald-200 text-technical">
            TypeScript
          </span>
        </div>

        {/* Links */}
        <div className="flex space-x-2">
          {project.project_url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.project_url!, '_blank');
              }}
              className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Live Demo</span>
            </button>
          )}
          {project.github_url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.github_url!, '_blank');
              }}
              className="flex items-center space-x-1 text-xs px-3 py-1.5 border border-border rounded-full hover:bg-accent transition-colors"
            >
              <Github className="h-3 w-3" />
              <span>GitHub</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderListCard = () => (
    <div 
      className="group bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        {/* Project Image */}
        <div className="relative w-full md:w-64 h-48 md:h-32 bg-muted flex-shrink-0">
          {!imageError && (
            <Image
              src={project.project_url || '/api/placeholder/400/240'}
              alt={project.name || 'Project image'}
              fill
              className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/20"></div>
            </div>
          )}

          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-4xl font-bold text-primary/20">
                {project.name?.charAt(0) || 'P'}
              </div>
            </div>
          )}

          {project.is_featured && (
            <div className="absolute top-2 left-2">
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span className="text-xs font-medium">Featured</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  {project.role && (
                    <p className="text-sm text-primary font-medium">{project.role}</p>
                  )}
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status || 'Draft'}
                </span>
              </div>

              {/* Meta info */}
              <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  {getProjectTypeIcon(project.project_type)}
                  <span className="capitalize">{project.project_type || 'Project'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(project.start_date)}
                    {project.end_date && ` - ${formatDate(project.end_date)}`}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Technology tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  React
                </span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  TypeScript
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex space-x-2 lg:ml-4">
              {project.project_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.project_url!, '_blank');
                  }}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Live Demo</span>
                </button>
              )}
              {project.github_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.github_url!, '_blank');
                  }}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 border border-border rounded-full hover:bg-accent transition-colors"
                >
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return viewMode === 'grid' ? renderGridCard() : renderListCard();
}