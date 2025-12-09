'use client';

import { Briefcase, Target, Zap, TrendingUp, Link2, Lightbulb, Headphones, Clock } from 'lucide-react';

export interface CopilotOutline {
  title: string;
  company?: string;
  situation: string[];
  task: string[];
  action: string[];
  result: string[];
  relatedExperiences: string[];
  keywords: string[];
}

interface CopilotArtifactProps {
  outline: CopilotOutline | null;
  isLoading?: boolean;
  lastQuestion?: string;
}

/**
 * Parses a copilot response into structured STAR format
 */
export function parseCopilotResponse(content: string): CopilotOutline | null {
  if (!content || content.length < 20) return null;

  const outline: CopilotOutline = {
    title: '',
    company: undefined,
    situation: [],
    task: [],
    action: [],
    result: [],
    relatedExperiences: [],
    keywords: [],
  };

  // Extract title line (starts with pin emoji or **title**)
  const titleMatch = content.match(/(?:\u{1F4CC}|📌)\s*(.+?)(?:\n|$)/u) ||
                     content.match(/\*\*(.+?)\*\*\s*@\s*(.+?)(?:\n|$)/);
  if (titleMatch && titleMatch[1]) {
    const fullTitle = titleMatch[1].trim();
    // Try to split by @ for company
    const atParts = fullTitle.split('@').map(s => s.trim());
    const titlePart = atParts[0];
    const companyPart = atParts[1];
    if (atParts.length >= 2 && titlePart && companyPart) {
      outline.title = titlePart.replace(/\*\*/g, '').trim();
      outline.company = companyPart.replace(/\*\*/g, '').trim();
    } else {
      outline.title = fullTitle.replace(/\*\*/g, '').trim();
    }
  }

  // Helper to extract bullet points after a section marker
  const extractBullets = (text: string, marker: string): string[] => {
    // Look for the marker (e.g., "S:" or "S :" at start of line) followed by content
    // until the next section marker or emoji
    const regex = new RegExp(
      `^${marker}\\s*:\\s*(.+?)(?=^[STAR]\\s*:|🔗|💡|$)`,
      'ms'
    );
    const match = text.match(regex);
    if (!match || !match[1]) return [];

    const section = match[1];
    // Extract individual bullets - each line that starts with bullet markers
    const bullets = section
      .split(/\n/)
      .map(line => {
        // Remove leading bullet markers (-, *, •) and whitespace
        return line.replace(/^[\s\-\*•]+/, '').trim();
      })
      .filter(line => {
        // Filter out empty lines and lines that are just section markers
        if (line.length === 0) return false;
        // Don't filter out lines that happen to start with S, T, A, R
        // Only filter if it's exactly a section marker pattern like "S:" at start
        if (/^[STAR]\s*:/.test(line)) return false;
        return true;
      });

    return bullets;
  };

  // Extract STAR sections
  outline.situation = extractBullets(content, 'S');
  outline.task = extractBullets(content, 'T');
  outline.action = extractBullets(content, 'A');
  outline.result = extractBullets(content, 'R');

  // Extract related experiences (after link emoji)
  const relatedMatch = content.match(/(?:\u{1F517}|🔗)\s*(?:Also relevant:?)?\s*(.+?)(?:\n|$)/u);
  if (relatedMatch && relatedMatch[1]) {
    outline.relatedExperiences = relatedMatch[1]
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Extract keywords (after lightbulb emoji)
  const keywordsMatch = content.match(/(?:\u{1F4A1}|💡)\s*(?:Keywords?:?)?\s*(.+?)(?:\n|$)/u);
  if (keywordsMatch && keywordsMatch[1]) {
    outline.keywords = keywordsMatch[1]
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Only return if we have at least some content
  if (outline.title || outline.situation.length || outline.action.length || outline.result.length) {
    return outline;
  }

  return null;
}

function StarSection({
  letter,
  label,
  items,
  color,
  icon: Icon
}: {
  letter: string;
  label: string;
  items: string[];
  color: string;
  icon: typeof Target;
}) {
  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color }}>{letter}</span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {label}
        </span>
      </div>
      <div style={{ paddingLeft: '36px' }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              fontSize: '14px',
              color: '#1e293b',
              lineHeight: 1.6,
              marginBottom: '6px',
              paddingLeft: '12px',
              borderLeft: `2px solid ${color}30`,
            }}
            dangerouslySetInnerHTML={{
              __html: item.replace(/\*\*(.+?)\*\*/g, '<strong style="color: ' + color + '">$1</strong>')
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CopilotArtifact({ outline, isLoading, lastQuestion }: CopilotArtifactProps) {
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 1.5s infinite',
            }}
          >
            <Clock size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Finding Best Match...
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Searching experience for STAR response
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['S', 'T', 'A', 'R'].map((letter) => (
            <div key={letter} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>{letter}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: '24px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.98); }
          }
          @keyframes shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (!outline) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fee2e2, #fed7aa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Headphones size={28} style={{ color: '#ef4444' }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
          Answer Outline
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
          Paste an interview question and I'll surface relevant experience in STAR format for quick reference.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Card with Title */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Briefcase size={22} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 4px 0',
              lineHeight: 1.3,
            }}>
              {outline.title || 'Experience Match'}
            </h3>
            {outline.company && (
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                @ {outline.company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* STAR Content */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <StarSection letter="S" label="Situation" items={outline.situation} color="#3b82f6" icon={Target} />
        <StarSection letter="T" label="Task" items={outline.task} color="#8b5cf6" icon={Target} />
        <StarSection letter="A" label="Action" items={outline.action} color="#10b981" icon={Zap} />
        <StarSection letter="R" label="Result" items={outline.result} color="#f59e0b" icon={TrendingUp} />
      </div>

      {/* Related Experiences */}
      {outline.relatedExperiences.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Link2 size={16} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Also Relevant
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {outline.relatedExperiences.map((exp, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  padding: '6px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {outline.keywords.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Lightbulb size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Keywords to Use
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {outline.keywords.map((keyword, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#d97706',
                  padding: '6px 12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
