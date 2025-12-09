'use client';

import { X, ChevronRight, Download, Copy, Check, Printer } from 'lucide-react';
import { useState, useCallback, ReactNode, useRef, useEffect } from 'react';

interface ArtifactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  title?: string;
  children: ReactNode;
  onDownload?: () => void;
  onCopy?: () => void;
  onPrint?: () => void;
}

export function ArtifactDrawer({
  isOpen,
  onClose,
  onToggle,
  title = 'Resume Preview',
  children,
  onDownload,
  onCopy,
  onPrint,
}: ArtifactDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopy = useCallback(() => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onCopy]);

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
      return;
    }

    // Default print behavior - print the content area
    if (!contentRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = contentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Georgia, "Times New Roman", serif;
              line-height: 1.5;
              color: #1e293b;
              padding: 20px 40px;
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            /* Remove any container styling from the resume artifact */
            body > div {
              background: none !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
            h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 20px 0 10px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; }
            h2 svg { margin-right: 8px; }
            h3 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
            p { margin: 8px 0; font-size: 13px; }
            ul { margin: 8px 0; padding-left: 20px; list-style-type: disc; }
            li { font-size: 13px; margin-bottom: 4px; }
            header { border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
            section { margin-bottom: 16px; }
            svg { display: none; } /* Hide icons in print */
            @media print {
              body { padding: 0; }
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, [onPrint, title]);

  // Collapsed tab that shows when drawer is closed (hidden on mobile)
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="hidden sm:flex"
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '100px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px 0 0 8px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          transition: 'width 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.width = '40px')}
        onMouseLeave={(e) => (e.currentTarget.style.width = '32px')}
        title="Open Resume Preview"
      >
        <ChevronRight
          size={20}
          style={{
            color: 'white',
            transform: 'rotate(180deg)',
          }}
        />
      </button>
    );
  }

  // Mobile: Full-screen overlay within parent container
  if (isMobile) {
    return (
      <div
        className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            {title}
          </h3>

          <div className="flex items-center gap-2">
            {/* Copy */}
            {onCopy && (
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-200"
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            )}

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-200"
              title="Print"
            >
              <Printer size={20} />
            </button>

            {/* Download */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-200"
                title="Download"
              >
                <Download size={20} />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-lg text-slate-500 hover:bg-red-100 hover:text-red-600 ml-2"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-auto p-4 bg-slate-100"
        >
          {children}
        </div>
      </div>
    );
  }

  // Desktop: Side panel
  return (
    <div
      style={{
        width: '50%',
        minWidth: '400px',
        height: '100%',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
            }}
          />
          {title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Copy */}
          {onCopy && (
            <button
              onClick={handleCopy}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: copied ? '#22c55e' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!copied) e.currentTarget.style.backgroundColor = '#e2e8f0';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          )}

          {/* Print */}
          <button
            onClick={handlePrint}
            style={{
              padding: '8px',
              borderRadius: '8px',
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
            title="Print resume"
          >
            <Printer size={18} />
          </button>

          {/* Download */}
          {onDownload && (
            <button
              onClick={onDownload}
              style={{
                padding: '8px',
                borderRadius: '8px',
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
              title="Download resume"
            >
              <Download size={18} />
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          backgroundColor: '#f1f5f9',
        }}
      >
        {children}
      </div>
    </div>
  );
}
