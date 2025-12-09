// Interview feature types

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  mode?: 'recruiter' | 'admin';
}

export interface StreamEvent {
  type: 'text' | 'done' | 'error';
  content?: string;
  message?: string;
}

export interface ResumeContext {
  identity: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    tagline?: string;
  };
  professionalSummaries: Array<{
    title: string;
    content: string;
    is_default?: boolean;
    target_industry?: string;
    target_role_type?: string;
  }>;
  positions: Array<{
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
      primary_title: string;
      primary_description: string;
      impact_metrics?: string;
      accomplishment_type?: string;
    }>;
  }>;
  accomplishments: Array<{
    primary_title: string;
    primary_description: string;
    impact_metrics?: string;
    accomplishment_type?: string;
    date_achieved?: string;
    is_featured?: boolean;
    related_skills?: Array<{ name: string }>;
    related_technologies?: Array<{ name: string }>;
  }>;
  skills: Array<{
    name: string;
    category?: string;
    proficiency_level?: number;
    is_core_skill?: boolean;
  }>;
  technologies: Array<{
    name: string;
    category?: string;
    proficiency_level?: number;
    years_experience?: number;
    is_current?: boolean;
  }>;
  projects: Array<{
    name: string;
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
  }>;
  education: Array<{
    institution: string;
    degree_type?: string;
    field_of_study?: string;
    graduation_date?: string;
    summary?: string;
    description?: string;
  }>;
  certifications: Array<{
    name: string;
    issuing_organization?: string;
    issue_date?: string;
    is_active?: boolean;
  }>;
}

export interface UseInterviewReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

// Resume Builder Types
export interface ResumeBuilderState {
  jobDescription: string | null;
  targetRole: string | null;
  targetCompany: string | null;
  generatedResume: GeneratedResume | null;
  isGenerating: boolean;
}

export interface GeneratedResume {
  contactInfo: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  skills: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    graduationDate?: string;
    details?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
    url?: string;
  }>;
}

export interface ResumeStreamEvent {
  type: 'text' | 'done' | 'error' | 'resume_update' | 'resume_complete' | 'target_info';
  content?: string;
  message?: string;
  resume?: GeneratedResume;
  targetRole?: string;
  targetCompany?: string;
}

// Interview Practice Types
export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational' | 'general';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips?: string[];
}

export interface InterviewFeedback {
  overallScore: number; // 1-10
  strengths: string[];
  improvements: string[];
  structureScore: number; // 1-10
  relevanceScore: number; // 1-10
  clarityScore: number; // 1-10
  starMethodUsed: boolean;
  suggestions: string[];
  revisedAnswer?: string;
}

export interface PracticeSession {
  id: string;
  question: InterviewQuestion;
  userAnswer: string;
  feedback: InterviewFeedback | null;
  timestamp: Date;
}

export interface InterviewPracticeStreamEvent {
  type: 'text' | 'done' | 'error' | 'feedback_update' | 'feedback_complete' | 'question';
  content?: string;
  message?: string;
  feedback?: InterviewFeedback;
  question?: InterviewQuestion;
}

// Content Builder Types
export type ContentType = 'position' | 'accomplishment' | 'skill' | 'technology' | 'project' | 'education' | 'certification' | 'company';

export interface PendingContent {
  id: string;
  type: ContentType;
  status: 'draft' | 'ready' | 'saved' | 'error';
  data: Record<string, unknown>;
  duplicateWarning?: string;
  clarificationNeeded?: string[];
  createdAt: Date;
}

export interface ContentBuilderState {
  pendingContent: PendingContent[];
  savedContent: PendingContent[];
  currentContentType: ContentType | null;
}

export interface ContentBuilderStreamEvent {
  type: 'text' | 'done' | 'error' | 'content_draft' | 'content_ready' | 'content_saved' | 'duplicate_warning' | 'clarification_needed';
  content?: string;
  message?: string;
  pendingContent?: PendingContent;
  duplicateInfo?: {
    contentId: string;
    existingItem: string;
    similarity: string;
  };
  clarification?: {
    contentId: string;
    questions: string[];
  };
}
