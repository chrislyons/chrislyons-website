// Note: Not using hono/html because it causes escaping issues
// Using raw template literals instead

import assetManifest from './asset-manifest.json';

// Type for entry from database
type Entry = {
  id: number;
  type: string;
  content: string;
  created_at: string;
  updated_at: string;
  published: number;
  metadata: string | null;
};

// Google Fonts to include
const FONTS = [
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Work Sans', category: 'sans-serif' },
  { name: 'DM Sans', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Righteous', category: 'display' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'Pacifico', category: 'handwriting' },
  { name: 'Permanent Marker', category: 'handwriting' },
  { name: 'Space Mono', category: 'monospace' },
  { name: 'JetBrains Mono', category: 'monospace' },
];

// Extract unique fonts from entries
function extractFonts(entries: Entry[]): string[] {
  const fontsUsed = new Set<string>();
  entries.forEach((entry) => {
    if (entry.metadata) {
      try {
        const meta = JSON.parse(entry.metadata);
        if (meta.font) fontsUsed.add(meta.font);
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
  return Array.from(fontsUsed);
}

// Build Google Fonts URL
function buildFontUrl(fonts: string[]): string {
  if (fonts.length === 0) {
    // Default fonts
    return 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
  }
  const families = fonts
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

// Navigation data (matches content.json structure)
const NAV_DATA = [
  {
    title: "Apps",
    path: "/apps",
    id: "apps",
    children: [
      { title: "Carbon ACX", path: "/apps/carbon-acx" },
      { title: "Clip Composer", path: "/apps/clip-composer" },
      { title: "Hotbox", path: "/apps/hotbox" },
      { title: "ListMaker", path: "/apps/listmaker" },
      { title: "Tidal MCP Server", path: "/apps/tidal-mcp" },
      { title: "WordBird", path: "/apps/wordbird" }
    ]
  },
  {
    title: "Ideas",
    path: "/ideas",
    id: "ideas",
    children: [
      { title: "27 Suppositions", path: "/ideas/27-suppositions" },
      { title: "Blog", path: "/blog" },
      { title: "Numa Network", path: "/ideas/numa-network" },
      { title: "OSD Events", path: "/ideas/osd-events" },
      { title: "Protocols of Sound", path: "/ideas/protocols-of-sound" }
    ]
  },
  {
    title: "Sounds",
    path: "/sounds",
    id: "sounds",
    children: [
      { title: "Collected Lyrics", path: "/sounds/lyrics" },
      { title: "Discography", path: "/sounds/discography" },
      { title: "Portfolio", path: "/sounds/portfolio" }
    ]
  },
  {
    title: "Connect",
    path: "/connect",
    id: "connect"
  }
];

// Render floating navigation (for blog/admin pages)
function renderFloatingNav(currentPath: string = ''): string {
  return `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" id="floating-nav" style="background: transparent;" role="navigation" aria-label="Main navigation">
      <div class="container-custom">
        <div class="flex items-center justify-between h-16">
          <!-- Logo / Site Title -->
          <div class="flex-shrink-0">
            <a href="/" class="text-2xl font-bold text-primary dark:text-blue-400 hover:text-secondary dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded">
              Chris Lyons
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4">
            ${NAV_DATA.map(item => {
              if (item.children && item.children.length > 0) {
                return `
                  <div class="relative group">
                    <button
                      type="button"
                      class="nav-link px-3 py-2 rounded-md text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:bg-opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary inline-flex items-center"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      ${item.title}
                      <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <div class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div class="py-1" role="menu" aria-orientation="vertical">
                        ${item.children.map(child => `
                          <a
                            href="${child.path}"
                            class="block px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                            role="menuitem"
                          >
                            ${child.title}
                          </a>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                `;
              } else {
                const isConnect = item.id === 'connect';
                return `
                  <a href="${item.path}" ${isConnect ? 'data-admin-trapdoor="true"' : ''} class="nav-link px-3 py-2 rounded-md text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:bg-opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary">
                    ${item.title}
                  </a>
                `;
              }
            }).join('')}
            <!-- Theme Toggle -->
            <button
              type="button"
              id="theme-toggle"
              class="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              aria-label="Cycle theme"
              title="Cycle through themes"
            >
              <svg id="theme-icon" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>

          <!-- Mobile: Theme toggle + menu button -->
          <div class="md:hidden flex items-center space-x-2">
            <!-- Theme Toggle -->
            <button
              type="button"
              id="theme-toggle-mobile"
              class="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              aria-label="Cycle theme"
              title="Cycle through themes"
            >
              <svg id="theme-icon-mobile" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <!-- Mobile menu button -->
            <button
              type="button"
              id="mobile-menu-button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <span class="sr-only">Open main menu</span>
              <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu (hidden by default) -->
      <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm">
          ${NAV_DATA.map(item => {
            if (item.children && item.children.length > 0) {
              return `
                <div class="space-y-1">
                  <button type="button" class="mobile-nav-parent w-full text-left px-3 py-2 rounded-md text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                    ${item.title}
                    <svg class="h-4 w-4 transform transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div class="mobile-nav-children hidden pl-4 space-y-1">
                    ${item.children.map(child => `
                      <a href="${child.path}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        ${child.title}
                      </a>
                    `).join('')}
                  </div>
                </div>
              `;
            } else {
              const isConnect = item.id === 'connect';
              return `
                <a href="${item.path}" ${isConnect ? 'data-admin-trapdoor="true"' : ''} class="block px-3 py-2 rounded-md text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  ${item.title}
                </a>
              `;
            }
          }).join('')}
        </div>
      </div>
    </nav>

    <script>
      // Theme management (six themes: moonlight, daylight, forest, beach, plum, char)
      const STORAGE_KEY = 'chrislyons-theme';
      const THEMES = ['moonlight', 'daylight', 'forest', 'beach', 'plum', 'char'];

      // Theme icons (SVG paths)
      const THEME_ICONS = {
        moonlight: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
        daylight: '<circle cx="12" cy="12" r="4"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 20v2m-8-10H2m20 0h-2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"></path>',
        forest: '<path stroke-linecap="round" stroke-linejoin="round" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>',
        beach: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2 6 8l6 6 6-6Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m8 12-3 3 3 3 3-3Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m14 12 3 3-3 3-3-3Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m12 14 0 8"></path><path stroke-linecap="round" stroke-linejoin="round" d="m9 20 3 2 3-2"></path>',
        plum: '<ellipse cx="12" cy="13" rx="7" ry="8"></ellipse><path stroke-linecap="round" stroke-linejoin="round" d="M12 5 Q 12 2, 14 2 Q 15 2, 15 3 Q 15 4, 13 5"></path><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="5" x2="12" y2="8"></line>',
        char: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.5 14.5 A6 6 0 0 0 15.5 14.5 A5 5 0 0 1 12 20 A5 5 0 0 1 8.5 14.5Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 11 Q 9 8, 11 4 Q 12 2, 13 4 Q 15 8, 12 11Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 11 Q 11 9, 12 7"></path>'
      };

      function getInitialTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);

        // Migrate old values
        if (stored === 'dark') return 'moonlight';
        if (stored === 'light') return 'daylight';

        if (THEMES.includes(stored)) return stored;
        return 'moonlight'; // Default to moonlight
      }

      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Set color-scheme for browser UI
        const isDark = theme === 'moonlight' || theme === 'forest';
        document.documentElement.style.setProperty('color-scheme', isDark ? 'dark' : 'light');

        // Update dark class for backward compatibility
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Update icon
        updateThemeIcon(theme);
      }

      function updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        const iconMobile = document.getElementById('theme-icon-mobile');
        const svgContent = THEME_ICONS[theme] || THEME_ICONS.moonlight;

        if (icon) icon.innerHTML = svgContent;
        if (iconMobile) iconMobile.innerHTML = svgContent;
      }

      function cycleTheme() {
        const current = localStorage.getItem(STORAGE_KEY) || 'moonlight';
        const currentIndex = THEMES.indexOf(current);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        const newTheme = THEMES[nextIndex];

        localStorage.setItem(STORAGE_KEY, newTheme);
        applyTheme(newTheme);
      }

      // Apply initial theme
      applyTheme(getInitialTheme());

      // Theme toggle listeners
      document.getElementById('theme-toggle')?.addEventListener('click', cycleTheme);
      document.getElementById('theme-toggle-mobile')?.addEventListener('click', cycleTheme);

      // Mobile menu toggle
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      let isMenuOpen = false;

      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
          isMenuOpen = !isMenuOpen;
          mobileMenu.classList.toggle('hidden');
          mobileMenuButton.setAttribute('aria-expanded', isMenuOpen.toString());

          const hamburgerIcon = mobileMenuButton.querySelector('svg:first-of-type');
          const closeIcon = mobileMenuButton.querySelector('svg:last-of-type');
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
          }
        });

        // Mobile nav dropdown toggles
        document.querySelectorAll('.mobile-nav-parent').forEach(button => {
          button.addEventListener('click', (e) => {
            const parent = button.parentElement;
            const children = parent.querySelector('.mobile-nav-children');
            const arrow = button.querySelector('svg');

            if (children && arrow) {
              children.classList.toggle('hidden');
              arrow.classList.toggle('rotate-180');
            }
          });
        });
      }

      // Admin trapdoor: Alt+Shift+Click on Connect
      document.querySelectorAll('[data-admin-trapdoor="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const modifierPressed = e.altKey && e.shiftKey;
          if (modifierPressed) {
            e.preventDefault();
            window.location.href = '/admin';
          }
        });
      });

      // Scroll-based nav background (melt effect)
      const nav = document.getElementById('floating-nav');
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isDark = document.documentElement.classList.contains('dark');

        if (scrollTop > 50) {
          nav.style.background = isDark ? 'rgba(26, 31, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)';
          nav.style.backdropFilter = 'blur(10px)';
          nav.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        } else {
          nav.style.background = 'transparent';
          nav.style.backdropFilter = 'none';
          nav.style.boxShadow = 'none';
        }
      });
    </script>
  `;
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Render a single entry
function renderEntry(entry: Entry, isAdmin: boolean = false): string {
  const content = JSON.parse(entry.content);
  const metadata = entry.metadata ? JSON.parse(entry.metadata) : {};

  let entryHtml = '';

  switch (entry.type) {
    case 'text':
      const font = content.font || metadata.font || 'Inter';
      const fontSize = content.fontSize || '18px';
      const color = content.color || '#333333';
      entryHtml = `
        <div class="entry-content prose max-w-none">
          <p style="font-family: '${font}', sans-serif; font-size: ${fontSize}; color: ${color};">
            ${content.text}
          </p>
        </div>
      `;
      break;

    case 'image':
      entryHtml = `
        <div class="entry-content">
          <img src="${content.url}" alt="${content.alt || ''}" class="w-full rounded-lg shadow-md">
          ${content.caption ? `<p class="caption mt-3 text-sm text-gray-600">${content.caption}</p>` : ''}
        </div>
      `;
      break;

    case 'gif':
      entryHtml = `
        <div class="entry-content flex justify-center">
          <img src="${content.url}" alt="${content.title || 'GIF'}" class="max-w-md rounded-lg shadow-md">
        </div>
        ${content.title ? `<p class="text-center mt-2 text-sm text-gray-500">${content.title}</p>` : ''}
      `;
      break;

    case 'quote':
      const quoteFont = content.font || metadata.font || 'Georgia';
      entryHtml = `
        <div class="entry-content border-l-4 border-purple-600 pl-6 py-2">
          <blockquote style="font-family: '${quoteFont}', serif; font-size: 20px; font-style: italic; color: #1f2937;">
            "${content.text}"
          </blockquote>
          ${content.author ? `<p class="mt-3 text-sm text-gray-600">— ${content.author}</p>` : ''}
        </div>
      `;
      break;
  }

  const adminControls = isAdmin ? `
    <div class="entry-controls absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
      <button class="edit-btn px-3 py-1 bg-white rounded shadow hover:bg-gray-50" data-id="${entry.id}">✏️</button>
      <button class="delete-btn px-3 py-1 bg-white rounded shadow hover:bg-red-50" data-id="${entry.id}">🗑️</button>
      <button class="publish-toggle px-3 py-1 bg-white rounded shadow hover:bg-blue-50" data-id="${entry.id}" data-published="${entry.published}">
        ${entry.published ? '👁️' : '🔒'}
      </button>
    </div>
  ` : '';

  return `
    <article class="entry mb-12 group relative ${isAdmin ? 'border-2 border-dashed border-gray-200 rounded-lg p-6' : ''}"
             id="entry-${entry.id}"
             data-type="${entry.type}"
             data-id="${entry.id}"
             data-timestamp="${entry.created_at}">
      ${adminControls}
      ${entryHtml}
      <time class="block mt-3 text-sm text-gray-500" datetime="${entry.created_at}">
        ${formatRelativeTime(entry.created_at)}
      </time>
    </article>
  `;
}

// Public blog view
export function renderBlog(entries: Entry[]): string {
  const fonts = extractFonts(entries);
  const fontUrl = buildFontUrl(fonts);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Infinite Canvas Blog</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="${fontUrl}" rel="stylesheet">
      <link rel="stylesheet" href="${assetManifest.css}">
      <style>
        /* Default/Daylight theme */
        body {
          background: linear-gradient(to bottom, #faf5ff 0%, #ffffff 100%);
          min-height: 100vh;
        }

        /* Moonlight theme */
        [data-theme="moonlight"] body,
        .dark body {
          background: linear-gradient(to bottom, #1a1f2e 0%, #0f1419 100%);
          color: #e4e4e7;
        }
        [data-theme="moonlight"] .text-gray-900,
        .dark .text-gray-900 {
          color: #f4f4f5;
        }
        [data-theme="moonlight"] .text-gray-600,
        .dark .text-gray-600 {
          color: #a1a1aa;
        }
        [data-theme="moonlight"] .text-gray-500,
        .dark .text-gray-500 {
          color: #71717a;
        }
        [data-theme="moonlight"] .entry-content p,
        .dark .entry-content p {
          color: #e4e4e7 !important;
        }
        [data-theme="moonlight"] .entry-content blockquote,
        .dark .entry-content blockquote {
          color: #e4e4e7 !important;
        }
        [data-theme="moonlight"] .caption,
        .dark .caption {
          color: #a1a1aa !important;
        }

        /* Forest theme */
        [data-theme="forest"] body {
          background: linear-gradient(to bottom, #1a2e1f 0%, #0f1a13 100%);
          color: #e7f4e4;
        }
        [data-theme="forest"] .text-gray-900 {
          color: #f0fdf4;
        }
        [data-theme="forest"] .text-gray-600 {
          color: #a8c9af;
        }
        [data-theme="forest"] .text-gray-500 {
          color: #7a9b82;
        }
        [data-theme="forest"] .entry-content p {
          color: #e7f4e4 !important;
        }
        [data-theme="forest"] .entry-content blockquote {
          color: #e7f4e4 !important;
        }
        [data-theme="forest"] .caption {
          color: #a8c9af !important;
        }

        /* Beach theme */
        [data-theme="beach"] body {
          background: linear-gradient(to bottom, #fffef7 0%, #fefce8 100%);
          color: #2d3e50;
        }
        [data-theme="beach"] .text-gray-900 {
          color: #0c4a6e;
        }
        [data-theme="beach"] .text-gray-600 {
          color: #64748b;
        }
        [data-theme="beach"] .text-gray-500 {
          color: #94a3b8;
        }
        [data-theme="beach"] .entry-content p {
          color: #2d3e50 !important;
        }
        [data-theme="beach"] .entry-content blockquote {
          color: #2d3e50 !important;
        }
        [data-theme="beach"] .caption {
          color: #64748b !important;
        }

        /* Plum theme */
        [data-theme="plum"] body {
          background: linear-gradient(to bottom, #faf5ff 0%, #f3e8ff 100%);
          color: #581c87;
        }
        [data-theme="plum"] .text-gray-900 {
          color: #6b21a8;
        }
        [data-theme="plum"] .text-gray-600 {
          color: #a78bfa;
        }
        [data-theme="plum"] .text-gray-500 {
          color: #c4b5fd;
        }
        [data-theme="plum"] .entry-content p {
          color: #581c87 !important;
        }
        [data-theme="plum"] .entry-content blockquote {
          color: #581c87 !important;
        }
        [data-theme="plum"] .caption {
          color: #a78bfa !important;
        }

        /* Char theme */
        [data-theme="char"] body {
          background: linear-gradient(to bottom, #fff7ed 0%, #ffedd5 100%);
          color: #7c2d12;
        }
        [data-theme="char"] .text-gray-900 {
          color: #9a3412;
        }
        [data-theme="char"] .text-gray-600 {
          color: #ea580c;
        }
        [data-theme="char"] .text-gray-500 {
          color: #f97316;
        }
        [data-theme="char"] .entry-content p {
          color: #7c2d12 !important;
        }
        [data-theme="char"] .entry-content blockquote {
          color: #7c2d12 !important;
        }
        [data-theme="char"] .caption {
          color: #ea580c !important;
        }
      </style>
    </head>
    <body class="antialiased">
      ${renderFloatingNav('/blog')}

      <div class="canvas-container max-w-3xl mx-auto px-4 py-12" style="padding-top: 6rem;">
        <header class="mb-16 text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Infinite Canvas</h1>
          <p class="text-gray-600">Visual thoughts in an endless scroll</p>
        </header>

        <div id="entries-container">
          ${entries.map(entry => renderEntry(entry, false)).join('\n')}
        </div>

        <!-- Infinite scroll sentinel -->
        <div id="scroll-sentinel" class="h-4"></div>

        ${entries.length === 0 ? `
          <div class="text-center py-20 text-gray-500">
            <p>No entries yet. Start creating!</p>
          </div>
        ` : ''}
      </div>

      <script>
        // Infinite scroll implementation
        const sentinel = document.getElementById('scroll-sentinel');
        const container = document.getElementById('entries-container');
        let loading = false;

        const observer = new IntersectionObserver(async (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loading = true;

            const lastEntry = container.querySelector('.entry:last-of-type');
            if (!lastEntry) {
              loading = false;
              return;
            }

            const lastTimestamp = lastEntry.dataset.timestamp;

            try {
              const response = await fetch(\`/blog?before=\${lastTimestamp}&format=json\`);
              const data = await response.json();

              if (data.entries && data.entries.length > 0) {
                // We'd need to render these on the server or have a client-side renderer
                // For now, this is a placeholder
                console.log('More entries loaded:', data.entries.length);
              }
            } catch (error) {
              console.error('Failed to load more entries:', error);
            }

            loading = false;
          }
        });

        observer.observe(sentinel);

        // Scroll to entry if hash is present
        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('ring-2', 'ring-purple-400', 'ring-opacity-50');
          }
        }
      </script>
    </body>
    </html>
  `;
}

// Admin view
export function renderAdmin(entries: Entry[]): string {
  const fonts = extractFonts(entries);
  const fontUrl = buildFontUrl(fonts);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin - Infinite Canvas</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="${fontUrl}" rel="stylesheet">
      <link rel="stylesheet" href="${assetManifest.css}">
      <style>
        /* Default/Daylight theme */
        body {
          background: linear-gradient(to bottom, #f3e8ff 0%, #faf5ff 100%);
          min-height: 100vh;
        }

        /* Moonlight theme */
        [data-theme="moonlight"] body,
        .dark body {
          background: linear-gradient(to bottom, #1a1f2e 0%, #0f1419 100%);
          color: #e4e4e7;
        }
        [data-theme="moonlight"] .text-gray-900,
        .dark .text-gray-900 {
          color: #f4f4f5;
        }
        [data-theme="moonlight"] .text-gray-600,
        .dark .text-gray-600 {
          color: #a1a1aa;
        }
        [data-theme="moonlight"] .text-gray-500,
        .dark .text-gray-500 {
          color: #71717a;
        }
        [data-theme="moonlight"] .bg-purple-600,
        .dark .bg-purple-600 {
          background-color: #7c3aed;
        }
        [data-theme="moonlight"] .entry-content p,
        .dark .entry-content p {
          color: #e4e4e7 !important;
        }
        [data-theme="moonlight"] .entry-content blockquote,
        .dark .entry-content blockquote {
          color: #e4e4e7 !important;
        }
        [data-theme="moonlight"] .caption,
        .dark .caption {
          color: #a1a1aa !important;
        }
        [data-theme="moonlight"] .entry,
        .dark .entry {
          border-color: #374151;
        }

        /* Forest theme */
        [data-theme="forest"] body {
          background: linear-gradient(to bottom, #1a2e1f 0%, #0f1a13 100%);
          color: #e7f4e4;
        }
        [data-theme="forest"] .text-gray-900 {
          color: #f0fdf4;
        }
        [data-theme="forest"] .text-gray-600 {
          color: #a8c9af;
        }
        [data-theme="forest"] .text-gray-500 {
          color: #7a9b82;
        }
        [data-theme="forest"] .bg-purple-600 {
          background-color: #4ade80;
        }
        [data-theme="forest"] .entry-content p {
          color: #e7f4e4 !important;
        }
        [data-theme="forest"] .entry-content blockquote {
          color: #e7f4e4 !important;
        }
        [data-theme="forest"] .caption {
          color: #a8c9af !important;
        }
        [data-theme="forest"] .entry {
          border-color: #2d4a34;
        }

        /* Beach theme */
        [data-theme="beach"] body {
          background: linear-gradient(to bottom, #fffef7 0%, #fefce8 100%);
          color: #2d3e50;
        }
        [data-theme="beach"] .text-gray-900 {
          color: #0c4a6e;
        }
        [data-theme="beach"] .text-gray-600 {
          color: #64748b;
        }
        [data-theme="beach"] .text-gray-500 {
          color: #94a3b8;
        }
        [data-theme="beach"] .bg-purple-600 {
          background-color: #0ea5e9;
        }
        [data-theme="beach"] .entry-content p {
          color: #2d3e50 !important;
        }
        [data-theme="beach"] .entry-content blockquote {
          color: #2d3e50 !important;
        }
        [data-theme="beach"] .caption {
          color: #64748b !important;
        }
        [data-theme="beach"] .entry {
          border-color: #cbd5e1;
        }

        /* Plum theme */
        [data-theme="plum"] body {
          background: linear-gradient(to bottom, #faf5ff 0%, #f3e8ff 100%);
          color: #581c87;
        }
        [data-theme="plum"] .text-gray-900 {
          color: #6b21a8;
        }
        [data-theme="plum"] .text-gray-600 {
          color: #a78bfa;
        }
        [data-theme="plum"] .text-gray-500 {
          color: #c4b5fd;
        }
        [data-theme="plum"] .bg-purple-600 {
          background-color: #9333ea;
        }
        [data-theme="plum"] .entry-content p {
          color: #581c87 !important;
        }
        [data-theme="plum"] .entry-content blockquote {
          color: #581c87 !important;
        }
        [data-theme="plum"] .caption {
          color: #a78bfa !important;
        }
        [data-theme="plum"] .entry {
          border-color: #d8b4fe;
        }

        /* Char theme */
        [data-theme="char"] body {
          background: linear-gradient(to bottom, #fff7ed 0%, #ffedd5 100%);
          color: #7c2d12;
        }
        [data-theme="char"] .text-gray-900 {
          color: #9a3412;
        }
        [data-theme="char"] .text-gray-600 {
          color: #ea580c;
        }
        [data-theme="char"] .text-gray-500 {
          color: #f97316;
        }
        [data-theme="char"] .bg-purple-600 {
          background-color: #dc2626;
        }
        [data-theme="char"] .entry-content p {
          color: #7c2d12 !important;
        }
        [data-theme="char"] .entry-content blockquote {
          color: #7c2d12 !important;
        }
        [data-theme="char"] .caption {
          color: #ea580c !important;
        }
        [data-theme="char"] .entry {
          border-color: #fdba74;
        }
      </style>
    </head>
    <body class="antialiased">
      ${renderFloatingNav('/admin')}

      <div class="canvas-container max-w-3xl mx-auto px-4 py-12" style="padding-top: 6rem;">
        <header class="mb-16 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Admin Canvas</h1>
            <p class="text-gray-600">Create and manage your entries</p>
          </div>
          <a href="/blog" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            View Blog →
          </a>
        </header>

        <div id="entries-container">
          ${entries.map(entry => renderEntry(entry, true)).join('\n')}
        </div>

        ${entries.length === 0 ? `
          <div class="text-center py-20 text-gray-500">
            <p>No entries yet. Click the + button below to create your first entry!</p>
          </div>
        ` : ''}
      </div>

      <!-- Add Block Button -->
      <button id="add-block-btn" class="fixed bottom-8 right-8 bg-purple-600 text-white rounded-full w-16 h-16 shadow-2xl hover:bg-purple-700 transition flex items-center justify-center text-3xl">
        +
      </button>

      <!-- Add Block Modal -->
      <dialog id="add-block-modal" class="rounded-lg p-0 backdrop:bg-black backdrop:bg-opacity-50">
        <div class="bg-white rounded-lg p-6 max-w-md">
          <h2 class="text-2xl font-bold mb-6">Add Block</h2>
          <div class="block-types grid grid-cols-2 gap-4">
            <button data-type="text" class="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-3xl mb-2">📝</div>
              <div class="font-semibold">Text</div>
            </button>
            <button data-type="image" class="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-3xl mb-2">🖼️</div>
              <div class="font-semibold">Image</div>
            </button>
            <button data-type="gif" class="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-3xl mb-2">🎬</div>
              <div class="font-semibold">GIF</div>
            </button>
            <button data-type="quote" class="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition">
              <div class="text-3xl mb-2">💬</div>
              <div class="font-semibold">Quote</div>
            </button>
          </div>
          <button id="close-modal-btn" class="mt-6 w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </dialog>

      <!-- Edit Block Modal -->
      <dialog id="edit-block-modal" class="rounded-lg p-0 backdrop:bg-black backdrop:bg-opacity-50 max-w-2xl">
        <div id="edit-modal-content" class="bg-white rounded-lg p-6">
          <!-- Dynamic content will be inserted here -->
        </div>
      </dialog>

      <script>
        ${getAdminScript()}
      </script>
    </body>
    </html>
  `;
}

// Admin JavaScript (inlined)
function getAdminScript(): string {
  return `
    const addBlockModal = document.getElementById('add-block-modal');
    const editBlockModal = document.getElementById('edit-block-modal');
    const addBlockBtn = document.getElementById('add-block-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    let currentEditingId = null;
    let currentBlockType = null;

    const FONTS = ${JSON.stringify(FONTS)};

    addBlockBtn.addEventListener('click', () => addBlockModal.showModal());
    closeModalBtn.addEventListener('click', () => addBlockModal.close());

    document.querySelectorAll('.block-types button').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        addBlockModal.close();
        openEditor(type);
      });
    });

    function openEditor(type, entryId = null) {
      currentBlockType = type;
      currentEditingId = entryId;
      const modalContent = document.getElementById('edit-modal-content');

      switch (type) {
        case 'text': modalContent.innerHTML = getTextEditor(); break;
        case 'image': modalContent.innerHTML = getImageEditor(); setupImageUpload(); break;
        case 'gif': modalContent.innerHTML = getGifEditor(); setupGifSearch(); break;
        case 'quote': modalContent.innerHTML = getQuoteEditor(); break;
      }

      editBlockModal.showModal();
    }

    function getTextEditor() {
      return \`<h2 class="text-2xl font-bold mb-6">Text Block</h2>
        <div class="space-y-4">
          <div><label class="block text-sm font-semibold mb-2">Text Content</label>
            <textarea id="text-content" class="w-full p-3 border border-gray-300 rounded-lg min-h-32" placeholder="Write your thoughts..."></textarea></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-semibold mb-2">Font</label>
              <select id="font-picker" class="w-full p-3 border border-gray-300 rounded-lg">
                \${FONTS.map(f => \`<option value="\${f.name}">\${f.name}</option>\`).join('')}</select></div>
            <div><label class="block text-sm font-semibold mb-2">Size</label>
              <div class="flex items-center gap-3"><input type="range" id="font-size" min="14" max="48" value="18" class="flex-1">
                <span id="size-display" class="text-sm font-mono">18px</span></div></div></div>
          <div class="flex items-center gap-3"><input type="checkbox" id="published" class="w-5 h-5">
            <label for="published" class="text-sm font-semibold">Publish immediately</label></div>
          <div class="flex gap-3 mt-6">
            <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Save</button>
            <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button></div></div>\`;
    }

    function getImageEditor() {
      return \`<h2 class="text-2xl font-bold mb-6">Image Block</h2>
        <div class="space-y-4">
          <div><label class="block text-sm font-semibold mb-2">Upload Image</label>
            <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
              <input type="file" id="image-upload" accept="image/*" class="hidden">
              <div id="upload-prompt"><div class="text-4xl mb-2">📸</div><p class="text-gray-600">Click to upload or drag and drop</p></div>
              <div id="image-preview" class="hidden"><img id="preview-img" class="max-w-full max-h-64 mx-auto rounded-lg"></div></div></div>
          <div><label class="block text-sm font-semibold mb-2">Caption (optional)</label>
            <input type="text" id="image-caption" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Add a caption..."></div>
          <div class="flex items-center gap-3"><input type="checkbox" id="published" class="w-5 h-5">
            <label for="published" class="text-sm font-semibold">Publish immediately</label></div>
          <div class="flex gap-3 mt-6">
            <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Save</button>
            <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button></div></div>\`;
    }

    function getGifEditor() {
      return \`<h2 class="text-2xl font-bold mb-6">GIF Block</h2>
        <div class="space-y-4">
          <div><label class="block text-sm font-semibold mb-2">Search Giphy</label>
            <input type="text" id="gif-search" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Search for GIFs..."></div>
          <div id="gif-results" class="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            <div class="col-span-3 text-center text-gray-400 py-8">Search for GIFs to get started</div></div>
          <input type="hidden" id="selected-gif-url"><input type="hidden" id="selected-gif-title">
          <div class="flex items-center gap-3"><input type="checkbox" id="published" class="w-5 h-5">
            <label for="published" class="text-sm font-semibold">Publish immediately</label></div>
          <div class="flex gap-3 mt-6">
            <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Save</button>
            <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button></div></div>\`;
    }

    function getQuoteEditor() {
      return \`<h2 class="text-2xl font-bold mb-6">Quote Block</h2>
        <div class="space-y-4">
          <div><label class="block text-sm font-semibold mb-2">Quote Text</label>
            <textarea id="quote-text" class="w-full p-3 border border-gray-300 rounded-lg min-h-24" placeholder="Enter the quote..."></textarea></div>
          <div><label class="block text-sm font-semibold mb-2">Author (optional)</label>
            <input type="text" id="quote-author" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Author name..."></div>
          <div><label class="block text-sm font-semibold mb-2">Font</label>
            <select id="font-picker" class="w-full p-3 border border-gray-300 rounded-lg">
              \${FONTS.map(f => \`<option value="\${f.name}">\${f.name}</option>\`).join('')}</select></div>
          <div class="flex items-center gap-3"><input type="checkbox" id="published" class="w-5 h-5">
            <label for="published" class="text-sm font-semibold">Publish immediately</label></div>
          <div class="flex gap-3 mt-6">
            <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Save</button>
            <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button></div></div>\`;
    }

    function setupImageUpload() {
      const uploadArea = document.getElementById('upload-area');
      const fileInput = document.getElementById('image-upload');
      uploadArea.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('upload-prompt').classList.add('hidden');
            document.getElementById('image-preview').classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });

      setTimeout(() => {
        document.getElementById('save-btn').addEventListener('click', async (e) => {
          const file = fileInput.files[0];
          if (!file) return alert('Please select an image');
          const btn = e.target;
          btn.textContent = 'Uploading...';
          btn.disabled = true;
          try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/admin/upload', { method: 'POST', body: formData });
            const { url } = await uploadRes.json();
            await fetch('/admin/entry', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'image',
                content: { url, caption: document.getElementById('image-caption').value, alt: document.getElementById('image-caption').value || 'Image' },
                published: document.getElementById('published').checked
              })
            });
            editBlockModal.close();
            location.reload();
          } catch (error) {
            alert('Failed: ' + error.message);
            btn.textContent = 'Save';
            btn.disabled = false;
          }
        });
        document.getElementById('cancel-btn').addEventListener('click', () => editBlockModal.close());
      }, 0);
    }

    function setupGifSearch() {
      const searchInput = document.getElementById('gif-search');
      const resultsDiv = document.getElementById('gif-results');
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const query = e.target.value;
          if (!query) return resultsDiv.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-8">Search for GIFs to get started</div>';
          try {
            const res = await fetch(\`/admin/giphy?q=\${encodeURIComponent(query)}\`);
            const data = await res.json();
            if (data.data && data.data.length > 0) {
              resultsDiv.innerHTML = data.data.map(gif => \`
                <img src="\${gif.images.fixed_width.url}" data-url="\${gif.images.original.url}" data-title="\${gif.title}"
                     class="cursor-pointer hover:opacity-80 rounded" onclick="selectGif('\${gif.images.original.url}', '\${gif.title.replace(/'/g, "\\\\'")}')">
              \`).join('');
            } else {
              resultsDiv.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-8">No GIFs found</div>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<div class="col-span-3 text-center text-red-500 py-8">Error loading GIFs</div>';
          }
        }, 300);
      });

      setTimeout(() => {
        document.getElementById('save-btn').addEventListener('click', async (e) => {
          const url = document.getElementById('selected-gif-url').value;
          if (!url) return alert('Please select a GIF');
          const btn = e.target;
          btn.textContent = 'Saving...';
          btn.disabled = true;
          try {
            await fetch('/admin/entry', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'gif',
                content: { url, title: document.getElementById('selected-gif-title').value },
                published: document.getElementById('published').checked
              })
            });
            editBlockModal.close();
            location.reload();
          } catch (error) {
            alert('Failed: ' + error.message);
            btn.textContent = 'Save';
            btn.disabled = false;
          }
        });
        document.getElementById('cancel-btn').addEventListener('click', () => editBlockModal.close());
      }, 0);
    }

    window.selectGif = function(url, title) {
      document.getElementById('selected-gif-url').value = url;
      document.getElementById('selected-gif-title').value = title;
      document.querySelectorAll('#gif-results img').forEach(img => img.classList.remove('ring-4', 'ring-purple-500'));
      event.target.classList.add('ring-4', 'ring-purple-500');
    };

    document.addEventListener('click', async (e) => {
      if (e.target.id === 'save-btn' && (currentBlockType === 'text' || currentBlockType === 'quote')) {
        e.target.textContent = 'Saving...';
        e.target.disabled = true;
        try {
          let content, metadata;
          if (currentBlockType === 'text') {
            const text = document.getElementById('text-content').value;
            const font = document.getElementById('font-picker').value;
            const fontSize = document.getElementById('font-size').value + 'px';
            content = { text, font, fontSize, color: '#333333' };
            metadata = { font };
          } else if (currentBlockType === 'quote') {
            const text = document.getElementById('quote-text').value;
            const author = document.getElementById('quote-author').value;
            const font = document.getElementById('font-picker').value;
            content = { text, author, font };
            metadata = { font };
          }
          await fetch('/admin/entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: currentBlockType, content, published: document.getElementById('published').checked, metadata })
          });
          editBlockModal.close();
          location.reload();
        } catch (error) {
          alert('Failed: ' + error.message);
          e.target.textContent = 'Save';
          e.target.disabled = false;
        }
      }
      if (e.target.id === 'cancel-btn') editBlockModal.close();
      if (e.target.classList.contains('edit-btn')) {
        const entryId = e.target.dataset.id;
        const entryEl = document.querySelector(\`[data-id="\${entryId}"]\`);
        const entryType = entryEl.dataset.type;
        alert('Edit functionality coming soon! For now, you can delete and recreate the entry.');
        // TODO: Implement edit functionality
        // This would require loading the entry data and populating the editor fields
      }
      if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this entry?')) {
          await fetch(\`/admin/entry/\${e.target.dataset.id}\`, { method: 'DELETE' });
          location.reload();
        }
      }
      if (e.target.classList.contains('publish-toggle')) {
        const id = e.target.dataset.id;
        const published = e.target.dataset.published === '1' ? 0 : 1;
        await fetch(\`/admin/entry/\${id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published })
        });
        location.reload();
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.id === 'font-size') {
        document.getElementById('size-display').textContent = e.target.value + 'px';
      }
    });
  `;
}

// Font picker HTML
export function renderFontPicker(): string {
  return `
    <select id="font-picker" class="w-full p-3 border border-gray-300 rounded-lg">
      ${FONTS.map(f => `<option value="${f.name}">${f.name} (${f.category})</option>`).join('\n')}
    </select>
  `;
}

export { FONTS };

// Canvas Creator view (Instagram Stories-style editor)
export function renderCanvasCreator(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Canvas Creator - Infinite Canvas</title>
      <link rel="stylesheet" href="${assetManifest.css}">
      <style>
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #1a1f2e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .creator-container {
          display: flex;
          height: 100vh;
          color: #fff;
        }

        /* Top Toolbar */
        .top-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(26, 31, 46, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 100;
        }

        .top-toolbar-left, .top-toolbar-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .toolbar-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .toolbar-btn.primary {
          background: #9333ea;
        }

        .toolbar-btn.primary:hover {
          background: #7c3aed;
        }

        /* Left Sidebar */
        .left-sidebar {
          width: 80px;
          background: rgba(15, 20, 25, 0.95);
          padding: 80px 0 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-btn {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-btn:hover {
          background: rgba(147, 51, 234, 0.3);
          transform: scale(1.05);
        }

        /* Canvas Area */
        .canvas-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px 20px 20px;
          overflow: auto;
        }

        #canvas {
          background: #ffffff;
          position: relative;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
          cursor: default;
        }

        .canvas-element {
          cursor: move;
          user-select: none;
        }

        .canvas-element.selected {
          outline: 2px solid #9333ea;
          outline-offset: 2px;
        }

        /* Right Sidebar (Properties) */
        .right-sidebar {
          width: 300px;
          background: rgba(15, 20, 25, 0.95);
          padding: 80px 20px 20px 20px;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: auto;
        }

        .property-group {
          margin-bottom: 24px;
        }

        .property-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #a1a1aa;
          margin-bottom: 8px;
        }

        .property-input {
          width: 100%;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
        }

        .preset-buttons {
          display: flex;
          gap: 8px;
        }

        .preset-btn {
          flex: 1;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 6px;
          color: #fff;
          font-size: 11px;
          cursor: pointer;
        }

        .preset-btn.active {
          background: #9333ea;
        }

        /* Modals */
        dialog {
          background: #1a1f2e;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
        }

        dialog::backdrop {
          background: rgba(0, 0, 0, 0.8);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        #gif-results {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        #gif-results img {
          width: 100%;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        #gif-results img:hover {
          transform: scale(1.05);
        }

        /* Element Toolbar (appears when element is selected) */
        #element-toolbar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(26, 31, 46, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          z-index: 101;
        }

        #element-toolbar.hidden {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="creator-container">
        <!-- Top Toolbar -->
        <div class="top-toolbar">
          <div class="top-toolbar-left">
            <input type="text" id="canvas-title" class="property-input" placeholder="Canvas Title" style="width: 200px;">
            <div class="preset-buttons">
              <button class="preset-btn" data-preset="stories">Stories<br>1080×1920</button>
              <button class="preset-btn" data-preset="square">Square<br>1080×1080</button>
              <button class="preset-btn" data-preset="desktop">Desktop<br>1440×810</button>
            </div>
          </div>
          <div class="top-toolbar-right">
            <button class="toolbar-btn" id="btn-save-draft">Save Draft</button>
            <button class="toolbar-btn primary" id="btn-publish">Publish</button>
            <a href="/admin" class="toolbar-btn">Close</a>
          </div>
        </div>

        <!-- Left Sidebar (Add Elements) -->
        <div class="left-sidebar">
          <button class="sidebar-btn" id="btn-add-text" title="Add Text">T</button>
          <button class="sidebar-btn" id="btn-add-image" title="Add Image">🖼️</button>
          <button class="sidebar-btn" id="btn-add-gif" title="Add GIF">🎬</button>
          <button class="sidebar-btn" id="btn-add-sticker" title="Add Sticker">✨</button>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-area">
          <div id="canvas" data-width="1080" data-height="1920" data-bg-type="solid" data-bg-value="#ffffff">
            <!-- Elements will be added here dynamically -->
          </div>
        </div>

        <!-- Right Sidebar (Properties) -->
        <div class="right-sidebar">
          <div class="property-group">
            <div class="property-label">Background</div>
            <input type="color" id="bg-color" class="property-input" value="#ffffff">
          </div>

          <div id="element-properties" class="hidden">
            <!-- Element-specific properties will appear here when an element is selected -->
          </div>
        </div>
      </div>

      <!-- GIF Search Modal -->
      <dialog id="gif-modal">
        <div class="modal-title">Search Giphy</div>
        <input type="text" id="gif-search-input" class="property-input" placeholder="Search for GIFs..." style="margin-bottom: 16px;">
        <div id="gif-results"></div>
        <button class="toolbar-btn" onclick="document.getElementById('gif-modal').close()" style="margin-top: 16px; width: 100%;">Cancel</button>
      </dialog>

      <!-- Element Toolbar (shows when element is selected) -->
      <div id="element-toolbar" class="hidden">
        <input type="text" id="text-font" class="property-input" placeholder="Font" style="width: 120px;">
        <input type="number" id="text-size" class="property-input" placeholder="Size" style="width: 80px;">
        <input type="color" id="text-color" class="property-input" style="width: 60px;">
        <button class="toolbar-btn" onclick="canvasCreator.deleteElement(canvasCreator.selectedElement.id)">Delete</button>
      </div>

      <script src="/canvas-creator.js"></script>
    </body>
    </html>
  `;
}
