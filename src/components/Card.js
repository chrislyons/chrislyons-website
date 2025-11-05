/**
 * Card Component
 *
 * Reusable card component with 3D tilt effects on hover
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
   * @param {boolean} options.tilt - Enable 3D tilt effect (default: true)
   */
  static render({ title, description, link, linkText = 'Learn more', className = '', clickable = false, tilt = true }) {
    const tiltClass = tilt ? 'card-tilt' : '';
    const cardClasses = `card ${tiltClass} ${className} ${clickable ? 'cursor-pointer' : ''}`;

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

  /**
   * Attach 3D tilt effect to all cards with card-tilt class
   * Call this after rendering cards to enable interactivity
   */
  static attachTiltEffects() {
    const cards = document.querySelectorAll('.card-tilt');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max 10 degrees)
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

export default Card;
