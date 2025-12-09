import { getProjects, getSystemSettings } from '@/lib/data-source';
import PageLayout from '@/components/layout/PageLayout';
import { Code2 } from 'lucide-react';
import SimpleProjectCard from '@/components/projects/SimpleProjectCard';

// Helper function to get initials from site name
function getSiteInitials(siteName: string): string {
  if (!siteName) return 'JS';

  const words = siteName.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 'JS';

  const firstWord = words[0];
  if (!firstWord) return 'JS';

  if (words.length === 1) {
    // Single word - take first two letters
    return firstWord.substring(0, 2).toUpperCase();
  }

  // Multiple words - take first letter of first two words
  const secondWord = words[1];
  const firstChar = firstWord[0];
  const secondChar = secondWord?.[0];

  if (!secondChar || !firstChar) {
    return firstChar?.toUpperCase() || 'JS';
  }

  return (firstChar + secondChar).toUpperCase();
}

export default async function ProjectsPage() {
  let projects: any[] = [];
  let error: string | null = null;
  let siteInitials = 'JS'; // default fallback

  try {
    const data = await getProjects();
    // Filter to only show published projects and sort by start_date (newest first)
    projects = data
      .filter((project: any) => project.status === 'published')
      .sort((a: any, b: any) => {
        // Sort by start_date in descending order (newest first)
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateB - dateA;
      });

    // Fetch system settings for site initials
    try {
      const settings = await getSystemSettings();
      const settingsData = Array.isArray(settings) ? settings[0] : settings;
      if (settingsData?.site_name) {
        siteInitials = getSiteInitials(settingsData.site_name);
      }
    } catch (settingsErr) {
      console.warn('Could not load system settings for initials:', settingsErr);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects data';
    console.error('Projects page data fetch error:', err);
  }


  // Separate projects by type for stats
  const professionalProjects = projects.filter(p => 
    p.project_type === 'professional' || p.project_type === 'client' || p.project_type === 'commercial'
  );
  
  const personalProjects = projects.filter(p => 
    p.project_type === 'personal' || p.project_type === 'side-project' || p.project_type === 'experiment'
  );

  const liveProjects = projects.filter(p => p.status === 'published' || p.status === 'live' || p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Projects are already sorted by start_date from the useEffect
  const allProjectsForGrid = projects;

  // Create header content for the stats
  const headerContent = projects.length > 0 ? (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '20px',
      marginTop: '24px',
      maxWidth: '600px',
      margin: '24px auto 0'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {projects.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Total Projects
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {professionalProjects.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Professional
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {liveProjects.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Live & Active
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
          {completedProjects.length}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.2 }}>
          Completed
        </div>
      </div>
    </div>
  ) : null;

  return (
    <PageLayout
      title="Projects Portfolio"
      description="A curated collection of my work spanning professional projects, personal experiments, and open-source contributions."
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


          {/* All Projects Grid */}
          {allProjectsForGrid.length > 0 && (
            <div style={{ marginBottom: '64px' }}>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 16px'
              }}>
                {allProjectsForGrid.map((project, index) => (
                  <SimpleProjectCard
                    key={project.id || index}
                    project={project}
                    index={index}
                    siteInitials={siteInitials}
                  />
                ))}
              </div>
            </div>
          )}


          {/* Empty State */}
          {!error && projects.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '64px 32px',
              color: '#6b7280'
            }}>
              <Code2 size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                No Projects Found
              </h3>
              <p>Project portfolio will appear here once loaded.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}