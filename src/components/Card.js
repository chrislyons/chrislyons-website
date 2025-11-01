/**
 * Card Component
 *
 * Reusable card component for displaying content sections
 */

export class Card {
  /**
   * Render a card component
   *
   * @param {Object} options - Card configuration
   * @param {string} options.title - Card title
   * @param {string} options.description - Card description
   * @param {string} options.link - Optional link URL
   * @param {string} options.linkText - Optional link text (defaults to "Learn more")
   * @param {string} options.className - Additional CSS classes
   * @param {boolean} options.clickable - Make entire card clickable
   */
  static render({ title, description, link, linkText = 'Learn more', className = '', clickable = false }) {
    const cardClasses = `card ${className} ${clickable ? 'cursor-pointer transform hover:scale-105' : ''}`;

    if (clickable && link) {
      return `
        <a href="${link}" class="${cardClasses} block no-underline" aria-label="${title}">
          <h3 class="text-2xl font-semibold mb-3 text-primary">${title}</h3>
          ${description ? `<p class="text-gray-600 leading-relaxed">${description}</p>` : ''}
        </a>
      `;
    }

    return `
      <div class="${cardClasses}">
        <h3 class="text-2xl font-semibold mb-3 text-primary">${title}</h3>
        ${description ? `<p class="text-gray-600 leading-relaxed mb-4">${description}</p>` : ''}
        ${link ? `
          <a
            href="${link}"
            class="link inline-flex items-center text-secondary hover:text-primary transition-colors"
            aria-label="${linkText} about ${title}"
          >
            ${linkText}
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render a grid of cards
   *
   * @param {Array} cards - Array of card configurations
   * @param {string} gridClass - Grid layout classes (defaults to 2 columns on md+)
   */
  static renderGrid(cards, gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6') {
    return `
      <div class="${gridClass}">
        ${cards.map(card => Card.render(card)).join('')}
      </div>
    `;
  }
}

export default Card;
