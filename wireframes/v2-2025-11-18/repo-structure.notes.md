# Repository Structure - Detailed Notes

## Overview

The chrislyons-website repository follows a **dual-architecture pattern** with clearly separated concerns between the SPA (Vite) and dynamic routes (Cloudflare Worker). The structure is organized for maintainability, with content separated from code, and configuration files at the root level.

## Directory Purposes

### Root Configuration Files

**Development Guides:**
- `CLAUDE.md` - Repository-specific development conventions, documentation standards (CLW prefix), and project structure guide
- `README.md` - Public-facing project overview with quick start instructions

**Build & Framework:**
- `package.json` - npm dependencies and scripts (`dev`, `dev:worker`, `dev:all`, `build`, `preview`)
- `vite.config.js` - Vite SPA configuration with proxy setup for `/blog` and `/admin` routes
- `wrangler.toml` - Cloudflare Worker configuration (D1 database, R2 bucket bindings, secrets)
- `tailwind.config.js` - Tailwind CSS theme customization (four-theme system)
- `postcss.config.mjs` - PostCSS processing configuration (note: `.mjs` extension required)
- `index.html` - SPA entry HTML with semantic structure and meta tags

### `src/` - Source Code

**Core Architecture Files:**
- `worker.ts` - Cloudflare Worker handling `/blog` and `/admin` routes (Hono framework, D1, R2)
- `main.js` - SPA application entry point (initializes router, components, theme)
- `routes.js` - Route configuration with lazy-loaded page modules
- `style.css` - Global CSS styles and Tailwind directives

**`components/` - Reusable UI Components:**
All components follow a class-based pattern with `render()` and `attachEventListeners()` methods:
- `Navigation.js` - Main navigation with mobile menu toggle
- `Footer.js` - Site footer with links
- `ThemeToggle.js` - Four-theme system (Moonlight, Daylight, Forest, Beach)
- `Card.js` - Reusable card component for portfolio items
- `PageHeader.js` - Consistent page header layout
- `SongAccordion.js` - Expandable song lyrics display
- `CollapsibleSection.js` - Generic collapsible content sections
- `TableResponsive.js` - Responsive table wrapper

**`pages/` - Page Render Functions:**
Each page exports a `render{PageName}Page()` function:
- Top-level pages: `HomePage.js`, `AppsPage.js`, `IdeasPage.js`, `SoundsPage.js`, `ConnectPage.js`, `NotFoundPage.js`
- `apps/index.js` - 7 app detail pages (Carbon ACX, Clip Composer, Hotbox, etc.)
- `ideas/index.js` - 4 idea detail pages (27 Suppositions, NUMA Network, etc.)
- `sounds/index.js` - 3 sound pages (Lyrics, Discography, Portfolio)

**`utils/` - Utility Functions:**
- `router.js` - Client-side router with hash-based navigation
- `contentLoader.js` - Async loading of markdown files from `/content`
- `markdown.js` - Markdown parsing (basic implementation)
- `templateHelpers.js` - HTML rendering helpers

**`data/` - Application Data:**
- `songs.js` - **Generated file** containing 39 song lyrics (HTML format)
- `songs/*.md` - **Source files** for song lyrics (human-editable markdown)

### `content/` - Markdown Content

Markdown files organized by section:
- `apps/` - Detailed descriptions for portfolio apps
- `ideas/` - Research and conceptual project documentation
- `sounds/` - Music-related content
- `systems/` - Systems architecture content
- `writing/` - Written works
- `connect/` - Contact and connection information

**Loading Pattern:** Pages use `contentLoader.js` to fetch and parse these markdown files at runtime.

### `public/` - Static Assets

Files served directly without processing:
- `fonts/` - HK Grotesk font family (WOFF2 format)
- `favicon.svg`, `favicon.ico` - Site icons

**Note:** Vite build configuration preserves font paths without hashing.

### `scripts/` - Build & Utility Scripts

- `parse-song-lyrics.js` - Converts `src/data/songs/*.md` to `src/data/songs.js`
  - Run with: `node scripts/parse-song-lyrics.js`
  - Converts markdown paragraphs to `<p>` tags with `<br>` for line breaks
- `generate-asset-manifest.js` - Creates `asset-manifest.json` mapping for Worker builds

### `migrations/` - Database Migrations

SQL migration files for D1 database:
- `001_create_entries_table.sql` - Blog entries table (text, image, gif, quote types)
- `001_create_canvases_table.sql` - Canvas blog table (Instagram Stories-style visual entries)

**Apply migrations with:** `npx wrangler d1 execute blog-db --file migrations/{filename}`

### `docs/` - Documentation

- `clw/` - Numbered documentation files following CLW prefix convention
  - Format: `CLW### Title.md` (e.g., `CLW001 Project Overview.md`)
  - All project-specific documentation lives here
  - See `CLAUDE.md` for naming conventions

### `wireframes/` - Architecture Diagrams

Versioned Mermaid diagram documentation:
- `v1-2025-11-08/` - Initial wireframe set
- `v2-2025-11-18/` - Current iteration (this version)
- `README.md` - Wireframe documentation index

**Each version contains paired files:**
- `{topic}.mermaid.md` - Pure Mermaid syntax (paste into mermaid.live)
- `{topic}.notes.md` - Extended explanatory documentation

### `.claude/` - Claude Code Configuration

Claude AI development tool configuration:
- `skills.json` - File pattern mappings for lazy-loaded skills
- `scratch/` - Temporary workspace (gitignored)

### `.wrangler/` - Cloudflare Worker State

Local development state for Cloudflare Worker:
- `state/` - D1 database local state
- Generated during `npm run dev:worker`
- Gitignored

### `workers-site/` - Legacy Worker Assets

Legacy directory for Cloudflare Worker static assets. Modern configuration uses `[assets]` binding in `wrangler.toml` instead.

### `assets/` - Additional Static Assets

- `images/` - Static images not part of the build process

## Code Organization Patterns

### Component Pattern

All components follow this structure:
```javascript
export class ComponentName {
  constructor(props) {
    // Initialize state
  }

  render() {
    // Return HTML string
  }

  attachEventListeners() {
    // Bind event handlers
  }
}
```

### Page Pattern

All pages export a render function:
```javascript
export function renderPageName() {
  const appContainer = document.getElementById('page-content');
  appContainer.innerHTML = `<div>Page content</div>`;
}
```

### Route Configuration Pattern

Routes use dynamic imports for code splitting:
```javascript
{
  path: '/example',
  load: () => import('./pages/ExamplePage.js').then(m => m.renderExamplePage)
}
```

## Important Files to Know

**When changing routes:** Edit `src/routes.js` and create corresponding page in `src/pages/`

**When adding components:** Create in `src/components/` and import in page files

**When updating song lyrics:**
1. Edit markdown in `src/data/songs/`
2. Run `node scripts/parse-song-lyrics.js`
3. Alternatively, edit `src/data/songs.js` directly

**When modifying blog/admin:** Edit `src/worker.ts` (TypeScript)

**When changing database schema:** Create new migration in `migrations/`

**When updating themes:** Edit Tailwind config and `src/components/ThemeToggle.js`

**When adding static content:** Add markdown to `content/` and create loader in page

## Configuration Dependencies

### Build Chain

1. **Development (SPA only):** `npm run dev` → Vite serves on 5173
2. **Development (Worker only):** `npm run dev:worker` → Wrangler serves on 8787
3. **Development (Full):** `npm run dev:all` → Both servers, Vite proxies to Worker
4. **Production Build:** `npm run build` → Vite build + asset manifest generation

### Worker Deployment

1. Build: `npm run build`
2. Deploy: `wrangler deploy` (or `npm run deploy` if configured)

**Secrets must be set before deployment:**
```bash
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put GIPHY_API_KEY
```

## Areas of Complexity

### Dual-Server Architecture

The split between Vite (SPA) and Cloudflare Worker (dynamic routes) requires careful configuration:
- Vite proxy configuration in `vite.config.js` forwards `/blog` and `/admin` to Worker
- Worker serves both dynamic routes AND static assets in production
- Development workflow requires understanding which server handles which route

### Asset Manifest Generation

The `src/worker.ts` imports `asset-manifest.json` to inject correct asset paths into the HTML template. This manifest is generated during build by `scripts/generate-asset-manifest.js`.

**If assets don't load in production:** Check that the manifest generation ran successfully during build.

### Font Path Preservation

Custom Vite configuration prevents hashing of font files to maintain stable paths. See `vite.config.js` → `build.rollupOptions.output.assetFileNames`.

## Common Workflows

### Adding a New App to Portfolio

1. Create markdown file: `content/apps/my-app.md`
2. Add route to `src/routes.js`:
   ```javascript
   {
     path: '/apps/my-app',
     load: () => import('./pages/apps/index.js').then(m => m.renderMyAppPage)
   }
   ```
3. Create render function in `src/pages/apps/index.js`:
   ```javascript
   export async function renderMyAppPage() {
     // Implementation
   }
   ```
4. Add card to `src/pages/AppsPage.js` main grid

### Updating Theme System

1. Edit theme definitions in `tailwind.config.js`
2. Update `ThemeToggle.js` component with new theme logic
3. Test theme persistence in localStorage
4. Verify all four themes (Moonlight, Daylight, Forest, Beach)

### Creating New Blog Entry Type

1. Add migration to `migrations/` with new entry type
2. Update `src/worker.ts` to handle new type in routes
3. Update blog template rendering logic
4. Deploy database migration before deploying code

## Related Documentation

- **CLAUDE.md** - Development conventions and standards
- **README.md** - Getting started and overview
- **docs/clw/CLW006 Four-Theme System Implementation.md** - Theme system details
- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - High-level architecture
- **wireframes/v2-2025-11-18/component-map.notes.md** - Component relationships
