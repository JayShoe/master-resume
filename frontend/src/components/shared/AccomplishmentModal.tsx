'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Technology category mapping function
function getTechnologyCategoryDisplay(category: string): string {
  switch (category.toLowerCase()) {
    case 'language': return 'Programming Language';
    case 'framework': return 'Framework';
    case 'tool': return 'Tool';
    case 'platform': return 'Platform';
    case 'database': return 'Database';
    case 'cloud': return 'Cloud Service';
    case 'library': return 'Library';
    default: return 'Technology';
  }
}

interface AccomplishmentModalProps {
  accomplishment: any;
  position?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccomplishmentModal({ 
  accomplishment, 
  position, 
  isOpen, 
  onClose 
}: AccomplishmentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && accomplishment) {
      console.log('Modal opened with accomplishment:', accomplishment);
      console.log('Related technologies:', accomplishment.related_technologies);
    }
  }, [isOpen, accomplishment]);

  if (!isOpen || !accomplishment || !mounted) {
    return null;
  }

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '600px',
          maxHeight: '80vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#64748b',
            zIndex: 10,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#475569';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ✕
        </button>
        
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '32px 40px 24px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* Position Context - only show if position provided */}
          {position?.primary_title && (
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '8px',
              letterSpacing: '0.025em'
            }}>
              {position.primary_title}
            </div>
          )}
          
          {/* Accomplishment Title */}
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0',
            lineHeight: '1.25',
            letterSpacing: '-0.025em'
          }}>
            {accomplishment.primary_title}
          </h2>
          
          {/* Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '14px',
            color: '#475569'
          }}>
            {accomplishment.date_achieved && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}></div>
                {new Date(accomplishment.date_achieved).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </div>
            )}
            
            {accomplishment.accomplishment_type && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></div>
                {accomplishment.accomplishment_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </div>
            )}
          </div>
        </div>
        
        {/* Modal Body - Scrollable */}
        <div style={{ 
          padding: '0 40px 40px',
          maxHeight: 'calc(80vh - 200px)',
          overflowY: 'auto'
        }}>
          
          {/* Overview - Primary Description */}
          {accomplishment.primary_description && (
            <div style={{
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                letterSpacing: '-0.025em'
              }}>
                Overview
              </h3>
              <div 
                style={{
                  color: '#475569',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
                dangerouslySetInnerHTML={{ __html: accomplishment.primary_description }}
              />
            </div>
          )}

          {/* Business Impact */}
          {accomplishment.impact_metrics && (
            <div style={{
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                letterSpacing: '-0.025em'
              }}>
                Business Impact
              </h3>
              <div 
                style={{
                  color: '#475569',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                {accomplishment.impact_metrics}
              </div>
            </div>
          )}
          
          {/* Technologies and Skills */}
          {(accomplishment.related_technologies?.length > 0 || accomplishment.related_skills?.length > 0) && (
            <div style={{ 
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              
              {/* Technologies */}
              {accomplishment.related_technologies && accomplishment.related_technologies.length > 0 && (
                <div style={{ marginBottom: accomplishment.related_skills?.length > 0 ? '20px' : '0' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '85px',
                      paddingTop: '2px'
                    }}>
                      Technologies
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px',
                      flex: 1
                    }}>
                      {accomplishment.related_technologies.map((junction: any, idx: number) => {
                        const tech = junction.technologies_id || junction;
                        const displayText = tech?.name || (tech?.category ? getTechnologyCategoryDisplay(tech.category) : 'Technology');
                        return (
                          <span key={idx} style={{
                            backgroundColor: 'white',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                          }}>
                            {displayText}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Skills */}
              {accomplishment.related_skills && accomplishment.related_skills.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '85px',
                      paddingTop: '2px'
                    }}>
                      Key Skills
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px',
                      flex: 1
                    }}>
                      {accomplishment.related_skills.map((junction: any, idx: number) => (
                        <span key={idx} style={{
                          backgroundColor: 'white',
                          color: '#374151',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: '1px solid #d1d5db',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}>
                          {junction.skills_id?.name || junction.name || 'Skill'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Related Projects */}
          {accomplishment.related_projects && accomplishment.related_projects.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                letterSpacing: '-0.025em'
              }}>
                Related Projects
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {accomplishment.related_projects.map((junction: any, idx: number) => (
                  <div key={idx} style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#475569',
                    padding: '8px 0',
                    borderBottom: idx < accomplishment.related_projects.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    {junction.projects_id?.name || junction.projects_id?.title || junction.name || 'Project'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}