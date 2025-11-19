import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from '../../src/utils/router.js';

describe('Router', () => {
  let router;

  beforeEach(() => {
    // Mock window and document objects
    vi.stubGlobal('window', {
      location: { pathname: '/' },
      history: {
        pushState: vi.fn()
      },
      scrollTo: vi.fn(),
      addEventListener: vi.fn(),
      matchMedia: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn()
      }))
    });

    vi.stubGlobal('document', {
      addEventListener: vi.fn(),
      getElementById: vi.fn(),
      createElement: vi.fn(() => ({
        setAttribute: vi.fn()
      })),
      body: {
        appendChild: vi.fn()
      }
    });

    router = new Router();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('matchRoute', () => {
    it('should match exact routes', () => {
      const result = router.matchRoute('/about', '/about');
      expect(result).toEqual({});
    });

    it('should not match different routes', () => {
      const result = router.matchRoute('/about', '/contact');
      expect(result).toBeNull();
    });

    it('should extract single parameter', () => {
      const result = router.matchRoute('/blog/:slug', '/blog/hello-world');
      expect(result).toEqual({ slug: 'hello-world' });
    });

    it('should extract multiple parameters', () => {
      const result = router.matchRoute('/blog/:year/:month/:slug', '/blog/2024/01/hello');
      expect(result).toEqual({ year: '2024', month: '01', slug: 'hello' });
    });

    it('should return null when path length differs', () => {
      const result = router.matchRoute('/blog/:slug', '/blog/2024/hello');
      expect(result).toBeNull();
    });

    it('should return null when pattern length differs', () => {
      const result = router.matchRoute('/blog/:year/:slug', '/blog/hello');
      expect(result).toBeNull();
    });

    it('should handle root path', () => {
      const result = router.matchRoute('/', '/');
      expect(result).toEqual({});
    });

    it('should match nested static routes', () => {
      const result = router.matchRoute('/apps/projects', '/apps/projects');
      expect(result).toEqual({});
    });

    it('should match mixed static and parameter routes', () => {
      const result = router.matchRoute('/apps/:category/item/:id', '/apps/tools/item/123');
      expect(result).toEqual({ category: 'tools', id: '123' });
    });

    it('should not match when static parts differ', () => {
      const result = router.matchRoute('/blog/:slug', '/posts/hello');
      expect(result).toBeNull();
    });

    it('should handle empty path parts correctly', () => {
      const result = router.matchRoute('/a/b', '/a/b');
      expect(result).toEqual({});
    });
  });

  describe('on', () => {
    it('should register a route', () => {
      const handler = vi.fn();
      const result = router.on('/test', handler);

      expect(router.routes.has('/test')).toBe(true);
      expect(router.routes.get('/test')).toBe(handler);
      expect(result).toBe(router); // chainable
    });

    it('should allow multiple routes', () => {
      router.on('/a', vi.fn()).on('/b', vi.fn()).on('/c', vi.fn());

      expect(router.routes.size).toBe(3);
      expect(router.routes.has('/a')).toBe(true);
      expect(router.routes.has('/b')).toBe(true);
      expect(router.routes.has('/c')).toBe(true);
    });
  });

  describe('notFound', () => {
    it('should register a 404 handler', () => {
      const handler = vi.fn();
      const result = router.notFound(handler);

      expect(router.notFoundHandler).toBe(handler);
      expect(result).toBe(router); // chainable
    });
  });

  describe('navigate', () => {
    beforeEach(() => {
      // Mock getElementById for announceRouteChange
      document.getElementById = vi.fn(() => ({
        textContent: ''
      }));
    });

    it('should push state to history by default', () => {
      router.on('/test', vi.fn());
      router.navigate('/test');

      expect(window.history.pushState).toHaveBeenCalledWith(
        { path: '/test' },
        '',
        '/test'
      );
    });

    it('should not push state when pushState is false', () => {
      router.on('/test', vi.fn());
      router.navigate('/test', false);

      expect(window.history.pushState).not.toHaveBeenCalled();
    });

    it('should call handleRoute with correct arguments', () => {
      const handleRouteSpy = vi.spyOn(router, 'handleRoute');
      router.on('/test', vi.fn());
      router.navigate('/test');

      expect(handleRouteSpy).toHaveBeenCalledWith('/test', true);
    });
  });

  describe('handleRoute', () => {
    beforeEach(() => {
      // Mock getElementById to return an existing announcement element
      document.getElementById = vi.fn(() => ({
        textContent: ''
      }));
    });

    it('should call handler for exact route match', () => {
      const handler = vi.fn();
      router.on('/about', handler);

      router.handleRoute('/about', false);

      expect(handler).toHaveBeenCalled();
    });

    it('should normalize trailing slashes', () => {
      const handler = vi.fn();
      router.on('/about', handler);

      router.handleRoute('/about/', false);

      expect(handler).toHaveBeenCalled();
    });

    it('should not normalize root path trailing slash', () => {
      const handler = vi.fn();
      router.on('/', handler);

      router.handleRoute('/', false);

      expect(handler).toHaveBeenCalled();
    });

    it('should call handler with params for parameterized routes', () => {
      const handler = vi.fn();
      router.on('/blog/:slug', handler);

      router.handleRoute('/blog/hello-world', false);

      expect(handler).toHaveBeenCalledWith({ slug: 'hello-world' });
    });

    it('should call notFound handler when no route matches', () => {
      const notFoundHandler = vi.fn();
      router.notFound(notFoundHandler);

      router.handleRoute('/nonexistent', false);

      expect(notFoundHandler).toHaveBeenCalled();
    });

    it('should scroll to top on new navigation', () => {
      const handler = vi.fn();
      router.on('/test', handler);

      router.handleRoute('/test', true);

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should not scroll on popstate navigation', () => {
      const handler = vi.fn();
      router.on('/test', handler);

      router.handleRoute('/test', false);

      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should update currentRoute', () => {
      router.on('/test', vi.fn());

      router.handleRoute('/test', false);

      expect(router.currentRoute).toBe('/test');
    });

    it('should prefer exact match over parameterized match', () => {
      const exactHandler = vi.fn();
      const paramHandler = vi.fn();

      router.on('/blog/featured', exactHandler);
      router.on('/blog/:slug', paramHandler);

      router.handleRoute('/blog/featured', false);

      expect(exactHandler).toHaveBeenCalled();
      expect(paramHandler).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentRoute', () => {
    it('should return null initially', () => {
      expect(router.getCurrentRoute()).toBeNull();
    });

    it('should return current route after navigation', () => {
      document.getElementById = vi.fn(() => ({
        textContent: ''
      }));

      router.on('/test', vi.fn());
      router.handleRoute('/test', false);

      expect(router.getCurrentRoute()).toBe('/test');
    });
  });

  describe('announceRouteChange', () => {
    it('should create announcement element if not exists', () => {
      const mockDiv = {
        id: '',
        className: '',
        setAttribute: vi.fn(),
        textContent: ''
      };

      document.getElementById = vi.fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(mockDiv);
      document.createElement = vi.fn(() => mockDiv);
      document.body.appendChild = vi.fn();

      router.announceRouteChange('/test');

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('should update announcement text for regular paths', () => {
      const mockAnnouncer = { textContent: '' };
      document.getElementById = vi.fn(() => mockAnnouncer);

      router.announceRouteChange('/about/team');

      expect(mockAnnouncer.textContent).toBe('Navigated to  about team');
    });

    it('should announce home page correctly', () => {
      const mockAnnouncer = { textContent: '' };
      document.getElementById = vi.fn(() => mockAnnouncer);

      router.announceRouteChange('/');

      expect(mockAnnouncer.textContent).toBe('Navigated to home page');
    });
  });

  describe('init', () => {
    it('should call handleRoute with current pathname', () => {
      const handleRouteSpy = vi.spyOn(router, 'handleRoute');
      window.location.pathname = '/test-page';

      router.init();

      expect(handleRouteSpy).toHaveBeenCalledWith('/test-page', false);
    });

    it('should be chainable', () => {
      const result = router.init();
      expect(result).toBe(router);
    });
  });
});
