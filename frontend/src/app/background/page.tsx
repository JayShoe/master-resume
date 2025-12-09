import type { Metadata } from 'next';
import { getEducation, getCertifications, getPositions, getSkills, getAccomplishments } from '@/lib/data-source';

export const dynamic = 'force-static';
import EducationTimeline from '@/components/background/EducationTimeline';
import CertificationDisplay from '@/components/background/CertificationDisplay';
import AwardsSection from '@/components/background/AwardsSection';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Educational Background & Certifications',
  description: 'Academic credentials, professional certifications, awards, and educational achievements throughout my career journey.',
  keywords: 'education, certifications, awards, academic background, professional development, training',
  openGraph: {
    title: 'Educational Background & Certifications',
    description: 'Explore my educational journey, professional certifications, and recognition achievements.',
    type: 'profile',
  },
};

export default async function BackgroundPage() {
  let education: any[] = [];
  let certifications: any[] = [];
  let experience: any[] = [];
  let skills: any[] = [];
  let accomplishments: any[] = [];
  let error = null;

  try {
    [education, certifications, experience, skills, accomplishments] = await Promise.all([
      getEducation(),
      getCertifications(),
      getPositions(),
      getSkills(),
      getAccomplishments()
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load background data';
    console.error('Background page data fetch error:', err);
  }
  
  // Calculate stats
  const activeCertifications = certifications.filter((cert: any) => 
    !cert.expiry_date || new Date(cert.expiry_date) > new Date()
  );
  const completedEducation = education.length;
  const yearsOfEducation = education.reduce((total: number, edu: any) => {
    const start = new Date(edu.start_date);
    const end = edu.end_date ? new Date(edu.end_date) : new Date();
    const years = (end.getFullYear() - start.getFullYear());
    return total + Math.max(1, years);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Educational Background
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive overview of my academic journey, professional certifications, 
            and recognition achievements that have shaped my expertise.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              {completedEducation} Degrees
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              {activeCertifications.length} Active Certifications
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              {yearsOfEducation}+ Years of Study
            </span>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-red-800 font-semibold mb-2">Data Loading Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Education Timeline */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Educational Journey</h2>
                <p className="text-muted-foreground">
                  Academic milestones and formal education achievements
                </p>
              </div>
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg"></div>}>
                <EducationTimeline 
                  education={education} 
                  experience={experience}
                  skills={skills}
                />
              </Suspense>
            </section>

            {/* Certifications */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Professional Certifications</h2>
                <p className="text-muted-foreground">
                  Industry certifications and professional development achievements
                </p>
              </div>
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg"></div>}>
                <CertificationDisplay certifications={certifications} />
              </Suspense>
            </section>

            {/* Awards and Recognition */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
                <p className="text-muted-foreground">
                  Professional achievements, honors, and recognition received throughout my career
                </p>
              </div>
              <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg"></div>}>
                <AwardsSection 
                  experience={experience}
                  skills={skills}
                  certifications={certifications}
                  accomplishments={accomplishments}
                />
              </Suspense>
            </section>
          </>
        )}
      </div>
    </div>
  );
}