// Import from generated schema for better type safety
import type { Positions } from './generated-schema';

// Re-export the generated Position type for consistency
export type Position = Positions;

// Core Identity and Professional Summary
export interface Identity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalSummary {
  id: string;
  title: string;
  summary: string;
  years_of_experience?: number;
  industry_focus?: string[];
  key_strengths?: string[];
  created_at: string;
  updated_at: string;
}

// Work Experience - Updated to match generated schema
export interface WorkExperience {
  id: string;
  company_name: string;
  position_title: string;
  primary_title: string;
  department?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  work_location?: string | string[]; // New work_location field (can be array)
  employment_type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  description?: string;
  summary?: string; // New summary field
  key_responsibilities?: string[];
  achievements?: string[];
  key_achievements?: string[]; // Alternative field name from Directus
  technologies_used?: string[];
  technologies?: string[]; // Alternative field name from Directus
  company?: any; // Company relation
  accomplishments?: any; // Accomplishments relation
  projects?: any; // Projects relation
  created_at: string;
  updated_at: string;
}

// Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  project_type: 'professional' | 'personal' | 'academic' | 'open_source';
  technologies_used?: string[];
  github_url?: string;
  live_url?: string;
  client?: string;
  team_size?: number;
  role?: string;
  key_features?: string[];
  challenges_overcome?: string[];
  created_at: string;
  updated_at: string;
}

// Skills
export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool' | 'framework';
  proficiency_level: 1 | 2 | 3 | 4 | 5;
  years_of_experience?: number;
  last_used?: string;
  is_featured: boolean;
  endorsements_count?: number;
  created_at: string;
  updated_at: string;
}

// Education
export interface Education {
  id: string;
  institution_name: string;
  degree_type: 'high_school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'certificate' | 'diploma';
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: number;
  location?: string;
  honors?: string[];
  relevant_coursework?: string[];
  thesis_title?: string;
  created_at: string;
  updated_at: string;
}

// Certifications
export interface Certification {
  id: string;
  name: string;
  issuing_organization: string;
  date_obtained: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  skills_validated?: string[];
  created_at: string;
  updated_at: string;
}

// Languages
export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  is_native: boolean;
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date_achieved: string;
  category: 'award' | 'recognition' | 'publication' | 'speaking' | 'competition' | 'milestone';
  organization?: string;
  url?: string;
  impact_metrics?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Job Applications (for tracking purposes)
export interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  application_date: string;
  status: 'applied' | 'reviewing' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
  job_url?: string;
  location?: string;
  salary_range?: string;
  application_method: 'online' | 'referral' | 'recruiter' | 'direct' | 'job_fair';
  contact_person?: string;
  notes?: string;
  interview_dates?: string[];
  follow_up_dates?: string[];
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface PortfolioSummary {
  identity: Identity | null;
  professionalSummary: ProfessionalSummary | null;
}

export interface PortfolioBackground {
  education: Education[];
  certifications: Certification[];
  languages: Language[];
}

// Utility Types
export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;
export type SkillCategory = 'technical' | 'soft' | 'language' | 'tool' | 'framework';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectType = 'professional' | 'personal' | 'academic' | 'open_source';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
export type ApplicationStatus = 'applied' | 'reviewing' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';

// API Error Response
export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}