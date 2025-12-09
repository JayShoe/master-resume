'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { FileText, ChevronRight } from 'lucide-react';
import type { Message, InterviewFeedback } from '@/lib/interview/types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  profileImage?: string | null;
  firstName: string;
  wideMode?: boolean;
  hideCodeblocks?: boolean;
  feedback?: InterviewFeedback | null;
  onViewFeedback?: () => void;
}

export function MessageList({ messages, isLoading, profileImage, firstName, wideMode = false, hideCodeblocks = false, feedback, onViewFeedback }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const prevMessageCount = useRef(messages.length);
  const userScrolledRef = useRef(false);
  const lastScrollTime = useRef(0);

  // Check if user has scrolled up from bottom
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Consider "at bottom" if within 150px of the bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;

    // Track when user manually scrolls (not programmatic)
    const now = Date.now();
    if (now - lastScrollTime.current > 50) {
      // This is likely a user scroll, not programmatic
      userScrolledRef.current = !isAtBottom;
      setIsUserScrolledUp(!isAtBottom);
    }
  }, []);

  // Auto-scroll to bottom only when:
  // 1. A new message is added
  // 2. User hasn't scrolled up manually during streaming
  useEffect(() => {
    if (!containerRef.current) return;

    // New message added - scroll to bottom and reset user scroll state
    if (messages.length > prevMessageCount.current) {
      lastScrollTime.current = Date.now();
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      userScrolledRef.current = false;
      setIsUserScrolledUp(false);
    } else if (!userScrolledRef.current && !isUserScrolledUp) {
      // Streaming update - only scroll if user hasn't manually scrolled up
      lastScrollTime.current = Date.now();
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    prevMessageCount.current = messages.length;
  }, [messages, isUserScrolledUp]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
      }}
    >
      {messages.map((message, index) => {
        const isLastAssistant =
          message.role === 'assistant' && index === messages.length - 1;
        const isStreaming = isLoading && isLastAssistant;
        // Show feedback button after last assistant message when feedback is available and not streaming
        const showFeedbackButton = isLastAssistant && !isLoading && feedback && onViewFeedback;

        return (
          <div key={message.id}>
            <MessageBubble
              message={message}
              isStreaming={isStreaming}
              profileImage={profileImage}
              firstName={firstName}
              wideMode={wideMode}
              hideCodeblocks={hideCodeblocks}
            />
            {showFeedbackButton && (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  onClick={onViewFeedback}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#f5f3ff',
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                    color: '#7c3aed',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ede9fe';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.15)';
                  }}
                >
                  <FileText size={18} />
                  View Detailed Feedback
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
