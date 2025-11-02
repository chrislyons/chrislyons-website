/**
 * Theme Toggle Component
 *
 * Implements six-theme switching with localStorage persistence:
 * - Night (dark mode)
 * - Daylight (light mode)
 * - Forest (dark green variation)
 * - Beach (warm light variation)
 * - Plum (purple/fuchsia light variation)
 * - Char (dark burnt orange/ember variation)
 */

export class ThemeToggle {
  constructor() {
    this.STORAGE_KEY = 'chrislyons-theme';
    this.LAST_THEME_KEY = 'chrislyons-last-theme';
    this.THEMES = ['moonlight', 'daylight', 'forest', 'beach', 'plum', 'char'];
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
   * SHUFFLE MODE: Always randomize theme on page load, ignoring localStorage cache
   * Never picks the same theme twice in a row (n+1 logic)
   * User can still cycle themes during session via toggle button
   */
  resolveInitialTheme() {
    if (typeof window === 'undefined') return 'moonlight';

    // Get the last theme shown (from previous page load or manual toggle)
    const lastTheme = window.localStorage.getItem(this.LAST_THEME_KEY);

    // Filter out the last theme to ensure we never repeat (n+1 logic)
    const availableThemes = lastTheme
      ? this.THEMES.filter(theme => theme !== lastTheme)
      : this.THEMES;

    // Randomly select from available themes
    const randomIndex = Math.floor(Math.random() * availableThemes.length);
    const selectedTheme = availableThemes[randomIndex];

    // Store this as the last theme for next page load
    window.localStorage.setItem(this.LAST_THEME_KEY, selectedTheme);

    return selectedTheme;
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    if (typeof document === 'undefined') return;

    document.documentElement.setAttribute('data-theme', theme);

    // Set color-scheme for browser UI
    const isDark = theme === 'moonlight' || theme === 'forest' || theme === 'char';
    document.documentElement.style.setProperty('color-scheme', isDark ? 'dark' : 'light');

    // Update Tailwind dark mode class for backward compatibility
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.theme = theme;
  }

  /**
   * Cycle to next theme
   */
  toggle() {
    const currentIndex = this.THEMES.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % this.THEMES.length;
    const newTheme = this.THEMES[nextIndex];

    this.applyTheme(newTheme);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.STORAGE_KEY, newTheme);
      // Also update last theme to prevent showing same theme on next page load
      window.localStorage.setItem(this.LAST_THEME_KEY, newTheme);
    }
  }

  /**
   * Listen for system theme changes
   */
  setupMediaQueryListener() {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      if (this.THEMES.includes(stored) || stored === 'dark' || stored === 'light') {
        // User has explicit preference, don't change
        return;
      }
      // No explicit preference, follow system
      const newTheme = event.matches ? 'moonlight' : 'daylight';
      this.applyTheme(newTheme);
    };

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', handler);
  }

  /**
   * Get theme display name
   */
  getThemeLabel(theme) {
    const labels = {
      'night': 'Moonlight',
      'daylight': 'Daylight',
      'forest': 'Forest',
      'beach': 'Beach',
      'plum': 'Plum',
      'char': 'Char'
    };
    return labels[theme] || theme;
  }

  /**
   * Render theme toggle button
   */
  render() {
    const currentLabel = this.getThemeLabel(this.theme);
    const currentIndex = this.THEMES.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % this.THEMES.length;
    const nextTheme = this.THEMES[nextIndex];
    const nextLabel = this.getThemeLabel(nextTheme);

    const icon = this.renderIcon(this.theme);

    return `
      <button
        type="button"
        id="theme-toggle"
        class="p-2 rounded-md text-gray-400 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Current theme: ${currentLabel}. Click to switch to ${nextLabel}"
        title="Current: ${currentLabel} • Next: ${nextLabel}"
      >
        ${icon}
      </button>
    `;
  }

  /**
   * Render icon based on theme
   */
  renderIcon(theme) {
    switch(theme) {
      case 'moonlight':
        return this.renderMoonIcon();
      case 'daylight':
        return this.renderSunIcon();
      case 'forest':
        return this.renderLeafIcon();
      case 'beach':
        return this.renderKiteIcon();
      case 'plum':
        return this.renderPlumIcon();
      case 'char':
        return this.renderCharIcon();
      default:
        return this.renderMoonIcon();
    }
  }

  /**
   * Render moon icon (for night mode)
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
   * Render sun icon (for daylight mode)
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
   * Render leaf icon (for forest mode)
   */
  renderLeafIcon() {
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
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
      </svg>
    `;
  }

  /**
   * Render kite icon (for beach mode)
   */
  renderKiteIcon() {
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
        <path d="M12 2 6 8l6 6 6-6Z"></path>
        <path d="m8 12-3 3 3 3 3-3Z"></path>
        <path d="m14 12 3 3-3 3-3-3Z"></path>
        <path d="m12 14 0 8"></path>
        <path d="m9 20 3 2 3-2"></path>
      </svg>
    `;
  }

  /**
   * Render plum icon (for plum mode)
   */
  renderPlumIcon() {
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
        <ellipse cx="12" cy="13" rx="7" ry="8"></ellipse>
        <path d="M12 5 Q 12 2, 14 2 Q 15 2, 15 3 Q 15 4, 13 5"></path>
        <line x1="12" y1="5" x2="12" y2="8"></line>
      </svg>
    `;
  }

  /**
   * Render char icon (for char mode)
   */
  renderCharIcon() {
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
        <path d="M8.5 14.5 A6 6 0 0 0 15.5 14.5 A5 5 0 0 1 12 20 A5 5 0 0 1 8.5 14.5Z"></path>
        <path d="M12 11 Q 9 8, 11 4 Q 12 2, 13 4 Q 15 8, 12 11Z"></path>
        <path d="M12 11 Q 11 9, 12 7"></path>
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
