/**
 * Chris Lyons Website - Main Entry Point
 *
 * Initializes the application with routing, components, and content loading
 */

import './style.css';

// Import components
import { Navigation } from './components/Navigation.js';
import { Footer } from './components/Footer.js';
import { ThemeToggle } from './components/ThemeToggle.js';

// Import utilities
import router from './utils/router.js';
import { injectMotionTokens } from './utils/spring.js';

// Import route configuration
import { routes, notFoundRoute } from './routes.js';

// Global state
let navigation = null;
let footer = null;
let themeToggle = null;

/**
 * Set up global keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // '\' key to cycle themes
    if (e.key === '\\' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Don't trigger if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      if (!isTyping) {
        e.preventDefault();
        themeToggle.toggle();

        // Re-render theme toggle buttons with new icon
        const themeToggleContainer = document.getElementById('theme-toggle-container');
        const themeToggleContainerMobile = document.getElementById('theme-toggle-container-mobile');

        if (themeToggleContainer) {
          themeToggleContainer.innerHTML = themeToggle.render();
          themeToggle.attachEventListeners();
        }

        if (themeToggleContainerMobile) {
          themeToggleContainerMobile.innerHTML = themeToggle.render();
        }
      }
    }
  });
}

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 Chris Lyons Website Initializing...');

  // Inject motion tokens as CSS custom properties
  injectMotionTokens();

  // Initialize theme (must be first to apply dark mode immediately)
  themeToggle = new ThemeToggle();

  // Set up global keyboard shortcuts
  setupKeyboardShortcuts();

  // Initialize components
  navigation = new Navigation();
  footer = new Footer();

  // Render static components
  renderNavigation();
  renderFooter();

  // Set up routes
  setupRoutes();

  // Initialize router
  router.init();

  console.log('✅ Application Initialized');
  console.log(`🎨 Theme: ${themeToggle.theme}`);
}

/**
 * Render navigation component
 */
function renderNavigation() {
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = navigation.render();
    navigation.attachEventListeners();

    // Render theme toggle in navigation
    const themeToggleContainer = document.getElementById('theme-toggle-container');
    const themeToggleContainerMobile = document.getElementById('theme-toggle-container-mobile');

    if (themeToggleContainer) {
      themeToggleContainer.innerHTML = themeToggle.render();
      themeToggle.attachEventListeners();
    }

    if (themeToggleContainerMobile) {
      themeToggleContainerMobile.innerHTML = themeToggle.render();
      // Note: Event listeners are already attached from desktop render
    }
  }
}

/**
 * Render footer component
 */
function renderFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = footer.render();
  }
}

/**
 * Set up application routes with code splitting
 */
function setupRoutes() {
  // Register all routes from configuration
  routes.forEach(route => {
    router.on(route.path, async () => {
      try {
        // Dynamically load the page module
        const renderFunction = await route.load();
        // Execute the render function
        renderFunction();
      } catch (error) {
        console.error(`Error loading page for ${route.path}:`, error);
        // Fall back to 404 page on error
        const render404 = await notFoundRoute.load();
        render404();
      }
    });
  });

  // Register 404 handler
  router.notFound(async () => {
    const render404 = await notFoundRoute.load();
    render404();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
