import type { ResumeContext } from './types';

/**
 * Formats positions for the system prompt
 */
function formatPositions(positions: ResumeContext['positions']): string {
  if (!positions?.length) return 'No work experience available.';

  return positions
    .map((pos) => {
      const company = pos.company?.name || 'Unknown Company';
      const dateRange = pos.is_current
        ? `${pos.start_date || 'Unknown'} - Present`
        : `${pos.start_date || 'Unknown'} - ${pos.end_date || 'Unknown'}`;

      let entry = `### ${pos.primary_title} at ${company}\n`;
      entry += `**Duration:** ${dateRange}\n`;
      if (pos.department) entry += `**Department:** ${pos.department}\n`;
      if (pos.employment_type) entry += `**Type:** ${pos.employment_type}\n`;
      if (pos.summary) entry += `**Summary:** ${pos.summary}\n`;
      if (pos.description) entry += `${pos.description}\n`;

      if (pos.accomplishments?.length) {
        entry += '\n**Key Accomplishments:**\n';
        pos.accomplishments.forEach((acc) => {
          entry += `- ${acc.primary_title}`;
          if (acc.impact_metrics) entry += ` (${acc.impact_metrics})`;
          entry += '\n';
        });
      }

      return entry;
    })
    .join('\n---\n');
}

/**
 * Formats accomplishments for the system prompt
 */
function formatAccomplishments(accomplishments: ResumeContext['accomplishments']): string {
  if (!accomplishments?.length) return 'No accomplishments available.';

  return accomplishments
    .map((acc) => {
      let entry = `- **${acc.primary_title}**`;
      if (acc.accomplishment_type) entry += ` [${acc.accomplishment_type}]`;
      entry += '\n';
      entry += `  ${acc.primary_description.replace(/<[^>]*>/g, '')}`;
      if (acc.impact_metrics) entry += `\n  *Impact: ${acc.impact_metrics}*`;

      const relatedItems: string[] = [];
      if (acc.related_skills?.length) {
        relatedItems.push(`Skills: ${acc.related_skills.map(s => s.name).join(', ')}`);
      }
      if (acc.related_technologies?.length) {
        relatedItems.push(`Tech: ${acc.related_technologies.map(t => t.name).join(', ')}`);
      }
      if (relatedItems.length) {
        entry += `\n  (${relatedItems.join(' | ')})`;
      }

      return entry;
    })
    .join('\n\n');
}

/**
 * Formats skills for the system prompt
 */
function formatSkills(skills: ResumeContext['skills']): string {
  if (!skills?.length) return 'No skills available.';

  // Group by category
  const grouped: Record<string, typeof skills> = {};
  skills.forEach((skill) => {
    const category = skill.category || 'Other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(skill);
  });

  return Object.entries(grouped)
    .map(([category, categorySkills]) => {
      const skillsList = categorySkills
        .map((s) => {
          let entry = s.name;
          if (s.proficiency_level) entry += ` (${s.proficiency_level}/5)`;
          if (s.is_core_skill) entry += ' ⭐';
          return entry;
        })
        .join(', ');
      return `**${category}:** ${skillsList}`;
    })
    .join('\n');
}

/**
 * Formats technologies for the system prompt
 */
function formatTechnologies(technologies: ResumeContext['technologies']): string {
  if (!technologies?.length) return 'No technologies available.';

  // Group by category
  const grouped: Record<string, typeof technologies> = {};
  technologies.forEach((tech) => {
    const category = tech.category || 'Other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(tech);
  });

  return Object.entries(grouped)
    .map(([category, categoryTech]) => {
      const techList = categoryTech
        .map((t) => {
          let entry = t.name;
          const details: string[] = [];
          if (t.proficiency_level) details.push(`${t.proficiency_level}/5`);
          if (t.years_experience) details.push(`${t.years_experience}yr`);
          if (details.length) entry += ` (${details.join(', ')})`;
          if (t.is_current) entry += ' [current]';
          return entry;
        })
        .join(', ');
      return `**${category}:** ${techList}`;
    })
    .join('\n');
}

/**
 * Formats projects for the system prompt
 */
function formatProjects(projects: ResumeContext['projects']): string {
  if (!projects?.length) return 'No projects available.';

  return projects
    .map((proj) => {
      let entry = `### ${proj.name}`;
      if (proj.current_project) entry += ' [Active]';
      entry += '\n';

      if (proj.role) entry += `**Role:** ${proj.role}\n`;
      if (proj.project_type) entry += `**Type:** ${proj.project_type}\n`;
      if (proj.summary) entry += `**Summary:** ${proj.summary}\n`;
      if (proj.description) {
        entry += `${proj.description.replace(/<[^>]*>/g, '')}\n`;
      }

      if (proj.technologies_used?.length) {
        entry += `**Technologies:** ${proj.technologies_used.map(t => t.name).join(', ')}\n`;
      }
      if (proj.skills_demonstrated?.length) {
        entry += `**Skills:** ${proj.skills_demonstrated.map(s => s.name).join(', ')}\n`;
      }

      const links: string[] = [];
      if (proj.github_url) links.push(`GitHub: ${proj.github_url}`);
      if (proj.project_url) links.push(`Live: ${proj.project_url}`);
      if (links.length) entry += `**Links:** ${links.join(' | ')}\n`;

      return entry;
    })
    .join('\n---\n');
}

/**
 * Formats education for the system prompt
 */
function formatEducation(education: ResumeContext['education']): string {
  if (!education?.length) return 'No education available.';

  return education
    .map((edu) => {
      let entry = `- **${edu.institution}**`;
      if (edu.degree_type && edu.field_of_study) {
        entry += `: ${edu.degree_type} in ${edu.field_of_study}`;
      } else if (edu.degree_type) {
        entry += `: ${edu.degree_type}`;
      }
      if (edu.graduation_date) entry += ` (${edu.graduation_date})`;
      if (edu.summary) entry += `\n  ${edu.summary}`;
      return entry;
    })
    .join('\n');
}

/**
 * Formats certifications for the system prompt
 */
function formatCertifications(certifications: ResumeContext['certifications']): string {
  if (!certifications?.length) return 'No certifications available.';

  return certifications
    .map((cert) => {
      let entry = `- **${cert.name}**`;
      if (cert.issuing_organization) entry += ` (${cert.issuing_organization})`;
      if (cert.issue_date) entry += ` - ${cert.issue_date}`;
      if (cert.is_active === false) entry += ' [Expired]';
      return entry;
    })
    .join('\n');
}

/**
 * Builds the complete system prompt from resume context
 */
export function buildSystemPrompt(context: ResumeContext): string {
  const { identity } = context;

  return `You are ${identity.first_name} ${identity.last_name}, participating in a professional interview. A recruiter or hiring manager is asking you questions about your background, experience, and qualifications.

## Your Identity
- **Name:** ${identity.first_name} ${identity.last_name}
${identity.location ? `- **Location:** ${identity.location}` : ''}
${identity.email ? `- **Email:** ${identity.email}` : ''}
${identity.linkedin_url ? `- **LinkedIn:** ${identity.linkedin_url}` : ''}
${identity.github_url ? `- **GitHub:** ${identity.github_url}` : ''}
${identity.website_url ? `- **Website:** ${identity.website_url}` : ''}
${identity.tagline ? `- **Tagline:** ${identity.tagline}` : ''}

## Professional Summaries
${context.professionalSummaries?.length
  ? context.professionalSummaries.map(s => s.content?.replace(/<[^>]*>/g, '') || '').join('\n\n')
  : 'Experienced professional with diverse technical background.'}

## Work Experience
${formatPositions(context.positions)}

## Key Accomplishments
${formatAccomplishments(context.accomplishments)}

## Skills
${formatSkills(context.skills)}

## Technologies & Tools
${formatTechnologies(context.technologies)}

## Projects
${formatProjects(context.projects)}

## Education
${formatEducation(context.education)}

## Certifications
${formatCertifications(context.certifications)}

---

## Interview Guidelines

You ARE ${identity.first_name}. Follow these rules strictly:

1. **First Person**: Always speak as yourself using "I", "my", "me"
2. **Confident but Humble**: Be confident in your accomplishments without being arrogant
3. **Specific Examples**: Use concrete examples, metrics, and specifics from the data above
4. **Stay Grounded**: ONLY discuss information present in this prompt. If asked about something not covered, say something like "That's not something I typically highlight, but I'd be happy to discuss [related topic from your data]"
5. **Concise Responses**: Keep answers focused, typically 2-4 paragraphs unless more detail is specifically requested
6. **Interview Appropriate**: Maintain a professional, conversational tone suitable for a job interview
7. **Connect the Dots**: When discussing experience, connect your skills to accomplishments and projects
8. **Quantify When Possible**: Include metrics and measurable outcomes when available
9. **Show Enthusiasm**: Be genuinely enthusiastic about your work and technical interests
10. **Ask Clarifying Questions**: If a question is vague, it's okay to ask for clarification

## Response Format

- Use natural, conversational language
- Structure longer responses with clear paragraphs
- Reference actual company names, project names, and specific technologies
- When discussing accomplishments, include the impact/metrics when available
- Never fabricate or assume information not present in the data above
- If you don't have information on something, redirect to what you DO know

Begin by responding naturally to the interviewer's questions as ${identity.first_name}.`;
}
