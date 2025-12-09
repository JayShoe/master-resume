// Transformation functions to convert Directus data to site-friendly types
// This layer provides a clean separation between CMS data and application logic

import type { 
  PortfolioProfile,
  PortfolioExperience,
  PortfolioProject,
  PortfolioSkill,
  PortfolioEducation,
  PortfolioCertification,
  JobApplicationStatus 
} from '@/types/site';

// Import Directus types (these will be auto-generated)
import type { 
  Identity,
  Positions,
  Projects,
  Skills,
  Education,
  Certifications,
  Job_applications,
  Companies
} from '@/types/generated-schema';

/**
 * Transform Directus Identity to Portfolio Profile
 */
export function transformIdentityToProfile(identity: Identity): PortfolioProfile {
  const fullName = [identity.first_name, identity.last_name]
    .filter(Boolean)
    .join(' ') || 'Anonymous';

  return {
    fullName,
    displayTitle: identity.tagline?.split('\n')[0] || 'Professional', // First line as title
    bio: identity.tagline || '',
    profileImage: identity.profile_photo as any || undefined,
    contactInfo: {
      email: identity.email || undefined,
      phone: identity.phone || undefined,
      location: identity.location || undefined,
      website: identity.website_url || undefined,
      linkedin: identity.linkedin_url || undefined,
      github: identity.github_url || undefined,
    }
  };
}

/**
 * Transform Directus Position (with Company) to Portfolio Experience
 */
// @ts-ignore - Temporary bypass for Railway deployment
export function transformPositionToExperience(position: Positions): PortfolioExperience {
  return {
    id: position.id || 0,
    position: position.primary_title,
    company: {
      name: position.company?.name || 'Unknown Company',
      logo: position.company?.logo ? String(position.company.logo) : undefined,
      website: position.company?.website || undefined,
    },
    duration: {
      start: position.start_date ? new Date(position.start_date) : new Date(),
      end: position.end_date ? new Date(position.end_date) : undefined,
      current: position.is_current || false,
    },
    description: position.description || undefined,
    // Parse achievements from description if formatted properly
    achievements: position.description
      ? position.description
          .split('\n')
          .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map(line => line.replace(/^[•-]\s*/, '').trim())
      : undefined,
  };
}

/**
 * Transform Directus Project to Portfolio Project
 */
export function transformProjectToPortfolio(project: Projects): PortfolioProject {
  return {
    id: project.id || 0,
    title: project.name,
    description: project.description || '',
    summary: project.description || undefined,
    image: undefined, // Not in schema
    demoUrl: project.project_url || undefined,
    repositoryUrl: project.github_url || undefined,
    technologies: [], // Would need junction table data
    status: project.status as 'completed' | 'in-progress' | 'planned' || 'completed',
    featured: project.is_featured || false,
    dateRange: {
      start: project.start_date ? new Date(project.start_date) : new Date(),
      end: project.end_date ? new Date(project.end_date) : undefined,
    },
  };
}

/**
 * Transform Directus Skill to Portfolio Skill
 */
export function transformSkillToPortfolio(skill: Skills): PortfolioSkill {
  return {
    id: skill.id || 0,
    name: skill.name,
    category: skill.category || 'Other',
    proficiency: skill.proficiency_level || 0,
    // TODO: Calculate years of experience from projects/positions
    yearsOfExperience: undefined,
    // TODO: Map skill names to icons
    icon: undefined,
  };
}

/**
 * Transform Directus Education to Portfolio Education
 */
export function transformEducationToPortfolio(education: Education): PortfolioEducation {
  return {
    id: education.id || 0,
    institution: education.institution || '',
    degree: education.degree_type || '',
    field: education.field_of_study || '',
    duration: {
      start: education.start_date ? new Date(education.start_date) : new Date(),
      end: education.graduation_date ? new Date(education.graduation_date) : undefined,
      current: !education.graduation_date,
    },
    grade: undefined,
    // Parse achievements from description
    achievements: education.description
      ? education.description
          .split('\n')
          .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map((line: string) => line.replace(/^[•-]\s*/, '').trim())
      : undefined,
    location: undefined,
  };
}

/**
 * Transform Directus Certification to Portfolio Certification
 */
export function transformCertificationToPortfolio(certification: Certifications): PortfolioCertification {
  return {
    id: certification.id || 0,
    name: certification.name,
    issuer: certification.issuing_organization || 'Unknown',
    issueDate: certification.issue_date ? new Date(certification.issue_date) : new Date(),
    expiryDate: undefined, // Not in schema
    credentialId: undefined, // Not in schema
    credentialUrl: undefined, // Not in schema
    logo: undefined, // Not in schema
  };
}

/**
 * Transform Directus Job Application to Site Job Application
 */
export function transformJobApplicationToStatus(jobApp: Job_applications): JobApplicationStatus {
  return {
    id: jobApp.id || 0,
    companyName: jobApp.company_name,
    positionTitle: jobApp.position_title,
    applicationDate: jobApp.application_date ? new Date(jobApp.application_date) : new Date(),
    status: jobApp.application_status as JobApplicationStatus['status'] || 'applied',
    nextAction: undefined, // Not in schema
    nextActionDate: undefined, // Not in schema
    notes: undefined, // Not in schema
    resumeUsed: jobApp.resume_used?.title || undefined,
    coverLetterUsed: undefined, // TODO: Add cover letter relation
    contacts: [], // TODO: Parse contacts from notes or separate collection
  };
}

/**
 * Group skills by category with aggregation
 */
export function groupSkillsByCategory(skills: PortfolioSkill[]): Record<string, PortfolioSkill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category]!.push(skill);
    return acc;
  }, {} as Record<string, PortfolioSkill[]>);
}

/**
 * Calculate experience duration in years and months
 */
export function calculateExperienceDuration(
  start: Date,
  end?: Date
): { years: number; months: number; totalMonths: number } {
  const endDate = end || new Date();
  const diffInMonths = 
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  
  return {
    years: Math.floor(diffInMonths / 12),
    months: diffInMonths % 12,
    totalMonths: diffInMonths,
  };
}

/**
 * Format date range for display
 */
export function formatDateRange(
  start: Date,
  end?: Date,
  current: boolean = false,
  format: 'short' | 'long' = 'short'
): string {
  const formatOptions: Intl.DateTimeFormatOptions = format === 'short'
    ? { year: 'numeric', month: 'short' }
    : { year: 'numeric', month: 'long' };

  const startStr = start.toLocaleDateString('en-US', formatOptions);
  
  if (current) {
    return `${startStr} - Present`;
  }
  
  if (!end) {
    return startStr;
  }
  
  const endStr = end.toLocaleDateString('en-US', formatOptions);
  return `${startStr} - ${endStr}`;
}

/**
 * Extract technologies from projects and experiences
 */
export function extractUniqueTechnologies(
  projects: PortfolioProject[],
  experiences: PortfolioExperience[]
): { name: string; count: number; icon?: string; color?: string }[] {
  const techMap = new Map<string, { count: number; icon?: string; color?: string }>();
  
  // Count from projects
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      const existing = techMap.get(tech.name) || { count: 0 };
      techMap.set(tech.name, {
        count: existing.count + 1,
        icon: tech.icon || existing.icon,
        color: tech.color || existing.color,
      });
    });
  });
  
  // TODO: Extract technologies from experience descriptions
  // This would require NLP or structured data
  
  return Array.from(techMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Calculate completeness score for portfolio
 */
export function calculatePortfolioCompleteness(data: {
  profile: PortfolioProfile;
  experiences: PortfolioExperience[];
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  education: PortfolioEducation[];
  certifications: PortfolioCertification[];
}): { score: number; missing: string[] } {
  const checks = [
    { key: 'profile.bio', value: data.profile.bio, weight: 15 },
    { key: 'profile.profileImage', value: data.profile.profileImage, weight: 10 },
    { key: 'profile.contactInfo.email', value: data.profile.contactInfo.email, weight: 10 },
    { key: 'experiences', value: data.experiences.length > 0, weight: 25 },
    { key: 'projects', value: data.projects.length > 0, weight: 20 },
    { key: 'skills', value: data.skills.length >= 5, weight: 15 },
    { key: 'education', value: data.education.length > 0, weight: 5 },
  ];
  
  let totalScore = 0;
  const missing: string[] = [];
  
  checks.forEach(check => {
    if (check.value) {
      totalScore += check.weight;
    } else {
      missing.push(check.key);
    }
  });
  
  return { score: totalScore, missing };
}