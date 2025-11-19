/**
 * Simple Client-Side Router
 *
 * Handles navigation without full page reloads
 * Updates URL using History API
 * Manages page transitions and document titles
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.notFoundHandler = null;

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      this.handleRoute(window.location.pathname, false);
    });

    // Intercept link clicks (except for worker routes)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        const path = link.getAttribute('href');

        // Don't intercept worker routes - let them perform full page navigation
        if (path.startsWith('/blog') || path.startsWith('/admin')) {
          return; // Allow default behavior (full page load)
        }

        e.preventDefault();
        this.navigate(path);
      }
    });
  }

  /**
   * Register a route
   *
   * @param {string} path - Route path (e.g., "/about", "/contact")
   * @param {Function} handler - Function to call when route is accessed
   */
  on(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  /**
   * Register a 404 handler
   *
   * @param {Function} handler - Function to call when no route matches
   */
  notFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  /**
   * Navigate to a new route
   *
   * @param {string} path - Path to navigate to
   * @param {boolean} pushState - Whether to push state to history (default: true)
   */
  navigate(path, pushState = true) {
    if (pushState) {
      window.history.pushState({ path }, '', path);
    }

    this.handleRoute(path, true);
  }

  /**
   * Handle route change
   *
   * @param {string} path - Current path
   * @param {boolean} isNewNavigation - Whether this is a new navigation
   */
  handleRoute(path, isNewNavigation) {
    // Normalize path (remove trailing slash except for root)
    const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');

    // Check for exact match first
    if (this.routes.has(normalizedPath)) {
      this.currentRoute = normalizedPath;
      const handler = this.routes.get(normalizedPath);

      // Scroll to top on new navigation
      if (isNewNavigation) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Call the route handler
      handler();

      // Announce route change to screen readers
      this.announceRouteChange(normalizedPath);

      return;
    }

    // Check for parameterized routes (e.g., /blog/:slug)
    for (const [routePath, handler] of this.routes) {
      const params = this.matchRoute(routePath, normalizedPath);
      if (params) {
        this.currentRoute = normalizedPath;

        if (isNewNavigation) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        handler(params);
        this.announceRouteChange(normalizedPath);
        return;
      }
    }

    // No route matched - call 404 handler
    if (this.notFoundHandler) {
      this.notFoundHandler();
      this.announceRouteChange('404');
    } else {
      console.error(`No route found for: ${normalizedPath}`);
    }
  }

  /**
   * Match a route pattern against a path
   *
   * @param {string} pattern - Route pattern (e.g., "/blog/:slug")
   * @param {string} path - Actual path to match
   * @returns {Object|null} - Parameters extracted from path, or null if no match
   */
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        // This is a parameter
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        // Parts don't match
        return null;
      }
    }

    return params;
  }

  /**
   * Announce route change to screen readers
   *
   * @param {string} path - Current path
   */
  announceRouteChange(path) {
    const announcement = document.getElementById('route-announcement');
    if (!announcement) {
      const div = document.createElement('div');
      div.id = 'route-announcement';
      div.className = 'sr-only';
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', 'polite');
      div.setAttribute('aria-atomic', 'true');
      document.body.appendChild(div);
    }

    const announcer = document.getElementById('route-announcement');
    announcer.textContent = `Navigated to ${path === '/' ? 'home page' : path.replace(/\//g, ' ')}`;
  }

  /**
   * Initialize router and handle current location
   */
  init() {
    this.handleRoute(window.location.pathname, false);
    return this;
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

export default new Router();
