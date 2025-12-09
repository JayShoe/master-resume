'use client';

import { Wrench, Zap, FileText, Mic, PlusCircle, Headphones, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getEnabledModes, type ChatMode, type ChatModeId } from '@/lib/interview/chat-modes';
import { useState, useEffect } from 'react';

interface ChatModeSidebarProps {
  currentMode: ChatModeId;
  onModeChange: (mode: ChatModeId) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const iconMap = {
  tool: Wrench,
  zap: Zap,
  'file-text': FileText,
  mic: Mic,
  'plus-circle': PlusCircle,
  headphones: Headphones,
};

export function ChatModeSidebar({ currentMode, onModeChange, isMobileOpen = false, onMobileClose }: ChatModeSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModeClick = (mode: ChatMode) => {
    if (!mode.enabled) return;
    if (mode.id !== currentMode) {
      onModeChange(mode.id);
    }
    // Close mobile sidebar after selection
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // On mobile, hide sidebar when not open
  if (isMobile && !isMobileOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isMobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}
      <div
        style={{
          width: isMobile ? '280px' : (isCollapsed ? '60px' : '260px'),
          minWidth: isMobile ? '280px' : (isCollapsed ? '60px' : '260px'),
          height: '100%',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease, min-width 0.2s ease, transform 0.3s ease',
          overflow: 'hidden',
          ...(isMobile ? {
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 50,
            height: '100vh',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          } : {}),
        }}
      >
      {/* Header */}
      <div
        style={{
          padding: (isCollapsed && !isMobile) ? '16px 8px' : '16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: (isCollapsed && !isMobile) ? 'center' : 'space-between',
        }}
      >
        {(!isCollapsed || isMobile) && (
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#475569',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Chat Modes
          </h3>
        )}
        {isMobile ? (
          <button
            onClick={onMobileClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Mode List */}
      <div
        style={{
          flex: 1,
          padding: (isCollapsed && !isMobile) ? '8px 4px' : '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        {getEnabledModes().map((mode) => {
          const Icon = iconMap[mode.icon];
          const isActive = mode.id === currentMode;
          const isDisabled = !mode.enabled;

          const showCompact = isCollapsed && !isMobile;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode)}
              disabled={isDisabled}
              title={showCompact ? `${mode.name}: ${mode.description}` : undefined}
              style={{
                width: '100%',
                padding: showCompact ? '12px 8px' : '12px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                display: 'flex',
                flexDirection: showCompact ? 'column' : 'row',
                alignItems: showCompact ? 'center' : 'flex-start',
                gap: showCompact ? '4px' : '12px',
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isDisabled) {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? '#ffffff' : '#64748b',
                  }}
                />
              </div>

              {!showCompact && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isActive ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {mode.name}
                    </span>
                    {mode.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: isActive
                            ? 'rgba(255,255,255,0.25)'
                            : mode.badge === 'Recommended'
                              ? '#dcfce7'
                              : '#fef3c7',
                          color: isActive
                            ? '#ffffff'
                            : mode.badge === 'Recommended'
                              ? '#166534'
                              : '#92400e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {mode.badge}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: isActive ? 'rgba(255,255,255,0.8)' : '#64748b',
                      margin: 0,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {mode.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      {(!isCollapsed || isMobile) && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f1f5f9',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Each mode keeps its own chat history.
          </p>
        </div>
      )}
      </div>
    </>
  );
}
