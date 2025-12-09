import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { loadResumeDataWithSources, ResumeDataWithSources } from '@/lib/interview/resume-data-loader';
import type { ChatRequest, InterviewFeedback, InterviewQuestion } from '@/lib/interview/types';

// For static export, we need to mark this as dynamic
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

// Sample interview questions categorized by type
const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Behavioral
  {
    id: 'beh-1',
    category: 'behavioral',
    question: 'Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?',
    difficulty: 'medium',
    tips: ['Use the STAR method', 'Focus on your actions and the positive outcome', 'Show empathy and communication skills'],
  },
  {
    id: 'beh-2',
    category: 'behavioral',
    question: 'Describe a situation where you had to meet a tight deadline. What was your approach?',
    difficulty: 'easy',
    tips: ['Be specific about the timeline', 'Explain your prioritization process', 'Mention the outcome'],
  },
  {
    id: 'beh-3',
    category: 'behavioral',
    question: 'Tell me about a time you failed at something. What did you learn from it?',
    difficulty: 'hard',
    tips: ['Be honest about the failure', 'Focus on what you learned', 'Show how you applied those lessons'],
  },
  {
    id: 'beh-4',
    category: 'behavioral',
    question: 'Give an example of when you had to persuade others to adopt your idea or approach.',
    difficulty: 'medium',
    tips: ['Describe the resistance you faced', 'Explain your persuasion strategy', 'Share the result'],
  },
  // Technical
  {
    id: 'tech-1',
    category: 'technical',
    question: 'Walk me through your approach to debugging a complex production issue.',
    difficulty: 'medium',
    tips: ['Describe your systematic approach', 'Mention tools and techniques you use', 'Give a real example if possible'],
  },
  {
    id: 'tech-2',
    category: 'technical',
    question: 'How do you ensure code quality in your projects?',
    difficulty: 'easy',
    tips: ['Mention testing strategies', 'Talk about code reviews', 'Discuss documentation practices'],
  },
  {
    id: 'tech-3',
    category: 'technical',
    question: 'Describe a technically challenging project you worked on. What made it challenging and how did you overcome those challenges?',
    difficulty: 'hard',
    tips: ['Be specific about technical details', 'Explain your problem-solving process', 'Highlight the impact'],
  },
  // Situational
  {
    id: 'sit-1',
    category: 'situational',
    question: 'How would you handle a situation where you disagree with your manager\'s technical decision?',
    difficulty: 'medium',
    tips: ['Show respect for authority while maintaining your perspective', 'Explain how you would present data', 'Discuss finding common ground'],
  },
  {
    id: 'sit-2',
    category: 'situational',
    question: 'If you discovered a critical bug right before a major release, what would you do?',
    difficulty: 'medium',
    tips: ['Prioritize communication', 'Discuss risk assessment', 'Show decision-making ability'],
  },
  // General
  {
    id: 'gen-1',
    category: 'general',
    question: 'Tell me about yourself and your professional journey.',
    difficulty: 'easy',
    tips: ['Keep it concise (2-3 minutes)', 'Focus on relevant experience', 'End with why you\'re interested in this opportunity'],
  },
  {
    id: 'gen-2',
    category: 'general',
    question: 'Where do you see yourself in 5 years?',
    difficulty: 'easy',
    tips: ['Show ambition but be realistic', 'Align with the company\'s growth potential', 'Express desire for continuous learning'],
  },
  {
    id: 'gen-3',
    category: 'general',
    question: 'Why are you looking for a new opportunity?',
    difficulty: 'medium',
    tips: ['Be positive about your current/past role', 'Focus on growth and new challenges', 'Avoid negativity about previous employers'],
  },
];

function buildInterviewCoachPrompt(data: ResumeDataWithSources, currentQuestion?: InterviewQuestion): string {
  const { identity } = data;

  // Format positions for context
  const positionsContext = data.positions
    .slice(0, 3) // Only most recent 3 positions
    .map((pos) => {
      let entry = `${pos.primary_title} at ${pos.company?.name || 'Unknown Company'} (${pos.start_date || 'Unknown'} - ${pos.is_current ? 'Present' : pos.end_date || 'Unknown'})`;
      if (pos.accomplishments?.length) {
        entry += '\nKey accomplishments: ' + pos.accomplishments.slice(0, 3).map((acc) => acc.primary_title).join('; ');
      }
      return entry;
    })
    .join('\n\n');

  // Format key skills
  const skillsContext = data.skills.slice(0, 10).map((s) => s.name).join(', ');

  // Format key projects
  const projectsContext = data.projects
    .slice(0, 3)
    .map((p) => `${p.name}: ${p.summary || p.description?.replace(/<[^>]*>/g, '').slice(0, 100)}`)
    .join('\n');

  const questionContext = currentQuestion
    ? `
## Current Interview Question
Category: ${currentQuestion.category}
Difficulty: ${currentQuestion.difficulty}
Question: "${currentQuestion.question}"
${currentQuestion.tips ? `\nTips for this question:\n${currentQuestion.tips.map((t) => `- ${t}`).join('\n')}` : ''}
`
    : '';

  return `You are an expert interview coach helping ${identity.first_name} ${identity.last_name} practice answering interview questions. Your role is to provide constructive, specific feedback on their answers.

## Candidate Background
**Name:** ${identity.first_name} ${identity.last_name}
**Current Tagline:** ${identity.tagline || 'Not provided'}

## Recent Experience
${positionsContext}

## Key Skills
${skillsContext}

## Notable Projects
${projectsContext}
${questionContext}

---

## Your Task

You are an interview coach having a practice session with ${identity.first_name}. Help them improve their interview answers by:

1. **Evaluating their response** using the STAR method (Situation, Task, Action, Result)
2. **Providing specific feedback** on:
   - Structure and organization
   - Relevance to the question
   - Clarity and conciseness
   - Use of specific examples and metrics
   - Professional tone

3. **Offering actionable suggestions** for improvement
4. **Providing an improved version** of their answer when helpful

**Conversation Modes:**

- If the user asks for a new question, select an appropriate interview question and present it to them
- If the user provides an answer to practice, evaluate it and provide detailed feedback
- If the user asks for tips or help with a specific type of question, provide guidance

**When providing feedback on an answer:**

1. First, write a conversational response with your feedback in natural language (2-3 paragraphs). Be encouraging and specific. This is what the user will read in the chat.

2. At the END of your response, output a JSON block for the visual feedback panel. The user won't see this JSON directly - it will be parsed and displayed as a visual scorecard. Use this exact structure:

\`\`\`json
{
  "overallScore": 7,
  "strengths": ["Clear structure", "Good use of metrics"],
  "improvements": ["Could add more context about the situation", "Missing the result"],
  "structureScore": 8,
  "relevanceScore": 7,
  "clarityScore": 6,
  "starMethodUsed": true,
  "suggestions": ["Start with more context about your role", "Quantify the impact more specifically"],
  "revisedAnswer": "Here is how I would rephrase your answer..."
}
\`\`\`

**Guidelines:**
- Be encouraging but honest in your conversational feedback
- Provide specific, actionable feedback
- Reference the candidate's actual experience when suggesting examples
- Keep feedback focused and not overwhelming (3-5 key points)
- Celebrate what they did well before suggesting improvements
- Always include the JSON block at the end for the visual scorecard

Remember: Your goal is to help ${identity.first_name} feel confident and prepared for real interviews.`;
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
    const body: ChatRequest & { questionId?: string } = await request.json();
    const { messages, questionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load resume data and build system prompt
    const resumeData = await getResumeData();
    const currentQuestion = questionId ? INTERVIEW_QUESTIONS.find((q) => q.id === questionId) : undefined;
    const systemPrompt = buildInterviewCoachPrompt(resumeData, currentQuestion);

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
            max_tokens: 2048,
            system: systemPrompt,
            messages: claudeMessages,
            stream: true,
          });

          let fullContent = '';
          let jsonBuffer = '';
          let inJsonBlock = false;
          let feedbackSent = false;
          let jsonStartMarker = '';

          // Process the stream
          for await (const event of response) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                const text = delta.text;
                fullContent += text;

                // Check for JSON block start (feedback) - don't send this to chat
                if (text.includes('```json')) {
                  inJsonBlock = true;
                  jsonBuffer = '';
                  // Send text before ```json but not the marker itself
                  const jsonStartIndex = text.indexOf('```json');
                  if (jsonStartIndex > 0) {
                    const textBefore = text.substring(0, jsonStartIndex);
                    const data = JSON.stringify({ type: 'text', content: textBefore });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                  jsonStartMarker = text.substring(text.indexOf('```json'));
                } else if (inJsonBlock) {
                  if (text.includes('```')) {
                    // End of JSON block
                    inJsonBlock = false;
                    const jsonEnd = text.indexOf('```');
                    jsonBuffer += text.substring(0, jsonEnd);

                    // Try to parse the feedback
                    try {
                      const feedback: InterviewFeedback = JSON.parse(jsonBuffer.trim());
                      // Send feedback complete event (structured data for the drawer)
                      const feedbackData = JSON.stringify({
                        type: 'feedback_complete',
                        feedback,
                      });
                      controller.enqueue(encoder.encode(`data: ${feedbackData}\n\n`));
                      feedbackSent = true;
                    } catch {
                      console.error('Failed to parse feedback JSON');
                    }

                    // Send any text after the closing ``` to the chat
                    const textAfter = text.substring(jsonEnd + 3);
                    if (textAfter.trim()) {
                      const data = JSON.stringify({ type: 'text', content: textAfter });
                      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    }
                  } else {
                    // Accumulate JSON but don't send to chat
                    jsonBuffer += text;
                  }
                } else {
                  // Normal text - send to chat
                  const data = JSON.stringify({ type: 'text', content: text });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }
            }
          }

          // If we didn't find a JSON block in stream, try to extract from full content
          if (!feedbackSent) {
            const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) {
              try {
                const feedback: InterviewFeedback = JSON.parse(jsonMatch[1].trim());
                const feedbackData = JSON.stringify({
                  type: 'feedback_complete',
                  feedback,
                });
                controller.enqueue(encoder.encode(`data: ${feedbackData}\n\n`));
              } catch {
                console.error('Failed to parse feedback JSON from full content');
              }
            }
          }

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Interview practice error:', errorMessage);
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
    console.error('Interview practice error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET endpoint to fetch available questions
export async function GET() {
  return new Response(JSON.stringify({ questions: INTERVIEW_QUESTIONS }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
