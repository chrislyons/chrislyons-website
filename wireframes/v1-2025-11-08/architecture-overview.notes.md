# Architecture Overview - Notes

## System Design Philosophy

The chrislyons-website uses a **hybrid architecture** that combines:
1. **Static SPA** for content-focused pages (portfolio, projects, music)
2. **Dynamic Worker** for data-driven features (blog, admin)
3. **Client-side routing** for smooth navigation
4. **Edge computing** for global performance

This approach optimizes for:
- **Performance**: Static assets served from CDN, minimal JavaScript
- **Developer Experience**: Vite for fast development, TypeScript for type safety
- **Flexibility**: Easy to add dynamic features without rebuilding entire site
- **Cost**: Free tier on Cloudflare for dynamic features

## Architectural Layers

### 1. Presentation Layer (Browser)

**Technology**: Vanilla JavaScript (no framework)

The client-side application is intentionally framework-free to:
- Minimize bundle size
- Reduce complexity for a content-focused site
- Eliminate framework lock-in
- Improve load performance

**Key Components**:
- **Router**: History API-based client-side routing
- **Components**: Reusable UI modules with render/attach pattern
- **Theme System**: Four-theme color system with localStorage persistence
- **Content Loader**: Markdown/JSON content hydration

### 2. Routing Layer

**Dual-Router Architecture**:

**Client-Side Router** (`src/utils/router.js`):
- Handles SPA routes: `/`, `/apps/*`, `/ideas/*`, `/sounds/*`, `/connect`
- Intercepts link clicks for smooth navigation
- Updates History API without page reload
- Scrolls to top on navigation
- Announces route changes to screen readers

**Server-Side Router** (`src/worker.ts` - Hono):
- Handles dynamic routes: `/blog`, `/admin`, `/rss.xml`, `/images/*`
- API endpoints for CRUD operations
- Authentication middleware for protected routes
- SPA fallback for unmatched routes (serves `index.html`)

**Why Two Routers?**
- Client router provides instant navigation for static content
- Server router enables dynamic, database-backed features
- Clear separation of concerns: content vs. data

### 3. Component Layer

**Architecture Pattern**: Component-based but not framework-based

Each component follows this pattern:
```javascript
export class Component {
  constructor(props) { /* Store props, initialize state */ }
  render() { /* Return HTML string */ }
  attachEventListeners() { /* Add interactivity */ }
}
```

**Rationale**:
- Predictable structure for all components
- Easy to understand and maintain
- No virtual DOM overhead
- Direct DOM manipulation when needed

**Component Types**:
1. **Layout Components**: Navigation, Footer
2. **UI Components**: Card, CollapsibleSection, TableResponsive, PageHeader
3. **Interactive Components**: ThemeToggle, SongAccordion
4. **Specialized Components**: Canvas creator, admin dashboard (in public/)

### 4. Data Layer

**Three Data Sources**:

**1. Static Content** (`content/` directory):
- Markdown and JSON files
- Loaded via contentLoader utility
- Versioned in git
- No build step required (loaded at runtime)

**2. Generated Data** (`src/data/songs.js`):
- Generated from markdown source files
- Build script: `scripts/parse-song-lyrics.js`
- Committed to git (not generated at build time)
- Used by SongAccordion component

**3. Database** (Cloudflare D1):
- Blog entries (text, image, gif, quote)
- Canvas entries (visual blog format)
- Managed via SQL migrations
- Accessed via worker routes

**Why Multiple Data Sources?**
- Static content: Fast, simple, version-controlled
- Generated data: Optimized format, no runtime parsing
- Database: Dynamic, user-generated content

### 5. State Management

**Stateless Architecture** with minimal client-side state:

**Persistent State**:
- Theme preference (localStorage)
- Admin session (HTTP-only cookie)

**Transient State**:
- Current route
- Navigation menu open/closed
- Component-specific state (accordion expanded, etc.)

**No Global State Management**:
- Each component manages its own state
- State is ephemeral and recreated on navigation
- Simplifies architecture, reduces bugs

### 6. Worker Layer (Cloudflare Workers + Hono)

**Why Hono?**
- Lightweight (~12KB)
- Express-like API (familiar to developers)
- TypeScript support
- Edge-optimized

**Worker Responsibilities**:
1. **Route Handling**: Dynamic routes (/blog, /admin)
2. **Authentication**: Cookie-based session management
3. **Database Access**: D1 queries for blog entries
4. **Asset Serving**: Serves Vite build output via ASSETS binding
5. **SPA Fallback**: Injects asset paths into index.html template
6. **API Endpoints**: RESTful API for admin operations

**Authentication Design**:
- Single-user system (hardcoded credentials)
- HTTP-only cookies for session management
- Simple token ("authenticated") for session validation
- 7-day session expiration

**Security Considerations**:
- Hardcoded credentials (ADMIN_USERNAME, ADMIN_PASSWORD) - **Technical Debt**
- Should use environment variables or Cloudflare Secrets
- Currently: username='clyons', password='supermario'

### 7. Database Layer (Cloudflare D1)

**Technology**: SQLite (edge-optimized)

**Schema Design**:

**entries table**:
- Flexible content model (type + JSON content)
- Supports: text, image, gif, quote
- Metadata field for extensibility
- Position index for manual ordering
- Published flag for draft/live management

**canvases table**:
- Instagram Stories-style visual entries
- JSON fields for background, dimensions, elements
- Positioned elements with rotation and z-index
- Preset canvas sizes

**Design Patterns**:
- JSON fields for flexible, schema-less data
- Indexes on query-heavy columns (created_at, published)
- Autoincrement IDs
- Timestamp fields with defaults

### 8. Build System

**Vite Configuration**:

**Development**:
- SPA mode enabled
- Proxy middleware for /blog and /admin
- Error handlers show development messages
- Hot module replacement

**Production**:
- Asset bundling and minification
- Font files preserved (not hashed)
- Asset manifest generation
- Output to `dist/`

**Build Pipeline**:
1. `vite build` - Compile, bundle, minify
2. `generate-asset-manifest.js` - Extract JS/CSS paths
3. Worker inlines paths into index.html template

**Why Asset Manifest?**
- Worker needs to know hashed filenames
- Inline CSS/JS paths into HTML template
- Enables cache-busting in production

## Core Interactions

### Static Content Request Flow

1. User navigates to `/apps/carbon-acx`
2. Router intercepts link click
3. Router calls route handler
4. Handler loads content via contentLoader
5. Handler renders HTML into #page-content
6. Router updates History API
7. Components attach event listeners

### Dynamic Content Request Flow

1. User navigates to `/blog`
2. Router allows full page load (no interception)
3. **Dev**: Vite proxy forwards to localhost:8787
4. **Prod**: Request goes directly to worker
5. Worker queries D1 database
6. Worker renders blog entries
7. Worker returns HTML response

### Admin Content Creation Flow

1. User logs in to /admin
2. Worker validates credentials
3. Worker sets HTTP-only session cookie
4. User creates blog entry
5. Client POSTs to /admin/entry
6. Worker validates session cookie
7. Worker inserts into D1 database
8. Worker returns success response

## Tech Stack Summary

**Frontend**:
- Vanilla JavaScript (no framework)
- Tailwind CSS for styling
- Custom four-theme system

**Backend**:
- Cloudflare Workers (edge runtime)
- Hono framework (routing)
- TypeScript

**Database**:
- Cloudflare D1 (SQLite)

**Storage**:
- Cloudflare R2 (disabled in current config)

**Build**:
- Vite (dev server + bundler)
- PostCSS + Tailwind

**External Services**:
- Giphy API (GIF search in admin)

## Design Patterns

### 1. Component Pattern
All UI components follow a consistent render/attach pattern for predictability.

### 2. Proxy Pattern
Vite dev server proxies worker routes to enable full-stack development.

### 3. Fallback Pattern
Worker serves SPA index.html for unmatched routes, enabling client-side routing.

### 4. Manifest Pattern
Asset manifest allows worker to inline hashed filenames at runtime.

### 5. Migration Pattern
Database schema changes tracked via SQL migration files.

### 6. Content-as-Code Pattern
Static content stored as markdown in git for version control.

## Architectural Decisions

### Why No React/Vue/Svelte?

**Rationale**:
- Site is primarily content-focused (not app-like)
- Minimal interactivity requirements
- Framework overhead not justified
- Faster load times without framework
- Easier for non-JS developers to contribute

**Trade-offs**:
- More verbose component code
- Manual DOM manipulation
- No virtual DOM diffing
- Less tooling/ecosystem support

### Why Cloudflare Workers?

**Rationale**:
- Edge computing for low latency
- Integrated with D1 and R2
- Free tier for hobby projects
- Simple deployment
- Serverless (no infrastructure management)

**Trade-offs**:
- Vendor lock-in to Cloudflare
- Limited to V8 runtime (no Node.js APIs)
- Cold start latency (minimal with Workers)
- Local development requires wrangler

### Why Dual-Server Development?

**Rationale**:
- Vite HMR for rapid SPA development
- Worker testing for dynamic routes
- Mirrors production architecture
- Each server focused on specific routes

**Trade-offs**:
- More complex development setup
- Two processes to manage
- Proxy configuration required
- Potential port conflicts

### Why TypeScript for Worker Only?

**Rationale**:
- Worker has more complex logic (auth, DB, routing)
- Type safety for Cloudflare bindings
- Client-side is simple enough for vanilla JS

**Trade-offs**:
- Inconsistent language across codebase
- No type checking for client code

## Areas of Technical Debt

1. **Hardcoded Credentials**: Admin username/password in source code
   - **Fix**: Move to environment variables or Cloudflare Secrets

2. **Legacy Worker**: workers-site/index.js still exists
   - **Fix**: Remove if no longer used, or document purpose

3. **R2 Disabled**: Blog images bucket configured but disabled
   - **Fix**: Enable R2 or remove configuration

4. **Large main.js**: Entry point is 36,659 tokens
   - **Fix**: Split into smaller modules

5. **No Tests**: No test suite for any code
   - **Fix**: Add unit tests for critical paths

6. **Single-User Auth**: No user management system
   - **Fix**: Add proper auth system if multi-user needed

## Common Workflows

### Adding a New SPA Page

1. Create content file in `content/pagename.md`
2. Add route in `src/main.js`: `router.on('/path', renderPageFunction)`
3. Create render function that loads content and renders HTML
4. Add navigation link in `src/components/Navigation.js`

### Adding a New Dynamic Route

1. Add route handler in `src/worker.ts`
2. Query D1 database if needed
3. Return HTML or JSON response
4. Add authentication check if needed

### Adding a New Component

1. Create `src/components/ComponentName.js`
2. Export class with constructor, render(), attachEventListeners()
3. Import in `src/main.js`
4. Use in route handlers

### Adding a Database Table

1. Create migration file in `migrations/`
2. Run migration with wrangler: `npx wrangler d1 migrations apply blog-db`
3. Update TypeScript types in worker if needed

### Updating Song Lyrics

1. Edit markdown files in `src/data/songs/*.md`
2. Run `node scripts/parse-song-lyrics.js`
3. Commit both markdown and generated `songs.js`

## Related Diagrams

- [repo-structure.mermaid.md](repo-structure.mermaid.md) - Directory tree
- [component-map.mermaid.md](component-map.mermaid.md) - Component relationships
- [data-flow.mermaid.md](data-flow.mermaid.md) - Data movement
- [entry-points.mermaid.md](entry-points.mermaid.md) - Application entry points
- [database-schema.mermaid.md](database-schema.mermaid.md) - Database structure
- [deployment-infrastructure.mermaid.md](deployment-infrastructure.mermaid.md) - Deployment architecture
