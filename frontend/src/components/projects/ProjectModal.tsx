'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  ExternalLink, 
  Github, 
  Calendar, 
  User, 
  Building, 
  Star, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Award,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Projects } from '@/types/generated-schema';

interface ProjectModalProps {
  project: Projects;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock images for gallery - in real app, these would come from relations
  const projectImages = [
    project.project_url || '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => 
          prev > 0 ? prev - 1 : projectImages.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => 
          prev < projectImages.length - 1 ? prev + 1 : 0
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose, projectImages.length]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getProjectTypeIcon = (type: string | null | undefined) => {
    switch (type) {
      case 'professional':
        return <Building className="h-5 w-5" />;
      case 'personal':
        return <User className="h-5 w-5" />;
      case 'open_source':
        return <Github className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !isFullscreen && onClose()}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-6xl my-8 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  {project.is_featured && (
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                    {project.status || 'Draft'}
                  </span>
                </div>
                
                {project.role && (
                  <p className="text-lg text-primary font-medium mb-2">{project.role}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    {getProjectTypeIcon(project.project_type)}
                    <span className="capitalize">{project.project_type || 'Project'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(project.start_date)}
                      {project.end_date && ` - ${formatDate(project.end_date)}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Action buttons */}
                {project.project_url && (
                  <button
                    onClick={() => window.open(project.project_url!, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Demo</span>
                  </button>
                )}
                {project.github_url && (
                  <button
                    onClick={() => window.open(project.github_url!, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </button>
                )}
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={projectImages[currentImageIndex] || '/api/placeholder/800/600'}
                  alt={`${project.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                
                {/* Navigation arrows */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev > 0 ? prev - 1 : projectImages.length - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev < projectImages.length - 1 ? prev + 1 : 0
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Image indicators */}
                {projectImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {projectImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </section>

                  {/* Key Features */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Key Features
                    </h2>
                    <ul className="space-y-3">
                      {/* Mock features - would come from database */}
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Responsive design with mobile-first approach</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Real-time data synchronization</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Advanced search and filtering capabilities</span>
                      </li>
                    </ul>
                  </section>

                  {/* Challenges & Solutions */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Challenges & Solutions
                    </h2>
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="font-medium mb-2">Performance Optimization</h3>
                        <p className="text-muted-foreground">
                          Implemented lazy loading and code splitting to reduce initial bundle size by 40%.
                        </p>
                      </div>
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="font-medium mb-2">Cross-browser Compatibility</h3>
                        <p className="text-muted-foreground">
                          Developed custom polyfills and fallbacks to ensure consistent experience across all browsers.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Impact & Results */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Impact & Results
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">25%</div>
                        <div className="text-sm text-green-700">Performance Improvement</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1K+</div>
                        <div className="text-sm text-blue-700">Active Users</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">4.8★</div>
                        <div className="text-sm text-purple-700">User Rating</div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Technologies */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* Mock technologies */}
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">PostgreSQL</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Docker</span>
                    </div>
                  </section>

                  {/* Project Team */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">

                        </div>
                        <div>
                          <div className="font-medium">Project Lead</div>
                          <div className="text-sm text-muted-foreground">Lead Developer</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Accomplishments */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Accomplishments
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <Award className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Best Innovation Award 2023</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Award className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Featured on Product Hunt</span>
                      </li>
                    </ul>
                  </section>

                  {/* Project Links */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4">Links</h3>
                    <div className="space-y-2">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary hover:underline"
                        >
                          <Github className="h-4 w-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={projectImages[currentImageIndex] || '/api/placeholder/800/600'}
              alt={`${project.name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          
          {/* Navigation in fullscreen */}
          {projectImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev > 0 ? prev - 1 : projectImages.length - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev < projectImages.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}