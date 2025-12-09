import React from 'react';
import {
  PortfolioSummary,
  WorkExperience,
  Project,
  Skill,
  PortfolioBackground,
  ApiError,
  Position
} from '@/types/portfolio';
import type { Positions } from '@/types/generated-schema';

// Base API configuration
// In production, this should be set via environment variable
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // For Railway deployment - check for Railway environment
  if (process.env.RAILWAY_ENVIRONMENT) {
    // Use the Railway internal network
    return `http://localhost:${process.env.PORT || 8080}`;
  }
  // For server-side rendering in development
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// Generic API response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // For server-side rendering
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error instanceof Error ? error : new Error('Unknown API error occurred');
  }
}

// Portfolio API functions (using any for now to handle the Directus data structure)
export async function fetchPortfolioSummary(): Promise<any> {
  return fetchApi<any>('/portfolio/summary');
}

export async function fetchWorkExperience(): Promise<Positions[]> {
  return fetchApi<Positions[]>('/portfolio/experience');
}

export async function fetchProjects(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/projects');
}

export async function fetchSkills(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/skills');
}

export async function fetchPortfolioBackground(): Promise<any> {
  return fetchApi<any>('/portfolio/background');
}

export async function fetchAccomplishments(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/accomplishments');
}

export async function fetchFeaturedAccomplishments(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/accomplishments?featured=true');
}

export async function fetchTechnologies(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/technologies');
}

export async function fetchEducation(): Promise<any[]> {
  const background = await fetchApi<any>('/portfolio/background');
  return background.education || [];
}

// React Hook for client-side data fetching
export function useApiData<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): ApiResponse<T> {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const result = await fetcher();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, error, loading };
}

// Specialized hooks for each data type
export function usePortfolioSummary(): ApiResponse<PortfolioSummary> {
  return useApiData(fetchPortfolioSummary);
}

export function useWorkExperience(): ApiResponse<Positions[]> {
  return useApiData(fetchWorkExperience);
}

export function useProjects(): ApiResponse<Project[]> {
  return useApiData(fetchProjects);
}

export function useSkills(): ApiResponse<Skill[]> {
  return useApiData(fetchSkills);
}

export function usePortfolioBackground(): ApiResponse<PortfolioBackground> {
  return useApiData(fetchPortfolioBackground);
}

// Utility functions for data processing
export function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
  
  if (isCurrent) {
    return `${start} - Present`;
  }
  
  if (!endDate) {
    return start;
  }
  
  const end = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
  
  return `${start} - ${end}`;
}

export function calculateYearsOfExperience(positions: any[]): number {
  if (!positions || positions.length === 0) return 0;
  
  // Find the earliest start_date
  const earliestStartDate = positions
    .filter(position => position.start_date)
    .map(position => new Date(position.start_date))
    .reduce((earliest, current) => current < earliest ? current : earliest, new Date());
  
  // Calculate years from earliest start date to today
  const today = new Date();
  const yearsDiff = today.getFullYear() - earliestStartDate.getFullYear();
  const monthsDiff = today.getMonth() - earliestStartDate.getMonth();
  
  // Adjust if we haven't reached the anniversary month yet this year
  return monthsDiff < 0 ? yearsDiff - 1 : yearsDiff;
}

export function groupSkillsByCategory(skills: any[]): Record<string, any[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);
}

export function getFeaturedSkills(skills: any[]): any[] {
  return skills.filter(skill => skill.is_core_skill).sort((a, b) => b.proficiency_level - a.proficiency_level);
}

export function getRecentProjects(projects: any[], limit: number = 6): any[] {
  return projects
    .filter(project => project.status === 'published')
    .sort((a, b) => new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime())
    .slice(0, limit);
}

// Helper function to construct Directus file URLs using SDK approach
export function getDirectusFileUrl(file: any): string | null {
  if (!file || !DIRECTUS_URL) return null;
  
  // Get the file ID from various possible formats
  let fileId: string | null = null;
  
  if (typeof file === 'string') {
    fileId = file;
  } else if (typeof file === 'object' && file !== null) {
    // For Directus file objects, prefer ID over filename_disk
    if (file.id) {
      fileId = file.id;
    } else if (file.filename_disk) {
      fileId = file.filename_disk;
    } else if (file.filename) {
      fileId = file.filename;
    }
  }
  
  if (!fileId) return null;
  
  // Use Directus standard assets endpoint format - ensure no double slashes
  const baseUrl = DIRECTUS_URL.endsWith('/') ? DIRECTUS_URL.slice(0, -1) : DIRECTUS_URL;
  return `${baseUrl}/assets/${fileId}`;
}

// Helper function to get profile image URL
export function getProfileImageUrl(identity: any): string | null {
  // Check for the profile_photo field (the correct Directus field name)
  if (identity?.profile_photo) {
    return getDirectusFileUrl(identity.profile_photo);
  }
  
  // Also check for common variations in case the field name is different in some cases
  if (identity?.profile_image) {
    return getDirectusFileUrl(identity.profile_image);
  }
  
  if (identity?.avatar) {
    return getDirectusFileUrl(identity.avatar);
  }
  
  if (identity?.photo) {
    return getDirectusFileUrl(identity.photo);
  }
  
  return null;
}

export async function fetchFootnotes(): Promise<any[]> {
  return fetchApi<any[]>('/portfolio/footnotes');
}