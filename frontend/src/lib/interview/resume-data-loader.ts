/**
 * Resume data loader for the pre-load chat mode
 * Fetches all resume data at once and includes source URLs for linking
 */

import {
  getIdentity,
  getPositions,
  getSkills,
  getTechnologies,
  getProjects,
  getEducation,
  getCertifications,
  getProfessionalSummaries,
  getAccomplishments,
} from '@/lib/data-source';

export interface SourceLink {
  url: string;
  label: string;
}

export interface PositionWithSource {
  id: string | number;
  primary_title: string;
  department?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  employment_type?: string;
  description?: string;
  summary?: string;
  company?: {
    name: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  accomplishments?: Array<{
    id: string | number;
    primary_title: string;
    primary_description: string;
    impact_metrics?: string;
    accomplishment_type?: string;
    related_skills?: Array<{ name: string }>;
    related_technologies?: Array<{ name: string }>;
  }>;
  source: SourceLink;
}

export interface ProjectWithSource {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  role?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  current_project?: boolean;
  summary?: string;
  github_url?: string;
  project_url?: string;
  technologies_used?: Array<{ name: string }>;
  skills_demonstrated?: Array<{ name: string }>;
  source: SourceLink;
}

export interface SkillWithSource {
  id: string | number;
  name: string;
  category?: string;
  proficiency_level?: number;
  is_core_skill?: boolean;
  source: SourceLink;
}

export interface TechnologyWithSource {
  id: string | number;
  name: string;
  category?: string;
  proficiency_level?: number;
  years_experience?: number;
  is_current?: boolean;
  source: SourceLink;
}

export interface EducationWithSource {
  id: string | number;
  institution: string;
  degree_type?: string;
  field_of_study?: string;
  graduation_date?: string;
  start_date?: string;
  summary?: string;
  description?: string;
  source: SourceLink;
}

export interface CertificationWithSource {
  id: string | number;
  name: string;
  issuing_organization?: string;
  issue_date?: string;
  is_active?: boolean;
  source: SourceLink;
}

export interface AccomplishmentWithSource {
  id: string | number;
  primary_title: string;
  primary_description: string;
  impact_metrics?: string;
  accomplishment_type?: string;
  date_achieved?: string;
  is_featured?: boolean;
  related_skills?: Array<{ name: string }>;
  related_technologies?: Array<{ name: string }>;
  position?: {
    primary_title: string;
    company?: { name: string };
  };
  source: SourceLink;
}

export interface ResumeDataWithSources {
  identity: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    tagline?: string;
  };
  professionalSummaries: Array<{
    id: string | number;
    title: string;
    content: string;
    is_default?: boolean;
    target_industry?: string;
    target_role_type?: string;
  }>;
  positions: PositionWithSource[];
  accomplishments: AccomplishmentWithSource[];
  skills: SkillWithSource[];
  technologies: TechnologyWithSource[];
  projects: ProjectWithSource[];
  education: EducationWithSource[];
  certifications: CertificationWithSource[];
}

/**
 * Creates a URL-safe slug from a project name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Fetches all resume data and adds source URLs for linking
 */
export async function loadResumeDataWithSources(): Promise<ResumeDataWithSources> {
  const [
    identity,
    professionalSummaries,
    positions,
    accomplishments,
    skills,
    technologies,
    projects,
    education,
    certifications,
  ] = await Promise.all([
    getIdentity().catch(() => null),
    getProfessionalSummaries().catch(() => []),
    getPositions().catch(() => []),
    getAccomplishments().catch(() => []),
    getSkills().catch(() => []),
    getTechnologies().catch(() => []),
    getProjects().catch(() => []),
    getEducation().catch(() => []),
    getCertifications().catch(() => []),
  ]);

  // Process positions with source links
  const positionsWithSources: PositionWithSource[] = (positions || []).map((pos: any, index: number) => ({
    id: pos.id || index,
    primary_title: pos.primary_title || pos.position_title,
    department: pos.department,
    start_date: pos.start_date,
    end_date: pos.end_date,
    is_current: pos.is_current,
    employment_type: pos.employment_type,
    description: pos.description,
    summary: pos.summary,
    company: pos.company ? {
      name: pos.company.name,
      industry: pos.company.industry,
      size: pos.company.size,
      location: pos.company.location,
    } : undefined,
    accomplishments: pos.accomplishments?.map((acc: any) => ({
      id: acc.id,
      primary_title: acc.primary_title,
      primary_description: acc.primary_description,
      impact_metrics: acc.impact_metrics,
      accomplishment_type: acc.accomplishment_type,
    })),
    source: {
      url: `/experience#position-${pos.id || index}`,
      label: `${pos.primary_title || pos.position_title} at ${pos.company?.name || 'Unknown'}`,
    },
  }));

  // Process projects with source links
  const projectsWithSources: ProjectWithSource[] = (projects || []).map((proj: any, index: number) => {
    const slug = proj.slug || createSlug(proj.name || `project-${index}`);
    return {
      id: proj.id || index,
      name: proj.name,
      slug,
      description: proj.description,
      role: proj.role,
      project_type: proj.project_type,
      start_date: proj.start_date,
      end_date: proj.end_date,
      current_project: proj.current_project,
      summary: proj.summary,
      github_url: proj.github_url,
      project_url: proj.project_url || proj.live_url,
      technologies_used: proj.technologies?.map((t: any) => ({
        name: t.technologies_id?.name || t.name || t,
      })),
      skills_demonstrated: proj.skills?.map((s: any) => ({
        name: s.skills_id?.name || s.name || s,
      })),
      source: {
        url: `/projects/${slug}`,
        label: proj.name,
      },
    };
  });

  // Process skills with source links
  const skillsWithSources: SkillWithSource[] = (skills || []).map((skill: any, index: number) => ({
    id: skill.id || index,
    name: skill.name,
    category: skill.category,
    proficiency_level: skill.proficiency_level,
    is_core_skill: skill.is_core_skill,
    source: {
      url: `/skills#${encodeURIComponent(skill.name?.toLowerCase().replace(/\s+/g, '-') || '')}`,
      label: skill.name,
    },
  }));

  // Process technologies with source links
  const technologiesWithSources: TechnologyWithSource[] = (technologies || []).map((tech: any, index: number) => ({
    id: tech.id || index,
    name: tech.name,
    category: tech.category,
    proficiency_level: tech.proficiency_level,
    years_experience: tech.years_experience,
    is_current: tech.is_current,
    source: {
      url: `/skills#${encodeURIComponent(tech.name?.toLowerCase().replace(/\s+/g, '-') || '')}`,
      label: tech.name,
    },
  }));

  // Process education with source links
  const educationWithSources: EducationWithSource[] = (education || []).map((edu: any, index: number) => ({
    id: edu.id || index,
    institution: edu.institution,
    degree_type: edu.degree_type,
    field_of_study: edu.field_of_study,
    graduation_date: edu.graduation_date,
    start_date: edu.start_date,
    summary: edu.summary,
    description: edu.description,
    source: {
      url: '/background#education',
      label: `${edu.degree_type || 'Degree'} from ${edu.institution}`,
    },
  }));

  // Process certifications with source links
  const certificationsWithSources: CertificationWithSource[] = (certifications || []).map((cert: any, index: number) => ({
    id: cert.id || index,
    name: cert.name,
    issuing_organization: cert.issuing_organization,
    issue_date: cert.issue_date,
    is_active: cert.is_active,
    source: {
      url: '/background#certifications',
      label: cert.name,
    },
  }));

  // Process accomplishments with source links
  const accomplishmentsWithSources: AccomplishmentWithSource[] = (accomplishments || []).map((acc: any, index: number) => ({
    id: acc.id || index,
    primary_title: acc.primary_title,
    primary_description: acc.primary_description,
    impact_metrics: acc.impact_metrics,
    accomplishment_type: acc.accomplishment_type,
    date_achieved: acc.date_achieved,
    is_featured: acc.is_featured,
    related_skills: acc.related_skills?.map((r: any) => ({
      name: r.skills_id?.name || r.name,
    })).filter((s: any) => s.name),
    related_technologies: acc.related_technologies?.map((r: any) => ({
      name: r.technologies_id?.name || r.name,
    })).filter((t: any) => t.name),
    position: acc.position ? {
      primary_title: acc.position.primary_title,
      company: acc.position.company ? { name: acc.position.company.name } : undefined,
    } : undefined,
    source: {
      url: acc.position?.id ? `/experience#position-${acc.position.id}` : '/experience',
      label: acc.primary_title,
    },
  }));

  return {
    identity: {
      first_name: identity?.first_name || 'Unknown',
      last_name: identity?.last_name || '',
      email: identity?.email,
      phone: identity?.phone,
      location: identity?.location,
      linkedin_url: identity?.linkedin_url,
      github_url: identity?.github_url,
      website_url: identity?.website_url,
      tagline: identity?.tagline,
    },
    professionalSummaries: (professionalSummaries || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      is_default: s.is_default,
      target_industry: s.target_industry,
      target_role_type: s.target_role_type,
    })),
    positions: positionsWithSources,
    accomplishments: accomplishmentsWithSources,
    skills: skillsWithSources,
    technologies: technologiesWithSources,
    projects: projectsWithSources,
    education: educationWithSources,
    certifications: certificationsWithSources,
  };
}
