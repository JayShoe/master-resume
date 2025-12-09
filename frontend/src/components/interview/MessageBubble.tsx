'use client';

import { useMemo } from 'react';
import { User, Check, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { marked } from 'marked';
import type { Message } from '@/lib/interview/types';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true,    // GitHub Flavored Markdown
});

// Helper to remove JSON blocks from content (handles nested braces)
function removeJsonBlocks(text: string): string {
  let result = '';
  let i = 0;

  while (i < text.length) {
    // Check if we're at the start of a JSON object or array
    if (text[i] === '{' || text[i] === '[') {
      const openChar = text[i];
      const closeChar = openChar === '{' ? '}' : ']';

      // Look ahead to see if this looks like JSON (has a quote soon after)
      const lookAhead = text.substring(i, i + 20);
      if (/^[\[{]\s*"/.test(lookAhead) || /^[\[{]\s*\{/.test(lookAhead)) {
        // Skip this JSON block by finding matching close brace
        let depth = 1;
        let j = i + 1;
        while (j < text.length && depth > 0) {
          if (text[j] === openChar) depth++;
          else if (text[j] === closeChar) depth--;
          j++;
        }
        // Skip past the JSON block
        i = j;
        continue;
      }
    }
    result += text[i];
    i++;
  }

  return result;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  profileImage?: string | null;
  firstName: string;
  wideMode?: boolean;
  hideCodeblocks?: boolean;
}

// Component to show generating/generated status instead of code blocks
function CodeBlockStatusIndicator({ isGenerating }: { isGenerating: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        backgroundColor: isGenerating ? '#fef3c7' : '#d1fae5',
        borderRadius: '8px',
        margin: '12px 0',
        border: `1px solid ${isGenerating ? '#fcd34d' : '#6ee7b7'}`,
      }}
    >
      {isGenerating ? (
        <>
          <Loader2
            size={18}
            style={{
              color: '#d97706',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#92400e' }}>
            Generating Content...
          </span>
        </>
      ) : (
        <>
          <CheckCircle2 size={18} style={{ color: '#059669' }} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#065f46' }}>
            Content Generated
          </span>
        </>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function MessageBubble({ message, isStreaming = false, profileImage, firstName, wideMode = false, hideCodeblocks = false }: MessageBubbleProps) {
  console.log('MessageBubble render, hideCodeblocks=', hideCodeblocks, 'role=', message.role);
  const isUser = message.role === 'user';

  // Check if content contains code blocks or JSON artifact
  const hasCodeBlock = useMemo(() => {
    if (!message.content) return false;
    // Check for markdown code blocks or raw JSON object/array
    return message.content.includes('```') ||
           /^\s*[\[{]/.test(message.content) ||
           /[\[{]\s*"/.test(message.content);
  }, [message.content]);

  // Parse markdown to HTML, optionally stripping code blocks and JSON artifacts
  const htmlContent = useMemo(() => {
    if (!message.content) return '';

    let content = message.content;

    let html = marked.parse(content) as string;

    // If hideCodeblocks is enabled, remove <pre> and <code> tags from the rendered HTML
    if (hideCodeblocks) {
      console.log('hideCodeblocks=true, hasCodeBlock=', message.content?.includes('{') || message.content?.includes('```'));
      console.log('BEFORE:', html.substring(0, 500));
      // Remove <pre>...</pre> blocks (including content)
      html = html.replace(/<pre[\s\S]*?<\/pre>/gi, '');
      // Remove standalone <code>...</code> that contain JSON-like content
      html = html.replace(/<code>[^<]*[{[\]}"'][^<]*<\/code>/gi, '');
      console.log('AFTER:', html.substring(0, 500));
    }

    return html;
  }, [message.content, hideCodeblocks]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: isUser ? '2px solid #3b82f6' : '1px solid #e2e8f0',
      }}
    >
      {/* Header with avatar and name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        {/* Avatar */}
        {isUser ? (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={20} style={{ color: 'white' }} />
          </div>
        ) : profileImage ? (
          <img
            src={profileImage}
            alt={firstName}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MessageSquare size={20} style={{ color: 'white' }} />
          </div>
        )}

        {/* Name and timestamp */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: isUser ? '#3b82f6' : '#1e293b' }}>
              {isUser ? 'You' : firstName}
            </span>
            {isUser && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  borderRadius: '8px',
                }}
              >
                Your Answer
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isUser && (
              <div style={{ display: 'flex', marginLeft: '4px' }}>
                <Check size={12} style={{ color: '#3b82f6' }} />
                <Check size={12} style={{ color: '#3b82f6', marginLeft: '-6px' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message content */}
      {isStreaming && !message.content ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'bounce 1s infinite',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'bounce 1s infinite 0.15s',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'bounce 1s infinite 0.3s',
            }}
          />
          <style>{`
            @keyframes bounce {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-8px); }
            }
          `}</style>
        </div>
      ) : (
        <div
          style={{
            padding: '16px',
            backgroundColor: isUser ? '#f8fafc' : '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            className={`chat-markdown ${hideCodeblocks ? 'hide-codeblocks' : ''}`}
            style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          {/* Show status indicator when hideCodeblocks is enabled and content has code blocks */}
          {hideCodeblocks && hasCodeBlock && (
            <CodeBlockStatusIndicator isGenerating={isStreaming} />
          )}
          {isStreaming && message.content && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '16px',
                backgroundColor: '#8b5cf6',
                marginLeft: '4px',
                borderRadius: '2px',
                animation: 'pulse 1s infinite',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
