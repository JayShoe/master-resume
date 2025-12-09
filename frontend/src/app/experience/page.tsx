import type { Metadata } from 'next';
import { getPositions } from '@/lib/data-source';
import { calculateYearsOfExperience } from '@/lib/api';

export const dynamic = 'force-static';
import PageLayout from '@/components/layout/PageLayout';
import AccomplishmentsWrapper from '@/components/experience/AccomplishmentsWrapper';
import { Calendar, MapPin, Building2, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Professional Experience',
  description: 'Comprehensive timeline of professional positions, accomplishments, and career development across 15+ years in technology, product management, and business development.',
  keywords: 'professional experience, career timeline, product management, business development, work history',
  openGraph: {
    title: 'Professional Experience',
    description: 'Explore my professional journey showcasing positions, accomplishments, and career growth.',
    type: 'profile',
  },
};


function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });

  if (isCurrent) {
    return `${start} - Present`;
  }

  if (!endDate) {
    return start;
  }

  const end = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });

  return `${start} - ${end}`;
}

function getCompanyLogoUrl(company: any): string | null {
  if (!company || !company.logo) return null;

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) return null;

  // Remove trailing slash from directusUrl to prevent double slashes
  const baseUrl = directusUrl.endsWith('/') ? directusUrl.slice(0, -1) : directusUrl;
  return `${baseUrl}/assets/${company.logo}`;
}

export default async function ExperiencePage() {
  let positions: any[] = [];
  let error = null;

  try {
    positions = await getPositions();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load experience data';
    console.error('Experience page data fetch error:', err);
  }

  const yearsOfExperience = positions.length > 0 ? calculateYearsOfExperience(positions) : 15;
  const currentRoles = positions.filter(p => p.is_current || p.current);

  // Create header content for the stats
  const headerContent = positions.length > 0 ? (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '20px',
      marginTop: '24px',
      maxWidth: '500px',
      margin: '24px auto 0'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {yearsOfExperience}+
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Years Experience
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {positions.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Professional Roles
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {currentRoles.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Current Position{currentRoles.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <PageLayout
      title="Professional Experience"
      description="My career journey showcasing positions, accomplishments, and the growth that has shaped my professional expertise."
      headerContent={headerContent}
    >
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '16px', margin: 0 }}>
                {error}
              </p>
            </div>
          )}


          {/* Experience Timeline */}
          {positions.length > 0 && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '48px' 
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  Career Journey
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  A timeline of professional growth, achievements, and impact across leading organizations.
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                {/* Main Timeline Line */}
                <div className="timeline-line" style={{
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  background: 'linear-gradient(to bottom, #3b82f6, #e5e7eb)',
                  transform: 'translateX(-50%)',
                  zIndex: 1
                }}></div>

                {positions
                  .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                  .map((position, index) => (
                  <div key={position.id || index} style={{
                    position: 'relative',
                    marginBottom: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}
                  className="experience-timeline-item"
                  data-position={index % 2 === 0 ? 'left' : 'right'}
                  >
                    {/* Timeline Node */}
                    <div className="timeline-node" style={{
                      position: 'absolute',
                      left: '50%',
                      top: '32px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: position.is_current || position.current ? 
                        'linear-gradient(135deg, #10b981, #059669)' : 
                        'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: '4px solid white',
                      boxShadow: position.is_current || position.current ?
                        '0 0 0 4px rgba(16, 185, 129, 0.2), 0 4px 12px rgba(16, 185, 129, 0.3)' :
                        '0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.3)',
                      transform: 'translateX(-50%)',
                      zIndex: 3
                    }}></div>

                    {/* Content Card */}
                    <div style={{
                      width: '100%',
                      maxWidth: '500px'
                    }}
                    className="experience-card-container"
                    data-position={index % 2 === 0 ? 'left' : 'right'}
                    >
                      <div className="card" style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        background: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        overflow: 'visible',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}>
                        {/* Date Flag */}
                        <div style={{
                          position: 'absolute',
                          top: '-16px',
                          right: '24px',
                          background: position.is_current || position.current ?
                            'linear-gradient(135deg, #10b981, #059669)' :
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '16px',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          minWidth: '120px'
                        }}>
                          {/* Start Date - Large */}
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            lineHeight: '1',
                            letterSpacing: '-0.025em'
                          }}>
                            {new Date(position.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          
                          {/* End Date or "Present" - Small */}
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            opacity: 0.9,
                            lineHeight: '1',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {position.is_current || position.current ? 
                              'Present' : 
                              position.end_date ? 
                                new Date(position.end_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric'
                                }) : 
                                'Present'
                            }
                          </div>
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '40px 12px 12px 12px' }}>
                          {/* Primary Title and Company as Main Header */}
                          <div style={{
                            marginBottom: '24px',
                            textAlign: 'center'
                          }}>
                            {/* Company Logo */}
                            {(() => {
                              const logoUrl = position.company ? getCompanyLogoUrl(position.company) : null;
                              return logoUrl && (
                                <div style={{
                                  marginBottom: '16px',
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}>
                                  <img
                                    src={logoUrl}
                                    alt={`${position.company.name} logo`}
                                    style={{
                                      maxWidth: '120px',
                                      maxHeight: '60px',
                                      width: 'auto',
                                      height: 'auto',
                                      objectFit: 'contain'
                                    }}
                                  />
                                </div>
                              );
                            })()}
                            {(position.primary_title || position.title || position.position_title) && (
                              <h3 style={{
                                fontSize: '22px',
                                fontWeight: '800',
                                color: '#111827',
                                margin: '0 0 8px 0',
                                lineHeight: '1.3'
                              }}>
                                {position.primary_title || position.title || position.position_title}
                              </h3>
                            )}
                            {(position.company?.name || position.company_name) && (
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#6b7280',
                                lineHeight: '1.3'
                              }}>
                                {position.company?.name || position.company_name || 'Company'}
                                {position.company?.location && (
                                  <span> - {position.company.location}</span>
                                )}
                              </div>
                            )}
                            {(position.employment_type || position.work_location) && (
                              <div style={{
                                fontSize: '13px',
                                fontWeight: '400',
                                color: '#a8a29e',
                                lineHeight: '1.3',
                                marginTop: '4px'
                              }}>
                                {position.employment_type && (
                                  <span>
                                    💼 {position.employment_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </span>
                                )}
                                {position.employment_type && position.work_location && (
                                  <span style={{ margin: '0 8px', color: '#d4d4d8' }}>•</span>
                                )}
                                {position.work_location && (
                                  <span>🏠 {Array.isArray(position.work_location) ? position.work_location[0] : position.work_location}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Accomplishments List with Tooltips */}
                          <AccomplishmentsWrapper position={position} />
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '0 12px 12px 12px' }}>

                          {/* Key Achievements - Enhanced Design */}
                          {position.key_achievements && position.key_achievements.length > 0 && (
                            <div style={{
                              background: 'linear-gradient(135deg, #fef7ff, #faf5ff)',
                              borderRadius: '12px',
                              padding: '12px',
                              marginBottom: '16px',
                              border: '1px solid #e879f9'
                            }}>
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#7c3aed',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <TrendingUp size={16} />
                                Key Achievements & Impact
                              </h4>
                              <div style={{
                                display: 'grid',
                                gap: '12px'
                              }}>
                                {position.key_achievements.map((achievement: any, idx: number) => (
                                  <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #f3e8ff',
                                    boxShadow: '0 1px 3px rgba(124, 58, 237, 0.1)'
                                  }}>
                                    <div style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: '#7c3aed',
                                      marginTop: '8px',
                                      flexShrink: 0
                                    }}></div>
                                    <span style={{
                                      color: '#374151',
                                      lineHeight: '1.6',
                                      fontSize: '14px'
                                    }}>
                                      {achievement}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technologies */}
                          {position.technologies && position.technologies.length > 0 && (
                            <div>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Technologies & Tools
                              </h4>
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px'
                              }}>
                                {position.technologies.map((tech: any, idx: number) => (
                                  <span key={idx} style={{
                                    background: '#f8fafc',
                                    color: '#475569',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0'
                                  }}>
                                    {typeof tech === 'string' ? tech : tech.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && positions.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '64px 32px',
              color: '#6b7280'
            }}>
              <Building2 size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                No Experience Data
              </h3>
              <p>Experience information will appear here once loaded.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}