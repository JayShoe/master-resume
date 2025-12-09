'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Projects } from '@/types/generated-schema';
import ProjectCard from './ProjectCard';

interface MasonryGridProps {
  projects: Projects[];
  onProjectClick: (project: Projects) => void;
}

export default function MasonryGrid({ projects, onProjectClick }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Initialize column heights
  useEffect(() => {
    setColumnHeights(new Array(columns).fill(0));
  }, [columns]);

  // Masonry layout calculation
  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const gap = 24; // 1.5rem in pixels
    const columnWidth = (containerWidth - (gap * (columns - 1))) / columns;

    // Reset column heights
    const heights = new Array(columns).fill(0);

    // Position each item
    projects.forEach((project, index) => {
      const item = itemRefs.current[index];
      if (!item) return;

      // Find the shortest column
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));
      
      // Calculate position
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = heights[shortestColumnIndex];

      // Apply positioning
      item.style.position = 'absolute';
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.width = `${columnWidth}px`;

      // Update column height
      const itemHeight = item.offsetHeight;
      heights[shortestColumnIndex] += itemHeight + gap;
    });

    // Set container height to the tallest column
    const maxHeight = Math.max(...heights) - gap;
    container.style.height = `${maxHeight}px`;

    setColumnHeights(heights);
  }, [projects, columns]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: '200px' }}
    >
      {projects.map((project, index) => (
        <div
          key={project.id}
          ref={el => { itemRefs.current[index] = el; }}
          className="transition-all duration-300"
        >
          <MasonryProjectCard 
            project={project} 
            onClick={() => onProjectClick(project)} 
          />
        </div>
      ))}
    </div>
  );
}

// Enhanced project card optimized for masonry layout
function MasonryProjectCard({ project, onClick }: { project: Projects; onClick: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageHeight, setImageHeight] = useState<number>(200);

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Randomize card heights for more interesting masonry layout
  const getRandomHeight = () => {
    const heights = [200, 240, 280, 320, 360];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  useEffect(() => {
    const height = getRandomHeight();
    if (height) {
      setImageHeight(height);
    }
  }, []);

  return (
    <div 
      className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden mb-6"
      onClick={onClick}
    >
      {/* Project Image */}
      <div 
        className="relative bg-muted overflow-hidden"
        style={{ height: `${imageHeight}px` }}
      >
        {!imageError && (
          <img
            src={project.project_url || '/api/placeholder/400/240'}
            alt={project.name || 'Project image'}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
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

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            {project.project_url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.project_url!, '_blank');
                }}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                View Live
              </button>
            )}
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status || 'Draft'}
          </span>
        </div>

        {/* Featured badge */}
        {project.is_featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full flex items-center space-x-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {project.name}
        </h3>

        {/* Role */}
        {project.role && (
          <p className="text-sm text-primary font-medium mb-3">{project.role}</p>
        )}

        {/* Description - variable length for masonry effect */}
        <p className="text-muted-foreground text-sm mb-4" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: Math.floor(Math.random() * 3) + 2, // 2-4 lines
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project.description}
        </p>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Mock technologies - would come from relations */}
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            React
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Node.js
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            TypeScript
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(project.start_date)}</span>
          </div>
          
          <div className="capitalize">
            {project.project_type || 'Project'}
          </div>
        </div>

        {/* Progress bar for ongoing projects */}
        {project.status === 'draft' && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}