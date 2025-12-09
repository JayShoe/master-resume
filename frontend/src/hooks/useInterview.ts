'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, UseInterviewReturn } from '@/lib/interview/types';

interface UseInterviewOptions {
  apiEndpoint?: string;
  persistKey?: string; // Key for localStorage persistence
}

// Serializable message format for storage
interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string
}

/**
 * Custom hook for managing interview chat state and API communication
 * Supports localStorage persistence for maintaining chat across navigation
 */
export function useInterview(options: UseInterviewOptions = {}): UseInterviewReturn {
  const { apiEndpoint = '/api/interview/chat', persistKey } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentEndpointRef = useRef(apiEndpoint);
  const currentPersistKeyRef = useRef(persistKey);

  // Load messages from localStorage when persistKey changes
  useEffect(() => {
    // If persistKey changed, load messages for the new key
    if (persistKey !== currentPersistKeyRef.current) {
      currentPersistKeyRef.current = persistKey;

      // Cancel any in-flight request when switching
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setIsLoading(false);
      setError(null);
    }

    if (!persistKey) {
      setMessages([]);
      return;
    }

    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const storedMessages: StoredMessage[] = JSON.parse(stored);
        const hydratedMessages: Message[] = storedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(hydratedMessages);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage:', e);
      setMessages([]);
    }
  }, [persistKey]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (!persistKey) return;

    try {
      const storedMessages: StoredMessage[] = messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));
      localStorage.setItem(persistKey, JSON.stringify(storedMessages));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage:', e);
    }
  }, [messages, persistKey]);

  /**
   * Generates a unique message ID
   */
  const generateId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  /**
   * Sends a message and streams the response
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Create placeholder for assistant response
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Prepare messages for API (without IDs and timestamps)
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Update endpoint ref if it changed
      currentEndpointRef.current = apiEndpoint;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Process SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete events from buffer
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                // Append text to assistant message
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  if (newMessages[lastIndex]?.role === 'assistant') {
                    newMessages[lastIndex] = {
                      ...newMessages[lastIndex],
                      content: newMessages[lastIndex].content + data.content,
                    };
                  }
                  return newMessages;
                });
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
              // 'done' type just means stream is complete
            } catch (parseError) {
              // Ignore JSON parse errors for incomplete data
              if (!(parseError instanceof SyntaxError)) {
                throw parseError;
              }
            }
          }
        }
      }
    } catch (err) {
      // Handle abort
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);

      // Update assistant message with error indicator
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex]?.role === 'assistant' && !newMessages[lastIndex].content) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: 'Sorry, I encountered an error. Please try again.',
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, apiEndpoint]);

  /**
   * Clears the chat history (also clears localStorage if persistKey is set)
   */
  const clearChat = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);

    // Clear from localStorage
    if (persistKey) {
      try {
        localStorage.removeItem(persistKey);
      } catch (e) {
        console.warn('Failed to clear chat history from localStorage:', e);
      }
    }
  }, [persistKey]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
