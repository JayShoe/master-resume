'use client'

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter, Instagram, Globe } from 'lucide-react';
import { getProfileImageUrl } from '@/lib/api';
import { useIdentity } from '@/providers/IdentityProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { identity } = useIdentity();

  // Generate initials from identity data
  const getInitials = () => {
    if (identity?.first_name && identity?.last_name) {
      return `${identity.first_name.charAt(0)}${identity.last_name.charAt(0)}`.toUpperCase();
    }
    return '';
  };

  // Generate full name from identity data
  const getFullName = () => {
    if (identity?.first_name && identity?.last_name) {
      return `${identity.first_name} ${identity.last_name}`;
    }
    return 'Portfolio';
  };

  // Generate social links from identity data
  const getSocialLinks = (): { name: string; href: string; icon: typeof Mail }[] => {
    const links: { name: string; href: string; icon: typeof Mail }[] = [];

    // Contact (always include)
    links.push({
      name: 'Contact',
      href: '/contact',
      icon: Mail,
    });

    // LinkedIn
    const linkedinUrl = identity?.linkedin_url || identity?.linkedin;
    if (linkedinUrl) {
      links.push({
        name: 'LinkedIn',
        href: linkedinUrl,
        icon: Linkedin,
      });
    }

    // GitHub
    const githubUrl = identity?.github_url || identity?.github;
    if (githubUrl) {
      links.push({
        name: 'GitHub',
        href: githubUrl,
        icon: Github,
      });
    }

    // Twitter
    const twitterUrl = identity?.twitter_url || identity?.twitter;
    if (twitterUrl) {
      links.push({
        name: 'Twitter',
        href: twitterUrl,
        icon: Twitter,
      });
    }

    // Instagram
    const instagramUrl = identity?.instagram_url || identity?.instagram;
    if (instagramUrl) {
      links.push({
        name: 'Instagram',
        href: instagramUrl,
        icon: Instagram,
      });
    }

    // Website/Portfolio
    const websiteUrl = identity?.website_url || identity?.website || identity?.portfolio_url;
    if (websiteUrl) {
      links.push({
        name: 'Website',
        href: websiteUrl,
        icon: Globe,
      });
    }

    return links;
  };

  const socialLinks = getSocialLinks();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
      borderTop: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Main Footer Content */}
        <div style={{ padding: '48px 0 32px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '32px'
          }}>
            {/* Brand Section - Left Column */}
            <div>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                textDecoration: 'none'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: getProfileImageUrl(identity) ? 'transparent' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  {(() => {
                    const profileImageUrl = getProfileImageUrl(identity);
                    return profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={getFullName()}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {getInitials()}
                      </span>
                    );
                  })()}
                </div>
                <span style={{
                  fontWeight: '700',
                  fontSize: '20px',
                  color: '#111827'
                }}>
                  {getFullName()}
                </span>
              </Link>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                {identity?.tagline || identity?.bio || 
                 'Product Leader with an Entrepreneur\'s Heart. Driving innovation through strategic product leadership and digital transformation.'}
              </p>
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    marginRight: '4px'
                  }}>
                    Connect:
                  </span>
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '16px',
                          background: 'white',
                          color: '#6b7280',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e5e7eb'
                        }}
                        target={social.href.startsWith('http') ? '_blank' : undefined}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.color = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Icon size={16} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation - Middle Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Navigation
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Home
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/about" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    About
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/experience" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Experience
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/projects" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Projects
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/skills" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Skills
                  </Link>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/contact" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools - Right Column */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Tools
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  <Link href="/master-resume" style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                    Master Resume
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '24px',
          paddingBottom: '32px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              © {currentYear} {getFullName()}. All rights reserved.
            </p>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0
            }}>
              Built with Next.js & Directus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}