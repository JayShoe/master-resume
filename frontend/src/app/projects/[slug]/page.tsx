import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects } from '@/lib/data-source';
import PageLayout from '@/components/layout/PageLayout';
import MediaSlider from '@/components/projects/MediaSlider';
import { ExternalLink, Github, User, Briefcase, Calendar } from 'lucide-react';
import { stripHtml } from '@/lib/stripHtml';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
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

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects
      .filter((project: any) => project.status === 'published')
      .map((project: any) => ({
        slug: createSlug(project.name || project.title || ''),
      }));
  } catch (error) {
    console.error('Error generating static params for projects:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const projects = await getProjects();
    const project = projects.find((p: any) => createSlug(p.name || p.title || '') === slug);
    
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.'
      };
    }

    return {
      title: `${project.name || project.title}`,
      description: project.summary || (project.description ? stripHtml(project.description) : `Details about ${project.name || project.title} project.`),
      keywords: `project, ${project.name}, ${project.project_type}, ${project.technologies_used?.map((t: any) => typeof t === 'string' ? t : t.name).join(', ')}`,
    };
  } catch (error) {
    return {
      title: 'Project',
      description: 'Project details page.'
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  let projects = [];
  let error = null;

  try {
    projects = await getProjects();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load project data';
    console.error('Project page data fetch error:', err);
  }

  const { slug } = await params;
  const project = projects.find((p: any) => createSlug(p.name || p.title || '') === slug);

  if (!project && !error) {
    notFound();
  }

  if (error) {
    return (
      <PageLayout
        title="Error"
        description="Failed to load project"
      >
        <section className="section">
          <div className="container">
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <p style={{ color: '#dc2626', fontSize: '16px', margin: 0 }}>
                {error}
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link href="/projects" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Projects
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  const status = getProjectStatus(project);

  const projectDate = project?.start_date
    ? new Date(project.start_date).getFullYear().toString()
    : '';

  const headerContent = (
    <div style={{ marginTop: '-16px' }}>
      {projectDate && (
        <p style={{
          fontSize: '16px',
          color: '#9ca3af',
          margin: '0 0 12px 0',
          fontWeight: '500'
        }}>
          Project started {projectDate}
        </p>
      )}
      {(project?.summary || project?.description) && (
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          lineHeight: '1.6',
          margin: 0,
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {project?.summary || (project?.description ? stripHtml(project.description) : '')}
        </p>
      )}
    </div>
  );

  return (
    <PageLayout
      title={project?.name || project?.title || 'Project'}
      headerContent={headerContent}
      backLink={{ href: '/projects', label: 'Back to Projects' }}
    >
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Media Slider */}
            {project?.related_media && Array.isArray(project.related_media) && project.related_media.length > 0 && (
              <MediaSlider
                media={project.related_media}
                directusUrl={process.env.NEXT_PUBLIC_DIRECTUS_URL}
              />
            )}

            {/* Project Hero */}
            <div style={{
              marginBottom: '48px'
            }}>
              {/* Project Image - Only show if no related_media */}
              {project?.featured_image && (!project?.related_media || project.related_media.length === 0) && (
                <div style={{
                  width: '100%',
                  height: '300px',
                  background: `url(${project.featured_image}) center/cover`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              )}

              <div>
                {/* Description */}
                {project?.description && (
                  <div style={{ marginBottom: '32px' }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                          <style>
                            .project-description ul {
                              list-style-type: disc;
                              padding-left: 1.5em;
                              margin: 1em 0;
                            }
                            .project-description ol {
                              list-style-type: decimal;
                              padding-left: 1.5em;
                              margin: 1em 0;
                            }
                            .project-description li {
                              margin: 0.5em 0;
                              line-height: 1.7;
                            }
                            .project-description p {
                              margin: 1em 0;
                            }
                            .project-description h1,
                            .project-description h2,
                            .project-description h3,
                            .project-description h4 {
                              color: #111827;
                              font-weight: 600;
                              margin-top: 1.5em;
                              margin-bottom: 0.5em;
                            }
                          </style>
                          <div class="project-description" style="color: #6b7280; line-height: 1.7; font-size: 18px;">
                            ${project.description}
                          </div>
                        `
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '32px',
                  flexWrap: 'wrap'
                }}>
                  {project?.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <ExternalLink size={16} />
                      View Live Project
                    </a>
                  )}
                  {project?.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <Github size={16} />
                      View Source Code
                    </a>
                  )}
                </div>

                {/* Technologies */}
                {project?.technologies_used && project.technologies_used.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '16px'
                    }}>
                      Technologies Used
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      {project.technologies_used.map((tech: any, idx: number) => (
                        <span key={idx} style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                          color: '#2563eb',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRadius: '24px',
                          border: '1px solid #bfdbfe',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
                        }}>
                          {typeof tech === 'string' ? tech : tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Project Details */}
            {(project?.role || project?.client || project?.duration) && (
              <div className="grid grid-3" style={{ gap: '24px', marginBottom: '48px' }}>
                {project?.role && (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <User size={32} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      My Role
                    </h4>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      {project.role}
                    </p>
                  </div>
                )}
                
                {project?.client && (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Briefcase size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      Client
                    </h4>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      {project.client}
                    </p>
                  </div>
                )}
                
                {project?.duration && (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Calendar size={32} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      Duration
                    </h4>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      {project.duration}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Project Content/Details */}
            {project?.content && (
              <div style={{
                marginTop: '48px'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '24px'
                }}>
                  Project Details
                </h3>
                <div>
                  {typeof project.content === 'string' ? (
                    <div dangerouslySetInnerHTML={{
                      __html: `
                        <style>
                          .project-content ul {
                            list-style-type: disc;
                            padding-left: 1.5em;
                            margin: 1em 0;
                          }
                          .project-content ol {
                            list-style-type: decimal;
                            padding-left: 1.5em;
                            margin: 1em 0;
                          }
                          .project-content li {
                            margin: 0.5em 0;
                            line-height: 1.7;
                          }
                          .project-content p {
                            margin: 1em 0;
                          }
                          .project-content h1,
                          .project-content h2,
                          .project-content h3,
                          .project-content h4 {
                            color: #111827;
                            font-weight: 600;
                            margin-top: 1.5em;
                            margin-bottom: 0.5em;
                          }
                        </style>
                        <div class="project-content" style="color: #6b7280; line-height: 1.7; font-size: 16px;">
                          ${project.content}
                        </div>
                      `
                    }} />
                  ) : (
                    <p style={{
                      color: '#6b7280',
                      lineHeight: '1.7',
                      fontSize: '16px'
                    }}>{project.content}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}