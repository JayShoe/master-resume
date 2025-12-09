import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.NEXT_PUBLIC_DIRECTUS_TOKEN;

/**
 * Proxy API route to forward requests to Directus with authentication
 * This allows client-side code to access Directus without exposing the token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!DIRECTUS_TOKEN) {
      return NextResponse.json(
        { error: 'Directus token not configured' },
        { status: 500 }
      );
    }

    const { path } = await params;
    const pathString = path.join('/');

    // Get query string from the request
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';

    const url = `${DIRECTUS_URL}/${pathString}${queryString}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Directus API error: ${response.status}`, errorText);
      return NextResponse.json(
        { error: `Directus API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Directus proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
