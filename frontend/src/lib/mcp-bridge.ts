/**
 * MCP Bridge Client
 * Client-side library for communicating with the MCP HTTP bridge API
 */

const MCP_API_URL = '/api/mcp';

export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DirectusItem {
  id: number | string;
  status?: string;
  [key: string]: unknown;
}

export interface DirectusItemsResponse {
  data: DirectusItem[];
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
}

export interface DirectusItemResponse {
  data: DirectusItem;
}

/**
 * Call an MCP tool via the HTTP bridge
 */
export async function callMCPTool<T = unknown>(
  tool: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(MCP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool, params }),
  });

  const result: MCPResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'MCP operation failed');
  }

  return result.data as T;
}

/**
 * Read items from a collection
 */
export async function readItems(
  collection: string,
  query?: {
    fields?: string[];
    filter?: Record<string, unknown>;
    sort?: string[];
    limit?: number;
    offset?: number;
    search?: string;
    deep?: Record<string, unknown>;
  }
): Promise<DirectusItemsResponse> {
  return callMCPTool<DirectusItemsResponse>('read-items', {
    collection,
    query,
  });
}

/**
 * Create an item in a collection
 */
export async function createItem(
  collection: string,
  item: Record<string, unknown>,
  query?: { fields?: string[] }
): Promise<DirectusItemResponse> {
  return callMCPTool<DirectusItemResponse>('create-item', {
    collection,
    item,
    query,
  });
}

/**
 * Update an item in a collection
 */
export async function updateItem(
  collection: string,
  id: string | number,
  data: Record<string, unknown>,
  query?: { fields?: string[] }
): Promise<DirectusItemResponse> {
  return callMCPTool<DirectusItemResponse>('update-item', {
    collection,
    id,
    data,
    query,
  });
}

/**
 * Delete an item from a collection
 */
export async function deleteItem(
  collection: string,
  id: string | number
): Promise<{ success: boolean }> {
  return callMCPTool<{ success: boolean }>('delete-item', {
    collection,
    id,
  });
}

/**
 * Search across a collection
 */
export async function searchItems(
  collection: string,
  searchQuery: string,
  options?: {
    filter?: Record<string, unknown>;
    fields?: string[];
    limit?: number;
  }
): Promise<DirectusItemsResponse> {
  return callMCPTool<DirectusItemsResponse>('search', {
    collection,
    query: searchQuery,
    ...options,
  });
}

/**
 * Read the schema/collections
 */
export async function readCollections(): Promise<unknown> {
  return callMCPTool('read-collections');
}

/**
 * Read users
 */
export async function readUsers(query?: Record<string, unknown>): Promise<unknown> {
  return callMCPTool('read-users', { query });
}

/**
 * Read files
 */
export async function readFiles(
  id?: string,
  query?: Record<string, unknown>
): Promise<unknown> {
  return callMCPTool('read-files', { id, query });
}

/**
 * Read folders
 */
export async function readFolders(query?: Record<string, unknown>): Promise<unknown> {
  return callMCPTool('read-folders', { query });
}
