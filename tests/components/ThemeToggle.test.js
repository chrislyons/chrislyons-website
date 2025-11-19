import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeToggle } from '../../src/components/ThemeToggle.js';

describe('ThemeToggle', () => {
  let localStorageMock;
  let matchMediaMock;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      store: {},
      getItem: vi.fn((key) => localStorageMock.store[key] || null),
      setItem: vi.fn((key, value) => {
        localStorageMock.store[key] = value;
      }),
      removeItem: vi.fn((key) => {
        delete localStorageMock.store[key];
      }),
      clear: vi.fn(() => {
        localStorageMock.store = {};
      })
    };

    // Mock matchMedia
    matchMediaMock = vi.fn((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    // Stub global objects
    vi.stubGlobal('window', {
      localStorage: localStorageMock,
      matchMedia: matchMediaMock
    });

    vi.stubGlobal('document', {
      documentElement: {
        setAttribute: vi.fn(),
        style: {
          setProperty: vi.fn()
        },
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        }
      },
      getElementById: vi.fn()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with available themes', () => {
      const toggle = new ThemeToggle();
      expect(toggle.THEMES).toEqual(['moonlight', 'daylight', 'forest', 'beach', 'plum', 'char']);
    });

    it('should apply theme on construction', () => {
      const toggle = new ThemeToggle();
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
        'data-theme',
        expect.any(String)
      );
    });
  });

  describe('prefersDark', () => {
    it('should return true when system prefers dark mode', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn()
      });

      const toggle = new ThemeToggle();
      expect(toggle.prefersDark()).toBe(true);
    });

    it('should return false when system prefers light mode', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn()
      });

      const toggle = new ThemeToggle();
      expect(toggle.prefersDark()).toBe(false);
    });

    it('should default to true when matchMedia is unavailable', () => {
      // Test the prefersDark method directly with undefined matchMedia
      const toggle = new ThemeToggle();

      // Temporarily remove matchMedia to test the fallback
      const originalMatchMedia = window.matchMedia;
      vi.stubGlobal('window', {
        ...window,
        matchMedia: undefined
      });

      expect(toggle.prefersDark()).toBe(true);

      // Restore
      vi.stubGlobal('window', {
        ...window,
        matchMedia: originalMatchMedia
      });
    });
  });

  describe('resolveInitialTheme', () => {
    it('should use stored theme preference if valid', () => {
      localStorageMock.store['chrislyons-theme'] = 'forest';

      const toggle = new ThemeToggle();
      expect(toggle.theme).toBe('forest');
    });

    it('should ignore invalid stored theme', () => {
      localStorageMock.store['chrislyons-theme'] = 'invalid-theme';

      const toggle = new ThemeToggle();
      expect(toggle.THEMES).toContain(toggle.theme);
    });

    it('should avoid repeating last random theme', () => {
      localStorageMock.store['chrislyons-last-theme'] = 'moonlight';

      // Create multiple toggles to test randomization
      const themes = new Set();
      for (let i = 0; i < 50; i++) {
        localStorageMock.store = { 'chrislyons-last-theme': 'moonlight' };
        const toggle = new ThemeToggle();
        themes.add(toggle.theme);
      }

      // Should never be moonlight (the last theme)
      expect(themes.has('moonlight')).toBe(false);
    });

    it('should store selected theme in localStorage', () => {
      const toggle = new ThemeToggle();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'chrislyons-theme',
        expect.any(String)
      );
    });
  });

  describe('applyTheme', () => {
    it('should set data-theme attribute', () => {
      const toggle = new ThemeToggle();
      toggle.applyTheme('beach');

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'beach');
    });

    it('should set color-scheme to dark for dark themes', () => {
      const toggle = new ThemeToggle();

      toggle.applyTheme('moonlight');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'dark');

      toggle.applyTheme('forest');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'dark');

      toggle.applyTheme('char');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'dark');
    });

    it('should set color-scheme to light for light themes', () => {
      const toggle = new ThemeToggle();

      toggle.applyTheme('daylight');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'light');

      toggle.applyTheme('beach');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'light');

      toggle.applyTheme('plum');
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('color-scheme', 'light');
    });

    it('should add dark class for dark themes', () => {
      const toggle = new ThemeToggle();
      toggle.applyTheme('moonlight');

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should remove dark class for light themes', () => {
      const toggle = new ThemeToggle();
      toggle.applyTheme('daylight');

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('should update internal theme state', () => {
      const toggle = new ThemeToggle();
      toggle.applyTheme('forest');

      expect(toggle.theme).toBe('forest');
    });
  });

  describe('toggle', () => {
    it('should cycle through themes in order', () => {
      localStorageMock.store['chrislyons-theme'] = 'moonlight';
      const toggle = new ThemeToggle();

      toggle.toggle();
      expect(toggle.theme).toBe('daylight');

      toggle.toggle();
      expect(toggle.theme).toBe('forest');

      toggle.toggle();
      expect(toggle.theme).toBe('beach');

      toggle.toggle();
      expect(toggle.theme).toBe('plum');

      toggle.toggle();
      expect(toggle.theme).toBe('char');

      toggle.toggle();
      expect(toggle.theme).toBe('moonlight'); // wrap around
    });

    it('should persist new theme to localStorage', () => {
      localStorageMock.store['chrislyons-theme'] = 'moonlight';
      const toggle = new ThemeToggle();

      toggle.toggle();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('chrislyons-theme', 'daylight');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('chrislyons-last-theme', 'daylight');
    });
  });

  describe('getThemeLabel', () => {
    it('should return correct labels for all themes', () => {
      const toggle = new ThemeToggle();

      // Note: 'night' is in labels but theme is 'moonlight'
      expect(toggle.getThemeLabel('night')).toBe('Moonlight');
      expect(toggle.getThemeLabel('daylight')).toBe('Daylight');
      expect(toggle.getThemeLabel('forest')).toBe('Forest');
      expect(toggle.getThemeLabel('beach')).toBe('Beach');
      expect(toggle.getThemeLabel('plum')).toBe('Plum');
      expect(toggle.getThemeLabel('char')).toBe('Char');
    });

    it('should return theme name for unknown themes', () => {
      const toggle = new ThemeToggle();
      expect(toggle.getThemeLabel('unknown')).toBe('unknown');
    });
  });

  describe('render', () => {
    it('should return button HTML', () => {
      localStorageMock.store['chrislyons-theme'] = 'moonlight';
      const toggle = new ThemeToggle();

      const html = toggle.render();

      expect(html).toContain('<button');
      expect(html).toContain('id="theme-toggle"');
      expect(html).toContain('aria-label');
    });

    it('should include current theme in aria-label', () => {
      localStorageMock.store['chrislyons-theme'] = 'forest';
      const toggle = new ThemeToggle();

      const html = toggle.render();

      expect(html).toContain('Forest');
    });

    it('should include SVG icon', () => {
      const toggle = new ThemeToggle();
      const html = toggle.render();

      expect(html).toContain('<svg');
    });
  });

  describe('renderIcon', () => {
    it('should render moon icon for moonlight theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('moonlight');

      expect(icon).toContain('<svg');
      expect(icon).toContain('path');
    });

    it('should render sun icon for daylight theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('daylight');

      expect(icon).toContain('<svg');
      expect(icon).toContain('circle');
    });

    it('should render leaf icon for forest theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('forest');

      expect(icon).toContain('<svg');
    });

    it('should render kite icon for beach theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('beach');

      expect(icon).toContain('<svg');
    });

    it('should render plum icon for plum theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('plum');

      expect(icon).toContain('<svg');
      expect(icon).toContain('ellipse');
    });

    it('should render char icon for char theme', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('char');

      expect(icon).toContain('<svg');
    });

    it('should default to moon icon for unknown themes', () => {
      const toggle = new ThemeToggle();
      const icon = toggle.renderIcon('unknown');

      expect(icon).toContain('<svg');
    });
  });

  describe('attachEventListeners', () => {
    it('should attach click event to toggle button', () => {
      const mockButton = {
        addEventListener: vi.fn(),
        outerHTML: ''
      };
      document.getElementById = vi.fn(() => mockButton);

      const toggle = new ThemeToggle();
      toggle.attachEventListeners();

      expect(document.getElementById).toHaveBeenCalledWith('theme-toggle');
      expect(mockButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should not throw when button is not found', () => {
      document.getElementById = vi.fn(() => null);

      const toggle = new ThemeToggle();
      expect(() => toggle.attachEventListeners()).not.toThrow();
    });
  });

  describe('setupMediaQueryListener', () => {
    it('should listen for system theme changes', () => {
      const addEventListenerMock = vi.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: addEventListenerMock
      });

      const toggle = new ThemeToggle();

      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('theme categorization', () => {
    it('should correctly identify dark themes', () => {
      const toggle = new ThemeToggle();
      const darkThemes = ['moonlight', 'forest', 'char'];

      darkThemes.forEach(theme => {
        toggle.applyTheme(theme);
        expect(document.documentElement.classList.add).toHaveBeenLastCalledWith('dark');
      });
    });

    it('should correctly identify light themes', () => {
      const toggle = new ThemeToggle();
      const lightThemes = ['daylight', 'beach', 'plum'];

      lightThemes.forEach(theme => {
        toggle.applyTheme(theme);
        expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      });
    });
  });
});
