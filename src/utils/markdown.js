/**
 * Markdown Parser Utility
 *
 * Simple, lightweight markdown to HTML converter
 * Handles common markdown syntax without external dependencies
 */

export class MarkdownParser {
  /**
   * Parse markdown to HTML
   *
   * @param {string} markdown - Markdown content
   * @returns {string} HTML string
   */
  static parse(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return '';
    }

    let html = markdown;

    // Escape HTML to prevent XSS (but preserve markdown)
    // html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers (h1-h6)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link">$1</a>');

    // Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4">');

    // Code blocks (```code```)
    html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>');

    // Unordered lists
    html = this.parseLists(html);

    // Paragraphs (lines separated by blank lines)
    html = this.parseParagraphs(html);

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

    // Tables
    html = this.parseTables(html);

    return html;
  }

  /**
   * Parse lists (ordered and unordered)
   *
   * @param {string} html - HTML string
   * @returns {string} HTML with parsed lists
   */
  static parseLists(html) {
    // Unordered lists
    html = html.replace(/(?:^|\n)((?:^[-*+]\s+.+\n?)+)/gm, (match) => {
      const items = match
        .trim()
        .split('\n')
        .map(line => line.replace(/^[-*+]\s+/, ''))
        .map(item => `<li class="ml-4">${item}</li>`)
        .join('\n');
      return `<ul class="list-disc list-inside my-4 space-y-2">\n${items}\n</ul>`;
    });

    // Ordered lists
    html = html.replace(/(?:^|\n)((?:^\d+\.\s+.+\n?)+)/gm, (match) => {
      const items = match
        .trim()
        .split('\n')
        .map(line => line.replace(/^\d+\.\s+/, ''))
        .map(item => `<li class="ml-4">${item}</li>`)
        .join('\n');
      return `<ol class="list-decimal list-inside my-4 space-y-2">\n${items}\n</ol>`;
    });

    return html;
  }

  /**
   * Parse paragraphs
   *
   * @param {string} html - HTML string
   * @returns {string} HTML with parsed paragraphs
   */
  static parseParagraphs(html) {
    // Split by double newlines to identify paragraphs
    const blocks = html.split(/\n\n+/);

    return blocks
      .map(block => {
        block = block.trim();

        // Skip if already an HTML element
        if (block.startsWith('<')) {
          return block;
        }

        // Skip if empty
        if (block.length === 0) {
          return '';
        }

        // Wrap in paragraph tag
        return `<p class="my-4 leading-relaxed">${block}</p>`;
      })
      .join('\n');
  }

  /**
   * Parse markdown tables
   *
   * @param {string} html - HTML string
   * @returns {string} HTML with parsed tables
   */
  static parseTables(html) {
    // Match table pattern (header | separator | rows)
    const tableRegex = /(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g;

    return html.replace(tableRegex, (match, header, separator, rows) => {
      // Parse header
      const headerCells = header
        .split('|')
        .filter(cell => cell.trim())
        .map(cell => `<th class="px-4 py-2 text-left font-semibold border-b">${cell.trim()}</th>`)
        .join('');

      // Parse rows
      const rowsHtml = rows
        .trim()
        .split('\n')
        .map(row => {
          const cells = row
            .split('|')
            .filter(cell => cell.trim())
            .map(cell => `<td class="px-4 py-2 border-b">${cell.trim()}</td>`)
            .join('');
          return `<tr>${cells}</tr>`;
        })
        .join('\n');

      return `
        <div class="overflow-x-auto my-6">
          <table class="min-w-full border-collapse">
            <thead class="bg-gray-50">
              <tr>${headerCells}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    });
  }

  /**
   * Extract frontmatter from markdown
   *
   * @param {string} markdown - Markdown content with optional YAML frontmatter
   * @returns {Object} { frontmatter: {}, content: '' }
   */
  static extractFrontmatter(markdown) {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
      return { frontmatter: {}, content: markdown };
    }

    const frontmatterText = match[1];
    const content = match[2];

    // Parse simple YAML (key: value pairs)
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    return { frontmatter, content };
  }

  /**
   * Generate table of contents from markdown headers
   *
   * @param {string} markdown - Markdown content
   * @returns {Array} Array of { level, text, id } objects
   */
  static generateTOC(markdown) {
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc = [];
    let match;

    while ((match = headerRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');

      toc.push({ level, text, id });
    }

    return toc;
  }
}

export default MarkdownParser;
