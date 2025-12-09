import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { loadResumeDataWithSources, ResumeDataWithSources } from '@/lib/interview/resume-data-loader';
import type { ChatRequest, GeneratedResume } from '@/lib/interview/types';

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

function buildResumeGeneratorPrompt(data: ResumeDataWithSources): string {
  const { identity } = data;

  // Format positions for context
  const positionsContext = data.positions
    .map((pos) => {
      let entry = `Position: ${pos.primary_title} at ${pos.company?.name || 'Unknown Company'}
Duration: ${pos.start_date || 'Unknown'} - ${pos.is_current ? 'Present' : pos.end_date || 'Unknown'}
${pos.summary ? `Summary: ${pos.summary}` : ''}
${pos.description ? `Description: ${pos.description.replace(/<[^>]*>/g, '')}` : ''}`;

      if (pos.accomplishments?.length) {
        entry +=
          '\nAccomplishments:\n' +
          pos.accomplishments
            .map((acc) => `- ${acc.primary_title}${acc.impact_metrics ? ` (${acc.impact_metrics})` : ''}`)
            .join('\n');
      }
      return entry;
    })
    .join('\n\n---\n\n');

  // Format skills
  const skillsContext = data.skills
    .map((s) => `${s.name}${s.category ? ` [${s.category}]` : ''}${s.proficiency_level ? ` (${s.proficiency_level}/5)` : ''}`)
    .join(', ');

  // Format technologies
  const techContext = data.technologies
    .map((t) => `${t.name}${t.years_experience ? ` (${t.years_experience}yr)` : ''}`)
    .join(', ');

  // Format projects
  const projectsContext = data.projects
    .map((p) => {
      let entry = `Project: ${p.name}
${p.role ? `Role: ${p.role}` : ''}
${p.summary || p.description?.replace(/<[^>]*>/g, '') || ''}`;
      if (p.technologies_used?.length) {
        entry += `\nTech: ${p.technologies_used.map((t) => t.name).join(', ')}`;
      }
      return entry;
    })
    .join('\n\n');

  // Format education
  const educationContext = data.education
    .map((e) => `${e.degree_type || ''} ${e.field_of_study ? `in ${e.field_of_study}` : ''} from ${e.institution}${e.graduation_date ? ` (${e.graduation_date})` : ''}`)
    .join('\n');

  // Format certifications
  const certsContext = data.certifications
    .map((c) => `${c.name}${c.issuing_organization ? ` - ${c.issuing_organization}` : ''}${c.issue_date ? ` (${c.issue_date})` : ''}`)
    .join('\n');

  // Format accomplishments (standalone)
  const accomplishmentsContext = data.accomplishments
    .filter((a) => a.is_featured)
    .map((a) => `- ${a.primary_title}${a.impact_metrics ? `: ${a.impact_metrics}` : ''}`)
    .join('\n');

  return `You are an expert resume writer and career coach helping ${identity.first_name} ${identity.last_name} create tailored resumes for job applications.

## Candidate Information

**Name:** ${identity.first_name} ${identity.last_name}
**Email:** ${identity.email || 'Not provided'}
**Phone:** ${identity.phone || 'Not provided'}
**Location:** ${identity.location || 'Not provided'}
**LinkedIn:** ${identity.linkedin_url || 'Not provided'}
**GitHub:** ${identity.github_url || 'Not provided'}
**Website:** ${identity.website_url || 'Not provided'}

## Professional Summaries Available
${data.professionalSummaries.map((s) => `- ${s.title}: ${s.content?.replace(/<[^>]*>/g, '')}`).join('\n') || 'None available'}

## Work Experience
${positionsContext}

## Featured Accomplishments
${accomplishmentsContext || 'None featured'}

## Skills
${skillsContext || 'None listed'}

## Technologies
${techContext || 'None listed'}

## Projects
${projectsContext || 'None listed'}

## Education
${educationContext || 'None listed'}

## Certifications
${certsContext || 'None listed'}

---

## Your Task

You are having a conversation with ${identity.first_name} to help create a tailored resume. The user will provide a job description or describe the role they're applying for.

**Guidelines:**
1. **Analyze Requirements**: Identify key skills, qualifications, and keywords from the job description
2. **Match Experience**: Select the most relevant positions, accomplishments, and projects that align with the job
3. **Tailor Content**: Rewrite bullet points to emphasize relevant experience and use keywords from the job posting
4. **Quantify Impact**: Include metrics and measurable outcomes wherever possible
5. **ATS Optimization**: Use keywords naturally to pass Applicant Tracking Systems
6. **Concise Format**: Keep the resume to 1-2 pages worth of content
7. **Professional Tone**: Write in active voice with strong action verbs

**When generating a resume, output a JSON block with this structure:**

\`\`\`json
{
  "contactInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "123-456-7890",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "website": "website.com"
  },
  "summary": "Professional summary tailored to the job...",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "bullets": [
        "Achievement-focused bullet point with metrics...",
        "Another relevant accomplishment..."
      ]
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "tools": ["Tool 1", "Tool 2"],
    "soft": ["Leadership", "Communication"]
  },
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "graduationDate": "May 2015",
      "details": "Optional details like GPA, honors"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description of the project and your role",
      "technologies": ["Tech 1", "Tech 2"],
      "url": "https://project-url.com"
    }
  ]
}
\`\`\`

**Conversation Flow:**
1. First, acknowledge the job description and identify key requirements
2. Explain your strategy for tailoring the resume
3. Generate the resume JSON (wrapped in \`\`\`json code block)
4. Offer to make adjustments based on feedback

Remember: Only use information from the candidate data above. Do not fabricate experience or skills.`;
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
    const systemPrompt = buildResumeGeneratorPrompt(resumeData);

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
          let resumeSent = false;

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

                    // Try to parse the resume
                    try {
                      const resume: GeneratedResume = JSON.parse(jsonBuffer.trim());
                      // Send resume complete event
                      const resumeData = JSON.stringify({
                        type: 'resume_complete',
                        resume,
                      });
                      controller.enqueue(encoder.encode(`data: ${resumeData}\n\n`));
                      resumeSent = true;
                    } catch {
                      console.error('Failed to parse resume JSON');
                    }
                  } else {
                    jsonBuffer += text;

                    // Try to parse partial JSON for streaming updates
                    if (!resumeSent && jsonBuffer.length > 100) {
                      try {
                        // Attempt to parse with closing braces
                        const partialJson = jsonBuffer + '}}]}';
                        const partialResume = JSON.parse(partialJson);
                        if (partialResume.contactInfo) {
                          const resumeUpdate = JSON.stringify({
                            type: 'resume_update',
                            resume: partialResume,
                          });
                          controller.enqueue(encoder.encode(`data: ${resumeUpdate}\n\n`));
                        }
                      } catch {
                        // Partial JSON not yet valid, continue
                      }
                    }
                  }
                }
              }
            }
          }

          // If we didn't find a JSON block in stream, try to extract from full content
          if (!resumeSent) {
            const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) {
              try {
                const resume: GeneratedResume = JSON.parse(jsonMatch[1].trim());
                const resumeData = JSON.stringify({
                  type: 'resume_complete',
                  resume,
                });
                controller.enqueue(encoder.encode(`data: ${resumeData}\n\n`));
              } catch {
                console.error('Failed to parse resume JSON from full content');
              }
            }
          }

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Resume generation error:', errorMessage);
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
    console.error('Resume generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
