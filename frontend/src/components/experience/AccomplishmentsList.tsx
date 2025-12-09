'use client';

import { useState } from 'react';

// Component for individual accomplishment with expandable details
function AccomplishmentItem({
  accomplishment,
  position,
  index,
  isExpanded,
  onToggle
}: {
  accomplishment: any,
  position: any,
  index: number,
  isExpanded: boolean,
  onToggle: () => void
}) {

  return (
    <li
      style={{
        marginBottom: '12px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        backgroundColor: isExpanded ? '#ffffff' : 'rgba(248, 250, 252, 0.5)',
        boxShadow: isExpanded ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      {/* Clickable Header */}
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          transition: 'all 0.15s ease',
          position: 'relative'
        }}
        onClick={onToggle}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Chevron Indicator */}
        <div style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2px',
          flexShrink: 0,
          transition: 'transform 0.3s ease',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
        }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isExpanded ? '#3b82f6' : '#6b7280'}
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        {/* Title */}
        {accomplishment.primary_title ? (
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: isExpanded ? '#1e293b' : '#475569',
                fontSize: '15px',
                lineHeight: '1.5',
                fontWeight: isExpanded ? '500' : '400'
              }}
              dangerouslySetInnerHTML={{ __html: accomplishment.primary_title }}
            />
            {/* "Click to view details" hint below the title, right-aligned */}
            {!isExpanded && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '4px'
              }}>
                <span style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Click to view details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: '1.5',
            fontStyle: 'italic',
            flex: 1
          }}>
            Accomplishment details not available
          </div>
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div style={{
          padding: '0 16px 16px 48px',
          animation: 'slideDown 0.3s ease'
        }}>
          {/* Primary Description */}
          {accomplishment.primary_description && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  color: '#334155',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
                dangerouslySetInnerHTML={{ __html: accomplishment.primary_description }}
              />
            </div>
          )}

          {/* Impact Metrics */}
          {accomplishment.impact_metrics && (
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fef9c3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #fbbf24'
            }}>
              <h5 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Impact & Results
              </h5>
              <p style={{
                color: '#78350f',
                fontSize: '13px',
                lineHeight: '1.5',
                margin: 0
              }}>
                {accomplishment.impact_metrics}
              </p>
            </div>
          )}

          {/* Related Technologies */}
          {accomplishment.related_technologies && accomplishment.related_technologies.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Technologies Used
              </h5>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {accomplishment.related_technologies.map((tech: any, idx: number) => (
                  <span key={idx} style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #bae6fd'
                  }}>
                    {tech.technologies_id?.name || tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Skills */}
          {accomplishment.related_skills && accomplishment.related_skills.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Skills Demonstrated
              </h5>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {accomplishment.related_skills.map((skill: any, idx: number) => (
                  <span key={idx} style={{
                    background: '#f0fdf4',
                    color: '#15803d',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #bbf7d0'
                  }}>
                    {skill.skills_id?.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {accomplishment.related_projects && accomplishment.related_projects.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Related Projects
              </h5>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {accomplishment.related_projects.map((project: any, idx: number) => {
                  // Create slug from project name/title
                  const projectName = project.projects_id?.name || project.projects_id?.title || `Project ${idx + 1}`;
                  const projectSlug = project.projects_id?.slug ||
                    projectName
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-')
                      .trim();

                  return (
                    <li key={idx}>
                      <a
                        href={`/projects/${projectSlug}`}
                        style={{
                          color: '#3b82f6',
                          fontSize: '13px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #dbeafe',
                          background: '#eff6ff',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                          e.currentTarget.style.borderColor = '#93c5fd';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.borderColor = '#dbeafe';
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 7h10v10"></path>
                          <path d="m7 17 10-10"></path>
                        </svg>
                        {projectName}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Type and Date */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {accomplishment.accomplishment_type && (
              <span>
                <strong>Type:</strong> {accomplishment.accomplishment_type.charAt(0).toUpperCase() + accomplishment.accomplishment_type.slice(1).replace(/_/g, ' ')}
              </span>
            )}
            {accomplishment.date_achieved && (
              <span>
                <strong>Date:</strong> {new Date(accomplishment.date_achieved).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </li>
  );
}

// Main component for accomplishments list
export default function AccomplishmentsList({ position }: { position: any }) {
  // Get accomplishments directly from the position
  const accomplishments = position.accomplishments || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#0f172a',
        margin: '0 0 16px 0',
        letterSpacing: '-0.025em',
        textAlign: 'center'
      }}>
        {position.summary || 'Key Accomplishments'}
      </h4>
      
      {accomplishments && accomplishments.length > 0 ? (
        <ul style={{
          margin: 0,
          padding: '0 0 0 20px',
          listStyle: 'none'
        }}>
          {accomplishments.map((accomplishment: any, idx: number) => (
            <AccomplishmentItem
              key={idx}
              accomplishment={accomplishment}
              position={position}
              index={idx}
              isExpanded={expandedIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </ul>
      ) : (
        <div style={{
          color: '#6b7280',
          fontSize: '14px',
          fontStyle: 'italic',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '6px',
          border: '1px dashed #e5e7eb'
        }}>
          No accomplishments recorded for this position
        </div>
      )}
    </div>
  );
}