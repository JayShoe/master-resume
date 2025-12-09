/**
 * Builds a system prompt optimized for Interview Copilot mode
 * Focuses on speed, scannability, and STAR-formatted output
 */

import type { ResumeDataWithSources } from './resume-data-loader';

/**
 * Strips HTML tags from content
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Formats a date string for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}

/**
 * Builds a compact experience database for quick retrieval
 */
function buildExperienceDatabase(data: ResumeDataWithSources): string {
  const entries: string[] = [];

  // Process positions with accomplishments
  data.positions?.forEach((pos) => {
    const company = pos.company?.name || 'Unknown Company';
    const dateRange = pos.is_current
      ? `${formatDate(pos.start_date)} - Present`
      : `${formatDate(pos.start_date)} - ${formatDate(pos.end_date)}`;

    let entry = `## ${pos.primary_title} @ ${company} (${dateRange})\n`;
    if (pos.summary) entry += `Context: ${pos.summary}\n`;

    // Include accomplishments with STAR-ready data
    if (pos.accomplishments?.length) {
      entry += 'Accomplishments:\n';
      pos.accomplishments.forEach((acc) => {
        entry += `- ${acc.primary_title}`;
        if (acc.impact_metrics) entry += ` | METRICS: ${acc.impact_metrics}`;
        entry += '\n';
        if (acc.primary_description) {
          entry += `  ${stripHtml(acc.primary_description).substring(0, 200)}\n`;
        }
        // Include related skills/tech for keyword suggestions
        const tags: string[] = [];
        if (acc.related_skills?.length) {
          tags.push(...acc.related_skills.map((s) => s.name));
        }
        if (acc.related_technologies?.length) {
          tags.push(...acc.related_technologies.map((t) => t.name));
        }
        if (tags.length) entry += `  Tags: ${tags.join(', ')}\n`;
      });
    }

    entries.push(entry);
  });

  // Process standalone accomplishments
  data.accomplishments?.forEach((acc) => {
    // Skip if already included with a position
    if (acc.position) return;

    let entry = `## ${acc.primary_title}`;
    if (acc.accomplishment_type) entry += ` [${acc.accomplishment_type}]`;
    entry += '\n';

    if (acc.primary_description) {
      entry += `Context: ${stripHtml(acc.primary_description).substring(0, 300)}\n`;
    }
    if (acc.impact_metrics) entry += `METRICS: ${acc.impact_metrics}\n`;

    const tags: string[] = [];
    if (acc.related_skills?.length) {
      tags.push(...acc.related_skills.map((s) => s.name));
    }
    if (acc.related_technologies?.length) {
      tags.push(...acc.related_technologies.map((t) => t.name));
    }
    if (tags.length) entry += `Tags: ${tags.join(', ')}\n`;

    entries.push(entry);
  });

  // Process projects
  data.projects?.forEach((proj) => {
    let entry = `## Project: ${proj.name}`;
    if (proj.role) entry += ` (${proj.role})`;
    entry += '\n';

    if (proj.summary) entry += `Context: ${proj.summary}\n`;
    if (proj.description) {
      entry += `Details: ${stripHtml(proj.description).substring(0, 300)}\n`;
    }

    const tags: string[] = [];
    if (proj.technologies_used?.length) {
      tags.push(...proj.technologies_used.map((t) => t.name));
    }
    if (proj.skills_demonstrated?.length) {
      tags.push(...proj.skills_demonstrated.map((s) => s.name));
    }
    if (tags.length) entry += `Tags: ${tags.join(', ')}\n`;

    entries.push(entry);
  });

  return entries.join('\n---\n');
}

/**
 * Builds a compact skills reference
 */
function buildSkillsReference(data: ResumeDataWithSources): string {
  const skillsByCategory: Record<string, string[]> = {};

  data.skills?.forEach((skill) => {
    const category = skill.category || 'General';
    if (!skillsByCategory[category]) skillsByCategory[category] = [];
    let entry = skill.name;
    if (skill.proficiency_level) entry += ` (${skill.proficiency_level}/5)`;
    skillsByCategory[category].push(entry);
  });

  data.technologies?.forEach((tech) => {
    const category = tech.category || 'Technologies';
    if (!skillsByCategory[category]) skillsByCategory[category] = [];
    let entry = tech.name;
    const details: string[] = [];
    if (tech.proficiency_level) details.push(`${tech.proficiency_level}/5`);
    if (tech.years_experience) details.push(`${tech.years_experience}yr`);
    if (details.length) entry += ` (${details.join(', ')})`;
    skillsByCategory[category].push(entry);
  });

  return Object.entries(skillsByCategory)
    .map(([category, skills]) => `**${category}:** ${skills.join(', ')}`)
    .join('\n');
}

/**
 * Builds the Interview Copilot system prompt
 */
export function buildCopilotSystemPrompt(data: ResumeDataWithSources): string {
  const { identity } = data;

  return `You are Interview Copilot. ${identity.first_name} is in a LIVE interview and needs quick, scannable notes - not conversation.

## YOUR ROLE
Surface relevant experience from ${identity.first_name}'s background to help formulate answers on the spot. Speed and scannability are critical.

## OUTPUT FORMAT (ALWAYS USE THIS EXACT STRUCTURE)

\`\`\`
📌 [Experience Title] @ [Company]

S: [1-2 bullet situation/context]
T: [1 bullet task/objective]
A: [3-4 bullet actions taken]
R: [1-2 bullet results with metrics - BOLD any numbers]

🔗 Also relevant: [Experience 2], [Experience 3]

💡 Keywords: [term], [term], [term]
\`\`\`

## RULES
1. NO pleasantries, NO "here's what I found" - just structured notes
2. Keep output under 150 words
3. ALWAYS bold metrics and numbers: **40%**, **$2M**, **15 team members**
4. Start each bullet with 2-3 word action phrase
5. If question is unclear, still provide most likely relevant experience
6. For behavioral questions (tell me about a time...), prioritize accomplishments with metrics

## ${identity.first_name.toUpperCase()}'S EXPERIENCE DATABASE

${buildExperienceDatabase(data)}

## SKILLS REFERENCE

${buildSkillsReference(data)}

## IDENTITY SUMMARY
- Name: ${identity.first_name} ${identity.last_name}
${identity.tagline ? `- Focus: ${identity.tagline}` : ''}
${data.professionalSummaries?.[0]?.content ? `- Summary: ${stripHtml(data.professionalSummaries[0].content).substring(0, 200)}` : ''}

---
When given an interview question, immediately identify the most relevant experience and output in STAR format. No delay, no preamble.`;
}
