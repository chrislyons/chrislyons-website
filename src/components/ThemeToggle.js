/**
 * Theme Toggle Component
 *
 * Implements dark/light mode switching with localStorage persistence
 * Based on wordbird-web pattern, adapted for vanilla JavaScript
 */

export class ThemeToggle {
  constructor() {
    this.STORAGE_KEY = 'chrislyons-theme';
    this.theme = this.resolveInitialTheme();
    this.applyTheme(this.theme);
    this.setupMediaQueryListener();
  }

  /**
   * Check if user prefers dark mode via system settings
   */
  prefersDark() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true; // Default to dark mode
    }
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (err) {
      console.warn('Unable to read prefers-color-scheme', err);
      return true; // Default to dark mode
    }
  }

  /**
   * Resolve initial theme on page load
   */
  resolveInitialTheme() {
    if (typeof window === 'undefined') return 'dark';

    const stored = window.localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Default to dark mode (changed from light mode)
    return 'dark';
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    if (typeof document === 'undefined') return;

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('color-scheme', theme);

    // Update Tailwind dark mode class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.theme = theme;
  }

  /**
   * Toggle theme
   */
  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.STORAGE_KEY, newTheme);
    }
  }

  /**
   * Listen for system theme changes
   */
  setupMediaQueryListener() {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        // User has explicit preference, don't change
        return;
      }
      // No explicit preference, follow system
      const newTheme = event.matches ? 'dark' : 'light';
      this.applyTheme(newTheme);
    };

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', handler);
  }

  /**
   * Render theme toggle button
   */
  render() {
    const label = this.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const icon = this.theme === 'dark' ? this.renderMoonIcon() : this.renderSunIcon();

    return `
      <button
        type="button"
        id="theme-toggle"
        class="p-2 rounded-md text-gray-400 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-pressed="${this.theme === 'dark'}"
        aria-label="${label}"
        title="${label}"
      >
        ${icon}
      </button>
    `;
  }

  /**
   * Render moon icon (for dark mode)
   */
  renderMoonIcon() {
    return `
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }

  /**
   * Render sun icon (for light mode)
   */
  renderSunIcon() {
    return `
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    `;
  }

  /**
   * Attach event listeners after rendering
   */
  attachEventListeners() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggle();
        // Re-render the button with new icon
        toggleButton.outerHTML = this.render();
        // Re-attach listener after re-render
        this.attachEventListeners();
      });
    }
  }
}

export default ThemeToggle;
