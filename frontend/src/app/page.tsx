import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';
import { Mail, TrendingUp, Users, User, Award, FolderOpen, ChevronRight } from 'lucide-react';
import { getIdentity, getProfessionalSummaries, getPositions, getProjects, getSkills, getEducation, getTechnologies, getAccomplishments } from '@/lib/data-source';
import { calculateYearsOfExperience, getRecentProjects, getFeaturedSkills, getProfileImageUrl } from '@/lib/api';
import AvailabilityCallout from '@/components/contact/AvailabilityCallout';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [identity, professionalSummaries] = await Promise.all([getIdentity(), getProfessionalSummaries()]);
    const portfolioData = { identity, professionalSummary: professionalSummaries?.[0] };
    
    const name = portfolioData?.identity ?
      `${portfolioData.identity.first_name} ${portfolioData.identity.last_name}` :
      'Portfolio';
      
    const title = 'Product Leader with an Entrepreneur\'s Heart';

    return {
      title: `${name} - ${title}`,
      description: 'Senior Product Leader specializing in strategic product development, digital transformation, and building scalable solutions that drive business growth.',
      keywords: 'Product Leader, Digital Transformation, Business Development, SEO & Marketing, Entrepreneur',
    };
  } catch (error) {
    return {
      title: 'Portfolio - Product Leader',
      description: 'Senior Product Leader specializing in strategic product development and digital transformation.',
    };
  }
}

export default async function Home() {
  let portfolioData = null;
  let experience: any[] = [];
  let projects: any[] = [];
  let skills: any[] = [];
  let technologies: any[] = [];
  let education: any[] = [];
  let accomplishments: any[] = [];
  let error = null;

  try {
    const [portfolioResponse, experienceData, projectsData, skillsData, technologiesData, educationData, accomplishmentsData] = await Promise.all([
      Promise.all([getIdentity(), getProfessionalSummaries()]).then(([identity, professionalSummaries]) => ({ identity, professionalSummary: professionalSummaries?.[0] })),
      getPositions(),
      getProjects(),
      getSkills(),
      getTechnologies(),
      getEducation(),
      getAccomplishments()
    ]);
    portfolioData = portfolioResponse;
    experience = experienceData;
    projects = projectsData;
    skills = skillsData;
    technologies = technologiesData;
    education = educationData;
    accomplishments = accomplishmentsData;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load portfolio data';
    console.error('Homepage data fetch error:', err);
  }

  const yearsOfExperience = experience.length > 0 ? calculateYearsOfExperience(experience) : 15;
  const totalProjects = projects.length;
  const totalSkills = skills.length;
  const totalTechnologies = technologies.length;
  const companiesWorked = experience.length;
  const totalAwards = accomplishments.filter(acc => acc.accomplishment_type === 'award' || acc.category === 'award').length;
  const featuredSkills = getFeaturedSkills(skills);
  const coreSkillsCount = featuredSkills.length;


  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ 
        paddingTop: '100px', // Account for fixed header
        paddingBottom: '40px',
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
      }}>
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

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '32px',
            maxWidth: '1400px',
            margin: '0 auto',
            alignItems: 'start'
          }} 
          className="md:grid-cols-1 md:gap-12"
          >
            {/* Left Column - Content */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '24px'
            }}>
              {/* Header with Profile Photo and Availability - 3 Column Layout */}
              <div style={{
                display: 'grid',
                gap: '24px',
                alignItems: 'start'
              }}
              className="grid-cols-1 md:grid-cols-[160px_1fr] md:gap-8"
              >
                {/* Profile Photo - Left Column */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
                className="md:justify-start"
                >
                  <div style={{
                    width: 'clamp(120px, 25vw, 160px)',
                    height: 'clamp(120px, 25vw, 160px)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: getProfileImageUrl(portfolioData?.identity) ? 'transparent' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: '4px solid #ffffff',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(36px, 10vw, 64px)',
                    fontWeight: '800',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    {(() => {
                      const profileImageUrl = getProfileImageUrl(portfolioData?.identity);
                      return profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt={`${portfolioData?.identity?.first_name} ${portfolioData?.identity?.last_name}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        portfolioData?.identity ?
                          `${portfolioData.identity.first_name[0]}${portfolioData.identity.last_name[0]}` :
                          ''
                      );
                    })()}
                  </div>
                </div>

                {/* Text Content and Availability - Right Column */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'start'
                }}
                className="flex-col md:flex-row"
                >
                  {/* Text Content */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    textAlign: 'center',
                    flex: '1'
                  }}
                  className="md:text-left"
                  >
                  {/* Name and Title */}
                  <div className="space-y-4">
                    <h1 style={{ 
                      fontSize: 'clamp(28px, 5vw, 64px)', 
                      fontWeight: '800', 
                      lineHeight: '1.1',
                      margin: 0,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {portfolioData?.identity ?
                        `${portfolioData.identity.first_name} ${portfolioData.identity.last_name}` :
                        'Portfolio'
                      }
                    </h1>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#3b82f6', 
                      fontWeight: '600',
                      margin: 0 
                    }}>
                      {portfolioData?.identity?.tagline || 'Product Leader with an Entrepreneur\'s Heart'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <p style={{ 
                    fontSize: '18px', 
                    lineHeight: '1.7',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Driving innovation through strategic product leadership and entrepreneurial vision. 
                    Transforming complex challenges into scalable solutions that deliver exceptional business value.
                  </p>
                  </div>

                  {/* Availability Box */}
                  <div 
                    className="hidden md:block"
                    style={{
                      background: '#f9fafb',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      alignSelf: 'start',
                      fontSize: '13px',
                      flexShrink: 0,
                      width: '220px'
                    }}
                  >
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  Availability
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Status</span>
                  <span style={{ 
                    color: '#10b981', 
                    fontWeight: '600',
                    background: '#f0fdf4',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>Available</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Citizenship</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>US Citizen</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Response</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>24-48 hours</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '15px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Employment</span>
                  <div style={{
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      W-2
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      1099
                    </span>
                  </div>
                </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                gap: '16px',
                margin: '24px 0',
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
                    {yearsOfExperience}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Years Experience
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
{totalSkills}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Core Skills
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
{totalTechnologies}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Technical Skills
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
{totalAwards}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Awards Earned
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
{companiesWorked}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Positions Held
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 28px)', 
                    fontWeight: '800', 
                    color: '#111827',
                    margin: 0 
                  }}>
{totalProjects}+
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: '#6b7280', lineHeight: '1.3' }}>
                    Featured Projects
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Mobile First Design */}
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 w-full"
              >
                <Link href="/about" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  minHeight: '80px'
                }}
                className="hover:border-blue-400 hover:shadow-md hover:scale-105"
                >
                  <User size={24} style={{ color: '#3b82f6' }} />
                  <span>About</span>
                </Link>

                <Link href="/experience" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  minHeight: '80px'
                }}
                className="hover:border-blue-400 hover:shadow-md hover:scale-105"
                >
                  <Users size={24} style={{ color: '#3b82f6' }} />
                  <span>Experience</span>
                </Link>

                <Link href="/skills" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  minHeight: '80px'
                }}
                className="hover:border-blue-400 hover:shadow-md hover:scale-105"
                >
                  <Award size={24} style={{ color: '#3b82f6' }} />
                  <span>Skills</span>
                </Link>

                <Link href="/projects" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  minHeight: '80px'
                }}
                className="hover:border-blue-400 hover:shadow-md hover:scale-105"
                >
                  <FolderOpen size={24} style={{ color: '#3b82f6' }} />
                  <span>Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action Section */}
      <section className="section" style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div className="container">
          <div style={{ 
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {/* Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
            }}>
              <Users size={28} color="white" />
            </div>

            <h2 style={{ 
              fontSize: 'clamp(28px, 4vw, 40px)', 
              fontWeight: '700',
              margin: '0 0 16px 0',
              lineHeight: '1.2',
              color: '#1e293b'
            }}>
              Let's Build Something Great Together
            </h2>
            
            <p style={{ 
              fontSize: '18px', 
              color: '#64748b',
              lineHeight: '1.6',
              margin: '0 0 40px 0'
            }}>
              {yearsOfExperience}+ years of proven product leadership experience. 
              Ready to collaborate and drive your next breakthrough project to success.
            </p>

            {/* CTA Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Mail size={18} />
                Get In Touch
              </Link>
              
              <Link 
                href="/experience" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <TrendingUp size={18} />
                View Experience
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}