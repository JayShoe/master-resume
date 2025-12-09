/**
 * Strip HTML tags from a string and decode HTML entities
 * @param html - HTML string to strip
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
