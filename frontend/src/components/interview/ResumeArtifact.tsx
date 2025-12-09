'use client';

import { FileText, Briefcase, GraduationCap, Award, Code, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export interface ResumeData {
  contactInfo: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  skills: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    graduationDate?: string;
    details?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
    url?: string;
  }>;
}

interface ResumeArtifactProps {
  data: ResumeData | null;
  isGenerating?: boolean;
  targetRole?: string;
  targetCompany?: string;
}

export function ResumeArtifact({ data, isGenerating, targetRole, targetCompany }: ResumeArtifactProps) {
  if (!data && !isGenerating) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            backgroundColor: '#e0e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <FileText size={36} style={{ color: '#6366f1' }} />
        </div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 8px 0',
          }}
        >
          No Resume Generated Yet
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0,
            maxWidth: '300px',
            lineHeight: 1.6,
          }}
        >
          Paste a job description in the chat to generate a tailored resume that highlights your most relevant experience.
        </p>
      </div>
    );
  }

  if (isGenerating && !data) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 8px 0',
          }}
        >
          Generating Your Resume...
        </h3>
        {targetRole && (
          <p
            style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
            }}
          >
            Tailoring for {targetRole}
            {targetCompany && ` at ${targetCompany}`}
          </p>
        )}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '40px',
        maxWidth: '100%',
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* Header / Contact Info */}
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #1e293b', paddingBottom: '16px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1e293b',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {data.contactInfo.name}
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: '#475569',
          }}
        >
          {data.contactInfo.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              {data.contactInfo.email}
            </span>
          )}
          {data.contactInfo.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} />
              {data.contactInfo.phone}
            </span>
          )}
          {data.contactInfo.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              {data.contactInfo.location}
            </span>
          )}
          {data.contactInfo.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Linkedin size={14} />
              {data.contactInfo.linkedin}
            </span>
          )}
          {data.contactInfo.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Github size={14} />
              {data.contactInfo.github}
            </span>
          )}
          {data.contactInfo.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} />
              {data.contactInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={sectionHeaderStyle}>Professional Summary</h2>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#374151',
              margin: 0,
            }}
          >
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={sectionHeaderStyle}>
            <Briefcase size={16} style={{ marginRight: '8px' }} />
            Professional Experience
          </h2>
          {data.experience.map((job, index) => (
            <div key={index} style={{ marginBottom: index < data.experience.length - 1 ? '20px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  {job.title}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  {job.startDate} – {job.current ? 'Present' : job.endDate}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
                {job.company}
                {job.location && ` • ${job.location}`}
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                {job.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: '#374151',
                      marginBottom: '4px',
                      listStyleType: 'disc',
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && (data.skills.technical?.length || data.skills.soft?.length || data.skills.tools?.length) && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={sectionHeaderStyle}>
            <Code size={16} style={{ marginRight: '8px' }} />
            Skills
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Technical:</strong> {data.skills.technical.join(', ')}
              </div>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Tools & Technologies:</strong> {data.skills.tools.join(', ')}
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Soft Skills:</strong> {data.skills.soft.join(', ')}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={sectionHeaderStyle}>
            <GraduationCap size={16} style={{ marginRight: '8px' }} />
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: index < data.education.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  {edu.degree}
                </h3>
                {edu.graduationDate && (
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{edu.graduationDate}</span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>{edu.institution}</div>
              {edu.details && (
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{edu.details}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={sectionHeaderStyle}>
            <Award size={16} style={{ marginRight: '8px' }} />
            Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.certifications.map((cert, index) => (
              <div key={index} style={{ fontSize: '13px', color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>{cert.name}</strong>
                {cert.issuer && ` – ${cert.issuer}`}
                {cert.date && (
                  <span style={{ color: '#64748b' }}> ({cert.date})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 style={sectionHeaderStyle}>Notable Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: index < data.projects!.length - 1 ? '16px' : 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                {project.name}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3b82f6', fontWeight: 400, marginLeft: '8px', fontSize: '12px' }}
                  >
                    View Project →
                  </a>
                )}
              </h3>
              <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                {project.description}
              </p>
              {project.technologies && project.technologies.length > 0 && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <em>Technologies: {project.technologies.join(', ')}</em>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#1e293b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  margin: '0 0 12px 0',
  paddingBottom: '6px',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
};
