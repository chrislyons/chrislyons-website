/**
 * PageHeader Component
 *
 * Consistent page header for all internal pages
 */

export class PageHeader {
  /**
   * Render a page header
   *
   * @param {Object} options - Header configuration
   * @param {string} options.title - Page title (h1)
   * @param {string} options.subtitle - Optional subtitle
   * @param {string} options.description - Optional description paragraph
   * @param {string} options.className - Additional CSS classes
   */
  static render({ title, subtitle, description, className = '' }) {
    return `
      <header class="mb-12 ${className}">
        ${subtitle ? `<p class="text-base text-gray-600 mb-2 font-medium uppercase tracking-wide">${subtitle}</p>` : ''}

        <h1 class="text-5xl md:text-6xl font-bold text-primary mb-6">
          ${title}
        </h1>

        ${description ? `
          <div class="max-w-3xl">
            <p class="text-xl text-gray-700 leading-relaxed">
              ${description}
            </p>
          </div>
        ` : ''}
      </header>
    `;
  }
}

export default PageHeader;
