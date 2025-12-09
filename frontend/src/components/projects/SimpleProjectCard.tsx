'use client';

import Link from 'next/link';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import { stripHtml } from '@/lib/stripHtml';

interface SimpleProjectCardProps {
  project: any;
  index: number;
  siteInitials?: string;
}

function getProjectStatus(project: any) {
  // Check if project is marked as current/ongoing
  if (project.current_project || project.is_present) {
    return { label: 'Active', color: '#3b82f6', bgColor: '#eff6ff' };
  }

  // Otherwise, use the status field
  if (project.status === 'completed') return { label: 'Completed', color: '#10b981', bgColor: '#ecfdf5' };
  if (project.status === 'active' || project.status === 'ongoing') return { label: 'Active', color: '#3b82f6', bgColor: '#eff6ff' };
  if (project.status === 'published') return { label: 'Live', color: '#10b981', bgColor: '#ecfdf5' };
  if (project.status === 'paused') return { label: 'Paused', color: '#f59e0b', bgColor: '#fffbeb' };
  return { label: 'Completed', color: '#10b981', bgColor: '#ecfdf5' }; // Default to completed instead of in progress
}

function formatProjectDate(startDate?: string, endDate?: string, isCurrent?: boolean) {
  if (!startDate) return 'Date not specified';

  const start = new Date(startDate).getFullYear();

  // If project is marked as current, show "Present"
  if (isCurrent) {
    return `${start} - Present`;
  }

  if (!endDate || endDate === startDate) return start.toString();

  const end = new Date(endDate).getFullYear();

  return `${start} - ${end}`;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getProjectThumbnail(project: any): string | null {
  if (!project.related_media || !Array.isArray(project.related_media) || project.related_media.length === 0) {
    return null;
  }

  const firstMedia = project.related_media[0];

  const getDirectusFile = (mediaItem: any) => {
    if (!mediaItem || typeof mediaItem !== 'object') {
      return null;
    }
    if (mediaItem.filename_download || mediaItem.type || mediaItem.id) {
      return mediaItem;
    }
    if (mediaItem.directus_files_id) {
      return mediaItem.directus_files_id;
    }
    return null;
  };

  const file = getDirectusFile(firstMedia);
  if (!file || !file.id) {
    return null;
  }

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    return null;
  }

  const baseUrl = directusUrl.endsWith('/') ? directusUrl.slice(0, -1) : directusUrl;
  return `${baseUrl}/assets/${file.id}`;
}

export default function SimpleProjectCard({ project, index, siteInitials = 'JS' }: SimpleProjectCardProps) {
  const status = getProjectStatus(project);
  const projectSlug = createSlug(project.name || project.title || '');
  const thumbnailUrl = getProjectThumbnail(project);

  return (
    <div key={project.id || index} style={{
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      background: 'white',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      minHeight: 'fit-content'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#d1d5db';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e5e7eb';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Project Thumbnail or Placeholder */}
      <div style={{
        width: '100%',
        height: '200px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={project.name || project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '64px',
              fontWeight: '700',
              color: '#cbd5e1',
              opacity: 0.3,
              letterSpacing: '-0.02em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {siteInitials}
            </div>
          </div>
        )}
        {/* Status badge overlay */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: status.color,
          background: status.bgColor,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          {status.label}
        </span>
      </div>

      {/* Project Content */}
      <div style={{ padding: '20px' }}>
        {/* Project Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
          gap: '12px'
        }}>
          <h3 style={{
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            lineHeight: '1.3',
            flex: '1',
            wordBreak: 'break-word'
          }}>
            {project.name || project.title}
          </h3>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          <Calendar size={14} />
          {formatProjectDate(project.start_date, project.end_date, project.current_project || project.is_present)}
        </div>

        <p style={{
          color: '#6b7280',
          lineHeight: '1.6',
          fontSize: '15px',
          margin: '0 0 20px 0'
        }}>
          {project.summary || (project.description ? stripHtml(project.description) : 'No description available.')}
        </p>

        {/* Technologies */}
        {project.technologies_used && project.technologies_used.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              {project.technologies_used.slice(0, 4).map((tech: any, idx: number) => (
                <span key={idx} style={{
                  padding: '4px 8px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px'
                }}>
                  {typeof tech === 'string' ? tech : tech.name}
                </span>
              ))}
              {project.technologies_used.length > 4 && (
                <span style={{
                  padding: '4px 8px',
                  background: '#e5e7eb',
                  color: '#6b7280',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px'
                }}>
                  +{project.technologies_used.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6'
        }}>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
              Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              <Github size={14} />
              Code
            </a>
          )}

          <Link
            href={`/projects/${projectSlug}`}
            style={{
              marginLeft: 'auto',
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}