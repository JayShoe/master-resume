import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { loadResumeDataWithSources, ResumeDataWithSources } from '@/lib/interview/resume-data-loader';
import type { ChatRequest, PendingContent, ContentType } from '@/lib/interview/types';

// This route requires runtime server access (Anthropic API)
export const dynamic = 'force-dynamic';

// Cache the resume data to avoid fetching on every request
let cachedResumeData: ResumeDataWithSources | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getResumeData(): Promise<ResumeDataWithSources> {
  const now = Date.now();
  if (!cachedResumeData || now - cacheTimestamp > CACHE_DURATION) {
    cachedResumeData = await loadResumeDataWithSources();
    cacheTimestamp = now;
  }
  return cachedResumeData;
}

function buildContentBuilderPrompt(data: ResumeDataWithSources): string {
  const { identity } = data;

  // Format existing data for context
  const existingSkills = data.skills.map((s) => s.name).join(', ');
  const existingTechnologies = data.technologies.map((t) => t.name).join(', ');

  return `You are a quick-add assistant for ${identity.first_name}'s resume database. Your job is to IMMEDIATELY add content when the user tells you something - no unnecessary questions.

## CRITICAL: Be Fast and Direct

When someone tells you something like:
- "I know Python" → Immediately add Python as a technology
- "Add React" → Immediately add React as a technology
- "I led a team of 5" → Add as an accomplishment
- "AWS certified" → Add as a certification
- "I worked at Google" → Add as a position (ask only start date if needed)

DO NOT ask unnecessary clarifying questions. Make smart defaults:
- Proficiency: If not specified, use 3 (Intermediate) for skills/tech
- Category: Infer from context (React=framework, Python=language, Leadership=skill)
- Dates: Use approximate dates or leave blank if not mentioned
- Is Current: Assume true for skills/tech unless past tense is used

## Existing Content (for reference)
Skills: ${existingSkills || 'None'}
Technologies: ${existingTechnologies || 'None'}

## Quick Add Rules

1. **Single items** - Add immediately with smart defaults
2. **Multiple items** - Add all at once ("I know Python, React, and AWS" → add all 3)
3. **Vague items** - Make your best guess, don't interrogate the user

## Output Format

ALWAYS output JSON immediately after your brief confirmation:

\`\`\`json
{
  "action": "content_ready",
  "content": {
    "id": "generated-id",
    "type": "skill|technology|accomplishment|position|project|education|certification|company",
    "status": "ready",
    "data": { ... }
  }
}
\`\`\`

## Type Detection

- Programming languages, frameworks, tools, databases, cloud → **technology**
- Soft skills, methodologies, processes → **skill**
- "I did X", achievements, results → **accomplishment**
- Job titles, "worked at" → **position**
- Degrees, schools → **education**
- Certifications, licenses → **certification**

## Data Schemas (use smart defaults for missing fields)

**Technology**: \`{ name, category: "language|framework|tool|platform|database|cloud|library", proficiency_level: 1-5, years_experience, is_current: true }\`

**Skill**: \`{ name, category: "technical|leadership|communication|design|business|project_management|analytics", proficiency_level: 1-5, is_core_skill: false }\`

**Accomplishment**: \`{ primary_title, primary_description, accomplishment_type: "achievement|project|initiative|process_improvement", is_featured: false }\`

**Position**: \`{ primary_title, company_name, is_current, employment_type: "full_time" }\`

**Certification**: \`{ name, issuing_organization, is_active: true }\`

**Education**: \`{ institution, degree_type, field_of_study }\`

## Example Interaction

User: "I'm really good at Python"
Assistant: Got it! Adding Python as an expert-level technology.

\`\`\`json
{
  "action": "content_ready",
  "content": {
    "id": "tech-python-${Date.now()}",
    "type": "technology",
    "status": "ready",
    "data": {
      "name": "Python",
      "category": "language",
      "proficiency_level": 5,
      "is_current": true
    }
  }
}
\`\`\`

Added! What else would you like to add?

---

Ready to add content. What would you like to add?`;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load resume data and build system prompt
    const resumeData = await getResumeData();
    const systemPrompt = buildContentBuilderPrompt(resumeData);

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Convert messages for Claude API
          const claudeMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          // Use streaming API for real-time response
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: systemPrompt,
            messages: claudeMessages,
            stream: true,
          });

          let fullContent = '';
          let jsonBuffer = '';
          let inJsonBlock = false;

          // Process the stream
          for await (const event of response) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                const text = delta.text;
                fullContent += text;

                // Send text event
                const data = JSON.stringify({ type: 'text', content: text });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                // Check for JSON block
                if (text.includes('```json')) {
                  inJsonBlock = true;
                  jsonBuffer = '';
                } else if (inJsonBlock) {
                  if (text.includes('```')) {
                    // End of JSON block
                    inJsonBlock = false;
                    const jsonEnd = text.indexOf('```');
                    jsonBuffer += text.substring(0, jsonEnd);

                    // Try to parse the content
                    try {
                      const parsed = JSON.parse(jsonBuffer.trim());
                      if (parsed.action === 'content_ready' && parsed.content) {
                        const contentData = JSON.stringify({
                          type: 'content_ready',
                          pendingContent: {
                            ...parsed.content,
                            createdAt: parsed.content.createdAt || new Date().toISOString(),
                          },
                        });
                        controller.enqueue(encoder.encode(`data: ${contentData}\n\n`));
                      } else if (parsed.action === 'duplicate_warning') {
                        const duplicateData = JSON.stringify({
                          type: 'duplicate_warning',
                          duplicateInfo: parsed.duplicate,
                        });
                        controller.enqueue(encoder.encode(`data: ${duplicateData}\n\n`));
                      } else if (parsed.action === 'clarification_needed') {
                        const clarificationData = JSON.stringify({
                          type: 'clarification_needed',
                          clarification: parsed.clarification,
                        });
                        controller.enqueue(encoder.encode(`data: ${clarificationData}\n\n`));
                      }
                    } catch {
                      console.error('Failed to parse content JSON');
                    }
                  } else {
                    jsonBuffer += text;
                  }
                }
              }
            }
          }

          // If we didn't find a JSON block in stream, try to extract from full content
          const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)```/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              const parsed = JSON.parse(jsonMatch[1].trim());
              if (parsed.action === 'content_ready' && parsed.content) {
                const contentData = JSON.stringify({
                  type: 'content_ready',
                  pendingContent: {
                    ...parsed.content,
                    createdAt: parsed.content.createdAt || new Date().toISOString(),
                  },
                });
                controller.enqueue(encoder.encode(`data: ${contentData}\n\n`));
              }
            } catch {
              // JSON already processed or invalid
            }
          }

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Content builder error:', errorMessage);
          const data = JSON.stringify({ type: 'error', message: errorMessage });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Content builder error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
