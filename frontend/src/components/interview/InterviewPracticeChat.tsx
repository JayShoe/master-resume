'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MessageSquare, Mic, FileText, Zap, Wrench, PlusCircle, Headphones, Menu, X, Sparkles, Database, MessageCircle, CheckCircle2, Upload, HelpCircle, Briefcase, Printer, Copy, Check } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { FeedbackArtifact } from './FeedbackArtifact';
import { ResumeArtifact, ResumeData } from './ResumeArtifact';
import { ContentPreviewArtifact } from './ContentPreviewArtifact';
import { CopilotArtifact, parseCopilotResponse, type CopilotOutline } from './CopilotArtifact';
import { useInterviewPractice } from '@/hooks/useInterviewPractice';
import { useResumeBuilder } from '@/hooks/useResumeBuilder';
import { useContentBuilder } from '@/hooks/useContentBuilder';
import { useInterview } from '@/hooks/useInterview';
import { CHAT_MODES, getChatMode, DEFAULT_MODE, type ChatModeId } from '@/lib/interview/chat-modes';

interface InterviewPracticeChatProps {
  identity: {
    first_name: string;
    last_name?: string;
    tagline?: string;
    profile_image?: string | null;
  };
}

// Icon mapping for chat modes
const ICON_MAP = {
  'tool': Wrench,
  'zap': Zap,
  'file-text': FileText,
  'mic': Mic,
  'plus-circle': PlusCircle,
  'headphones': Headphones,
};


// Suggested prompts for content builder
const CONTENT_PROMPTS = [
  { title: 'Add a new position', description: 'Job role or experience', prompt: 'I want to add a new job position to my resume.' },
  { title: 'Add an accomplishment', description: 'Achievement or milestone', prompt: 'I have an accomplishment I want to document.' },
  { title: 'Add a project', description: 'Personal or work project', prompt: 'I want to add a project to my portfolio.' },
  { title: 'Add skills', description: 'Technical or soft skills', prompt: 'I want to add some new skills and technologies I have learned.' },
];

// Common interview questions for copilot mode
const COPILOT_PROMPTS = [
  { title: 'Leadership', description: 'Tell me about a time you led a team', prompt: 'Tell me about a time you led a team through a difficult project.' },
  { title: 'Problem Solving', description: 'Describe a technical challenge', prompt: 'Describe a technical challenge you faced and how you solved it.' },
  { title: 'Conflict', description: 'How do you handle disagreements?', prompt: 'Tell me about a time you had a disagreement with a coworker.' },
  { title: 'Achievement', description: 'Your proudest accomplishment', prompt: 'What is your proudest professional accomplishment?' },
];

// Helper to load from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore parse errors
  }
  return defaultValue;
}

export function InterviewPracticeChat({ identity }: InterviewPracticeChatProps) {
  const [selectedMode, setSelectedMode] = useState<ChatModeId>(DEFAULT_MODE);
  const [chatKey, setChatKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  const [jobDescInput, setJobDescInput] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobCompanyInput, setJobCompanyInput] = useState('');
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Global job context - persisted and used across all modes
  const [globalJobContext, setGlobalJobContext] = useState<{ title: string; company: string; description: string } | null>(null);
  const [isJobContextLoaded, setIsJobContextLoaded] = useState(false);

  // Copilot outline state - parsed from the last assistant message
  const [copilotOutline, setCopilotOutline] = useState<CopilotOutline | null>(null);

  // Load global job context from localStorage on mount (client-side only)
  useEffect(() => {
    const saved = loadFromStorage<{ title: string; company: string; description: string } | null>('global-job-context', null);
    if (saved) {
      setGlobalJobContext(saved);
    }
    setIsJobContextLoaded(true);
  }, []);

  // Persist global job context
  useEffect(() => {
    if (typeof window === 'undefined' || !isJobContextLoaded) return;
    if (globalJobContext) {
      localStorage.setItem('global-job-context', JSON.stringify(globalJobContext));
    } else {
      localStorage.removeItem('global-job-context');
    }
  }, [globalJobContext, isJobContextLoaded]);

  const clearGlobalJobContext = useCallback(() => {
    setGlobalJobContext(null);
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentMode = getChatMode(selectedMode);
  const isInterviewPractice = selectedMode === 'interview-practice';
  const isResumeBuilder = selectedMode === 'resume-generator';
  const isContentBuilder = selectedMode === 'content-builder';
  const isInterviewCopilot = selectedMode === 'interview-copilot';
  const isChatMode = selectedMode === 'mcp-preload' || selectedMode === 'mcp-tools' || selectedMode === 'interview-copilot';

  // Interview Practice Hook
  const interviewPractice = useInterviewPractice({
    apiEndpoint: '/api/interview/practice',
    persistKey: 'interview-practice',
  });

  // Resume Builder Hook
  const resumeBuilder = useResumeBuilder({
    apiEndpoint: '/api/interview/resume-gen',
    persistKey: 'resume-builder',
  });

  // Content Builder Hook
  const contentBuilder = useContentBuilder({
    apiEndpoint: '/api/interview/content-builder',
    persistKey: 'content-builder',
  });

  // Chat Mode Hook
  const chatMode = useInterview({
    apiEndpoint: currentMode?.apiEndpoint || '/api/interview/chat-preload',
    persistKey: `interview-chat-${selectedMode}`,
  });

  // Get current mode's state
  const getCurrentModeState = () => {
    if (isInterviewPractice) return interviewPractice;
    if (isResumeBuilder) return resumeBuilder;
    if (isContentBuilder) return contentBuilder;
    return chatMode;
  };

  const currentState = getCurrentModeState();

  const handleModeChange = useCallback((mode: ChatModeId) => {
    setSelectedMode(mode);
    setChatKey(prev => prev + 1);
  }, []);

  const handleClear = useCallback(() => {
    currentState.clearChat();
    if (isInterviewCopilot) {
      setCopilotOutline(null);
    }
  }, [currentState, isInterviewCopilot]);

  const handleSend = useCallback(async (content: string) => {
    await currentState.sendMessage(content);
  }, [currentState]);

  // Parse copilot responses to extract STAR outline
  useEffect(() => {
    if (!isInterviewCopilot) return;

    const messages = chatMode.messages;
    if (messages.length === 0) {
      setCopilotOutline(null);
      return;
    }

    // Find the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMessage) {
      const parsed = parseCopilotResponse(lastAssistantMessage.content);
      setCopilotOutline(parsed);
    }
  }, [isInterviewCopilot, chatMode.messages]);

  // Get current mode icon
  const CurrentModeIcon = ICON_MAP[currentMode?.icon || 'mic'] || Mic;

  // Check if preview panel has content
  const hasPreviewContent = () => {
    if (isInterviewPractice) return !!interviewPractice.feedback || interviewPractice.isAnalyzingAnswer;
    if (isResumeBuilder) return !!resumeBuilder.resume || resumeBuilder.isGeneratingResume;
    if (isContentBuilder) return contentBuilder.pendingContent.length > 0 || contentBuilder.savedContent.length > 0;
    if (isInterviewCopilot) return !!copilotOutline || chatMode.isLoading;
    return false;
  };

  // Get preview panel config (title, description, icon, gradient)
  const getPreviewConfig = () => {
    if (isInterviewPractice) {
      return {
        title: 'Answer Feedback',
        description: 'AI analysis of your response',
        gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
        icon: CheckCircle2,
      };
    }
    if (isResumeBuilder) {
      return {
        title: resumeBuilder.targetRole ? `Resume: ${resumeBuilder.targetRole}` : 'Resume Preview',
        description: 'Generated resume document',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        icon: FileText,
      };
    }
    if (isContentBuilder) {
      return {
        title: 'Content Preview',
        description: 'Pending items to save',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        icon: Database,
      };
    }
    if (isInterviewCopilot) {
      return {
        title: 'Answer Outline',
        description: 'STAR-formatted notes',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        icon: Headphones,
      };
    }
    return {
      title: 'Suggestions',
      description: 'Questions to ask',
      gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
      icon: MessageCircle,
    };
  };

  const previewConfig = getPreviewConfig();
  const PreviewIcon = previewConfig.icon;

  // Get mode gradient
  const getModeGradient = () => {
    if (isInterviewPractice) return 'linear-gradient(135deg, #8b5cf6, #6366f1)';
    if (isResumeBuilder) return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    if (isContentBuilder) return 'linear-gradient(135deg, #10b981, #059669)';
    if (selectedMode === 'mcp-preload') return 'linear-gradient(135deg, #f59e0b, #eab308)';
    if (selectedMode === 'interview-copilot') return 'linear-gradient(135deg, #ef4444, #f97316)';
    return 'linear-gradient(135deg, #3b82f6, #6366f1)';
  };

  // Get welcome content based on mode
  const renderWelcomeContent = () => {
    const modeConfig = {
      'interview-practice': {
        icon: <Mic size={28} style={{ color: 'white' }} />,
        title: 'Ready to Practice',
        description: `Ask for an interview question or type your own to get started, ${identity.first_name}.`,
      },
      'resume-generator': {
        icon: <Sparkles size={28} style={{ color: 'white' }} />,
        title: 'AI Resume Builder',
        description: `Paste a job description and I'll create a tailored resume highlighting ${identity.first_name}'s most relevant experience.`,
      },
      'content-builder': {
        icon: <Database size={28} style={{ color: 'white' }} />,
        title: 'Content Builder',
        description: `Tell me about your experience, projects, skills, or accomplishments and I'll help you add them to your resume database.`,
      },
      'mcp-preload': {
        icon: <Zap size={28} style={{ color: 'white' }} />,
        title: 'Quick Chat',
        description: `Ask me anything about ${identity.first_name}'s skills, projects, or career journey.`,
      },
      'mcp-tools': {
        icon: <Wrench size={28} style={{ color: 'white' }} />,
        title: 'Deep Dive',
        description: `I'll use AI tools to search and retrieve specific data about ${identity.first_name}'s experience.`,
      },
      'interview-copilot': {
        icon: <Headphones size={28} style={{ color: 'white' }} />,
        title: 'Interview Copilot',
        description: `Paste interview questions to get quick STAR-formatted notes from ${identity.first_name}'s experience.`,
      },
    };

    const config = modeConfig[selectedMode as keyof typeof modeConfig];

    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: getModeGradient(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            }}
          >
            {config.icon}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
            {config.title}
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
            {config.description}
          </p>
        </div>
      </div>
    );
  };

  // State for resume builder job description input
  const [resumeJobDescInput, setResumeJobDescInput] = useState('');

  // Handle resume generation with job description
  const handleGenerateResume = useCallback(() => {
    if (!resumeJobDescInput.trim() && !globalJobContext) return;

    const jobDesc = resumeJobDescInput.trim() || globalJobContext?.description || '';
    const prompt = `Here is the job description I want to apply for:\n\n${jobDesc}\n\nPlease generate a tailored resume for this position.`;
    handleSend(prompt);
    setResumeJobDescInput('');
  }, [resumeJobDescInput, globalJobContext, handleSend]);

  // Handle print for preview content
  const handlePrint = useCallback(() => {
    if (!previewContentRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = previewContentRef.current.innerHTML;
    const title = previewConfig.title;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Georgia, "Times New Roman", serif;
              line-height: 1.5;
              color: #1e293b;
              padding: 20px 40px;
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            /* Remove any container styling from the resume artifact */
            body > div {
              background: none !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
            h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 20px 0 10px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; }
            h2 svg { margin-right: 8px; }
            h3 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
            p { margin: 8px 0; font-size: 13px; }
            ul { margin: 8px 0; padding-left: 20px; list-style-type: disc; }
            li { font-size: 13px; margin-bottom: 4px; }
            header { border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
            section { margin-bottom: 16px; }
            svg { display: none; } /* Hide icons in print */
            @media print {
              body { padding: 0; }
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, [previewConfig.title]);

  // Handle copy resume as markdown
  const handleCopyResume = useCallback(() => {
    const resume = resumeBuilder.resume as ResumeData | null;
    if (!resume) return;

    const lines: string[] = [];

    // Contact Info
    lines.push(`# ${resume.contactInfo.name}`);
    lines.push('');

    const contactParts: string[] = [];
    if (resume.contactInfo.email) contactParts.push(`📧 ${resume.contactInfo.email}`);
    if (resume.contactInfo.phone) contactParts.push(`📱 ${resume.contactInfo.phone}`);
    if (resume.contactInfo.location) contactParts.push(`📍 ${resume.contactInfo.location}`);
    if (contactParts.length > 0) lines.push(contactParts.join(' | '));

    const linkParts: string[] = [];
    if (resume.contactInfo.linkedin) linkParts.push(`🔗 ${resume.contactInfo.linkedin}`);
    if (resume.contactInfo.github) linkParts.push(`💻 ${resume.contactInfo.github}`);
    if (resume.contactInfo.website) linkParts.push(`🌐 ${resume.contactInfo.website}`);
    if (linkParts.length > 0) lines.push(linkParts.join(' | '));

    lines.push('');
    lines.push('---');
    lines.push('');

    // Summary
    if (resume.summary) {
      lines.push('## Professional Summary');
      lines.push('');
      lines.push(resume.summary);
      lines.push('');
    }

    // Experience
    if (resume.experience.length > 0) {
      lines.push('## Professional Experience');
      lines.push('');
      for (const job of resume.experience) {
        lines.push(`### ${job.title}`);
        lines.push(`**${job.company}**${job.location ? ` • ${job.location}` : ''}`);
        lines.push(`*${job.startDate} – ${job.current ? 'Present' : job.endDate}*`);
        lines.push('');
        for (const bullet of job.bullets) {
          lines.push(`- ${bullet}`);
        }
        lines.push('');
      }
    }

    // Skills
    if (resume.skills && (resume.skills.technical?.length || resume.skills.tools?.length || resume.skills.soft?.length)) {
      lines.push('## Skills');
      lines.push('');
      if (resume.skills.technical?.length) {
        lines.push(`**Technical:** ${resume.skills.technical.join(', ')}`);
        lines.push('');
      }
      if (resume.skills.tools?.length) {
        lines.push(`**Tools & Technologies:** ${resume.skills.tools.join(', ')}`);
        lines.push('');
      }
      if (resume.skills.soft?.length) {
        lines.push(`**Soft Skills:** ${resume.skills.soft.join(', ')}`);
        lines.push('');
      }
    }

    // Education
    if (resume.education.length > 0) {
      lines.push('## Education');
      lines.push('');
      for (const edu of resume.education) {
        lines.push(`### ${edu.degree}`);
        lines.push(`**${edu.institution}**${edu.graduationDate ? ` • ${edu.graduationDate}` : ''}`);
        if (edu.details) lines.push(`*${edu.details}*`);
        lines.push('');
      }
    }

    // Certifications
    if (resume.certifications?.length) {
      lines.push('## Certifications');
      lines.push('');
      for (const cert of resume.certifications) {
        lines.push(`- **${cert.name}**${cert.issuer ? ` – ${cert.issuer}` : ''}${cert.date ? ` *(${cert.date})*` : ''}`);
      }
      lines.push('');
    }

    // Projects
    if (resume.projects?.length) {
      lines.push('## Projects');
      lines.push('');
      for (const project of resume.projects) {
        lines.push(`### ${project.name}${project.url ? ` ([View](${project.url}))` : ''}`);
        lines.push(project.description);
        if (project.technologies?.length) {
          lines.push('');
          lines.push(`*Technologies: ${project.technologies.join(', ')}*`);
        }
        lines.push('');
      }
    }

    const markdown = lines.join('\n');
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [resumeBuilder.resume]);

  // Render suggested prompts
  const renderSuggestedPrompts = () => {
    if (isResumeBuilder) {
      // If there's a global job context, show a "Generate Resume" button
      if (globalJobContext) {
        return (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Briefcase size={16} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>Target Job Set</span>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                {globalJobContext.title}{globalJobContext.company ? ` at ${globalJobContext.company}` : ''}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {globalJobContext.description.length > 150
                  ? globalJobContext.description.substring(0, 150) + '...'
                  : globalJobContext.description}
              </p>
            </div>
            <button
              onClick={handleGenerateResume}
              disabled={currentState.isLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                background: currentState.isLoading ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: currentState.isLoading ? '#94a3b8' : 'white',
                fontSize: '15px',
                fontWeight: 600,
                cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: currentState.isLoading ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Sparkles size={18} />
              {currentState.isLoading ? 'Generating Resume...' : 'Generate Tailored Resume'}
            </button>
            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
              Or paste a different job description below
            </p>
          </div>
        );
      }

      // No global job context - show button to set target job
      return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
              marginBottom: '20px',
            }}
          >
            <Briefcase size={28} style={{ color: 'white' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>
            Set Your Target Job
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '320px', textAlign: 'center', lineHeight: 1.5, marginBottom: '24px' }}>
            To generate a tailored resume, first set the target job you&apos;re applying for.
          </p>
          <button
            onClick={() => setShowJobDescModal(true)}
            style={{
              padding: '14px 28px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Briefcase size={18} />
            Set Target Job
          </button>
        </div>
      );
    }

    if (isContentBuilder) {
      return (
        <div style={{ padding: '0 20px 20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            What would you like to add?
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {CONTENT_PROMPTS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSend(item.prompt)}
                disabled={currentState.isLoading}
                style={{
                  flex: '1 1 180px',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: currentState.isLoading ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (isInterviewCopilot) {
      return (
        <div style={{ padding: '0 20px 20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Try These Questions
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COPILOT_PROMPTS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSend(item.prompt)}
                disabled={currentState.isLoading}
                style={{
                  flex: '1 1 180px',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: currentState.isLoading ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Chat mode suggestion questions
  const CHAT_SUGGESTIONS = [
    { category: 'Experience', questions: ['What projects has Jay worked on?', 'Tell me about Jay\'s work history', 'What companies has Jay worked for?'] },
    { category: 'Skills', questions: ['What technologies does Jay know?', 'What are Jay\'s strongest skills?', 'Does Jay have experience with React?'] },
    { category: 'Background', questions: ['What is Jay\'s educational background?', 'What certifications does Jay have?', 'Where is Jay located?'] },
  ];

  // Render preview panel content
  const renderPreviewContent = () => {
    if (isInterviewPractice) {
      return <FeedbackArtifact feedback={interviewPractice.feedback} isAnalyzing={interviewPractice.isAnalyzingAnswer} />;
    }
    if (isResumeBuilder) {
      return (
        <ResumeArtifact
          data={resumeBuilder.resume as ResumeData}
          isGenerating={resumeBuilder.isGeneratingResume}
          targetRole={resumeBuilder.targetRole || undefined}
          targetCompany={resumeBuilder.targetCompany || undefined}
        />
      );
    }
    if (isContentBuilder) {
      return (
        <ContentPreviewArtifact
          pendingContent={contentBuilder.pendingContent}
          savedContent={contentBuilder.savedContent}
          onSave={contentBuilder.saveContent}
          onDiscard={contentBuilder.discardContent}
          onClearAll={contentBuilder.clearAllPending}
        />
      );
    }
    if (isInterviewCopilot) {
      return (
        <CopilotArtifact
          outline={copilotOutline}
          isLoading={chatMode.isLoading}
        />
      );
    }
    // Chat modes show suggestions
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Try asking one of these questions to learn more about {identity.first_name}:
        </p>
        {CHAT_SUGGESTIONS.map((section, idx) => (
          <div key={idx}>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              {section.category}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {section.questions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSend(question.replace(/Jay/g, identity.first_name))}
                  disabled={currentState.isLoading}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#475569',
                    transition: 'all 0.15s ease',
                    opacity: currentState.isLoading ? 0.6 : 1,
                  }}
                >
                  {question.replace(/Jay/g, identity.first_name)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        {/* Mobile Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowMobileMenu(true)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CurrentModeIcon size={18} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{currentMode?.name || 'Chat'}</span>
            </div>
          </div>
          <button
            onClick={() => setShowMobilePreview(true)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: hasPreviewContent() ? '#f5f3ff' : 'white',
              cursor: 'pointer',
              color: hasPreviewContent() ? '#7c3aed' : '#64748b',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isInterviewCopilot ? 'Outline' : isChatMode ? 'Suggestions' : isInterviewPractice ? 'Feedback' : 'Preview'}
            {hasPreviewContent() && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowMobileMenu(false)}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '280px',
                backgroundColor: 'white',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Chat Modes</h3>
                <button onClick={() => setShowMobileMenu(false)} style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {CHAT_MODES.filter(mode => mode.enabled).map((mode) => {
                  const Icon = ICON_MAP[mode.icon] || MessageSquare;
                  const isActive = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => { handleModeChange(mode.id); setShowMobileMenu(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                        color: isActive ? '#4338ca' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <Icon size={20} />
                      <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}>{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Preview Overlay */}
        {showMobilePreview && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 50, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: previewConfig.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PreviewIcon size={18} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    {previewConfig.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    {previewConfig.description}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowMobilePreview(false)} style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#f8fafc' }}>
              {renderPreviewContent()}
            </div>
          </div>
        )}

        {/* Chat Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {currentState.messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Skip welcome content for resume builder without job context - the Set Target Job prompt is enough */}
              {!(isResumeBuilder && !globalJobContext) && renderWelcomeContent()}
              {renderSuggestedPrompts()}
            </div>
          ) : (
            <MessageList
              messages={currentState.messages}
              isLoading={currentState.isLoading}
              profileImage={identity.profile_image}
              firstName={identity.first_name}
              hideCodeblocks={isInterviewPractice || isResumeBuilder}
            />
          )}
        </div>

        {/* Error Display */}
        {currentState.error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderTop: '1px solid #fecaca', color: '#dc2626', fontSize: '13px' }}>
            {currentState.error}
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
          <ChatInput
            onSend={handleSend}
            disabled={currentState.isLoading}
            placeholder={
              isInterviewPractice ? "Ask for a question or type your answer..." :
              isResumeBuilder ? "Paste a job description or describe the role..." :
              isContentBuilder ? "Describe what you want to add..." :
              isInterviewCopilot ? "Paste an interview question..." :
              `Ask ${identity.first_name} anything...`
            }
          />
        </div>
      </div>
    );
  }

  // Desktop Layout - 3 columns
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 1fr',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left Column: Chat Modes Menu */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
        }}
      >
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            padding: '0 8px',
          }}
        >
          Chat Modes
        </h3>

        {CHAT_MODES.filter(mode => mode.enabled).map((mode) => {
          const Icon = ICON_MAP[mode.icon] || MessageSquare;
          const isActive = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                color: isActive ? '#4338ca' : '#475569',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}>
                {mode.name}
              </span>
            </button>
          );
        })}

        {/* Spacer to push toolbox to bottom */}
        <div style={{ flex: 1 }} />

        {/* Toolbox Section */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '12px',
            marginTop: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              padding: '0 8px',
            }}
          >
            Context
          </h3>

          {/* Job Context Display or Upload Button */}
          {globalJobContext ? (
            <div
              onClick={() => {
                // Pre-populate modal fields with existing context
                setJobTitleInput(globalJobContext.title || '');
                setJobCompanyInput(globalJobContext.company || '');
                setJobDescInput(globalJobContext.description || '');
                setShowJobDescModal(true);
              }}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} style={{ color: '#16a34a' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Target Job
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearGlobalJobContext();
                  }}
                  style={{
                    padding: '2px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#166534',
                  margin: '0 0 2px 0',
                  lineHeight: 1.3,
                }}
              >
                {globalJobContext.title || 'Job Description'}
              </p>
              {globalJobContext.company && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#15803d',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {globalJobContext.company}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowJobDescModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                backgroundColor: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
              }}
            >
              <Briefcase size={18} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                Add Job Context
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Center Column: Chat Window */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: getModeGradient(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CurrentModeIcon size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {currentMode?.name || 'Chat'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {currentMode?.description || 'Chat with AI'}
              </p>
            </div>
          </div>

          {currentState.messages.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Interview Practice Sub-Header */}
        {isInterviewPractice && (
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Ask A Question Button */}
            <button
              onClick={() => {
                interviewPractice.requestNewQuestion();
              }}
              disabled={currentState.isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 500,
                cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                opacity: currentState.isLoading ? 0.6 : 1,
              }}
            >
              <HelpCircle size={16} />
              Ask A Question
            </button>

            {/* Ask Targeted Question Button - shown when job context is set */}
            {globalJobContext && (
              <button
                onClick={() => {
                  // Clear chat first to start fresh
                  interviewPractice.clearChat();
                  // Send targeted question prompt
                  const prompt = `Ask me a single, concise interview question for a ${globalJobContext.title}${globalJobContext.company ? ` at ${globalJobContext.company}` : ''} role. Keep the question brief and focused. Base it on this job description:\n\n${globalJobContext.description}`;
                  // Small delay to ensure state is cleared before sending
                  setTimeout(() => handleSend(prompt), 50);
                }}
                disabled={currentState.isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: currentState.isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: currentState.isLoading ? 0.6 : 1,
                }}
              >
                <Briefcase size={14} />
                Ask Targeted Question
              </button>
            )}
          </div>
        )}

        {/* Messages Area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {currentState.messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Skip welcome content for resume builder without job context - the Set Target Job prompt is enough */}
              {!(isResumeBuilder && !globalJobContext) && renderWelcomeContent()}
              {renderSuggestedPrompts()}
            </div>
          ) : (
            <MessageList
              messages={currentState.messages}
              isLoading={currentState.isLoading}
              profileImage={identity.profile_image}
              firstName={identity.first_name}
              hideCodeblocks={isInterviewPractice || isResumeBuilder}
            />
          )}
        </div>

        {/* Current Question Display (Interview Practice only) */}
        {isInterviewPractice && interviewPractice.currentQuestion && currentState.messages.length > 0 && (
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', marginBottom: '4px' }}>
              Current Question
            </p>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
              {interviewPractice.currentQuestion.question}
            </p>
          </div>
        )}

        {/* Error Display */}
        {currentState.error && (
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#fef2f2',
              borderTop: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '13px',
            }}
          >
            {currentState.error}
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
          <ChatInput
            onSend={handleSend}
            disabled={currentState.isLoading}
            placeholder={
              isInterviewPractice ? "Ask for a question or type your answer..." :
              isResumeBuilder ? "Paste a job description or describe the role..." :
              isContentBuilder ? "Describe what you want to add..." :
              isInterviewCopilot ? "Paste an interview question..." :
              `Ask ${identity.first_name} anything...`
            }
          />
        </div>
      </div>

      {/* Right Column: Preview Panel */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Preview Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: previewConfig.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PreviewIcon size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {previewConfig.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {previewConfig.description}
              </p>
            </div>
          </div>

          {/* Copy and Print Buttons */}
          {isResumeBuilder && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Copy Button */}
              <button
                onClick={handleCopyResume}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: copied ? '#22c55e' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title={copied ? 'Copied!' : 'Copy as markdown'}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Print resume"
              >
                <Printer size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div
          ref={previewContentRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
          }}
        >
          {renderPreviewContent()}
        </div>
      </div>

      {/* Job Description Modal */}
      {showJobDescModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowJobDescModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    Set Target Job
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    This context will be used across all chat modes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJobDescModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitleInput}
                    onChange={(e) => setJobTitleInput(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={jobCompanyInput}
                    onChange={(e) => setJobCompanyInput(e.target.value)}
                    placeholder="e.g., Google"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Job Description
                </label>
                <textarea
                  value={jobDescInput}
                  onChange={(e) => setJobDescInput(e.target.value)}
                  placeholder="Paste the full job description here..."
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => {
                  setShowJobDescModal(false);
                  setJobDescInput('');
                  setJobTitleInput('');
                  setJobCompanyInput('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (jobDescInput.trim()) {
                    // Save to global job context
                    setGlobalJobContext({
                      title: jobTitleInput.trim() || 'Job Description',
                      company: jobCompanyInput.trim(),
                      description: jobDescInput.trim(),
                    });
                    setShowJobDescModal(false);
                    setJobDescInput('');
                    setJobTitleInput('');
                    setJobCompanyInput('');
                  }
                }}
                disabled={!jobDescInput.trim()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: !jobDescInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: !jobDescInput.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Briefcase size={16} />
                Save Job Context
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
