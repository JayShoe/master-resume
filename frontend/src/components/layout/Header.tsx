'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getProfileImageUrl } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { useIdentity } from '@/providers/IdentityProvider';

const baseNavigationItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Skills', href: '/skills' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { identity } = useIdentity();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getInitials = () => {
    if (identity?.first_name && identity?.last_name) {
      return `${identity.first_name.charAt(0)}${identity.last_name.charAt(0)}`.toUpperCase();
    }
    return '';
  };

  const getFullName = () => {
    if (identity?.first_name && identity?.last_name) {
      return `${identity.first_name} ${identity.last_name}`;
    }
    return 'Portfolio';
  };

  const getFirstName = () => {
    return identity?.first_name || 'Me';
  };

  // Build navigation items with dynamic Interview link
  const navigationItems = [
    ...baseNavigationItems,
    { name: `Interview ${getFirstName()}`, href: '/interview' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #f3f4f6',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
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
            color: 'white',
            fontWeight: '700',
            fontSize: '16px'
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
                getInitials()
              );
            })()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontWeight: '700', 
              fontSize: '18px', 
              color: '#111827',
              lineHeight: 1.2 
            }}>
              {getFullName()}
            </span>
            <span style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              lineHeight: 1.2 
            }}>
              Product Leader
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ 
          display: isMobile ? 'none' : 'flex', 
          alignItems: 'center', 
          gap: '32px' 
        }}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  fontSize: '16px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#3b82f6' : '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#6b7280';
                }}
              >
                {item.name}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: '#3b82f6',
                    borderRadius: '1px'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <Link 
          href="/contact" 
          style={{
            display: isMobile ? 'none' : 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
          }}
        >
          Let's Connect
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          style={{
            display: isMobile ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            border: 'none',
            background: isMobileMenuOpen ? '#3b82f6' : 'transparent',
            color: isMobileMenuOpen ? 'white' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            boxShadow: isMobileMenuOpen ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = isMobileMenuOpen ? 'rotate(90deg) scale(0.95)' : 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)';
          }}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: '72px',
            left: '0',
            right: '0',
            background: 'white',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
            zIndex: 50,
            maxHeight: 'calc(100vh - 72px)',
            overflowY: 'auto',
            animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderTop: '1px solid #f3f4f6'
          }}
        >
          <div style={{ 
            padding: '20px 24px 32px',
            maxWidth: '100%',
            margin: '0'
          }}>
            {/* Menu Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>
                Navigation
              </h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '16px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#3b82f6' : '#374151',
                      textDecoration: 'none',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      margin: '2px 0',
                      background: isActive ? 'linear-gradient(135deg, #eff6ff, #f0f9ff)' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.background = isActive ? 'linear-gradient(135deg, #dbeafe, #e0f2fe)' : '#f8fafc';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.background = isActive ? 'linear-gradient(135deg, #eff6ff, #f0f9ff)' : 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span>{item.name}</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {isActive && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#3b82f6'
                        }} />
                      )}
                      <div style={{
                        fontSize: '14px',
                        color: isActive ? '#3b82f6' : '#9ca3af',
                        transform: 'rotate(90deg)'
                      }}>
                        ›
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              <div style={{ 
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    width: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.96)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <span>Let's Connect</span>
                  <div style={{
                    fontSize: '14px',
                    transform: 'rotate(45deg)'
                  }}>
                    ↗
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Add CSS keyframes as a style tag */}
          <style jsx>{`
            @keyframes fadeIn {
              from { 
                opacity: 0;
              }
              to { 
                opacity: 1;
              }
            }
            
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* Ensure mobile menu doesn't interfere with page content */
            body {
              ${isMobileMenuOpen ? 'overflow: hidden; position: fixed; width: 100%;' : ''}
            }
          `}</style>
        </div>
      )}
    </header>
  );
}