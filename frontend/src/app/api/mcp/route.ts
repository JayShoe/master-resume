import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

interface MCPToolRequest {
  tool: string;
  params: Record<string, unknown>;
}

interface MCPResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * MCP HTTP Bridge
 * Provides HTTP access to Directus operations using an MCP-style interface
 * Maps MCP tool names to Directus REST API calls
 */
export async function POST(request: NextRequest): Promise<NextResponse<MCPResponse>> {
  try {
    if (!DIRECTUS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Directus token not configured' },
        { status: 500 }
      );
    }

    const body: MCPToolRequest = await request.json();
    const { tool, params } = body;

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      );
    }

    const result = await executeMCPTool(tool, params || {});
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('MCP bridge error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

async function executeMCPTool(tool: string, params: Record<string, unknown>): Promise<unknown> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  };

  switch (tool) {
    // Read operations
    case 'read-collections':
      return await fetchDirectus('/collections', headers);

    case 'read-items': {
      const { collection, query } = params as { collection: string; query?: Record<string, unknown> };
      if (!collection) throw new Error('Collection name is required');
      const queryString = query ? buildQueryString(query) : '';
      return await fetchDirectus(`/items/${collection}${queryString}`, headers);
    }

    case 'read-users': {
      const { query } = params as { query?: Record<string, unknown> };
      const queryString = query ? buildQueryString(query) : '';
      return await fetchDirectus(`/users${queryString}`, headers);
    }

    case 'read-files': {
      const { id, query } = params as { id?: string; query?: Record<string, unknown> };
      const queryString = query ? buildQueryString(query) : '';
      if (id) {
        return await fetchDirectus(`/files/${id}${queryString}`, headers);
      }
      return await fetchDirectus(`/files${queryString}`, headers);
    }

    case 'read-folders': {
      const { query } = params as { query?: Record<string, unknown> };
      const queryString = query ? buildQueryString(query) : '';
      return await fetchDirectus(`/folders${queryString}`, headers);
    }

    // Write operations
    case 'create-item': {
      const { collection, item, query } = params as {
        collection: string;
        item: Record<string, unknown>;
        query?: Record<string, unknown>;
      };
      if (!collection) throw new Error('Collection name is required');
      if (!item) throw new Error('Item data is required');

      // Add default status if not provided
      const itemData = { ...item };
      if (!('status' in itemData)) {
        itemData.status = 'published';
      }

      const queryString = query ? buildQueryString(query) : '';
      return await fetchDirectus(`/items/${collection}${queryString}`, headers, {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
    }

    case 'update-item': {
      const { collection, id, data, query } = params as {
        collection: string;
        id: string | number;
        data: Record<string, unknown>;
        query?: Record<string, unknown>;
      };
      if (!collection) throw new Error('Collection name is required');
      if (!id) throw new Error('Item ID is required');
      if (!data) throw new Error('Update data is required');

      const queryString = query ? buildQueryString(query) : '';
      return await fetchDirectus(`/items/${collection}/${id}${queryString}`, headers, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }

    case 'delete-item': {
      const { collection, id } = params as { collection: string; id: string | number };
      if (!collection) throw new Error('Collection name is required');
      if (!id) throw new Error('Item ID is required');

      return await fetchDirectus(`/items/${collection}/${id}`, headers, {
        method: 'DELETE',
      });
    }

    // Search operation
    case 'search': {
      const { collection, query: searchQuery, filter, fields, limit } = params as {
        collection: string;
        query: string;
        filter?: Record<string, unknown>;
        fields?: string[];
        limit?: number;
      };
      if (!collection) throw new Error('Collection name is required');

      const queryParams: Record<string, unknown> = {
        search: searchQuery,
        filter: { ...filter, status: { _eq: 'published' } },
        fields: fields || ['*'],
        limit: limit || 25,
      };

      const queryString = buildQueryString(queryParams);
      return await fetchDirectus(`/items/${collection}${queryString}`, headers);
    }

    default:
      throw new Error(`Unknown MCP tool: ${tool}`);
  }
}

async function fetchDirectus(
  path: string,
  headers: HeadersInit,
  options?: { method?: string; body?: string }
): Promise<unknown> {
  const url = `${DIRECTUS_URL}${path}`;
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers,
    body: options?.body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Directus API error (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.errors && errorJson.errors.length > 0) {
        errorMessage = errorJson.errors.map((e: { message: string }) => e.message).join(', ');
      }
    } catch {
      if (errorText) {
        errorMessage = `${errorMessage}: ${errorText}`;
      }
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like DELETE)
  const text = await response.text();
  if (!text) return { success: true };

  return JSON.parse(text);
}

function buildQueryString(query: Record<string, unknown>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;

    if (key === 'filter' && typeof value === 'object') {
      params.set('filter', JSON.stringify(value));
    } else if (key === 'deep' && typeof value === 'object') {
      params.set('deep', JSON.stringify(value));
    } else if (key === 'fields' && Array.isArray(value)) {
      params.set('fields', value.join(','));
    } else if (key === 'sort' && Array.isArray(value)) {
      params.set('sort', value.join(','));
    } else if (typeof value === 'object') {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
