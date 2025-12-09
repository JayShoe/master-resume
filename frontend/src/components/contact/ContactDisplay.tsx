'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';

interface ContactDisplayProps {
  identity: {
    email?: string;
    phone?: string;
    linkedin_url?: string;
    linkedin?: string;
  } | null;
}

export default function ContactDisplay({ identity }: ContactDisplayProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!identity) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '64px 32px',
        color: '#6b7280'
      }}>
        <Mail size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          No Contact Information
        </h3>
        <p>Contact information will appear here once loaded.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? '32px' : '48px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Main Contact Methods */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {/* Email Contact */}
        {identity.email && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            transition: 'transform 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onClick={() => {
            navigator.clipboard.writeText(identity.email!);
            alert('Email address copied to clipboard!');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}>
              <Mail size={28} style={{ color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>Send Email</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              Click to copy my email address to your clipboard.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#3b82f6',
              fontWeight: '500',
              fontSize: '16px'
            }}>
              <span>{identity.email}</span>
              <ExternalLink size={16} />
            </div>
          </div>
        )}

        {/* Phone Contact */}
        {identity.phone && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            transition: 'transform 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onClick={() => window.open(`tel:${identity.phone}`, '_blank')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <Phone size={28} style={{ color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>Call Me</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              Want to discuss your project over the phone?
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#10b981',
              fontWeight: '500',
              fontSize: '16px'
            }}>
              <span>{identity.phone}</span>
              <ExternalLink size={16} />
            </div>
          </div>
        )}

        {/* LinkedIn Contact */}
        {(identity.linkedin_url || identity.linkedin) && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            transition: 'transform 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onClick={() => window.open(identity.linkedin_url || identity.linkedin, '_blank')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0077b5, #005885)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(0, 119, 181, 0.3)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'white' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>Connect on LinkedIn</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              Let's connect professionally and expand our networks.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#0077b5',
              fontWeight: '500',
              fontSize: '16px'
            }}>
              <span>View Profile</span>
              <ExternalLink size={16} />
            </div>
          </div>
        )}

        {/* Ready to Start Your Project Box */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'white' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px'
          }}>Ready to Start Your Project?</h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '0',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            Choose your preferred contact method above and let's discuss how we can bring your ideas to life. I'm excited to hear about your next project!
          </p>
        </div>
      </div>
    </div>
  );
}
