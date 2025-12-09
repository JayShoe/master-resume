/**
 * Real MCP Client for Directus
 * Connects to the actual Directus MCP server defined in .mcp.json
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

let mcpClient: Client | null = null;
let mcpTransport: StdioClientTransport | null = null;

/**
 * Initialize the MCP client connection to Directus
 */
async function initMCPClient(): Promise<Client> {
  if (mcpClient) {
    return mcpClient;
  }

  // Get Directus MCP server configuration from environment
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055';
  const directusToken = process.env.DIRECTUS_TOKEN;

  if (!directusToken) {
    throw new Error('DIRECTUS_TOKEN environment variable is required for MCP connection');
  }

  // Create transport to the Directus MCP server
  mcpTransport = new StdioClientTransport({
    command: 'npx',
    args: ['@directus/content-mcp@latest'],
    env: {
      ...process.env,
      DIRECTUS_URL: directusUrl,
      DIRECTUS_TOKEN: directusToken,
    },
  });

  // Create and initialize the MCP client
  mcpClient = new Client(
    {
      name: 'master-resume-interview',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await mcpClient.connect(mcpTransport);

  return mcpClient;
}

/**
 * Get list of available tools from the MCP server
 */
export async function listMCPTools() {
  const client = await initMCPClient();
  const response = await client.listTools();
  return response.tools;
}

/**
 * Call a tool on the MCP server
 */
export async function callMCPTool(toolName: string, args: Record<string, unknown> = {}) {
  const client = await initMCPClient();
  const response = await client.callTool({
    name: toolName,
    arguments: args,
  });
  return response;
}

/**
 * Close the MCP connection
 */
export async function closeMCPClient() {
  if (mcpClient && mcpTransport) {
    await mcpClient.close();
    mcpClient = null;
    mcpTransport = null;
  }
}

/**
 * Format tool definitions for Claude API
 */
export async function getMCPToolsForClaude(): Promise<Array<{
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}>> {
  const tools = await listMCPTools();
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description || '',
    input_schema: tool.inputSchema,
  }));
}

/**
 * Execute a tool call and return formatted result
 */
export async function executeMCPTool(toolName: string, args: Record<string, unknown>): Promise<string> {
  try {
    const response = await callMCPTool(toolName, args);

    // Handle different response types
    if (Array.isArray(response.content)) {
      // MCP returns content as an array of blocks
      const textContent = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      return textContent || JSON.stringify(response.content, null, 2);
    }

    return JSON.stringify(response.content, null, 2);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`MCP tool execution error (${toolName}):`, message);
    return JSON.stringify({ error: message });
  }
}

// Export for compatibility with existing code
export { executeMCPTool as executeTool };
