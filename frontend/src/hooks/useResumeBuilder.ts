'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, GeneratedResume, ResumeStreamEvent } from '@/lib/interview/types';

interface UseResumeBuilderOptions {
  apiEndpoint?: string;
  persistKey?: string;
}

interface UseResumeBuilderReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  resume: GeneratedResume | null;
  isGeneratingResume: boolean;
  targetRole: string | null;
  targetCompany: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  clearResume: () => void;
}

// Helper to load initial state from localStorage
function loadFromStorage<T>(key: string, parser?: (val: string) => T): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return parser ? parser(saved) : JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function useResumeBuilder({
  apiEndpoint = '/api/interview/resume-gen',
  persistKey = 'resume-builder',
}: UseResumeBuilderOptions = {}): UseResumeBuilderReturn {
  // Initialize state from localStorage to avoid hydration issues
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadFromStorage<Message[]>(`${persistKey}-messages`);
    if (saved) {
      return saved.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<GeneratedResume | null>(() =>
    loadFromStorage<GeneratedResume>(`${persistKey}-resume`)
  );
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [targetRole, setTargetRole] = useState<string | null>(() =>
    loadFromStorage<string>(`${persistKey}-targetRole`, (v) => v)
  );
  const [targetCompany, setTargetCompany] = useState<string | null>(() =>
    loadFromStorage<string>(`${persistKey}-targetCompany`, (v) => v)
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialMount = useRef(true);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip the initial mount to avoid overwriting with potentially stale state during hydration
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(`${persistKey}-messages`, JSON.stringify(messages));
  }, [messages, persistKey]);

  // Persist resume to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (resume) {
      localStorage.setItem(`${persistKey}-resume`, JSON.stringify(resume));
    } else {
      localStorage.removeItem(`${persistKey}-resume`);
    }
  }, [resume, persistKey]);

  // Persist targetRole to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (targetRole) {
      localStorage.setItem(`${persistKey}-targetRole`, targetRole);
    } else {
      localStorage.removeItem(`${persistKey}-targetRole`);
    }
  }, [targetRole, persistKey]);

  // Persist targetCompany to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (targetCompany) {
      localStorage.setItem(`${persistKey}-targetCompany`, targetCompany);
    } else {
      localStorage.removeItem(`${persistKey}-targetCompany`);
    }
  }, [targetCompany, persistKey]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create placeholder for assistant message
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event: ResumeStreamEvent = JSON.parse(data);

              switch (event.type) {
                case 'text':
                  if (event.content) {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMessageId
                          ? { ...m, content: m.content + event.content }
                          : m
                      )
                    );
                  }
                  break;

                case 'resume_update':
                  setIsGeneratingResume(true);
                  if (event.resume) {
                    setResume(event.resume);
                  }
                  break;

                case 'resume_complete':
                  setIsGeneratingResume(false);
                  if (event.resume) {
                    setResume(event.resume);
                  }
                  break;

                case 'target_info':
                  // Custom event for extracting job info
                  if (event.targetRole) {
                    setTargetRole(event.targetRole);
                  }
                  if (event.targetCompany) {
                    setTargetCompany(event.targetCompany);
                  }
                  break;

                case 'error':
                  setError(event.message || 'An error occurred');
                  break;

                case 'done':
                  break;
              }
            } catch {
              // Ignore parse errors for malformed JSON
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      setIsGeneratingResume(false);
    }
  }, [apiEndpoint, messages]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setResume(null);
    setTargetRole(null);
    setTargetCompany(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-messages`);
      localStorage.removeItem(`${persistKey}-resume`);
      localStorage.removeItem(`${persistKey}-targetRole`);
      localStorage.removeItem(`${persistKey}-targetCompany`);
    }
  }, [persistKey]);

  const clearResume = useCallback(() => {
    setResume(null);
    setTargetRole(null);
    setTargetCompany(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-resume`);
      localStorage.removeItem(`${persistKey}-targetRole`);
      localStorage.removeItem(`${persistKey}-targetCompany`);
    }
  }, [persistKey]);

  return {
    messages,
    isLoading,
    error,
    resume,
    isGeneratingResume,
    targetRole,
    targetCompany,
    sendMessage,
    clearChat,
    clearResume,
  };
}
