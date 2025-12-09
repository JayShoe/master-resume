'use client';

import { useState, useCallback } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ArtifactDrawer } from './ArtifactDrawer';
import { ResumeArtifact, ResumeData } from './ResumeArtifact';
import { useResumeBuilder } from '@/hooks/useResumeBuilder';
import { AlertCircle, FileText, Sparkles, PanelRightOpen, Briefcase } from 'lucide-react';

interface ResumeBuilderChatProps {
  identity: {
    first_name: string;
    last_name?: string;
    tagline?: string;
    profile_image?: string | null;
  };
  onClearChat?: () => void;
  globalJobContext?: { title: string; company: string; description: string } | null;
  onOpenJobModal?: () => void;
}

// Component shown when no target job is set
function SetTargetJobPrompt({ onOpenJobModal, firstName }: { onOpenJobModal: () => void; firstName: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
          marginBottom: '24px',
        }}
      >
        <Briefcase size={36} style={{ color: 'white' }} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', textAlign: 'center' }}>
        Set Your Target Job
      </h2>
      <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6, marginBottom: '32px' }}>
        To generate a tailored resume, first set the target job you&apos;re applying for. The AI will highlight {firstName}&apos;s most relevant experience.
      </p>
      <button
        onClick={onOpenJobModal}
        style={{
          padding: '16px 32px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)';
        }}
      >
        <Briefcase size={20} />
        Set Target Job
      </button>
    </div>
  );
}

// Component shown when target job is set - ready to generate
function ReadyToGeneratePrompt({
  jobContext,
  onGenerate,
  onChangeJob,
  isLoading,
  firstName
}: {
  jobContext: { title: string; company: string; description: string };
  onGenerate: () => void;
  onChangeJob: () => void;
  isLoading: boolean;
  firstName: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.25)',
          marginBottom: '24px',
        }}
      >
        <FileText size={36} style={{ color: 'white' }} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', textAlign: 'center' }}>
        Ready to Generate Resume
      </h2>

      {/* Target Job Card */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Briefcase size={16} style={{ color: '#16a34a' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Target Job
          </span>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#166534', margin: 0 }}>
          {jobContext.title}
        </p>
        {jobContext.company && (
          <p style={{ fontSize: '14px', color: '#15803d', margin: '4px 0 0 0' }}>
            {jobContext.company}
          </p>
        )}
      </div>

      <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6, marginBottom: '32px' }}>
        Click below to generate a tailored resume highlighting {firstName}&apos;s most relevant experience for this role.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onChangeJob}
          style={{
            padding: '14px 24px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            background: 'white',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6366f1';
            e.currentTarget.style.color = '#6366f1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          Change Job
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          style={{
            padding: '14px 32px',
            borderRadius: '10px',
            border: 'none',
            background: isLoading ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: isLoading ? '#94a3b8' : 'white',
            fontSize: '15px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.3)';
          }}
        >
          <Sparkles size={18} />
          {isLoading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
    </div>
  );
}

export function ResumeBuilderChat({ identity, onClearChat, globalJobContext, onOpenJobModal }: ResumeBuilderChatProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const {
    messages,
    isLoading,
    error,
    resume,
    isGeneratingResume,
    targetRole,
    targetCompany,
    sendMessage,
    clearChat,
  } = useResumeBuilder({
    apiEndpoint: '/api/interview/resume-gen',
    persistKey: 'resume-builder',
  });

  const handleClear = useCallback(() => {
    clearChat();
    onClearChat?.();
  }, [clearChat, onClearChat]);

  const handleSend = useCallback(async (content: string) => {
    // Auto-open drawer when sending a message
    if (!drawerOpen) {
      setDrawerOpen(true);
    }
    await sendMessage(content);
  }, [sendMessage, drawerOpen]);

  const handleCopyResume = useCallback(() => {
    if (!resume) return;
    // Convert resume to markdown format
    const markdown = formatResumeAsMarkdown(resume);
    navigator.clipboard.writeText(markdown);
  }, [resume]);

  const handleDownloadResume = useCallback(() => {
    if (!resume) return;
    // For now, download as JSON - could add PDF generation later
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${targetRole?.toLowerCase().replace(/\s+/g, '-') || 'tailored'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [resume, targetRole]);

  // Generate resume from global job context
  const handleGenerateFromContext = useCallback(() => {
    if (!globalJobContext) return;
    const prompt = `Here is the job description I want to apply for:\n\nJob Title: ${globalJobContext.title}\nCompany: ${globalJobContext.company}\n\n${globalJobContext.description}\n\nPlease generate a tailored resume for this position.`;
    handleSend(prompt);
  }, [globalJobContext, handleSend]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          overflow: 'hidden',
          padding: '24px',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Resume Builder
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Generate tailored resumes from job descriptions
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Toggle Artifact Button */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: drawerOpen ? '#f1f5f9' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = drawerOpen ? '#f1f5f9' : 'white')}
            >
              <PanelRightOpen size={18} />
              {drawerOpen ? 'Hide Preview' : 'Show Preview'}
            </button>

            {/* Clear Button */}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#dc2626',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {messages.length === 0 ? (
            // No messages yet - show appropriate prompt based on job context
            !globalJobContext ? (
              <SetTargetJobPrompt
                onOpenJobModal={onOpenJobModal || (() => {})}
                firstName={identity.first_name}
              />
            ) : (
              <ReadyToGeneratePrompt
                jobContext={globalJobContext}
                onGenerate={handleGenerateFromContext}
                onChangeJob={onOpenJobModal || (() => {})}
                isLoading={isLoading}
                firstName={identity.first_name}
              />
            )
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              profileImage={identity.profile_image}
              firstName={identity.first_name}
              wideMode={!drawerOpen}
              hideCodeblocks={true}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4 px-5 py-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Only show when there are messages */}
        {messages.length > 0 && (
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            placeholder="Ask follow-up questions or request changes to the resume..."
          />
        )}
      </div>

      {/* Artifact Drawer */}
      <ArtifactDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onToggle={() => setDrawerOpen(!drawerOpen)}
        title={targetRole ? `Resume for ${targetRole}` : 'Resume Preview'}
        onCopy={resume ? handleCopyResume : undefined}
        onDownload={resume ? handleDownloadResume : undefined}
      >
        <ResumeArtifact
          data={resume as ResumeData}
          isGenerating={isGeneratingResume}
          targetRole={targetRole || undefined}
          targetCompany={targetCompany || undefined}
        />
      </ArtifactDrawer>
    </div>
  );
}

function formatResumeAsMarkdown(resume: ResumeData): string {
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
  if (resume.contactInfo.linkedin) linkParts.push(`[LinkedIn](${resume.contactInfo.linkedin})`);
  if (resume.contactInfo.github) linkParts.push(`[GitHub](${resume.contactInfo.github})`);
  if (resume.contactInfo.website) linkParts.push(`[Website](${resume.contactInfo.website})`);
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

  return lines.join('\n');
}
