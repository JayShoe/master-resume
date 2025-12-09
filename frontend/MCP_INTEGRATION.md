# Directus MCP Integration

This document explains how the interview page uses the Directus Model Context Protocol (MCP) Server for AI-powered resume interactions.

## Overview

The `/interview` page demonstrates two different approaches to using Directus data with AI:

1. **Deep Dive (MCP Tools)** - Uses the Directus Remote MCP Server with real-time tool calling
2. **Quick Chat (MCP Pre-load)** - Pre-loads Directus data via MCP-compatible layer for faster responses

## Architecture

### Deep Dive Mode (Real MCP)

This mode connects to the **Directus Remote MCP Server** (available in Directus v11.12+) via HTTP endpoints:

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Claude    │──────▶│  Next.js API     │──────▶│ Directus Remote │
│   (AI)      │◀──────│  Route           │◀──────│ MCP Server      │
└─────────────┘      └──────────────────┘      └─────────────────┘
                            │
                            │ Calls MCP tools:
                            │ - items
                            │ - schema
                            │ - system-prompt
                            └─────────────────────
```

**Implementation:**
- File: [directus-remote-mcp.ts](src/lib/interview/directus-remote-mcp.ts)
- API Route: [chat/route.ts](src/app/api/interview/chat/route.ts)
- Endpoint: `POST /api/interview/chat`

**How it works:**
1. Fetches available MCP tools from Directus via `GET /mcp/tools/list`
2. Provides tools to Claude along with the Directus system prompt
3. When Claude wants to use a tool, calls `POST /mcp/tools/call` with the tool name and arguments
4. Returns the MCP response back to Claude for processing

**MCP Tools Used:**
- `system-prompt` - Gets Directus-specific knowledge for the AI
- `items` - Reads collections (positions, skills, projects, etc.)
- `schema` - Understands the data structure
- And other Directus MCP tools as needed

### Quick Chat Mode (MCP-Compatible Pre-load)

This mode pre-fetches all data from Directus and includes it in the system prompt for faster responses without tool-calling overhead:

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Claude    │──────▶│  Next.js API     │      │ Directus API    │
│   (AI)      │◀──────│  Route           │      │ (via SDK)       │
└─────────────┘      └──────────────────┘      └─────────────────┘
                            ▲
                            │
                            │ Pre-loads all data
                            │ at request time
                            └─────────────────────
```

**Implementation:**
- API Route: [chat-preload/route.ts](src/app/api/interview/chat-preload/route.ts)
- Data Loader: [resume-data-loader.ts](src/lib/interview/resume-data-loader.ts)
- Endpoint: `POST /api/interview/chat-preload`

**How it works:**
1. Fetches all resume data from Directus via the SDK
2. Builds a comprehensive system prompt with all the data
3. Optionally enhances with the Directus MCP system prompt
4. Claude answers questions directly from the pre-loaded context

## Configuration

### Environment Variables

Required for MCP integration:

```env
# Directus Configuration
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_directus_token_here

# Claude API
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Directus Version

The Remote MCP Server integration requires **Directus v11.12 or later**.

For older versions, you can still use the pre-load mode which uses the Directus SDK.

## External MCP Client Configuration

To use the Directus MCP Server with external tools like Claude Desktop, configure it in your `.mcp.json`:

```json
{
  "mcpServers": {
    "directus": {
      "command": "npx",
      "args": ["@directus/content-mcp@latest"],
      "env": {
        "DIRECTUS_URL": "http://localhost:8055",
        "DIRECTUS_TOKEN": "your-directus-token-here"
      }
    }
  }
}
```

## Key Files

| File | Purpose |
|------|---------|
| [directus-remote-mcp.ts](src/lib/interview/directus-remote-mcp.ts) | Client for Directus Remote MCP Server |
| [chat/route.ts](src/app/api/interview/chat/route.ts) | Deep Dive mode API using MCP tools |
| [chat-preload/route.ts](src/app/api/interview/chat-preload/route.ts) | Quick Chat mode API with pre-loaded data |
| [chat-modes.ts](src/lib/interview/chat-modes.ts) | Configuration for both modes |
| [mcp-client.ts](src/lib/interview/mcp-client.ts) | Legacy MCP-style client (deprecated) |

## Benefits of Using MCP

1. **Standardized Protocol** - Uses the industry-standard Model Context Protocol
2. **Dynamic Data Access** - AI can query specific data on demand
3. **Permissions-Based** - Respects Directus permissions and access control
4. **Schema Awareness** - AI understands your data structure
5. **Future-Proof** - Compatible with the growing MCP ecosystem

## Demo

The "Deep Dive (MCP Tools)" mode is specifically designed to demonstrate the MCP integration. When you use this mode:

1. Open the browser's Network tab
2. Ask a question like "What are my skills?"
3. You'll see API calls to the Directus MCP endpoints
4. The AI will use MCP tools like `items` to fetch the data

## Learn More

- [Directus MCP Documentation](https://directus.io/docs/guides/ai/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Directus MCP GitHub](https://github.com/directus/mcp)
