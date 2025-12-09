'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, PendingContent, ContentBuilderStreamEvent, ContentType } from '@/lib/interview/types';

interface UseContentBuilderOptions {
  apiEndpoint?: string;
  persistKey?: string;
}

interface UseContentBuilderReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  pendingContent: PendingContent[];
  savedContent: PendingContent[];
  currentContentType: ContentType | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  saveContent: (contentId: string) => Promise<void>;
  discardContent: (contentId: string) => void;
  clearAllPending: () => void;
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

export function useContentBuilder({
  apiEndpoint = '/api/interview/content-builder',
  persistKey = 'content-builder',
}: UseContentBuilderOptions = {}): UseContentBuilderReturn {
  // Initialize state from localStorage
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
  const [pendingContent, setPendingContent] = useState<PendingContent[]>(() => {
    const saved = loadFromStorage<PendingContent[]>(`${persistKey}-pending`);
    if (saved) {
      return saved.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
    return [];
  });
  const [savedContent, setSavedContent] = useState<PendingContent[]>(() => {
    const saved = loadFromStorage<PendingContent[]>(`${persistKey}-saved`);
    if (saved) {
      return saved.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
    return [];
  });
  const [currentContentType, setCurrentContentType] = useState<ContentType | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialMount = useRef(true);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(`${persistKey}-messages`, JSON.stringify(messages));
  }, [messages, persistKey]);

  // Persist pending content to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pendingContent.length > 0) {
      localStorage.setItem(`${persistKey}-pending`, JSON.stringify(pendingContent));
    } else {
      localStorage.removeItem(`${persistKey}-pending`);
    }
  }, [pendingContent, persistKey]);

  // Persist saved content to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (savedContent.length > 0) {
      localStorage.setItem(`${persistKey}-saved`, JSON.stringify(savedContent));
    } else {
      localStorage.removeItem(`${persistKey}-saved`);
    }
  }, [savedContent, persistKey]);

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
              const event: ContentBuilderStreamEvent = JSON.parse(data);

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

                case 'content_draft':
                case 'content_ready':
                  if (event.pendingContent) {
                    const newContent: PendingContent = {
                      ...event.pendingContent,
                      createdAt: new Date(event.pendingContent.createdAt),
                    };
                    setPendingContent((prev) => {
                      const existing = prev.findIndex((c) => c.id === newContent.id);
                      if (existing >= 0) {
                        const updated = [...prev];
                        updated[existing] = newContent;
                        return updated;
                      }
                      return [...prev, newContent];
                    });
                    setCurrentContentType(newContent.type);
                  }
                  break;

                case 'content_saved':
                  if (event.pendingContent) {
                    const savedItem: PendingContent = {
                      ...event.pendingContent,
                      status: 'saved',
                      createdAt: new Date(event.pendingContent.createdAt),
                    };
                    // Move from pending to saved
                    setPendingContent((prev) => prev.filter((c) => c.id !== savedItem.id));
                    setSavedContent((prev) => [...prev, savedItem]);
                  }
                  break;

                case 'duplicate_warning':
                  if (event.duplicateInfo) {
                    setPendingContent((prev) =>
                      prev.map((c) =>
                        c.id === event.duplicateInfo!.contentId
                          ? {
                              ...c,
                              duplicateWarning: `Similar to existing: ${event.duplicateInfo!.existingItem} (${event.duplicateInfo!.similarity})`,
                            }
                          : c
                      )
                    );
                  }
                  break;

                case 'clarification_needed':
                  if (event.clarification) {
                    setPendingContent((prev) =>
                      prev.map((c) =>
                        c.id === event.clarification!.contentId
                          ? {
                              ...c,
                              clarificationNeeded: event.clarification!.questions,
                            }
                          : c
                      )
                    );
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
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, messages]);

  const saveContent = useCallback(async (contentId: string) => {
    const content = pendingContent.find((c) => c.id === contentId);
    if (!content || content.status !== 'ready') return;

    try {
      const response = await fetch(`${apiEndpoint}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save content: ${response.status}`);
      }

      const result = await response.json();

      // Move to saved
      setPendingContent((prev) => prev.filter((c) => c.id !== contentId));
      setSavedContent((prev) => [
        ...prev,
        { ...content, status: 'saved', data: { ...content.data, directusId: result.id } },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save';
      setError(errorMessage);
      setPendingContent((prev) =>
        prev.map((c) => (c.id === contentId ? { ...c, status: 'error' } : c))
      );
    }
  }, [apiEndpoint, pendingContent]);

  const discardContent = useCallback((contentId: string) => {
    setPendingContent((prev) => prev.filter((c) => c.id !== contentId));
  }, []);

  const clearAllPending = useCallback(() => {
    setPendingContent([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-pending`);
    }
  }, [persistKey]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setPendingContent([]);
    setSavedContent([]);
    setCurrentContentType(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-messages`);
      localStorage.removeItem(`${persistKey}-pending`);
      localStorage.removeItem(`${persistKey}-saved`);
    }
  }, [persistKey]);

  return {
    messages,
    isLoading,
    error,
    pendingContent,
    savedContent,
    currentContentType,
    sendMessage,
    clearChat,
    saveContent,
    discardContent,
    clearAllPending,
  };
}
