'use client';

import { InterviewPracticeChat } from '@/components/interview/InterviewPracticeChat';

interface InterviewClientProps {
  identity: {
    first_name: string;
    last_name?: string;
    tagline?: string;
    profile_image?: string | null;
  };
}

export function InterviewClient({ identity }: InterviewClientProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 80px -20px rgba(0,0,0,0.25)',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
      }}
    >
      <InterviewPracticeChat identity={identity} />
    </div>
  );
}
