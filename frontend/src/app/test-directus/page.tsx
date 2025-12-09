'use client';

import { useEffect, useState } from 'react';
import { getIdentity } from '@/lib/directus';

export default function TestDirectusPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [identityStatus, setIdentityStatus] = useState<string>('Not tested yet');
  const [error, setError] = useState<any>(null);
  const [identityData, setIdentityData] = useState<any>(null);

  useEffect(() => {
    // Test identity fetch (this will also test the connection)
    getIdentity()
      .then((identity) => {
        setConnectionStatus('✅ Connection successful!');
        setIdentityStatus('✅ Identity fetched successfully!');
        setIdentityData(identity);
        console.log('Identity data:', identity);
      })
      .catch((err) => {
        setConnectionStatus('❌ Connection failed');
        setIdentityStatus('❌ Identity fetch failed');
        setError(err);
        console.error('Identity fetch error:', err);
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Directus Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Environment Variables:</h2>
          <ul className="space-y-1 text-sm">
            <li>NEXT_PUBLIC_DIRECTUS_URL: {process.env.NEXT_PUBLIC_DIRECTUS_URL || 'NOT SET'}</li>
            <li>DIRECTUS_TOKEN: {process.env.DIRECTUS_TOKEN ? '✅ SET' : '❌ NOT SET'}</li>
          </ul>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Connection Status:</h2>
          <p>{connectionStatus}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Identity Fetch Status:</h2>
          <p>{identityStatus}</p>
          {identityData && (
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(identityData, null, 2)}
            </pre>
          )}
        </div>

        {error && (
          <div className="p-4 border border-red-500 rounded">
            <h2 className="font-semibold mb-2 text-red-600">Error Details:</h2>
            <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}