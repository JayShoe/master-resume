import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: '#0ea5e9',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 20,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
        }}
      >
        MR
      </div>
    ),
    {
      ...size,
    }
  )
}