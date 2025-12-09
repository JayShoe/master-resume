import React from 'react';
import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  background?: string;
  headerContent?: React.ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
}

export default function PageLayout({
  children,
  title,
  description,
  background = '#ffffff',
  headerContent,
  backLink
}: PageLayoutProps) {
  return (
    <main style={{ 
      paddingTop: '72px', // Account for fixed header
      minHeight: '100vh',
      background 
    }}>
      {/* Page Header */}
      {(title || description) && (
        <div style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #e5e7eb',
          padding: '40px 0',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            position: 'relative'
          }}>
            {backLink && (
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '0'
              }}>
                <Link href={backLink.href} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {backLink.label}
                </Link>
              </div>
            )}
            <div style={{
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {title && (
                <h1 style={{ 
                  fontSize: 'clamp(32px, 4vw, 48px)', 
                  fontWeight: '700', 
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  {title}
                </h1>
              )}
              {description && (
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  textAlign: 'justify',
                  margin: 0
                }}>
                  {description}
                </p>
              )}
              {headerContent && (
                <div style={{ marginTop: '24px' }}>
                  {headerContent}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}
    </main>
  );
}