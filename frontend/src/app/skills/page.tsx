import { getSkills, getTechnologies } from '@/lib/data-source';
import PageLayout from '@/components/layout/PageLayout';
import SkillsDisplay from '@/components/skills/SkillsDisplay';

function calculateYearsExperience(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears);
}

export default async function SkillsPage() {
  let skills: any[] = [];
  let technologies: any[] = [];
  let error: string | null = null;

  try {
    [skills, technologies] = await Promise.all([
      getSkills(),
      getTechnologies()
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load data';
    console.error('Skills page data fetch error:', err);
  }

  // Group skills by category for stats
  const skillsByCategory = skills.reduce((acc: Record<string, any[]>, skill: any) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  // Create header content for the stats
  const headerContent = skills.length > 0 ? (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '48px',
      marginTop: '32px',
      flexWrap: 'wrap'
    }}>
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {skills.length}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Total Skills
        </div>
      </div>
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {technologies.length}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Total Technologies
        </div>
      </div>
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {Object.keys(skillsByCategory).length}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Categories
        </div>
      </div>
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {skills.filter(s => s.start_date && calculateYearsExperience(s.start_date) >= 5).length}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          5+ Years Experience
        </div>
      </div>
    </div>
  ) : null;

  return (
    <PageLayout
      title="Skills"
      description="Technical proficiencies and business skills in technology, product management, and strategy."
      headerContent={headerContent}
    >
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '16px', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* Proficiencies Section */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '48px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(28px, 3.5vw, 36px)',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  Core Skills
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0,
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Professional expertise in technology, leadership, and strategy.
                </p>
              </div>
            </div>
          )}

          <SkillsDisplay
            skills={skills}
            technologies={technologies}
            directusUrl={process.env.NEXT_PUBLIC_DIRECTUS_URL}
          />
        </div>
      </section>
    </PageLayout>
  );
}
