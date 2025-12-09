import type { Metadata } from 'next';
import { getIdentity, getProfessionalSummaries, getPositions, getEducation, getCertifications, getSkills, getTechnologies, getProjects, getFootnotes } from '@/lib/data-source';

export const dynamic = 'force-static';

// Print styles for resume
const printStyles = `
  @page {
    size: letter;
    margin: 0.75in;
    @top-center {
      content: none;
    }
    @bottom-center {
      content: none;
    }
  }

  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Hide navigation and other UI elements */
    nav,
    header,
    footer,
    .no-print {
      display: none !important;
    }
    
    /* Reset main container for print */
    main {
      padding: 0 !important;
      margin: 0 !important;
      min-height: auto !important;
      background: white !important;
    }
    
    /* Optimize resume container for print */
    .resume-container {
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: white !important;
    }
    
    /* Ensure black text for print */
    body, * {
      color: black !important;
      background: white !important;
    }
    
    /* Page breaks */
    .page-break-before {
      page-break-before: always;
    }
    
    .page-break-after {
      page-break-after: always;
    }
    
    .page-break-avoid {
      page-break-inside: avoid;
    }
    
    /* Section spacing for print */
    section {
      margin-bottom: 24px !important;
    }
    
    /* Work experience entries */
    .work-experience-entry {
      page-break-inside: avoid;
      margin-bottom: 20px !important;
    }
    
    /* Headers */
    h1 {
      font-size: 24px !important;
      margin-bottom: 8px !important;
    }
    
    h2 {
      font-size: 18px !important;
      margin-bottom: 12px !important;
      margin-top: 20px !important;
    }
    
    h3 {
      font-size: 16px !important;
      margin-bottom: 6px !important;
    }
    
    /* Remove borders and backgrounds for print */
    .header-border {
      border-bottom: 2px solid black !important;
      margin-bottom: 24px !important;
    }

    .section-border {
      border-bottom: 1px solid black !important;
    }

    /* Project description formatting */
    .project-description p {
      margin: 0 0 8px 0 !important;
    }

    .project-description ul,
    .project-description ol {
      margin: 8px 0 !important;
      padding-left: 20px !important;
      list-style-type: disc !important;
    }

    .project-description ol {
      list-style-type: decimal !important;
    }

    .project-description li {
      margin: 2px 0 !important;
      list-style: inherit !important;
      display: list-item !important;
    }

    .project-description strong {
      font-weight: bold !important;
    }

    .project-description em {
      font-style: italic !important;
    }
  }

  /* Project description formatting for screen */
  .project-description p {
    margin: 0 0 8px 0;
  }

  .project-description ul,
  .project-description ol {
    margin: 8px 0;
    padding-left: 20px;
    list-style-type: disc;
  }

  .project-description ol {
    list-style-type: decimal;
  }

  .project-description li {
    margin: 2px 0;
    list-style: inherit;
    display: list-item;
  }

  .project-description strong {
    font-weight: bold;
  }

  .project-description em {
    font-style: italic;
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [identity, professionalSummaries] = await Promise.all([getIdentity(), getProfessionalSummaries()]);
    const fullName = identity 
      ? `${identity.first_name} ${identity.last_name}`.trim()
      : 'Resume';
    
    return {
      title: `Master Resume - ${fullName}`,
      description: 'Complete resume in text format including all positions, accomplishments, skills, and portfolio items.',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Master Resume',
      description: 'Complete resume in text format including all positions, accomplishments, skills, and portfolio items.',
    };
  }
}

async function fetchAllResumeData() {
  try {
    const [summary, experience, background, skills, technologies, projects, footnotes] = await Promise.all([
      Promise.all([getIdentity(), getProfessionalSummaries()]).then(([identity, professionalSummaries]) => ({ identity, professionalSummary: professionalSummaries?.[0], professionalSummaries })).catch(() => ({ identity: null, professionalSummary: null, professionalSummaries: [] })),
      getPositions().catch(() => []),
      Promise.all([getEducation(), getCertifications()]).then(([education, certifications]) => ({ education, certifications })).catch(() => ({ education: [], certifications: [] })),
      getSkills().catch(() => []),
      getTechnologies().catch(() => []),
      getProjects().catch(() => []),
      getFootnotes().catch(() => [])
    ]);

    return {
      identity: summary?.identity || null,
      professionalSummary: summary?.professionalSummary || null,
      professionalSummaries: summary?.professionalSummaries || [],
      experience: experience || [],
      education: background?.education || [],
      certifications: background?.certifications || [],
      skills: skills || [],
      technologies: technologies || [],
      projects: projects || [],
      footnotes: footnotes || []
    };
  } catch (error) {
    console.error('Error fetching complete resume data:', error);
    return {
      identity: null,
      professionalSummary: null,
      professionalSummaries: [],
      experience: [],
      education: [],
      certifications: [],
      skills: [],
      technologies: [],
      projects: [],
      footnotes: []
    };
  }
}

// Function to format dates for ATS compatibility
function formatDateForATS(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  } catch {
    return dateString; // Return original if parsing fails
  }
}

// Function to format project dates (year only)
function formatProjectDateForATS(startDate: string, endDate?: string, isCurrent?: boolean): string {
  if (!startDate) return '';

  try {
    const startYear = new Date(startDate).getFullYear();

    if (isCurrent) {
      return `${startYear} - Present`;
    }

    if (!endDate) {
      return startYear.toString();
    }

    const endYear = new Date(endDate).getFullYear();
    return `${startYear} - ${endYear}`;
  } catch {
    return startDate;
  }
}

// Function to format degree types
function formatDegreeType(degreeType: string): string {
  const degreeMap: { [key: string]: string } = {
    'high_school': 'High School Diploma',
    'associate': 'Associate Degree',
    'bachelor': 'Bachelor\'s Degree',
    'bachelors': 'Bachelor\'s Degree',
    'master': 'Master\'s Degree',
    'masters': 'Master\'s Degree',
    'phd': 'Ph.D.',
    'doctorate': 'Doctorate',
    'certificate': 'Certificate',
    'diploma': 'Diploma'
  };

  return degreeMap[degreeType.toLowerCase()] || degreeType;
}

// Function to clean HTML content for accomplishments
function cleanAccomplishmentHtml(htmlContent: string): string {
  if (!htmlContent) return '';

  // Remove wrapping <p> tags but preserve inner HTML like <strong>, <em>, etc.
  let cleaned = htmlContent.replace(/^<p[^>]*>|<\/p>$/g, '');

  // Replace multiple consecutive <p> tags with line breaks for multi-paragraph content
  cleaned = cleaned.replace(/<\/p>\s*<p[^>]*>/g, '<br><br>');

  // Clean up any remaining standalone <p> tags
  cleaned = cleaned.replace(/<\/?p[^>]*>/g, '');

  return cleaned.trim();
}

// Function to clean HTML content for project descriptions with better formatting preservation
function cleanProjectDescriptionHtml(htmlContent: string): string {
  if (!htmlContent) return '';

  let cleaned = htmlContent;

  // Handle paragraph tags more carefully - only convert to breaks if not containing lists
  cleaned = cleaned.replace(/<p[^>]*>(?![^<]*<\/?(ul|ol|li))/g, '');
  cleaned = cleaned.replace(/<\/p>(?![^<]*<\/?(ul|ol|li))/g, '<br><br>');

  // Preserve list formatting by ensuring proper spacing around lists
  cleaned = cleaned.replace(/(<\/ul>|<\/ol>)/g, '$1<br>');
  cleaned = cleaned.replace(/(<ul[^>]*>|<ol[^>]*>)/g, '<br>$1');

  // Clean up excessive line breaks while preserving intentional spacing
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){4,}/g, '<br><br><br>');
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3}/g, '<br><br>');

  // Remove leading breaks but preserve trailing structure
  cleaned = cleaned.replace(/^(<br\s*\/?>\s*)+/g, '');

  // Clean up spacing around lists
  cleaned = cleaned.replace(/(<br\s*\/?>\s*)+(<ul|<ol)/g, '$2');
  cleaned = cleaned.replace(/(<\/ul>|<\/ol>)(<br\s*\/?>\s*)+/g, '$1<br>');

  return cleaned.trim();
}

export default async function MasterResumePage() {
  const { identity, professionalSummary, professionalSummaries, experience, education, certifications, skills, technologies, projects, footnotes } = await fetchAllResumeData();
  
  // Fallback values if data is not available
  const fullName = identity 
    ? `${identity.first_name} ${identity.last_name}`.trim()
    : 'Resume';
  
  const tagline = identity?.tagline || 'Professional Resume';
  const email = identity?.email || '';
  const phone = identity?.phone || '';
  const linkedinUrl = identity?.linkedin_url || '';
  const location = identity?.location || '';
  
  // Create contact info array and filter out empty values
  const contactInfo = [
    email,
    phone,
    linkedinUrl,
    location
  ].filter(Boolean);
  const profileSummary = professionalSummary?.content || 'Professional summary not available.';
  const allSummaries = professionalSummaries || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <main style={{ 
        paddingTop: '72px', // Account for fixed header
        minHeight: '100vh',
        background: '#ffffff'
      }}>
        <div 
          className="resume-container"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            backgroundColor: '#ffffff',
            color: '#000000',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px',
            lineHeight: '1.6'
          }}>
          {/* Header */}
          <div className="header-border page-break-avoid" style={{ 
            marginBottom: '40px', 
            borderBottom: '2px solid #000', 
            paddingBottom: '20px',
            textAlign: 'center'
          }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {fullName}
          </h1>
          <p style={{ fontSize: '16px', margin: '0 0 15px 0' }}>
            {tagline}
          </p>
          
          {/* Contact Information */}
          {contactInfo.length > 0 && (
            <div style={{ fontSize: '14px' }}>
              <p style={{ margin: '5px 0' }}>
                {contactInfo.join(' • ')}
              </p>
            </div>
          )}
      </div>

      {/* Professional Summaries */}
      {allSummaries.length > 0 ? (
        allSummaries.map((summary: any, index: number) => (
          <section key={summary.id || index} style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              margin: '0 0 15px 0',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              paddingBottom: '5px'
            }}>
              {summary.title || 'Professional Summary'}
            </h2>
            <div 
              style={{ margin: '0', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: summary.content || 'Summary content not available.' }}
            />
          </section>
        ))
      ) : (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Professional Summary
          </h2>
          <div 
            style={{ margin: '0', whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: profileSummary }}
          />
        </section>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Work Experience
          </h2>
          {experience.map((position: any, index: number) => (
            <div key={position.id || index} className="work-experience-entry page-break-avoid" style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {position.position_title || position.primary_title}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {position.company?.name || position.company_name} | {position.end_date ? `${formatDateForATS(position.start_date)} - ${formatDateForATS(position.end_date)}` : formatDateForATS(position.start_date)}
              </p>
              {position.location && (
                <p style={{ fontSize: '14px', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                  {position.location}
                </p>
              )}
              {position.summary && (
                <p style={{ margin: '0 0 10px 0' }}>
                  {position.summary}
                </p>
              )}
              {position.accomplishments && position.accomplishments.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    {position.accomplishments.map((accomplishment: any, accIndex: number) => (
                      <li key={accomplishment.id || accIndex} style={{ margin: '5px 0', listStyle: 'none' }}>
                        <span>- </span>
                        <span
                          style={{ margin: '0', whiteSpace: 'pre-wrap', color: '#555555' }}
                          dangerouslySetInnerHTML={{
                            __html: cleanAccomplishmentHtml(accomplishment.primary_description || accomplishment.description || accomplishment.title)
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Projects
          </h2>
          {projects.map((project: any, index: number) => (
            <div key={project.id || index} className="page-break-avoid" style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {project.name || project.title}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {formatProjectDateForATS(project.start_date, project.end_date, project.current_project || project.is_present)}
              </p>
              {project.description && (
                <div
                  style={{
                    margin: '0 0 10px 0',
                    lineHeight: '1.4'
                  }}
                  className="project-description"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p style={{ fontSize: '14px', margin: '0 0 5px 0', fontStyle: 'italic' }}>
                  Technologies: {project.technologies.map((tech: any) => 
                    tech.technologies_id?.name || tech.name || tech
                  ).join(', ')}
                </p>
              )}
              {(project.github_url || project.live_url || project.url) && (
                <p style={{ fontSize: '14px', margin: '0' }}>
                  {project.github_url && `GitHub: ${project.github_url}`}
                  {project.github_url && (project.live_url || project.url) && ' | '}
                  {(project.live_url || project.url) && `Live: ${project.live_url || project.url}`}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Education
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={edu.id || index} style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {edu.graduation_date ? formatDegreeType(edu.degree_type) : 'Studies'} in {edu.field_of_study}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>
                {edu.institution} | {edu.graduation_date ? `${formatDateForATS(edu.start_date)} - ${formatDateForATS(edu.graduation_date)}` : formatDateForATS(edu.start_date)}
              </p>
              {edu.gpa && (
                <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>
                  GPA: {edu.gpa}
                </p>
              )}
              {edu.accomplishments && edu.accomplishments.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    {edu.accomplishments.map((accomplishment: any, accIndex: number) => {
                      // Handle both direct accomplishments and nested accomplishments_id structure
                      const acc = accomplishment.accomplishments_id || accomplishment;
                      const htmlContent = acc.primary_description || acc.description || acc.title || '';
                      return (
                        <li key={acc.id || accIndex} style={{ margin: '5px 0', listStyle: 'none' }}>
                          <span>- </span>
                          <span
                            style={{ margin: '0', whiteSpace: 'pre-wrap', color: '#555555' }}
                            dangerouslySetInnerHTML={{ __html: cleanAccomplishmentHtml(htmlContent) }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Skills
          </h2>
          <p style={{ margin: '0', lineHeight: '1.4' }}>
            {skills.map((skill: any, index: number) => 
              skill.name + (skill.proficiency_level ? ` (${skill.proficiency_level}/5)` : '')
            ).join(' • ')}
          </p>
        </section>
      )}

      {/* Technical Skills / Technologies */}
      {technologies && technologies.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Technical Skills
          </h2>
          <p style={{ margin: '0', lineHeight: '1.4' }}>
            {technologies.map((tech: any) => tech.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Certifications
          </h2>
          {certifications.map((cert: any, index: number) => (
            <div key={cert.id || index} style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {cert.name}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>
                {cert.issuing_organization} | Issued: {cert.issue_date}
              </p>
              {cert.expiration_date && (
                <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>
                  Expires: {cert.expiration_date}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Footnotes */}
      {footnotes && footnotes.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '0 0 15px 0',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '5px'
          }}>
            Footnotes
          </h2>
          {footnotes.map((footnote: any, index: number) => (
            <div key={footnote.id || index} style={{ marginBottom: '15px' }}>
              <div
                style={{ margin: '0', fontSize: '12px', color: '#666666', lineHeight: '1.4' }}
                dangerouslySetInnerHTML={{ __html: footnote.description }}
              />
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <footer style={{ 
        marginTop: '60px', 
        paddingTop: '20px', 
        borderTop: '2px solid #000',
        fontSize: '12px',
        textAlign: 'center' as const
      }}>
        <p style={{ margin: '0' }}>
          Generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        {identity?.website_url && (
          <p style={{ margin: '5px 0 0 0' }}>
            Complete portfolio available at: {identity.website_url}
          </p>
        )}
      </footer>
        </div>
      </main>
    </>
  );
}