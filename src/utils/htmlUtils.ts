// Re-export sanitizeHTML function from htmlSanitizer
export { sanitizeHTML, stripHTML } from './htmlSanitizer';

// Additional HTML utility functions can be added here
export function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function unescapeHTML(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}
