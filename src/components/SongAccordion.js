/**
 * Song Accordion Component
 *
 * Expandable song cards for lyrics display
 * Each song can be expanded inline to show full lyrics
 */

export class SongAccordion {
  /**
   * Render a list of expandable song cards
   *
   * @param {Array} songs - Array of song objects with { title, lyrics }
   * @returns {string} HTML string
   */
  static render(songs) {
    const songItems = songs.map((song, index) => {
      const songId = `song-${index}`;
      const headerId = `${songId}-header`;
      const contentId = `${songId}-content`;

      // Default lyrics message if not provided
      const lyricsContent = song.lyrics || '<p class="text-gray-500 italic">Lyrics will be added soon.</p>';

      return `
        <div class="song-card mb-4" data-song-id="${songId}">
          <!-- Song Header / Toggle Button -->
          <button
            type="button"
            id="${headerId}"
            class="song-toggle w-full text-left px-6 py-4 rounded-lg transition-all duration-300 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded="false"
            aria-controls="${contentId}"
          >
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-800">${song.title}</span>
              <svg
                class="song-icon w-6 h-6 text-gray-600 transform transition-transform duration-300"
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

          <!-- Lyrics Content (Collapsible) -->
          <div
            id="${contentId}"
            class="song-content overflow-hidden transition-all duration-300 max-h-0 opacity-0"
            aria-labelledby="${headerId}"
            role="region"
          >
            <div class="song-lyrics lyrics-protected px-6 py-8 bg-gray-50 rounded-b-lg border-x-2 border-b-2 border-gray-200 prose prose-lg max-w-none">
              ${lyricsContent}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="song-accordion-container">
        ${songItems}
      </div>
    `;
  }

  /**
   * Attach event listeners to all song accordion items
   * Call this after rendering to enable interactivity
   */
  static attachEventListeners() {
    const songCards = document.querySelectorAll('.song-card');

    songCards.forEach(card => {
      const toggle = card.querySelector('.song-toggle');
      const content = card.querySelector('.song-content');
      const icon = card.querySelector('.song-icon');
      const lyricsDiv = card.querySelector('.lyrics-protected');

      if (!toggle || !content || !icon) return;

      // Toggle function
      const toggleSong = () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const newExpandedState = !isExpanded;

        // If expanding this song, collapse all others first
        if (newExpandedState) {
          SongAccordion.collapseAll();
        }

        // Update ARIA state
        toggle.setAttribute('aria-expanded', newExpandedState.toString());

        // Toggle classes for animation
        if (newExpandedState) {
          // Expand
          content.classList.remove('max-h-0', 'opacity-0');
          content.classList.add('max-h-[2000px]', 'opacity-100');
          icon.classList.add('rotate-180');
          toggle.classList.add('rounded-b-none');
        } else {
          // Collapse
          content.classList.remove('max-h-[2000px]', 'opacity-100');
          content.classList.add('max-h-0', 'opacity-0');
          icon.classList.remove('rotate-180');
          toggle.classList.remove('rounded-b-none');
        }
      };

      // Click event
      toggle.addEventListener('click', toggleSong);

      // Keyboard support (Enter and Space)
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSong();
        }
      });

      // Copy protection for lyrics content
      if (lyricsDiv) {
        // Prevent right-click context menu
        lyricsDiv.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });

        // Prevent copy, cut, and paste
        lyricsDiv.addEventListener('copy', (e) => {
          e.preventDefault();
          return false;
        });

        lyricsDiv.addEventListener('cut', (e) => {
          e.preventDefault();
          return false;
        });

        // Prevent drag selection
        lyricsDiv.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Prevent keyboard shortcuts (Ctrl+C, Cmd+C, etc.)
        lyricsDiv.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'a')) {
            e.preventDefault();
            return false;
          }
        });
      }
    });
  }

  /**
   * Expand a specific song by index
   *
   * @param {number} index - Song index to expand
   */
  static expandSong(index) {
    const card = document.querySelector(`[data-song-id="song-${index}"]`);
    if (!card) return;

    const toggle = card.querySelector('.song-toggle');
    if (toggle && toggle.getAttribute('aria-expanded') === 'false') {
      toggle.click();
    }
  }

  /**
   * Collapse all songs
   */
  static collapseAll() {
    const toggles = document.querySelectorAll('.song-toggle[aria-expanded="true"]');
    toggles.forEach(toggle => toggle.click());
  }
}

export default SongAccordion;
