'use client'

import { useState, useEffect } from 'react'
import { getDirectusFileUrl, getProfileImageUrl } from '@/lib/api'
import { getIdentity } from '@/lib/data-source'

export default function DebugAssets() {
  const [identity, setIdentity] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const identity = await getIdentity()
        setIdentity(identity)
        
        const profileUrl = getProfileImageUrl(identity)
        setImageUrl(profileUrl)

        // Test different URL formats
        const tests = [
          {
            name: 'Profile Image URL',
            url: profileUrl,
            description: 'Generated profile image URL'
          },
          {
            name: 'Direct Asset Access',
            url: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/9dc22055-dec6-44f5-b66a-f2ae608a056a`,
            description: 'Direct asset access without token'
          },
          {
            name: 'Asset with Token',
            url: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/9dc22055-dec6-44f5-b66a-f2ae608a056a?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
            description: 'Asset access with token'
          }
        ]

        setTestResults(tests)
      } catch (error) {
        console.error('Error loading debug data:', error)
      }
    }

    loadData()
  }, [])

  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Asset Debug Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>NEXT_PUBLIC_DIRECTUS_URL:</strong> {process.env.NEXT_PUBLIC_DIRECTUS_URL}</p>
            <p><strong>NEXT_PUBLIC_DIRECTUS_TOKEN:</strong> {process.env.NEXT_PUBLIC_DIRECTUS_TOKEN ? 'Set' : 'Not set'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Identity Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(identity, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Image URL</h2>
          <p className="mb-4">{imageUrl || 'No image URL generated'}</p>
          {imageUrl && (
            <div className="space-y-4">
              <img 
                src={imageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl)
                  e.currentTarget.style.border = '2px solid red'
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl)
                }}
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Different URLs</h2>
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-semibold">{test.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-2 break-all">
                  {test.url}
                </p>
                {test.url && (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={test.url} 
                      alt={test.name}
                      className="w-16 h-16 object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.border = '2px solid red'
                        e.currentTarget.alt = 'Failed to load'
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.border = '2px solid green'
                      }}
                    />
                    <a 
                      href={test.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}