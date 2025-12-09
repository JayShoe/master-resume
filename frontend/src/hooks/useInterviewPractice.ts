'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, InterviewFeedback, InterviewQuestion, InterviewPracticeStreamEvent } from '@/lib/interview/types';

interface UseInterviewPracticeOptions {
  apiEndpoint?: string;
  persistKey?: string;
}

interface UseInterviewPracticeReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  feedback: InterviewFeedback | null;
  currentQuestion: InterviewQuestion | null;
  questions: InterviewQuestion[];
  generatedQuestions: InterviewQuestion[];
  jobDescription: string | null;
  isAnalyzingAnswer: boolean;
  isGeneratingQuestions: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  selectQuestion: (question: InterviewQuestion) => void;
  requestNewQuestion: (category?: string) => Promise<void>;
  clearFeedback: () => void;
  generateQuestionsFromJD: (jobDescription: string) => Promise<void>;
  clearJobDescription: () => void;
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

export function useInterviewPractice({
  apiEndpoint = '/api/interview/practice',
  persistKey = 'interview-practice',
}: UseInterviewPracticeOptions = {}): UseInterviewPracticeReturn {
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
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(() =>
    loadFromStorage<InterviewFeedback>(`${persistKey}-feedback`)
  );
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(() =>
    loadFromStorage<InterviewQuestion>(`${persistKey}-currentQuestion`)
  );
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>(() =>
    loadFromStorage<InterviewQuestion[]>(`${persistKey}-generatedQuestions`) || []
  );
  const [jobDescription, setJobDescription] = useState<string | null>(() =>
    loadFromStorage<string>(`${persistKey}-jobDescription`, (v) => v)
  );
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialMount = useRef(true);

  // Fetch available questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions || []);
        }
      } catch {
        console.error('Failed to fetch interview questions');
      }
    }
    fetchQuestions();
  }, [apiEndpoint]);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(`${persistKey}-messages`, JSON.stringify(messages));
  }, [messages, persistKey]);

  // Persist feedback to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (feedback) {
      localStorage.setItem(`${persistKey}-feedback`, JSON.stringify(feedback));
    } else {
      localStorage.removeItem(`${persistKey}-feedback`);
    }
  }, [feedback, persistKey]);

  // Persist currentQuestion to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentQuestion) {
      localStorage.setItem(`${persistKey}-currentQuestion`, JSON.stringify(currentQuestion));
    } else {
      localStorage.removeItem(`${persistKey}-currentQuestion`);
    }
  }, [currentQuestion, persistKey]);

  // Persist generatedQuestions to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (generatedQuestions.length > 0) {
      localStorage.setItem(`${persistKey}-generatedQuestions`, JSON.stringify(generatedQuestions));
    } else {
      localStorage.removeItem(`${persistKey}-generatedQuestions`);
    }
  }, [generatedQuestions, persistKey]);

  // Persist jobDescription to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (jobDescription) {
      localStorage.setItem(`${persistKey}-jobDescription`, jobDescription);
    } else {
      localStorage.removeItem(`${persistKey}-jobDescription`);
    }
  }, [jobDescription, persistKey]);

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
    setIsAnalyzingAnswer(true);

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
          questionId: currentQuestion?.id,
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
              const event: InterviewPracticeStreamEvent = JSON.parse(data);

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

                case 'feedback_update':
                  setIsAnalyzingAnswer(true);
                  if (event.feedback) {
                    setFeedback(event.feedback);
                  }
                  break;

                case 'feedback_complete':
                  setIsAnalyzingAnswer(false);
                  if (event.feedback) {
                    setFeedback(event.feedback);
                  }
                  break;

                case 'question':
                  if (event.question) {
                    setCurrentQuestion(event.question);
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
      setIsAnalyzingAnswer(false);
    }
  }, [apiEndpoint, messages, currentQuestion]);

  const selectQuestion = useCallback((question: InterviewQuestion) => {
    setCurrentQuestion(question);
    setFeedback(null);

    // Reset messages to start fresh with new question (prevents accumulating context/tokens)
    const questionMessage: Message = {
      id: `question-${Date.now()}`,
      role: 'assistant',
      content: `**Interview Question** (${question.category}, ${question.difficulty})\n\n${question.question}${question.tips ? `\n\n*Tips:*\n${question.tips.map((t) => `- ${t}`).join('\n')}` : ''}`,
      timestamp: new Date(),
    };
    setMessages([questionMessage]);
  }, []);

  const requestNewQuestion = useCallback(async (category?: string) => {
    // Filter questions by category if provided
    const availableQuestions = category
      ? questions.filter((q) => q.category === category)
      : questions;

    if (availableQuestions.length === 0) {
      // Request from AI if no questions available
      await sendMessage(category
        ? `Give me a new ${category} interview question to practice.`
        : 'Give me a random interview question to practice.');
      return;
    }

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const randomQuestion = availableQuestions[randomIndex];
    if (randomQuestion) {
      selectQuestion(randomQuestion);
    }
  }, [questions, selectQuestion, sendMessage]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setFeedback(null);
    setCurrentQuestion(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-messages`);
      localStorage.removeItem(`${persistKey}-feedback`);
      localStorage.removeItem(`${persistKey}-currentQuestion`);
    }
  }, [persistKey]);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-feedback`);
    }
  }, [persistKey]);

  const generateQuestionsFromJD = useCallback(async (jd: string) => {
    if (!jd.trim()) return;

    setIsGeneratingQuestions(true);
    setError(null);
    setJobDescription(jd);

    try {
      const response = await fetch(`${apiEndpoint}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(errorMessage);
    } finally {
      setIsGeneratingQuestions(false);
    }
  }, [apiEndpoint]);

  const clearJobDescription = useCallback(() => {
    setJobDescription(null);
    setGeneratedQuestions([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${persistKey}-jobDescription`);
      localStorage.removeItem(`${persistKey}-generatedQuestions`);
    }
  }, [persistKey]);

  return {
    messages,
    isLoading,
    error,
    feedback,
    currentQuestion,
    questions,
    generatedQuestions,
    jobDescription,
    isAnalyzingAnswer,
    isGeneratingQuestions,
    sendMessage,
    clearChat,
    selectQuestion,
    requestNewQuestion,
    clearFeedback,
    generateQuestionsFromJD,
    clearJobDescription,
  };
}
