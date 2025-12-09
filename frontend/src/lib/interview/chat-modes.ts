/**
 * Chat mode definitions for the interview feature
 * Each mode represents a different way of interacting with the AI
 */

export type ChatModeId = 'mcp-tools' | 'mcp-preload' | 'resume-generator' | 'interview-practice' | 'content-builder' | 'interview-copilot';

export interface ChatMode {
  id: ChatModeId;
  name: string;
  description: string;
  icon: 'tool' | 'zap' | 'file-text' | 'mic' | 'plus-circle' | 'headphones';
  apiEndpoint: string;
  enabled: boolean;
  badge?: string;
}

export const CHAT_MODES: ChatMode[] = [
  {
    id: 'mcp-preload',
    name: 'Quick Chat',
    description: 'Fast responses with Directus data pre-loaded via MCP-compatible layer',
    icon: 'zap',
    apiEndpoint: '/api/interview/chat-preload',
    enabled: true,
    badge: 'Recommended',
  },
  {
    id: 'mcp-tools',
    name: 'Deep Dive',
    description: 'Uses Directus Remote MCP Server tools for dynamic data retrieval',
    icon: 'tool',
    apiEndpoint: '/api/interview/chat',
    enabled: true,
    badge: 'MCP Demo',
  },
  {
    id: 'resume-generator',
    name: 'Resume Builder',
    description: 'Generate tailored resumes for specific job descriptions',
    icon: 'file-text',
    apiEndpoint: '/api/interview/resume-gen',
    enabled: true,
    badge: 'New',
  },
  {
    id: 'interview-practice',
    name: 'Interview Practice',
    description: 'Practice answering interview questions with AI feedback',
    icon: 'mic',
    apiEndpoint: '/api/interview/practice',
    enabled: true,
    badge: 'New',
  },
  {
    id: 'interview-copilot',
    name: 'Interview Copilot',
    description: 'Live interview companion - get STAR-formatted notes in real-time',
    icon: 'headphones',
    apiEndpoint: '/api/interview/copilot',
    enabled: true,
    badge: 'Live',
  },
  {
    id: 'content-builder',
    name: 'Add Content',
    description: 'Add new experience, projects, skills, and accomplishments through conversation',
    icon: 'plus-circle',
    apiEndpoint: '/api/interview/content-builder',
    enabled: true,
    badge: 'New',
  },
];

export const DEFAULT_MODE: ChatModeId = 'mcp-preload';

export function getChatMode(id: ChatModeId): ChatMode | undefined {
  return CHAT_MODES.find((mode) => mode.id === id);
}

export function getEnabledModes(): ChatMode[] {
  return CHAT_MODES.filter((mode) => mode.enabled);
}
