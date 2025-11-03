/**
 * Navigation Component
 *
 * Responsive navigation with:
 * - Desktop: Horizontal nav with dropdowns
 * - Mobile: Hamburger menu
 * - WCAG 2 compliant with keyboard navigation
 */

import contentData from '../../content/content.json';

export class Navigation {
  constructor() {
    this.isMenuOpen = false;
    this.currentPath = window.location.pathname;
  }

  /**
   * Filter out hidden navigation items and sort children alphabetically
   * Exception: "Blog" always appears first in any dropdown
   */
  filterHidden(items) {
    return items
      .filter(item => !item.hidden)
      .map(item => ({
        ...item,
        children: item.children
          ? this.filterHidden(item.children).sort((a, b) => {
              // Put "Blog" first
              if (a.title === 'Blog') return -1;
              if (b.title === 'Blog') return 1;
              // Otherwise alphabetical
              return a.title.localeCompare(b.title);
            })
          : undefined
      }));
  }

  /**
   * Render the navigation component
   */
  render() {
    const nav = this.filterHidden(contentData.navigation);

    return `
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
        <div class="container-custom">
          <div class="flex items-center justify-between h-16">
            <!-- Logo / Site Title -->
            <div class="flex-shrink-0">
              <a href="/" class="text-2xl font-bold text-primary hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded">
                Chris Lyons
              </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-4">
              <div class="flex items-baseline space-x-4">
                ${nav.map(item => this.renderNavItem(item)).join('')}
              </div>
              <!-- Theme Toggle -->
              <div id="theme-toggle-container"></div>
            </div>

            <!-- Mobile: Theme toggle + menu button -->
            <div class="md:hidden flex items-center space-x-2">
              <!-- Theme Toggle -->
              <div id="theme-toggle-container-mobile"></div>
              <!-- Mobile menu button -->
              <button
                type="button"
                id="mobile-menu-button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors"
                aria-controls="mobile-menu"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <span class="sr-only">Open main menu</span>
                <!-- Hamburger icon -->
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <!-- Close icon (hidden by default) -->
                <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu (hidden by default) -->
        <div class="md:hidden hidden" id="mobile-menu">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            ${nav.map(item => this.renderMobileNavItem(item)).join('')}
          </div>
        </div>
      </nav>
    `;
  }

  /**
   * Render a desktop navigation item
   */
  renderNavItem(item) {
    const isActive = this.currentPath === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isConnect = item.id === 'connect';

    if (!hasChildren) {
      return `
        <a
          href="${item.path}"
          class="nav-link px-3 py-2 rounded-md text-lg font-medium ${
            isActive
              ? 'text-primary bg-gray-100'
              : 'text-gray-700 hover:text-primary hover:bg-gray-50'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          ${isActive ? 'aria-current="page"' : ''}
          ${isConnect ? 'data-admin-trapdoor="true"' : ''}
        >
          ${item.title}
        </a>
      `;
    }

    // Item with dropdown
    return `
      <div class="relative" data-dropdown-wrapper>
        <button
          type="button"
          class="nav-link px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary inline-flex items-center"
          aria-expanded="false"
          aria-haspopup="true"
          data-dropdown-button
        >
          ${item.title}
          <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Dropdown menu with invisible bridge -->
        <div class="absolute left-0 top-full w-56 z-10 opacity-0 invisible pointer-events-none transition-all duration-150" data-dropdown-menu>
          <!-- Invisible bridge to maintain hover state across gap -->
          <div class="h-2"></div>
          <!-- Actual dropdown content -->
          <div class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div class="py-1" role="menu" aria-orientation="vertical">
              ${item.children.map(child => `
                <a
                  href="${child.path}"
                  class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none focus:bg-gray-100"
                  role="menuitem"
                >
                  ${child.title}
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render a mobile navigation item
   */
  renderMobileNavItem(item) {
    const isActive = this.currentPath === item.path;
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return `
        <a
          href="${item.path}"
          class="mobile-nav-link block px-3 py-2 rounded-md text-lg font-medium ${
            isActive
              ? 'text-primary bg-gray-200'
              : 'text-gray-700 hover:text-primary hover:bg-gray-100'
          } transition-colors"
          ${isActive ? 'aria-current="page"' : ''}
        >
          ${item.title}
        </a>
      `;
    }

    // Item with children (expandable)
    return `
      <div class="space-y-1">
        <a
          href="${item.path}"
          class="mobile-nav-link block px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
        >
          ${item.title}
        </a>
        <div class="pl-4 space-y-1">
          ${item.children.map(child => `
            <a
              href="${child.path}"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
            >
              ${child.title}
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners after rendering
   */
  attachEventListeners() {
    // Dropdown hover behavior
    document.querySelectorAll('[data-dropdown-wrapper]').forEach(wrapper => {
      const button = wrapper.querySelector('[data-dropdown-button]');
      const menu = wrapper.querySelector('[data-dropdown-menu]');

      if (!button || !menu) return;

      let isOpen = false;

      const showDropdown = () => {
        isOpen = true;
        menu.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        menu.classList.add('opacity-100', 'visible', 'pointer-events-auto');
        button.setAttribute('aria-expanded', 'true');
      };

      const hideDropdown = () => {
        isOpen = false;
        menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
        menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        button.setAttribute('aria-expanded', 'false');
      };

      // Show dropdown when hovering button
      button.addEventListener('mouseenter', showDropdown);

      // Keep dropdown open when hovering the menu (including bridge)
      menu.addEventListener('mouseenter', showDropdown);

      // Hide when leaving button (only if not moving to menu)
      button.addEventListener('mouseleave', (e) => {
        // Small delay to allow moving to menu
        setTimeout(() => {
          if (!menu.matches(':hover')) {
            hideDropdown();
          }
        }, 50);
      });

      // Hide when leaving menu (only if not moving back to button)
      menu.addEventListener('mouseleave', (e) => {
        setTimeout(() => {
          if (!button.matches(':hover') && !menu.matches(':hover')) {
            hideDropdown();
          }
        }, 50);
      });
    });

    // Admin trapdoor: Alt+Shift+Click on Connect
    document.querySelectorAll('[data-admin-trapdoor="true"]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Check for Alt+Shift+Click
        const modifierPressed = e.altKey && e.shiftKey;

        if (modifierPressed) {
          e.preventDefault();
          window.location.href = '/admin';
        }
      });
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        this.isMenuOpen = !this.isMenuOpen;

        // Toggle menu visibility
        mobileMenu.classList.toggle('hidden');

        // Update button aria-expanded
        mobileMenuButton.setAttribute('aria-expanded', this.isMenuOpen.toString());

        // Toggle icons
        const hamburgerIcon = mobileMenuButton.querySelector('svg:first-of-type');
        const closeIcon = mobileMenuButton.querySelector('svg:last-of-type');

        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.classList.toggle('hidden');
          closeIcon.classList.toggle('hidden');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && !mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
          this.isMenuOpen = false;
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');

          const hamburgerIcon = mobileMenuButton.querySelector('svg:first-of-type');
          const closeIcon = mobileMenuButton.querySelector('svg:last-of-type');
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.isMenuOpen = false;
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          mobileMenuButton.focus(); // Return focus to button

          const hamburgerIcon = mobileMenuButton.querySelector('svg:first-of-type');
          const closeIcon = mobileMenuButton.querySelector('svg:last-of-type');
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
        }
      });
    }
  }
}

export default Navigation;
