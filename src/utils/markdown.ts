// Utility functions for parsing and rendering markdown content

export function parseMarkdownLinks(content: string): string {
  // Convert markdown links [text](url) to HTML anchor tags
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Determine if link is internal or external
    const isInternal = url.startsWith('/') || url.startsWith('#') || url.includes(window?.location?.hostname);
    const target = isInternal ? '_self' : '_blank';
    const rel = isInternal ? '' : 'rel="noopener noreferrer"';
    
    return `<a href="${url}" target="${target}" ${rel} class="markdown-link ${isInternal ? 'internal-link' : 'external-link'}">${text}</a>`;
  });
}

export function parseMarkdownHeadings(content: string): string {
  // Convert markdown headings to HTML
  return content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
}

export function parseMarkdownBold(content: string): string {
  // Convert **bold** to <strong>
  return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export function parseMarkdownItalic(content: string): string {
  // Convert *italic* to <em>
  return content.replace(/\*(.*?)\*/g, '<em>$1</em>');
}

export function parseMarkdownCode(content: string): string {
  // Convert `code` to <code>
  return content.replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function parseMarkdownLineBreaks(content: string): string {
  // Convert line breaks to <br> and paragraphs
  return content
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function parseMarkdownToHTML(content: string): string {
  let html = content;
  
  // Parse in order to avoid conflicts
  html = parseMarkdownCode(html);
  html = parseMarkdownBold(html);
  html = parseMarkdownItalic(html);
  html = parseMarkdownHeadings(html);
  html = parseMarkdownLinks(html);
  html = parseMarkdownLineBreaks(html);
  
  return html;
}

export function countMarkdownLinks(content: string): { total: number; internal: number; external: number } {
  const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  const total = linkMatches.length;
  
  let internal = 0;
  let external = 0;
  
  linkMatches.forEach(match => {
    const urlMatch = match.match(/\]\(([^)]+)\)/);
    if (urlMatch) {
      const url = urlMatch[1];
      if (url.startsWith('/') || url.startsWith('#')) {
        internal++;
      } else {
        external++;
      }
    }
  });
  
  return { total, internal, external };
}
