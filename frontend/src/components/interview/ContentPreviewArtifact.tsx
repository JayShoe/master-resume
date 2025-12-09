'use client';

import { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  Briefcase,
  Trophy,
  Lightbulb,
  Code,
  FolderOpen,
  GraduationCap,
  Award,
  Building2,
  ChevronDown,
  ChevronRight,
  Trash2,
  Save,
} from 'lucide-react';
import type { PendingContent, ContentType } from '@/lib/interview/types';

interface ContentPreviewArtifactProps {
  pendingContent: PendingContent[];
  savedContent: PendingContent[];
  onSave: (contentId: string) => Promise<void>;
  onDiscard: (contentId: string) => void;
  onClearAll: () => void;
}

const CONTENT_TYPE_CONFIG: Record<ContentType, { icon: typeof Briefcase; label: string; color: string }> = {
  position: { icon: Briefcase, label: 'Position', color: '#3b82f6' },
  accomplishment: { icon: Trophy, label: 'Accomplishment', color: '#f59e0b' },
  skill: { icon: Lightbulb, label: 'Skill', color: '#8b5cf6' },
  technology: { icon: Code, label: 'Technology', color: '#06b6d4' },
  project: { icon: FolderOpen, label: 'Project', color: '#10b981' },
  education: { icon: GraduationCap, label: 'Education', color: '#ec4899' },
  certification: { icon: Award, label: 'Certification', color: '#f97316' },
  company: { icon: Building2, label: 'Company', color: '#6366f1' },
};

function ContentCard({
  content,
  onSave,
  onDiscard,
  isSaved = false,
}: {
  content: PendingContent;
  onSave?: (contentId: string) => Promise<void>;
  onDiscard?: (contentId: string) => void;
  isSaved?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const config = CONTENT_TYPE_CONFIG[content.type];
  const Icon = config.icon;

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(content.id);
    } finally {
      setIsSaving(false);
    }
  };

  // Get display title based on content type
  const getTitle = (): string => {
    const data = content.data;
    switch (content.type) {
      case 'position':
        return `${String(data.primary_title ?? '')}${data.company_name ? ` at ${String(data.company_name)}` : ''}`;
      case 'accomplishment':
        return String(data.primary_title ?? 'Untitled');
      case 'skill':
      case 'technology':
      case 'certification':
      case 'company':
        return String(data.name ?? 'Untitled');
      case 'project':
        return String(data.name ?? 'Untitled');
      case 'education':
        return `${String(data.degree_type ?? 'Degree')} from ${String(data.institution ?? 'Unknown')}`;
      default:
        return 'New Content';
    }
  };

  // Get key details to display
  const getDetails = () => {
    const data = content.data;
    const details: { label: string; value: string }[] = [];

    switch (content.type) {
      case 'position':
        if (data.employment_type) details.push({ label: 'Type', value: data.employment_type as string });
        if (data.start_date) details.push({ label: 'Start', value: data.start_date as string });
        if (data.is_current) details.push({ label: 'Status', value: 'Current' });
        else if (data.end_date) details.push({ label: 'End', value: data.end_date as string });
        break;
      case 'accomplishment':
        if (data.accomplishment_type) details.push({ label: 'Type', value: data.accomplishment_type as string });
        if (data.impact_metrics) details.push({ label: 'Impact', value: data.impact_metrics as string });
        break;
      case 'skill':
        if (data.category) details.push({ label: 'Category', value: data.category as string });
        if (data.proficiency_level) details.push({ label: 'Level', value: `${data.proficiency_level}/5` });
        break;
      case 'technology':
        if (data.category) details.push({ label: 'Category', value: data.category as string });
        if (data.years_experience) details.push({ label: 'Experience', value: `${data.years_experience} years` });
        break;
      case 'project':
        if (data.role) details.push({ label: 'Role', value: data.role as string });
        if (data.project_type) details.push({ label: 'Type', value: data.project_type as string });
        break;
      case 'education':
        if (data.field_of_study) details.push({ label: 'Field', value: data.field_of_study as string });
        if (data.graduation_date) details.push({ label: 'Graduated', value: data.graduation_date as string });
        break;
      case 'certification':
        if (data.issuing_organization) details.push({ label: 'Issuer', value: data.issuing_organization as string });
        if (data.issue_date) details.push({ label: 'Date', value: data.issue_date as string });
        break;
      case 'company':
        if (data.industry) details.push({ label: 'Industry', value: data.industry as string });
        if (data.size) details.push({ label: 'Size', value: data.size as string });
        break;
    }

    return details;
  };

  const statusColors = {
    draft: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    ready: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
    saved: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  };

  const statusStyle = statusColors[content.status] || statusColors.draft;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: `1px solid ${isSaved ? '#e2e8f0' : statusStyle.border}`,
        overflow: 'hidden',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: isSaved ? '#f8fafc' : statusStyle.bg,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
          }}
        >
          <Icon size={16} style={{ color: 'white' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              {getTitle()}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: statusStyle.text,
                backgroundColor: isSaved ? '#e2e8f0' : 'white',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {content.status.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {config.label}
          </span>
        </div>

        {expanded ? <ChevronDown size={18} color="#64748b" /> : <ChevronRight size={18} color="#64748b" />}
      </div>

      {/* Content */}
      {expanded && (
        <div style={{ padding: '16px' }}>
          {/* Warnings */}
          {content.duplicateWarning && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '13px', color: '#92400e' }}>{content.duplicateWarning}</span>
            </div>
          )}

          {/* Clarification Needed */}
          {(() => {
            const questions = content.clarificationNeeded;
            if (!questions || questions.length === 0) return null;
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: '#ede9fe',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              >
                <HelpCircle size={16} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '13px', color: '#5b21b6', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                    Clarification needed:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {questions.map((q, i) => (
                      <li key={i} style={{ fontSize: '12px', color: '#6d28d9' }}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* Details */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {getDetails().map((detail, index) => (
              <div
                key={index}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: '#64748b' }}>{detail.label}: </span>
                <span style={{ color: '#1e293b', fontWeight: 500 }}>{detail.value}</span>
              </div>
            ))}
          </div>

          {/* Description Preview */}
          {(() => {
            const desc = content.data.description || content.data.primary_description || content.data.summary;
            if (!desc) return null;
            const descStr = String(desc).replace(/<[^>]*>/g, '');
            return (
              <div
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.5,
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  maxHeight: '100px',
                  overflow: 'hidden',
                }}
              >
                {descStr.slice(0, 200)}
                {descStr.length > 200 && '...'}
              </div>
            );
          })()}

          {/* Actions */}
          {!isSaved && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {content.status === 'ready' && onSave && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save size={16} />
                      Save to Database
                    </>
                  )}
                </button>
              )}
              {onDiscard && (
                <button
                  onClick={() => onDiscard(content.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    backgroundColor: 'white',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                  Discard
                </button>
              )}
            </div>
          )}

          {/* Saved indicator */}
          {isSaved && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <Check size={16} />
              Saved to Directus
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ContentPreviewArtifact({
  pendingContent,
  savedContent,
  onSave,
  onDiscard,
  onClearAll,
}: ContentPreviewArtifactProps) {
  const hasPending = pendingContent.length > 0;
  const hasSaved = savedContent.length > 0;
  const isEmpty = !hasPending && !hasSaved;

  if (isEmpty) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <FolderOpen size={28} style={{ color: '#94a3b8' }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
          No Content Yet
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '240px' }}>
          Start a conversation to add new content to your resume database.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
      {/* Pending Content */}
      {hasPending && (
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Pending ({pendingContent.length})
            </h3>
            {pendingContent.length > 1 && (
              <button
                onClick={onClearAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
          </div>
          {pendingContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onSave={onSave}
              onDiscard={onDiscard}
            />
          ))}
        </div>
      )}

      {/* Saved Content */}
      {hasSaved && (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', marginBottom: '12px' }}>
            Saved This Session ({savedContent.length})
          </h3>
          {savedContent.map((content) => (
            <ContentCard key={content.id} content={content} isSaved />
          ))}
        </div>
      )}
    </div>
  );
}
