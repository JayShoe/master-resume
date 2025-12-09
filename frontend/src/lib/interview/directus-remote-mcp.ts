/**
 * Directus Remote MCP Client
 * Uses the Directus v11.12+ built-in remote MCP server via HTTP endpoints
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

/**
 * Call the Directus Remote MCP Server to list available tools
 */
export async function listDirectusMCPTools() {
  if (!DIRECTUS_TOKEN) {
    throw new Error('DIRECTUS_TOKEN is required for MCP access');
  }

  const response = await fetch(`${DIRECTUS_URL}/mcp/tools/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Directus MCP tools/list failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.tools || [];
}

/**
 * Call a tool on the Directus Remote MCP Server
 */
export async function callDirectusMCPTool(toolName: string, args: Record<string, unknown> = {}) {
  if (!DIRECTUS_TOKEN) {
    throw new Error('DIRECTUS_TOKEN is required for MCP access');
  }

  const response = await fetch(`${DIRECTUS_URL}/mcp/tools/call`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: toolName,
      arguments: args,
    }),
  });

  if (!response.ok) {
    throw new Error(`Directus MCP tool call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get system prompt from the MCP server
 * This provides Directus-specific knowledge to the AI assistant
 */
export async function getDirectusMCPSystemPrompt() {
  try {
    const result = await callDirectusMCPTool('system-prompt', {});

    // Extract text content from MCP response
    if (result.content && Array.isArray(result.content)) {
      const textContent = result.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');
      return textContent;
    }

    return '';
  } catch (error) {
    console.error('Failed to get MCP system prompt:', error);
    return '';
  }
}

/**
 * Get MCP tools formatted for Claude API
 */
export async function getMCPToolsForClaude(): Promise<Array<{
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}>> {
  try {
    const tools = await listDirectusMCPTools();

    return tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description || '',
      input_schema: tool.inputSchema || { type: 'object', properties: {}, required: [] },
    }));
  } catch (error) {
    console.error('Failed to get MCP tools:', error);
    // Return fallback tools if MCP server is not available
    return [];
  }
}

/**
 * Execute an MCP tool and return formatted result for Claude
 */
export async function executeMCPTool(toolName: string, args: Record<string, unknown>): Promise<string> {
  try {
    const response = await callDirectusMCPTool(toolName, args);

    // Handle different MCP response formats
    if (response.content && Array.isArray(response.content)) {
      const textContent = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      return textContent || JSON.stringify(response.content, null, 2);
    }

    return JSON.stringify(response, null, 2);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`MCP tool execution error (${toolName}):`, message);
    return JSON.stringify({ error: message });
  }
}

// Compatibility exports
export { executeMCPTool as executeTool };
export { listDirectusMCPTools as listMCPTools };
export { callDirectusMCPTool as callMCPTool };
