import { createDirectus, rest, staticToken, readItems, readItem, readSingleton } from '@directus/sdk';

// Get environment variables
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');
}

// Create the base client
const baseClient = createDirectus(directusUrl).with(rest());

// Export authenticated client if token exists, otherwise public client
export const directus = directusToken 
  ? baseClient.with(staticToken(directusToken))
  : baseClient;

// Test connection function
export async function testConnection() {
  try {
    console.log('🔗 Testing connection to:', directusUrl);
    console.log('🔑 Using token:', directusToken ? 'Yes' : 'No');
    
    // Try to fetch collections
    const response = await fetch(`${directusUrl}/collections`, {
      headers: directusToken ? {
        'Authorization': `Bearer ${directusToken}`
      } : {}
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const collections = await response.json();
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${collections.data?.length || 0} collections`);
    
    return collections;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    throw error;
  }
}

// Fetch schema information
export async function fetchSchema() {
  try {
    const baseUrl = directusUrl;
    const headers: Record<string, string> = {};
    if (directusToken) {
      headers['Authorization'] = `Bearer ${directusToken}`;
    }
    
    console.log('📡 Fetching schema from:', baseUrl);
    
    // Fetch collections, fields, and relations in parallel
    const [collectionsRes, fieldsRes, relationsRes] = await Promise.all([
      fetch(`${baseUrl}/collections`, { headers }),
      fetch(`${baseUrl}/fields`, { headers }),
      fetch(`${baseUrl}/relations`, { headers })
    ]);
    
    if (!collectionsRes.ok || !fieldsRes.ok || !relationsRes.ok) {
      throw new Error('Failed to fetch schema data');
    }
    
    const [collections, fields, relations] = await Promise.all([
      collectionsRes.json(),
      fieldsRes.json(),
      relationsRes.json()
    ]);
    
    console.log('✅ Schema fetched successfully!');
    console.log(`📊 Collections: ${collections.data?.length || 0}`);
    console.log(`🏷️  Fields: ${fields.data?.length || 0}`);
    console.log(`🔗 Relations: ${relations.data?.length || 0}`);
    
    return {
      collections: collections.data || [],
      fields: fields.data || [],
      relations: relations.data || []
    };
  } catch (error) {
    console.error('❌ Schema fetch failed:', error);
    throw error;
  }
}

// Generic helper functions using the SDK
export async function getAllItems<T = any>(collection: string): Promise<T[]> {
  try {
    return await directus.request(readItems(collection)) as T[];
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
}

export async function getItemById<T = any>(collection: string, id: string | number): Promise<T> {
  try {
    return await directus.request(readItem(collection, id)) as T;
  } catch (error) {
    console.error(`Error fetching ${collection} by id:`, error);
    throw error;
  }
}

export async function getSingleton<T = any>(collection: string): Promise<T> {
  try {
    return await directus.request(readSingleton(collection)) as T;
  } catch (error) {
    console.error(`Error fetching ${collection} singleton:`, error);
    throw error;
  }
}