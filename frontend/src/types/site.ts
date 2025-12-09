// Site-specific types that extend or transform Directus types
// These types are manually maintained and represent the application layer

import { ReactNode } from 'react';

// Navigation and UI types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

// Theme and appearance
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Portfolio display types (transformed from Directus data)
export interface PortfolioProfile {
  fullName: string;
  displayTitle: string;
  bio: string;
  profileImage?: string;
  contactInfo: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface PortfolioExperience {
  id: number;
  position: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  duration: {
    start: Date;
    end?: Date;
    current: boolean;
  };
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  summary?: string;
  image?: string;
  demoUrl?: string;
  repositoryUrl?: string;
  technologies: {
    name: string;
    icon?: string;
    color?: string;
  }[];
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  dateRange: {
    start: Date;
    end?: Date;
  };
}

export interface PortfolioSkill {
  id: number;
  name: string;
  category: string;
  proficiency: number; // 1-5 or 1-100
  yearsOfExperience?: number;
  icon?: string;
}

export interface PortfolioEducation {
  id: number;
  institution: string;
  degree: string;
  field: string;
  duration: {
    start: Date;
    end?: Date;
    current: boolean;
  };
  grade?: string;
  achievements?: string[];
  location?: string;
}

export interface PortfolioCertification {
  id: number;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
}

// Resume generation types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  sections: ResumeSectionConfig[];
}

export interface ResumeSectionConfig {
  id: string;
  name: string;
  type: 'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  enabled: boolean;
  order: number;
  settings?: Record<string, any>;
}

export interface ResumeExportOptions {
  format: 'pdf' | 'docx' | 'html';
  template: string;
  sections: string[];
  customizations?: {
    colors?: {
      primary: string;
      secondary: string;
    };
    fonts?: {
      heading: string;
      body: string;
    };
    spacing?: 'compact' | 'normal' | 'relaxed';
  };
}

// Job application tracking
export interface JobApplicationStatus {
  id: number;
  companyName: string;
  positionTitle: string;
  applicationDate: Date;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  nextAction?: string;
  nextActionDate?: Date;
  notes?: string;
  resumeUsed?: string;
  coverLetterUsed?: string;
  contacts?: {
    name: string;
    role: string;
    email?: string;
    linkedin?: string;
  }[];
}

// Analytics and insights
export interface PortfolioAnalytics {
  views: {
    total: number;
    thisMonth: number;
    trend: number; // percentage change
  };
  popularSections: {
    section: string;
    views: number;
  }[];
  skillDemand: {
    skill: string;
    mentions: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
  applicationMetrics: {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    averageResponseTime: number; // in days
  };
}

// Form and component types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  phone?: string;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  technologies: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  sortBy: 'date' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

// Component props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  clickable?: boolean;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

// Pagination
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Chart and visualization types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  date: Date;
  value: number;
  category?: string;
}

export interface SkillRadarData {
  skill: string;
  proficiency: number;
  category: string;
  maxValue?: number;
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  retryable: boolean;
}