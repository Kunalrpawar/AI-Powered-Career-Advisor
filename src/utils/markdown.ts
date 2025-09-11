export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Very small, safe markdown subset: bold and line breaks
export function toHtmlFromMarkdownLite(input: string): string {
  const escaped = escapeHtml(input || '');
  // Bold: **text**
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Line breaks
  const withBreaks = withBold.replace(/\n/g, '<br/>');
  return withBreaks;
}


