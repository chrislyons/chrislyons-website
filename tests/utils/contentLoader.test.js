import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the content.json import before importing ContentLoader
vi.mock('../../content/content.json', () => ({
  default: {
    site: {
      title: 'Test Site',
      description: 'A test site'
    },
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
            id: 'apps-projects',
            title: 'Projects',
            path: '/apps/projects'
          },
          {
            id: 'apps-tools',
            title: 'Tools',
            path: '/apps/tools'
          }
        ]
      },
      {
        id: 'ideas',
        title: 'Ideas',
        path: '/ideas',
        children: []
      }
    ],
    pages: {
      home: {
        title: 'Home',
        description: 'Welcome to the home page',
        placeholder: false
      },
      apps: {
        title: 'Apps',
        description: 'Application projects',
        placeholder: false
      },
      'apps-projects': {
        title: 'Projects',
        description: 'My projects',
        placeholder: false
      },
      'apps-tools': {
        title: 'Tools',
        description: 'Useful tools',
        placeholder: true
      },
      ideas: {
        title: 'Ideas',
        description: 'My ideas',
        placeholder: true
      }
    }
  }
}));

import { ContentLoader } from '../../src/utils/contentLoader.js';

describe('ContentLoader', () => {
  let contentLoader;

  beforeEach(() => {
    contentLoader = new ContentLoader();

    // Mock document for DOM operations
    vi.stubGlobal('document', {
      title: '',
      head: {
        appendChild: vi.fn()
      },
      querySelector: vi.fn(),
      createElement: vi.fn(() => ({
        setAttribute: vi.fn()
      }))
    });

    // Mock fetch for loadMarkdown
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('getSiteData', () => {
    it('should return site metadata', () => {
      const siteData = contentLoader.getSiteData();

      expect(siteData.title).toBe('Test Site');
      expect(siteData.description).toBe('A test site');
    });
  });

  describe('getNavigation', () => {
    it('should return navigation structure', () => {
      const navigation = contentLoader.getNavigation();

      expect(navigation).toBeInstanceOf(Array);
      expect(navigation.length).toBe(3);
      expect(navigation[0].id).toBe('home');
      expect(navigation[1].id).toBe('apps');
      expect(navigation[2].id).toBe('ideas');
    });

    it('should include nested children', () => {
      const navigation = contentLoader.getNavigation();
      const apps = navigation[1];

      expect(apps.children).toHaveLength(2);
      expect(apps.children[0].id).toBe('apps-projects');
      expect(apps.children[1].id).toBe('apps-tools');
    });
  });

  describe('getPageData', () => {
    it('should return page data by ID', () => {
      const pageData = contentLoader.getPageData('home');

      expect(pageData).not.toBeNull();
      expect(pageData.title).toBe('Home');
      expect(pageData.description).toBe('Welcome to the home page');
    });

    it('should return null for unknown page ID', () => {
      const pageData = contentLoader.getPageData('nonexistent');

      expect(pageData).toBeNull();
    });

    it('should return nested page data', () => {
      const pageData = contentLoader.getPageData('apps-projects');

      expect(pageData).not.toBeNull();
      expect(pageData.title).toBe('Projects');
    });
  });

  describe('getPageDataByPath', () => {
    it('should return page data by path', () => {
      const pageData = contentLoader.getPageDataByPath('/');

      expect(pageData).not.toBeNull();
      expect(pageData.title).toBe('Home');
    });

    it('should find nested pages by path', () => {
      const pageData = contentLoader.getPageDataByPath('/apps/projects');

      expect(pageData).not.toBeNull();
      expect(pageData.title).toBe('Projects');
    });

    it('should return null for unknown path', () => {
      const pageData = contentLoader.getPageDataByPath('/nonexistent');

      expect(pageData).toBeNull();
    });

    it('should handle parent paths', () => {
      const pageData = contentLoader.getPageDataByPath('/apps');

      expect(pageData).not.toBeNull();
      expect(pageData.title).toBe('Apps');
    });
  });

  describe('loadMarkdown', () => {
    it('should fetch and return markdown content', async () => {
      const mockContent = '# Test Content';
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      const content = await contentLoader.loadMarkdown('test.md');

      expect(fetch).toHaveBeenCalledWith('/test.md?raw');
      expect(content).toBe(mockContent);
    });

    it('should cache fetched content', async () => {
      const mockContent = '# Cached Content';
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      await contentLoader.loadMarkdown('cached.md');
      await contentLoader.loadMarkdown('cached.md');

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return cached content on subsequent calls', async () => {
      const mockContent = '# First Load';
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      const first = await contentLoader.loadMarkdown('file.md');
      const second = await contentLoader.loadMarkdown('file.md');

      expect(first).toBe(second);
    });

    it('should handle fetch errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found'
      });

      const content = await contentLoader.loadMarkdown('missing.md');

      expect(content).toContain('Error');
      expect(content).toContain('missing.md');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const content = await contentLoader.loadMarkdown('error.md');

      expect(content).toContain('Error');
    });
  });

  describe('getPagesByProperty', () => {
    it('should filter pages by property value', () => {
      const placeholderPages = contentLoader.getPagesByProperty('placeholder', true);

      expect(placeholderPages).toHaveLength(2);
      expect(placeholderPages.find(p => p.id === 'apps-tools')).toBeTruthy();
      expect(placeholderPages.find(p => p.id === 'ideas')).toBeTruthy();
    });

    it('should return empty array when no matches', () => {
      const pages = contentLoader.getPagesByProperty('nonexistent', true);

      expect(pages).toEqual([]);
    });

    it('should include page id in results', () => {
      const pages = contentLoader.getPagesByProperty('placeholder', false);

      pages.forEach(page => {
        expect(page.id).toBeDefined();
      });
    });
  });

  describe('getPlaceholderPages', () => {
    it('should return all placeholder pages', () => {
      const placeholders = contentLoader.getPlaceholderPages();

      expect(placeholders).toHaveLength(2);
      placeholders.forEach(page => {
        expect(page.placeholder).toBe(true);
      });
    });
  });

  describe('findNavItem', () => {
    it('should find top-level nav item by ID', () => {
      const item = contentLoader.findNavItem('home');

      expect(item).not.toBeNull();
      expect(item.title).toBe('Home');
      expect(item.path).toBe('/');
    });

    it('should find nested nav item by ID', () => {
      const item = contentLoader.findNavItem('apps-projects');

      expect(item).not.toBeNull();
      expect(item.title).toBe('Projects');
      expect(item.path).toBe('/apps/projects');
    });

    it('should return null for unknown ID', () => {
      const item = contentLoader.findNavItem('nonexistent');

      expect(item).toBeNull();
    });
  });

  describe('getBreadcrumbs', () => {
    it('should return breadcrumbs for root path', () => {
      const breadcrumbs = contentLoader.getBreadcrumbs('/');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({ title: 'Home', path: '/' });
      expect(breadcrumbs[1]).toEqual({ title: 'Home', path: '/' });
    });

    it('should return breadcrumbs for nested path', () => {
      const breadcrumbs = contentLoader.getBreadcrumbs('/apps/projects');

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0]).toEqual({ title: 'Home', path: '/' });
      expect(breadcrumbs[1]).toEqual({ title: 'Apps', path: '/apps' });
      expect(breadcrumbs[2]).toEqual({ title: 'Projects', path: '/apps/projects' });
    });

    it('should return only home for unknown path', () => {
      const breadcrumbs = contentLoader.getBreadcrumbs('/nonexistent');

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0]).toEqual({ title: 'Home', path: '/' });
    });
  });

  describe('updateDocumentTitle', () => {
    it('should update document title with page title', () => {
      contentLoader.updateDocumentTitle('Test Page');

      expect(document.title).toBe('Test Page - Test Site');
    });

    it('should use site title only when no page title', () => {
      contentLoader.updateDocumentTitle('');

      expect(document.title).toBe('Test Site');
    });

    it('should handle null page title', () => {
      contentLoader.updateDocumentTitle(null);

      expect(document.title).toBe('Test Site');
    });
  });

  describe('updateMetaDescription', () => {
    it('should update existing meta description', () => {
      const mockMeta = {
        setAttribute: vi.fn()
      };
      document.querySelector = vi.fn(() => mockMeta);

      contentLoader.updateMetaDescription('New description');

      expect(mockMeta.setAttribute).toHaveBeenCalledWith('content', 'New description');
    });

    it('should create meta description if not exists', () => {
      const mockMeta = {
        setAttribute: vi.fn()
      };
      document.querySelector = vi.fn(() => null);
      document.createElement = vi.fn(() => mockMeta);

      contentLoader.updateMetaDescription('New description');

      expect(document.createElement).toHaveBeenCalledWith('meta');
      expect(mockMeta.setAttribute).toHaveBeenCalledWith('name', 'description');
      expect(mockMeta.setAttribute).toHaveBeenCalledWith('content', 'New description');
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMeta);
    });
  });
});
