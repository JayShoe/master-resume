'use client';

import { ExternalLink, Github, Linkedin, Globe, FileText } from 'lucide-react';

interface ProfessionalLinksProps {
  identity: any;
}

export default function ProfessionalLinks({ identity }: ProfessionalLinksProps) {
  // Professional links with icons and descriptions using identity data
  const professionalLinks = [
    {
      name: 'LinkedIn',
      url: identity?.linkedin_url || identity?.linkedin,
      icon: Linkedin,
      color: '#2563eb',
      bgColor: '#eff6ff',
      description: 'Connect with me professionally'
    },
    {
      name: 'GitHub',
      url: identity?.github_url || identity?.github,
      icon: Github,
      color: '#1f2937',
      bgColor: '#f9fafb',
      description: 'Explore my open source work'
    },
    {
      name: 'Portfolio',
      url: identity?.portfolio_url || identity?.portfolio,
      icon: Globe,
      color: '#7c3aed',
      bgColor: '#faf5ff',
      description: 'View my complete portfolio'
    },
    {
      name: 'Website',
      url: identity?.website_url || identity?.website,
      icon: Globe,
      color: '#059669',
      bgColor: '#ecfdf5',
      description: 'Visit my personal website'
    }
  ].filter(link => link.url); // Only show links that have URLs

  if (professionalLinks.length === 0) {
    return (
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <ExternalLink size={18} style={{ color: '#3b82f6' }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>Professional Links</h3>
        </div>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Professional links will be displayed here once configured.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <ExternalLink size={18} style={{ color: '#3b82f6' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>Professional Links</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {professionalLinks.map((link) => {
          const IconComponent = link.icon;
          
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: link.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={16} style={{ color: link.color }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '2px'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#111827',
                    fontSize: '14px'
                  }}>
                    {link.name}
                  </span>
                  <ExternalLink size={12} style={{ color: '#6b7280' }} />
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {link.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Social Icons */}
      <div style={{
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <h4 style={{
          fontWeight: '500',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#374151',
          margin: '0 0 12px 0'
        }}>Connect & Follow</h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {professionalLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Follow me on ${link.name}`}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  backgroundColor: link.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <IconComponent size={16} style={{ color: link.color }} />
              </a>
            );
          })}
        </div>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '8px',
          margin: '8px 0 0 0',
          lineHeight: '1.4'
        }}>
          Stay updated with my latest projects and insights
        </p>
      </div>
    </div>
  );
}