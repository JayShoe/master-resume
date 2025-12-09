import { getIdentity } from '@/lib/data-source';
import { getProfileImageUrl } from '@/lib/api';
import { InterviewClient } from './InterviewClient';

// This page needs to be dynamic for the chat API to work
export const dynamic = 'force-dynamic';

export default async function InterviewPage() {
  let identity: { first_name: string; last_name?: string; tagline?: string; profile_image?: string | null } = {
    first_name: 'Jay',
  };

  try {
    const data = await getIdentity();
    if (data) {
      identity = {
        first_name: data.first_name || 'Jay',
        last_name: data.last_name,
        tagline: data.tagline,
        profile_image: getProfileImageUrl(data),
      };
    }
  } catch (error) {
    console.log('Using fallback identity for Interview page');
  }

  return (
    <div
      className="fixed inset-0 top-20 sm:top-[88px]"
      style={{
        background: 'linear-gradient(to bottom right, #f1f5f9, #eff6ff, #eef2ff)',
      }}
    >
      {/* Decorative background elements - hidden on mobile for performance */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', top: '80px', left: '40px', width: '288px', height: '288px', background: 'rgba(96, 165, 250, 0.2)', borderRadius: '50%', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', top: '160px', right: '80px', width: '384px', height: '384px', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '50%', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '33%', width: '320px', height: '320px', background: 'rgba(129, 140, 248, 0.2)', borderRadius: '50%', filter: 'blur(48px)' }} />
      </div>

      {/* Content container - fills available space below navbar */}
      <div
        className="relative z-10 h-full w-full p-3 sm:p-6 box-border"
      >
        <InterviewClient identity={identity} />
      </div>
    </div>
  );
}
