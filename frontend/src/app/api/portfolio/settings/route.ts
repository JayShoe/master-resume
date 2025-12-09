import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.NEXT_PUBLIC_DIRECTUS_TOKEN;

export async function GET() {
  try {
    if (!DIRECTUS_TOKEN) {
      throw new Error('Directus token not configured');
    }

    const url = `${DIRECTUS_URL}/items/system_settings`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return the first item from the array, or the data directly if it's not an array
    const settings = Array.isArray(data.data) ? data.data[0] : data.data;

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch system settings:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch system settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
