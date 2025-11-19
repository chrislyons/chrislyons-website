# Repository Structure - Notes

## Overview

The chrislyons-website repository follows a modular structure that separates concerns between static SPA content, dynamic worker-based routes, configuration, and documentation. The repository uses a three-tier configuration hierarchy (repo → workspace → global) and follows the CLW### documentation naming convention.

## Directory Purposes

### Root Level Configuration

**CLAUDE.md** - Repository-specific conventions and development guide
- Inherits from workspace config (`~/chrislyons/dev/CLAUDE.md`)
- Defines CLW documentation naming convention
- Contains skill loading configuration
- Documents dual-server architecture

**package.json** - Node.js project manifest
- Defines dev, build, and preview scripts
- Three development modes: SPA only, Worker only, Full stack
- Dependencies: Vite, Tailwind CSS, Hono

**vite.config.js** - Vite build configuration
- SPA mode enabled
- Proxy configuration for /blog and /admin routes
- Custom asset handling (font files not hashed)
- Development fallback messages for worker routes

**wrangler.toml** - Cloudflare Workers configuration
- Worker name: "hey"
- D1 database binding for blog entries
- R2 bucket configuration (currently disabled)
- Asset serving configuration

**tailwind.config.js** - Tailwind CSS configuration
- Four-theme system support (Moonlight, Daylight, Forest, Beach)
- Custom color definitions

**index.html** - SPA entry point
- Meta tags for SEO
- Theme color configuration
- Skeleton structure for client-side rendering

### src/ - Application Source

**main.js** - Application entry point (36,659 tokens - large file!)
- Initializes routing, components, and content loading
- Sets up keyboard shortcuts (\ key for theme toggle)
- Renders all page routes (home, apps, ideas, sounds, connect)
- Manages navigation and footer components

**worker.ts** - Cloudflare Worker (TypeScript)
- Hono framework for routing
- Handles /blog, /admin, /rss.xml routes
- Cookie-based authentication for admin routes
- D1 database integration for entries and canvases
- R2 bucket integration for image uploads
- Serves SPA index.html for non-dynamic routes

**style.css** - Global styles
- Tailwind CSS integration
- Custom theme variables

#### components/

Reusable UI components built with vanilla JavaScript:

- **Navigation.js** - Main navigation bar with mobile menu support
- **Footer.js** - Site footer
- **Card.js** - Reusable card component
- **CollapsibleSection.js** - Expandable/collapsible sections
- **TableResponsive.js** - Responsive table wrapper
- **PageHeader.js** - Consistent page headers
- **ThemeToggle.js** - Four-theme system toggle (Moonlight/Daylight/Forest/Beach)
- **SongAccordion.js** - Expandable song lyric cards

All components follow a pattern:
- `render()` method returns HTML string
- `attachEventListeners()` for interactivity
- Constructor for initialization

#### utils/

**router.js** - Client-side routing
- History API integration
- Link interception (except /blog and /admin)
- Parameterized route support
- Accessibility announcements for screen readers
- Smooth scroll on navigation

**contentLoader.js** - Static content loading
- Loads markdown and JSON from /content directory
- Updates document title and meta tags
- Provides page data to route handlers

**markdown.js** - Markdown parsing utilities
- Converts markdown to HTML

#### data/

**songs.js** - Song lyrics data (auto-generated)
- Generated from markdown files in songs/ directory
- Contains title and HTML-formatted lyrics
- Used by SongAccordion component

**songs/*.md** - Markdown source files for lyrics
- Format: Title, author, verses separated by blank lines
- Converted to songs.js via `node scripts/parse-song-lyrics.js`

### content/ - Static Content

Markdown and JSON files for page content:

**content.json** - Site-wide content metadata
- Page titles, descriptions, navigation labels

**home.md** - Homepage content

**apps/** - Application project descriptions
- carbon-acx, clip-composer, hotbox, listmaker, orpheus-sdk, tidal-mcp, wordbird

**ideas/** - Conceptual project descriptions
- 27-suppositions, numa-network, osd-events, protocols-of-sound

**sounds/** - Music-related content
- Discography, portfolio, lyrics metadata

**connect/** - Contact information

**systems/** - System documentation

**writing/** - Writing samples

### public/ - Static Assets

Files served directly without processing:

**admin.js** - Admin dashboard client-side code
**canvas-creator.js** - Canvas creation interface

**fonts/HKGrotesk_3003/** - HK Grotesk font family
- Preserved in build (not hashed for stable paths)

### scripts/ - Build and Utility Scripts

**parse-song-lyrics.js** - Converts markdown lyrics to JavaScript
- Reads from src/data/songs/*.md
- Generates src/data/songs.js
- Formats verses with HTML line breaks

**generate-asset-manifest.js** - Creates asset manifest for worker
- Runs after Vite build
- Extracts JS and CSS file paths
- Used by worker.ts to inline correct asset paths

**inject-assets.js** - Asset injection helper

### migrations/ - Database Migrations

**001_create_entries_table.sql** - Blog entries table
- Supports text, image, gif, quote types
- JSON content and metadata fields
- Published flag and position index
- Indexes on created_at, published, position_index

**001_create_canvases_table.sql** - Canvas blog entries
- Instagram Stories-style visual canvas
- JSON fields for background, dimensions, elements
- Positioned elements with rotation and z-index
- Preset canvas sizes (Stories 9:16, Square 1:1, Desktop 16:9)

### docs/clw/ - Documentation

**CLW### Title.md** - Numbered documentation files
- Format: CLW001 Project Overview.md
- Sequential numbering
- IEEE-style citations
- Template: Title, Context, Decisions/Implementation, Next Actions, References

**INDEX.md** - Document registry

Archive policy:
- Files older than 180 days moved to docs/clw/archive/
- Draft files (*.draft.md) excluded from indexing

### .claude/ - Claude Code Configuration

**skills.json** - Skill loading configuration
- Maps file patterns to skill templates
- ci-troubleshooter, test-analyzer, schema-linter, dependency-audit, doc-standards

**scratch/** - Temporary workspace (gitignored)

### assets/ - Static Images

**images/** - Image files for the site

### workers-site/ - Legacy Worker

**index.js** - Legacy Cloudflare Worker implementation
- Uses @cloudflare/kv-asset-handler
- Security headers
- 404 handling
- Note: This appears to be legacy code; current worker is in src/worker.ts

## Code Organization Patterns

### Component Pattern
All components follow a consistent pattern:
```javascript
export class ComponentName {
  constructor(props) { /* initialization */ }
  render() { /* return HTML string */ }
  attachEventListeners() { /* add interactivity */ }
}
```

### Route Pattern
Routes defined in main.js:
```javascript
router.on('/path', renderPageFunction);
```

Route handlers render content into `#page-content` div.

### Content Loading Pattern
Content loaded via contentLoader utility:
```javascript
const pageData = contentLoader.getPageData('pageName');
contentLoader.updateDocumentTitle('Title');
```

## Where to Find Different Types of Code

### Making Changes To...

**Navigation/UI Structure** → `src/components/Navigation.js`, `src/components/Footer.js`

**Page Content** → `content/` directory (markdown and JSON files)

**Routing** → `src/main.js` (route definitions), `src/utils/router.js` (router logic)

**Styling/Themes** → `src/style.css`, `tailwind.config.js`, `src/components/ThemeToggle.js`

**Song Lyrics** → `src/data/songs/*.md` then run `node scripts/parse-song-lyrics.js`

**Blog/Admin Routes** → `src/worker.ts` (Hono routes)

**Database Schema** → `migrations/` directory

**Build Process** → `vite.config.js`, `scripts/generate-asset-manifest.js`

**Worker Configuration** → `wrangler.toml`

**Documentation** → `docs/clw/CLW### Title.md` (follow naming convention!)

## Important Notes

### Dual-Server Architecture
The project uses TWO servers in development:
1. **Vite (port 5173)** - SPA routes (/, /apps, /ideas, /sounds, /connect)
2. **Cloudflare Worker (port 8787)** - Dynamic routes (/blog, /admin)

In production, the worker serves everything using the ASSETS binding.

### Build Process
1. `npm run build` runs Vite build
2. `scripts/generate-asset-manifest.js` creates asset manifest
3. Worker inlines asset paths from manifest into index.html template

### Configuration Hierarchy
Repo config (CLAUDE.md) → Workspace config (~/ chrislyons/dev/CLAUDE.md) → Global config (~/.claude/CLAUDE.md)

### Documentation Naming Convention
CRITICAL: All PREFIX-numbered docs MUST include a title:
- ✅ CLW001 Project Overview.md
- ❌ CLW001.md

### Git Workflow
- Develop on branch: `claude/wireframes-architecture-documentation-011CUw6hVfHLWofH7EK1jNFJ`
- Always use `git push -u origin <branch-name>`
- Branch must start with 'claude/' and end with session ID

## Related Diagrams

- [architecture-overview.mermaid.md](architecture-overview.mermaid.md) - High-level system design
- [component-map.mermaid.md](component-map.mermaid.md) - Component relationships
- [data-flow.mermaid.md](data-flow.mermaid.md) - How data moves through the system
- [entry-points.mermaid.md](entry-points.mermaid.md) - Application entry points
- [database-schema.mermaid.md](database-schema.mermaid.md) - Database structure
- [deployment-infrastructure.mermaid.md](deployment-infrastructure.mermaid.md) - Deployment architecture
