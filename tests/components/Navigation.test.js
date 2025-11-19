import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the content.json import before importing Navigation
vi.mock('../../content/content.json', () => ({
  default: {
    navigation: [
      {
        id: 'home',
        title: 'Home',
        path: '/',
        children: []
      },
      {
        id: 'apps',
        title: 'Apps',
        path: '/apps',
        children: [
          {
            id: 'apps-alpha',
            title: 'Alpha',
            path: '/apps/alpha'
          },
          {
            id: 'apps-blog',
            title: 'Blog',
            path: '/apps/blog'
          },
          {
            id: 'apps-zebra',
            title: 'Zebra',
            path: '/apps/zebra'
          }
        ]
      },
      {
        id: 'hidden-item',
        title: 'Hidden',
        path: '/hidden',
        hidden: true
      },
      {
        id: 'connect',
        title: 'Connect',
        path: '/connect'
      }
    ]
  }
}));

import { Navigation } from '../../src/components/Navigation.js';

describe('Navigation', () => {
  let navigation;

  beforeEach(() => {
    // Mock window and document
    vi.stubGlobal('window', {
      location: { pathname: '/' }
    });

    vi.stubGlobal('document', {
      getElementById: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });

    navigation = new Navigation();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with menu closed', () => {
      expect(navigation.isMenuOpen).toBe(false);
    });

    it('should set current path from window location', () => {
      expect(navigation.currentPath).toBe('/');
    });

    it('should initialize without bound handlers', () => {
      expect(navigation.boundDocumentClickHandler).toBeNull();
      expect(navigation.boundDocumentKeydownHandler).toBeNull();
    });
  });

  describe('filterHidden', () => {
    it('should filter out hidden items', () => {
      const items = [
        { id: 'visible', title: 'Visible', hidden: false },
        { id: 'hidden', title: 'Hidden', hidden: true }
      ];

      const result = navigation.filterHidden(items);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('visible');
    });

    it('should sort children alphabetically', () => {
      const items = [
        {
          id: 'parent',
          title: 'Parent',
          children: [
            { id: 'c', title: 'Charlie' },
            { id: 'a', title: 'Alpha' },
            { id: 'b', title: 'Beta' }
          ]
        }
      ];

      const result = navigation.filterHidden(items);

      expect(result[0].children[0].title).toBe('Alpha');
      expect(result[0].children[1].title).toBe('Beta');
      expect(result[0].children[2].title).toBe('Charlie');
    });

    it('should put Blog first in children', () => {
      const items = [
        {
          id: 'parent',
          title: 'Parent',
          children: [
            { id: 'z', title: 'Zebra' },
            { id: 'b', title: 'Blog' },
            { id: 'a', title: 'Alpha' }
          ]
        }
      ];

      const result = navigation.filterHidden(items);

      expect(result[0].children[0].title).toBe('Blog');
      expect(result[0].children[1].title).toBe('Alpha');
      expect(result[0].children[2].title).toBe('Zebra');
    });

    it('should filter hidden children', () => {
      const items = [
        {
          id: 'parent',
          title: 'Parent',
          children: [
            { id: 'visible', title: 'Visible', hidden: false },
            { id: 'hidden', title: 'Hidden', hidden: true }
          ]
        }
      ];

      const result = navigation.filterHidden(items);

      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].id).toBe('visible');
    });

    it('should handle items without children', () => {
      const items = [
        { id: 'no-children', title: 'No Children' }
      ];

      const result = navigation.filterHidden(items);

      expect(result[0].children).toBeUndefined();
    });

    it('should return empty array for empty input', () => {
      const result = navigation.filterHidden([]);
      expect(result).toEqual([]);
    });
  });

  describe('render', () => {
    it('should return navigation HTML', () => {
      const html = navigation.render();

      expect(html).toContain('<nav');
      expect(html).toContain('role="navigation"');
      expect(html).toContain('aria-label="Main navigation"');
    });

    it('should include site title link', () => {
      const html = navigation.render();

      expect(html).toContain('href="/"');
      expect(html).toContain('Chris Lyons');
    });

    it('should include visible nav items', () => {
      const html = navigation.render();

      expect(html).toContain('Home');
      expect(html).toContain('Apps');
      expect(html).toContain('Connect');
    });

    it('should exclude hidden nav items', () => {
      const html = navigation.render();

      expect(html).not.toContain('Hidden');
    });

    it('should include mobile menu button', () => {
      const html = navigation.render();

      expect(html).toContain('id="mobile-menu-button"');
      expect(html).toContain('aria-controls="mobile-menu"');
    });

    it('should include mobile menu container', () => {
      const html = navigation.render();

      expect(html).toContain('id="mobile-menu"');
    });

    it('should include theme toggle containers', () => {
      const html = navigation.render();

      expect(html).toContain('id="theme-toggle-container"');
      expect(html).toContain('id="theme-toggle-container-mobile"');
    });
  });

  describe('renderNavItem', () => {
    it('should mark active page with aria-current', () => {
      navigation.currentPath = '/';

      const html = navigation.renderNavItem({
        id: 'home',
        title: 'Home',
        path: '/'
      });

      expect(html).toContain('aria-current="page"');
      expect(html).toContain('text-primary bg-gray-100');
    });

    it('should not mark inactive pages as current', () => {
      navigation.currentPath = '/other';

      const html = navigation.renderNavItem({
        id: 'home',
        title: 'Home',
        path: '/'
      });

      expect(html).not.toContain('aria-current');
    });

    it('should render items with children as dropdowns', () => {
      const html = navigation.renderNavItem({
        id: 'apps',
        title: 'Apps',
        path: '/apps',
        children: [
          { id: 'child', title: 'Child', path: '/apps/child' }
        ]
      });

      expect(html).toContain('data-dropdown-wrapper');
      expect(html).toContain('data-dropdown-button');
      expect(html).toContain('data-dropdown-menu');
      expect(html).toContain('aria-haspopup="true"');
    });

    it('should include dropdown children', () => {
      const html = navigation.renderNavItem({
        id: 'apps',
        title: 'Apps',
        path: '/apps',
        children: [
          { id: 'child1', title: 'Child One', path: '/apps/child1' },
          { id: 'child2', title: 'Child Two', path: '/apps/child2' }
        ]
      });

      expect(html).toContain('Child One');
      expect(html).toContain('Child Two');
      expect(html).toContain('href="/apps/child1"');
      expect(html).toContain('href="/apps/child2"');
    });

    it('should add admin trapdoor attribute to connect link', () => {
      const html = navigation.renderNavItem({
        id: 'connect',
        title: 'Connect',
        path: '/connect'
      });

      expect(html).toContain('data-admin-trapdoor="true"');
    });

    it('should not add admin trapdoor to other links', () => {
      const html = navigation.renderNavItem({
        id: 'home',
        title: 'Home',
        path: '/'
      });

      expect(html).not.toContain('data-admin-trapdoor');
    });
  });

  describe('renderMobileNavItem', () => {
    it('should mark active page with aria-current', () => {
      navigation.currentPath = '/';

      const html = navigation.renderMobileNavItem({
        id: 'home',
        title: 'Home',
        path: '/'
      });

      expect(html).toContain('aria-current="page"');
      expect(html).toContain('text-primary bg-gray-200');
    });

    it('should render simple items as links', () => {
      const html = navigation.renderMobileNavItem({
        id: 'home',
        title: 'Home',
        path: '/'
      });

      expect(html).toContain('<a');
      expect(html).toContain('href="/"');
      expect(html).toContain('Home');
    });

    it('should render items with children as expandable sections', () => {
      const html = navigation.renderMobileNavItem({
        id: 'apps',
        title: 'Apps',
        path: '/apps',
        children: [
          { id: 'child', title: 'Child', path: '/apps/child' }
        ]
      });

      expect(html).toContain('Apps');
      expect(html).toContain('Child');
      expect(html).toContain('pl-4'); // nested indentation
    });

    it('should include all children links', () => {
      const html = navigation.renderMobileNavItem({
        id: 'apps',
        title: 'Apps',
        path: '/apps',
        children: [
          { id: 'c1', title: 'Child 1', path: '/apps/c1' },
          { id: 'c2', title: 'Child 2', path: '/apps/c2' }
        ]
      });

      expect(html).toContain('href="/apps/c1"');
      expect(html).toContain('href="/apps/c2"');
    });
  });

  describe('cleanup', () => {
    it('should remove document-level event listeners', () => {
      const mockHandler = vi.fn();
      navigation.boundDocumentClickHandler = mockHandler;
      navigation.boundDocumentKeydownHandler = mockHandler;

      navigation.cleanup();

      expect(document.removeEventListener).toHaveBeenCalledWith('click', mockHandler);
      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', mockHandler);
      expect(navigation.boundDocumentClickHandler).toBeNull();
      expect(navigation.boundDocumentKeydownHandler).toBeNull();
    });

    it('should handle cleanup when no handlers exist', () => {
      navigation.boundDocumentClickHandler = null;
      navigation.boundDocumentKeydownHandler = null;

      expect(() => navigation.cleanup()).not.toThrow();
      expect(document.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('attachEventListeners', () => {
    let mockMobileButton;
    let mockMobileMenu;

    beforeEach(() => {
      mockMobileButton = {
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        contains: vi.fn(() => false),
        querySelector: vi.fn(() => ({
          classList: {
            toggle: vi.fn(),
            remove: vi.fn(),
            add: vi.fn()
          }
        })),
        focus: vi.fn()
      };

      mockMobileMenu = {
        classList: {
          toggle: vi.fn(),
          add: vi.fn()
        },
        contains: vi.fn(() => false)
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'mobile-menu-button') return mockMobileButton;
        if (id === 'mobile-menu') return mockMobileMenu;
        return null;
      });

      document.querySelectorAll = vi.fn(() => []);
    });

    it('should call cleanup before attaching', () => {
      const cleanupSpy = vi.spyOn(navigation, 'cleanup');

      navigation.attachEventListeners();

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should attach click listener to mobile menu button', () => {
      navigation.attachEventListeners();

      expect(mockMobileButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should attach document click listener for closing menu', () => {
      navigation.attachEventListeners();

      expect(document.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
      expect(navigation.boundDocumentClickHandler).not.toBeNull();
    });

    it('should attach document keydown listener for escape', () => {
      navigation.attachEventListeners();

      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      expect(navigation.boundDocumentKeydownHandler).not.toBeNull();
    });

    it('should handle missing mobile menu elements', () => {
      document.getElementById = vi.fn(() => null);

      expect(() => navigation.attachEventListeners()).not.toThrow();
    });

    it('should set up dropdown listeners', () => {
      const mockWrapper = {
        querySelector: vi.fn((selector) => {
          if (selector === '[data-dropdown-button]') {
            return {
              addEventListener: vi.fn(),
              setAttribute: vi.fn(),
              matches: vi.fn()
            };
          }
          if (selector === '[data-dropdown-menu]') {
            return {
              addEventListener: vi.fn(),
              classList: {
                remove: vi.fn(),
                add: vi.fn()
              },
              matches: vi.fn(),
              querySelectorAll: vi.fn(() => [])
            };
          }
        })
      };

      document.querySelectorAll = vi.fn((selector) => {
        if (selector === '[data-dropdown-wrapper]') return [mockWrapper];
        if (selector === '[data-admin-trapdoor="true"]') return [];
        return [];
      });

      navigation.attachEventListeners();

      expect(mockWrapper.querySelector).toHaveBeenCalledWith('[data-dropdown-button]');
      expect(mockWrapper.querySelector).toHaveBeenCalledWith('[data-dropdown-menu]');
    });

    it('should set up admin trapdoor listener', () => {
      const mockLink = {
        addEventListener: vi.fn()
      };

      document.querySelectorAll = vi.fn((selector) => {
        if (selector === '[data-admin-trapdoor="true"]') return [mockLink];
        return [];
      });

      navigation.attachEventListeners();

      expect(mockLink.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });
  });

  describe('mobile menu toggle', () => {
    it('should toggle isMenuOpen state', () => {
      let clickHandler;
      const mockButton = {
        addEventListener: vi.fn((event, handler) => {
          if (event === 'click') clickHandler = handler;
        }),
        setAttribute: vi.fn(),
        querySelector: vi.fn(() => ({
          classList: { toggle: vi.fn() }
        }))
      };

      const mockMenu = {
        classList: { toggle: vi.fn() },
        contains: vi.fn()
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'mobile-menu-button') return mockButton;
        if (id === 'mobile-menu') return mockMenu;
        return null;
      });

      navigation.attachEventListeners();

      expect(navigation.isMenuOpen).toBe(false);
      clickHandler();
      expect(navigation.isMenuOpen).toBe(true);
      clickHandler();
      expect(navigation.isMenuOpen).toBe(false);
    });
  });
});
