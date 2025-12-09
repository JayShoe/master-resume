import { Target, Award, Users } from 'lucide-react';
import { getProfileImageUrl } from '@/lib/api';
import { getIdentity, getProfessionalSummaries } from '@/lib/data-source';

interface ProfessionalSummary {
  id: number;
  title: string;
  content: string;
  target_industry?: string;
  target_role_type?: string;
  is_default: boolean;
  status?: string;
}

interface Identity {
  first_name: string;
  last_name: string;
  tagline?: string;
  profile_photo?: string;
}

export default async function AboutPage() {
  let identity: Identity | null = null;
  let summaries: ProfessionalSummary[] = [];

  try {
    [identity, summaries] = await Promise.all([
      getIdentity(),
      getProfessionalSummaries()
    ]);

    // Filter out archived/draft summaries
    summaries = summaries.filter((summary: ProfessionalSummary) =>
      summary.status !== 'archived' && summary.status !== 'draft'
    );
  } catch (error) {
    console.log('Using fallback content for About page');
  }

  const primarySummary = summaries.find(s => s.is_default);
  const secondarySummaries = summaries.filter(s => !s.is_default);

  const customHeader = (
    <div style={{
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      borderBottom: '1px solid #e5e7eb',
      paddingTop: '60px',
      paddingBottom: '60px'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Mobile Layout - Stacked */}
        <div className="block md:hidden">
          <div className="text-center space-y-6">
            {/* Profile Photo */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white shadow-xl flex items-center justify-center text-white text-5xl font-bold">
                {(() => {
                  const profileImageUrl = getProfileImageUrl(identity);
                  return profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={`${identity?.first_name} ${identity?.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    identity ?
                      `${identity.first_name[0]}${identity.last_name[0]}` :
                      ''
                  );
                })()}
              </div>
            </div>

            {/* Name and Tagline */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {identity ?
                  `${identity.first_name} ${identity.last_name}` :
                  'Portfolio'
                }
              </h1>
              <p className="text-lg text-blue-600 font-semibold">
                {identity?.tagline || 'Product Leader with an Entrepreneur\'s Heart'}
              </p>
            </div>

            {/* Professional Summary */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 20px 0'
              }}>
                {primarySummary ? primarySummary.title : 'Professional Summary'}
              </h2>
              <div style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '1.7',
                textAlign: 'justify',
                marginBottom: '24px'
              }}>
                {primarySummary ?
                  primarySummary.content.replace(/<[^>]*>/g, '') :
                  "Transforming complex challenges into scalable solutions that deliver exceptional business value through strategic thinking and hands-on execution."
                }
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 justify-end">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Target size={14} />
                  {primarySummary?.target_industry || 'Technology & E-commerce'}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                  <Award size={14} />
                  {primarySummary?.target_role_type || 'Product Leadership'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[320px_1fr] gap-12 items-start">
            {/* Left Column - Profile Info */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white shadow-xl flex items-center justify-center text-white text-6xl font-bold">
                  {(() => {
                    const profileImageUrl = getProfileImageUrl(identity);
                    return profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={`${identity?.first_name} ${identity?.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      identity ?
                        `${identity.first_name[0]}${identity.last_name[0]}` :
                        ''
                    );
                  })()}
                </div>
              </div>

              {/* Name and Tagline */}
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {identity ?
                    `${identity.first_name} ${identity.last_name}` :
                    'Portfolio'
                  }
                </h1>
                <p className="text-base text-blue-600 font-semibold">
                  {identity?.tagline || 'Product Leader with an Entrepreneur\'s Heart'}
                </p>
              </div>
            </div>

            {/* Right Column - Professional Summary */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 24px 0'
              }}>
                {primarySummary ? primarySummary.title : 'Professional Summary'}
              </h2>
              <div style={{
                fontSize: '18px',
                color: '#374151',
                lineHeight: '1.7',
                textAlign: 'justify',
                marginBottom: '32px'
              }}>
                {primarySummary ?
                  primarySummary.content.replace(/<[^>]*>/g, '') :
                  "Transforming complex challenges into scalable solutions that deliver exceptional business value through strategic thinking and hands-on execution."
                }
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 justify-end">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Target size={14} />
                  {primarySummary?.target_industry || 'Technology & E-commerce'}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                  <Award size={14} />
                  {primarySummary?.target_role_type || 'Product Leadership'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main style={{
      paddingTop: '72px', // Account for fixed header
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      {customHeader}


      {/* Other Professional Summaries Section */}
      <section className="section" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 16px 0'
              }}>
                Additional Professional Perspectives
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                margin: 0
              }}>
                {secondarySummaries.length > 0 ?
                  `Explore ${secondarySummaries.length} additional professional summaries tailored for different industries and roles.` :
                  'Professional summaries for various industries and roles will appear here when available.'
                }
              </p>
            </div>

            {secondarySummaries.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {secondarySummaries.map((summary) => (
                  <div
                    key={summary.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      padding: '24px'
                    }}
                  >
                    <div style={{
                      marginBottom: '16px'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {summary.title}
                      </h3>
                      {(summary.target_industry || summary.target_role_type) && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          {summary.target_industry && (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#6b7280',
                              background: '#f3f4f6',
                              padding: '4px 12px',
                              borderRadius: '12px'
                            }}>
                              {summary.target_industry}
                            </span>
                          )}
                          {summary.target_role_type && (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#6b7280',
                              background: '#f3f4f6',
                              padding: '4px 12px',
                              borderRadius: '12px'
                            }}>
                              {summary.target_role_type}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      dangerouslySetInnerHTML={{ __html: summary.content }}
                      className="prose max-w-none"
                      style={{
                        color: '#374151',
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <Users size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Additional professional summaries will appear here once they're available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}