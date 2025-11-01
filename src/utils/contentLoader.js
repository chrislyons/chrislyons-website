/**
 * Content Loader Utility
 *
 * Loads and manages content from content.json and markdown files
 */

import contentData from '../../content/content.json';

export class ContentLoader {
  constructor() {
    this.contentData = contentData;
    this.markdownCache = new Map();
  }

  /**
   * Get site metadata
   *
   * @returns {Object} Site metadata
   */
  getSiteData() {
    return this.contentData.site;
  }

  /**
   * Get navigation structure
   *
   * @returns {Array} Navigation items
   */
  getNavigation() {
    return this.contentData.navigation;
  }

  /**
   * Get page data by ID
   *
   * @param {string} pageId - Page identifier
   * @returns {Object|null} Page data or null if not found
   */
  getPageData(pageId) {
    return this.contentData.pages[pageId] || null;
  }

  /**
   * Get page data by path
   *
   * @param {string} path - Page path (e.g., "/systems/boot-industries")
   * @returns {Object|null} Page data or null if not found
   */
  getPageDataByPath(path) {
    // Find navigation item with matching path
    const findInNav = (items) => {
      for (const item of items) {
        if (item.path === path) {
          return this.getPageData(item.id);
        }
        if (item.children) {
          const found = findInNav(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInNav(this.contentData.navigation);
  }

  /**
   * Load markdown content from a file
   *
   * @param {string} filePath - Path to markdown file relative to project root
   * @returns {Promise<string>} Markdown content
   */
  async loadMarkdown(filePath) {
    // Check cache first
    if (this.markdownCache.has(filePath)) {
      return this.markdownCache.get(filePath);
    }

    try {
      // In Vite, we can import raw files
      const response = await fetch(`/${filePath}?raw`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }

      const content = await response.text();
      this.markdownCache.set(filePath, content);
      return content;
    } catch (error) {
      console.error('Error loading markdown:', error);
      return `# Error\n\nFailed to load content from ${filePath}`;
    }
  }

  /**
   * Get all pages with a specific property
   *
   * @param {string} property - Property to check
   * @param {any} value - Value to match
   * @returns {Array} Array of page objects
   */
  getPagesByProperty(property, value) {
    return Object.entries(this.contentData.pages)
      .filter(([_, page]) => page[property] === value)
      .map(([id, page]) => ({ id, ...page }));
  }

  /**
   * Get all placeholder pages
   *
   * @returns {Array} Array of placeholder pages
   */
  getPlaceholderPages() {
    return this.getPagesByProperty('placeholder', true);
  }

  /**
   * Find navigation item by ID
   *
   * @param {string} id - Page ID
   * @returns {Object|null} Navigation item or null
   */
  findNavItem(id) {
    const findInNav = (items) => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findInNav(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInNav(this.contentData.navigation);
  }

  /**
   * Get breadcrumb trail for a page
   *
   * @param {string} path - Page path
   * @returns {Array} Array of breadcrumb objects with { title, path }
   */
  getBreadcrumbs(path) {
    const breadcrumbs = [{ title: 'Home', path: '/' }];

    const findPath = (items, currentPath = []) => {
      for (const item of items) {
        const newPath = [...currentPath, { title: item.title, path: item.path }];

        if (item.path === path) {
          return newPath;
        }

        if (item.children) {
          const found = findPath(item.children, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    const trail = findPath(this.contentData.navigation);
    if (trail) {
      breadcrumbs.push(...trail);
    }

    return breadcrumbs;
  }

  /**
   * Update document title based on page data
   *
   * @param {string} pageTitle - Page title
   */
  updateDocumentTitle(pageTitle) {
    const siteTitle = this.contentData.site.title;
    document.title = pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle;
  }

  /**
   * Update meta description
   *
   * @param {string} description - Meta description content
   */
  updateMetaDescription(description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }
}

export default new ContentLoader();
