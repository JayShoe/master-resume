import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getMCPToolsForClaude,
  executeMCPTool,
  getDirectusMCPSystemPrompt
} from '@/lib/interview/directus-remote-mcp';
import type { ChatRequest } from '@/lib/interview/types';

// For static export, we need to mark this as dynamic
// This route requires runtime server access (Anthropic API)
export const dynamic = 'force-dynamic';

// Base system prompt for the interview assistant
const BASE_SYSTEM_PROMPT = `You are Jay, an AI-powered interview assistant representing a professional's portfolio website. You speak in first person as Jay, answering questions about Jay's background, experience, skills, and accomplishments.

Your role is to:
1. Answer questions about Jay's professional background conversationally and authentically
2. Use the available Directus MCP tools to fetch relevant information from the resume database
3. Always base your answers on actual data retrieved from the tools - never make up information
4. Be engaging, professional, and personable
5. Highlight achievements and skills when relevant
6. Keep responses concise but informative (2-3 paragraphs max unless more detail is requested)

Important guidelines:
- Always use MCP tools to get data before answering questions about experience, skills, projects, etc.
- Use the 'items' tool to read from collections like 'positions', 'accomplishments', 'skills', 'technologies', 'projects', 'education', 'certifications', and 'identity'
- Use the 'schema' tool to understand the data structure if needed
- If you don't find relevant information, say so honestly rather than making things up
- Speak naturally as if you are Jay being interviewed
- Show enthusiasm about accomplishments without being boastful
- Make connections between different experiences when relevant

When asked broad questions like "tell me about yourself", use multiple MCP tool calls to gather a comprehensive picture.`;

/**
 * Build the complete system prompt with MCP-specific context
 */
async function buildSystemPrompt(): Promise<string> {
  const mcpSystemPrompt = await getDirectusMCPSystemPrompt();

  if (mcpSystemPrompt) {
    return `${BASE_SYSTEM_PROMPT}\n\n--- Directus MCP System Context ---\n${mcpSystemPrompt}`;
  }

  return BASE_SYSTEM_PROMPT;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get MCP tools from Directus Remote MCP Server
    const mcpTools = await getMCPToolsForClaude();
    const systemPrompt = await buildSystemPrompt();

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Convert messages for Claude API
          let claudeMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          // Tool use loop - keep processing until we get a final response
          let continueLoop = true;

          while (continueLoop) {
            // Call Claude API with Directus MCP tools
            const response = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 2048,
              system: systemPrompt,
              tools: mcpTools as Anthropic.Tool[],
              messages: claudeMessages,
            });

            // Process the response
            if (response.stop_reason === 'tool_use') {
              // Claude wants to use Directus MCP tools
              const assistantContent: Anthropic.ContentBlock[] = [];
              const toolResults: Anthropic.ToolResultBlockParam[] = [];

              for (const block of response.content) {
                assistantContent.push(block);

                if (block.type === 'tool_use') {
                  // Execute the MCP tool via Directus Remote MCP Server
                  const toolResult = await executeMCPTool(
                    block.name,
                    block.input as Record<string, unknown>
                  );

                  toolResults.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: toolResult,
                  });
                }
              }

              // Add assistant message and tool results to the conversation
              claudeMessages = [
                ...claudeMessages,
                { role: 'assistant', content: assistantContent },
                { role: 'user', content: toolResults },
              ];
            } else {
              // Final response - stream the text content
              continueLoop = false;

              for (const block of response.content) {
                if (block.type === 'text') {
                  // Stream the text character by character for a nicer effect
                  const text = block.text;
                  const chunkSize = 5; // Characters per chunk

                  for (let i = 0; i < text.length; i += chunkSize) {
                    const chunk = text.slice(i, i + chunkSize);
                    const data = JSON.stringify({ type: 'text', content: chunk });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                    // Small delay for streaming effect
                    await new Promise((resolve) => setTimeout(resolve, 10));
                  }
                }
              }

              // Send done event
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
              );
            }
          }

          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Interview chat error:', errorMessage);
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
    console.error('Interview chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
