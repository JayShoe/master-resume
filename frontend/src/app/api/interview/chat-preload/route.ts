import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { loadResumeDataWithSources } from '@/lib/interview/resume-data-loader';
import { buildPreloadedSystemPrompt } from '@/lib/interview/preload-prompt-builder';
import { getDirectusMCPSystemPrompt } from '@/lib/interview/directus-remote-mcp';
import type { ChatRequest } from '@/lib/interview/types';

// This route requires runtime server access (Anthropic API)
// Note: This mode pre-loads data from Directus via MCP-compatible data layer
// for faster responses without tool-calling overhead
export const dynamic = 'force-dynamic';

// Cache the resume data to avoid fetching on every request
let cachedResumeData: Awaited<ReturnType<typeof loadResumeDataWithSources>> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getResumeData() {
  const now = Date.now();
  if (!cachedResumeData || now - cacheTimestamp > CACHE_DURATION) {
    cachedResumeData = await loadResumeDataWithSources();
    cacheTimestamp = now;
  }
  return cachedResumeData;
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

    // Load resume data and build system prompt with MCP context
    const resumeData = await getResumeData();
    let systemPrompt = buildPreloadedSystemPrompt(resumeData);

    // Optionally enhance with Directus MCP system context
    try {
      const mcpSystemPrompt = await getDirectusMCPSystemPrompt();
      if (mcpSystemPrompt) {
        systemPrompt = `${systemPrompt}\n\n--- Directus MCP System Context (for reference) ---\n${mcpSystemPrompt}`;
      }
    } catch (error) {
      // MCP system prompt is optional, continue without it
      console.log('MCP system prompt not available, using basic prompt');
    }

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

          // Process the stream
          for await (const event of response) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                const data = JSON.stringify({ type: 'text', content: delta.text });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
          }

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Interview chat-preload error:', errorMessage);
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
    console.error('Interview chat-preload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
