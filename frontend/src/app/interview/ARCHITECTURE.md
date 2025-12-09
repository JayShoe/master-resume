# Interview Jay - Architecture Design

## Overview

"Interview Jay" is an AI-powered conversational interface that allows recruiters and visitors to ask questions about Jay's background, accomplishments, skills, and projects. The system uses Claude API with Directus MCP integration to provide grounded, factual responses based on real data from the master resume CMS.

## Core Principles

1. **Data Grounding**: All responses must be based on actual data from Directus
2. **Interview Style**: Responses should be professional, confident, and interview-appropriate
3. **No Hallucination**: Claude should only cite facts that exist in the database
4. **Read-Only (Public)**: Public mode is read-only; admin mode can write to Directus

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │  InterviewPage  │    │   ChatWindow    │    │  MessageList    │ │
│  │   (page.tsx)    │───▶│   Component     │───▶│   Component     │ │
│  └─────────────────┘    └────────┬────────┘    └─────────────────┘ │
│                                  │                                  │
│                                  ▼                                  │
│                         ┌─────────────────┐                        │
│                         │  useInterview   │                        │
│                         │     Hook        │                        │
│                         └────────┬────────┘                        │
│                                  │                                  │
└──────────────────────────────────┼──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API Route: /api/interview/chat                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │  Request        │    │  Context        │    │  Claude API     │ │
│  │  Validation     │───▶│  Builder        │───▶│  Integration    │ │
│  └─────────────────┘    └────────┬────────┘    └────────┬────────┘ │
│                                  │                      │           │
│                                  ▼                      │           │
│                         ┌─────────────────┐             │           │
│                         │  Directus       │             │           │
│                         │  Data Fetcher   │◀────────────┘           │
│                         └─────────────────┘                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         External Services                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐│
│  │      Claude API         │    │        Directus CMS             ││
│  │  (Anthropic Messages)   │    │   (Master Resume Data)          ││
│  │                         │    │                                 ││
│  │  - System prompt        │    │  Collections:                   ││
│  │  - Conversation history │    │  - identity                     ││
│  │  - Streaming response   │    │  - positions + companies        ││
│  └─────────────────────────┘    │  - accomplishments              ││
│                                 │  - skills                       ││
│                                 │  - technologies                 ││
│                                 │  - projects                     ││
│                                 │  - education                    ││
│                                 │  - certifications               ││
│                                 │  - professional_summaries       ││
│                                 └─────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
frontend/src/
├── app/
│   ├── api/
│   │   └── interview/
│   │       ├── chat/
│   │       │   └── route.ts          # Main chat endpoint (streaming)
│   │       └── context/
│   │           └── route.ts          # Fetch resume context for system prompt
│   │
│   └── interview/
│       ├── page.tsx                  # Main interview page (server component wrapper)
│       ├── InterviewClient.tsx       # Client component with chat UI
│       └── ARCHITECTURE.md           # This file
│
├── components/
│   └── interview/
│       ├── ChatWindow.tsx            # Main chat container
│       ├── MessageList.tsx           # Renders conversation messages
│       ├── MessageBubble.tsx         # Individual message styling
│       ├── ChatInput.tsx             # User input with send button
│       ├── TypingIndicator.tsx       # Shows when AI is responding
│       ├── SuggestedQuestions.tsx    # Starter questions for users
│       └── InterviewHeader.tsx       # Header with profile info
│
├── hooks/
│   └── useInterview.ts               # Custom hook for chat state management
│
├── lib/
│   └── interview/
│       ├── context-builder.ts        # Builds system prompt from Directus data
│       ├── prompt-templates.ts       # System prompt templates
│       └── types.ts                  # Interview-specific types
│
└── types/
    └── interview.ts                  # TypeScript interfaces for interview feature
```

---

## API Routes

### 1. POST `/api/interview/chat`

Main chat endpoint that handles conversation with Claude.

**Request Body:**
```typescript
interface ChatRequest {
  messages: Message[];           // Conversation history
  mode?: 'recruiter' | 'admin'; // User mode (default: recruiter)
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
```

**Response:** Server-Sent Events (SSE) stream

```typescript
// Stream events
data: {"type": "text", "content": "Hello..."}
data: {"type": "text", "content": " I'm Jay..."}
data: {"type": "done"}
data: {"type": "error", "message": "..."}
```

**Implementation Flow:**
1. Validate request body
2. Fetch resume context from Directus (cached)
3. Build system prompt with context
4. Call Claude API with streaming
5. Stream response chunks to client

### 2. GET `/api/interview/context`

Fetches and caches resume context for the system prompt.

**Response:**
```typescript
interface ResumeContext {
  identity: Identity;
  positions: Position[];
  accomplishments: Accomplishment[];
  skills: Skill[];
  technologies: Technology[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  professionalSummaries: ProfessionalSummary[];
}
```

---

## System Prompt Design

The system prompt grounds Claude in the user's actual data:

```typescript
const buildSystemPrompt = (context: ResumeContext): string => `
You are acting as the portfolio owner in an interview setting. A recruiter or hiring manager is asking you questions about your background, experience, and qualifications.

## Your Identity
- Name: ${context.identity.first_name} ${context.identity.last_name}
- Location: ${context.identity.location}
- Email: ${context.identity.email}
- LinkedIn: ${context.identity.linkedin_url}
- GitHub: ${context.identity.github_url}

## Professional Summary
${context.professionalSummaries.map(s => s.content).join('\n\n')}

## Work Experience
${formatPositions(context.positions)}

## Key Accomplishments
${formatAccomplishments(context.accomplishments)}

## Skills
${formatSkills(context.skills)}

## Technologies
${formatTechnologies(context.technologies)}

## Projects
${formatProjects(context.projects)}

## Education
${formatEducation(context.education)}

## Certifications
${formatCertifications(context.certifications)}

## Interview Guidelines
1. Answer as Jay in first person ("I", "my", "me")
2. Be confident but not arrogant
3. Use specific examples and metrics from the data above
4. If asked about something not in your data, politely redirect
5. Keep responses concise but thorough (2-4 paragraphs max)
6. Highlight relevant accomplishments when discussing experience
7. Connect skills to concrete examples from projects/positions
8. Be enthusiastic about technical topics and problem-solving

## Response Format
- Use natural, conversational language
- Include specific metrics and outcomes when available
- Reference actual project names, company names, and technologies
- Never make up information not present in the data above
`;
```

---

## Component Design

### ChatWindow.tsx
Main container managing layout and scroll behavior.

```typescript
interface ChatWindowProps {
  identity: Identity;
}
```

### MessageList.tsx
Renders conversation with proper styling for user/assistant.

```typescript
interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}
```

### ChatInput.tsx
Text input with send button and keyboard handling.

```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}
```

### SuggestedQuestions.tsx
Starter questions to help users begin the conversation.

```typescript
const suggestedQuestions = [
  "Tell me about your most impactful project",
  "What technologies are you most experienced with?",
  "Describe a challenging problem you solved",
  "What's your leadership experience?",
  "Walk me through your career progression",
];
```

---

## State Management

### useInterview Hook

```typescript
interface UseInterviewReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const useInterview = (): UseInterviewReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    // Add user message
    // Call API with streaming
    // Append assistant response chunks
  };

  return { messages, isLoading, error, sendMessage, clearChat };
};
```

---

## Data Flow

### 1. Initial Load
```
User visits /interview
  → Server fetches identity from Directus
  → Renders page with profile header
  → Client component hydrates with empty chat
```

### 2. Sending a Message
```
User types message and clicks send
  → useInterview.sendMessage(content)
  → POST /api/interview/chat with messages array
  → API fetches resume context (cached)
  → API builds system prompt
  → API calls Claude with streaming
  → SSE chunks stream back to client
  → Hook updates messages state progressively
  → UI renders streaming response
```

### 3. Context Caching
```
First request:
  → Fetch all data from Directus
  → Cache in memory (5 min TTL) or use Next.js cache

Subsequent requests:
  → Return cached context
  → Background refresh if stale
```

---

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on chat endpoint
2. **Input Validation**: Sanitize user messages before sending to Claude
3. **Token Management**: Use environment variables for API keys
4. **Mode Restriction**: Admin mode requires authentication
5. **Content Filtering**: Filter inappropriate questions/responses

---

## Environment Variables

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Directus (existing)
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_token_here

# Interview Feature
INTERVIEW_RATE_LIMIT=10        # Requests per minute
INTERVIEW_CONTEXT_CACHE_TTL=300 # 5 minutes
```

---

## Future Enhancements (Admin Mode)

1. **Interview Practice**: Practice answering common questions
2. **Resume Generation**: Generate tailored resumes for specific jobs
3. **Data Updates**: Add/update accomplishments via chat
4. **Analytics**: Track common questions and improve responses
5. **Voice Mode**: Speech-to-text and text-to-speech support

---

## Implementation Priority

1. **Phase 1**: Basic chat with streaming (MVP)
   - API route with Claude integration
   - Simple chat UI
   - System prompt with Directus context

2. **Phase 2**: Enhanced UI
   - Suggested questions
   - Better message formatting
   - Loading states and animations

3. **Phase 3**: Optimization
   - Context caching
   - Rate limiting
   - Error handling improvements

4. **Phase 4**: Admin Mode
   - Authentication
   - Write operations
   - Practice mode
