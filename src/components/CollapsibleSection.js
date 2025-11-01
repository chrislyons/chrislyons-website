/**
 * Collapsible Section Component
 *
 * Accessible, animated collapsible section with keyboard support
 * Used on home page for "Pages (hidden)" navigation section
 */

export class CollapsibleSection {
  /**
   * Render a collapsible section
   *
   * @param {Object} options - Configuration options
   * @param {string} options.id - Unique ID for the section
   * @param {string} options.title - Section title (e.g., "Pages (hidden)")
   * @param {string} options.content - HTML content to display when expanded
   * @param {boolean} options.initiallyOpen - Whether section starts open (default: false)
   * @param {string} options.headerClass - Additional classes for header (default: brown background)
   * @param {string} options.contentClass - Additional classes for content area
   * @returns {string} HTML string
   */
  static render({
    id,
    title,
    content,
    initiallyOpen = false,
    headerClass = '',
    contentClass = ''
  }) {
    const headerId = `${id}-header`;
    const contentId = `${id}-content`;
    const isExpanded = initiallyOpen;

    return `
      <div class="collapsible-section mb-6" id="${id}">
        <!-- Toggle Button/Header -->
        <button
          type="button"
          id="${headerId}"
          class="collapsible-toggle w-full text-left px-6 py-4 rounded-lg transition-all duration-300 ${headerClass} bg-amber-800 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          aria-expanded="${isExpanded}"
          aria-controls="${contentId}"
        >
          <div class="flex items-center justify-between">
            <span class="text-xl font-semibold text-white">${title}</span>
            <svg
              class="collapsible-icon w-6 h-6 text-white transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>

        <!-- Collapsible Content -->
        <div
          id="${contentId}"
          class="collapsible-content overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'} ${contentClass}"
          aria-labelledby="${headerId}"
          role="region"
        >
          <div class="collapsible-inner">
            ${content}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to collapsible sections
   * Call this after rendering to enable interactivity
   *
   * @param {string} sectionId - ID of the collapsible section
   */
  static attachEventListeners(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`CollapsibleSection: Section with id "${sectionId}" not found`);
      return;
    }

    const toggle = section.querySelector('.collapsible-toggle');
    const content = section.querySelector('.collapsible-content');
    const icon = section.querySelector('.collapsible-icon');

    if (!toggle || !content || !icon) {
      console.warn(`CollapsibleSection: Required elements not found in section "${sectionId}"`);
      return;
    }

    // Toggle function
    const toggleSection = () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newExpandedState = !isExpanded;

      // Update ARIA state
      toggle.setAttribute('aria-expanded', newExpandedState.toString());

      // Toggle classes for animation
      if (newExpandedState) {
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('max-h-screen', 'opacity-100', 'mt-4');
        icon.classList.add('rotate-180');
      } else {
        content.classList.remove('max-h-screen', 'opacity-100', 'mt-4');
        content.classList.add('max-h-0', 'opacity-0');
        icon.classList.remove('rotate-180');
      }

      // Announce state change to screen readers
      const announcement = document.getElementById('collapsible-announcement');
      if (announcement) {
        announcement.textContent = `${newExpandedState ? 'Expanded' : 'Collapsed'} ${toggle.textContent}`;
      }
    };

    // Click event
    toggle.addEventListener('click', toggleSection);

    // Keyboard support (Enter and Space)
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection();
      }
    });

    // Create screen reader announcement container if it doesn't exist
    if (!document.getElementById('collapsible-announcement')) {
      const announcer = document.createElement('div');
      announcer.id = 'collapsible-announcement';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
  }

  /**
   * Initialize all collapsible sections on the page
   * Searches for elements with class 'collapsible-section' and attaches listeners
   */
  static initializeAll() {
    const sections = document.querySelectorAll('.collapsible-section');
    sections.forEach(section => {
      if (section.id) {
        CollapsibleSection.attachEventListeners(section.id);
      }
    });
  }
}

export default CollapsibleSection;
