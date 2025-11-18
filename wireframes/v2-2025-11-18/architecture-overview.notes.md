# Architecture Overview - Detailed Notes

## Overview

The chrislyons-website employs a **dual-server architecture** that separates static SPA routes from dynamic server-rendered routes. This hybrid approach provides the benefits of both client-side routing (fast navigation, code splitting) and server-side rendering (dynamic content, database access, authentication).

## Architectural Layers

### 1. Client Layer (Browser)

**Technology:** Vanilla JavaScript (ES6+), No framework dependencies

The client layer runs entirely in the browser and handles:
- Client-side routing via hash-based navigation
- Dynamic page rendering from imported modules
- Theme persistence and switching
- Markdown content loading and parsing
- User interactions and keyboard shortcuts

**Key Characteristics:**
- **No build-time dependencies on a framework** (React, Vue, etc.)
- **Code splitting** via dynamic imports in `routes.js`
- **Progressive enhancement** with semantic HTML
- **Accessibility-first** design with ARIA labels and semantic elements

### 2. Development Environment

**Dual-Server Setup** for development workflow:

#### Vite Dev Server (Port 5173)
- **Purpose:** Serves SPA routes during development
- **Features:**
  - Hot Module Replacement (HMR) for instant updates
  - Proxy middleware forwards `/blog` and `/admin` to Worker
  - Static file serving with source maps
  - Tailwind CSS processing with JIT compilation
- **Routes handled:** `/`, `/apps/*`, `/ideas/*`, `/sounds/*`, `/connect`

#### Wrangler Dev Server (Port 8787)
- **Purpose:** Simulates Cloudflare Worker environment locally
- **Features:**
  - Local D1 SQLite database (stored in `.wrangler/state/`)
  - Local R2 bucket simulation
  - Secret environment variable injection
  - TypeScript compilation on-the-fly
- **Routes handled:** `/blog`, `/admin`, `/rss.xml`, `/images/*`

**Development Workflow Options:**

1. **SPA Only (`npm run dev`):**
   - Fast startup, no Worker overhead
   - `/blog` and `/admin` show development messages with instructions
   - Use for: UI development, component work, theme changes

2. **Worker Only (`npm run dev:worker`):**
   - Test blog and admin functionality independently
   - Access at `http://localhost:8787`
   - Use for: Database work, admin panel development

3. **Full Stack (`npm run dev:all`):**
   - Both servers running simultaneously
   - Vite proxy forwards Worker routes automatically
   - Single URL (`http://localhost:5173`) for all routes
   - Use for: End-to-end testing, full feature development

### 3. Production Environment (Cloudflare)

**Unified Deployment** on Cloudflare's edge network:

#### Cloudflare Worker
- **Runtime:** V8 isolate (serverless, edge-deployed)
- **Framework:** Hono.js (lightweight, Express-like API)
- **Responsibilities:**
  - Serve dynamic routes (`/blog`, `/admin`)
  - Serve static assets via Assets binding
  - Route SPA requests to `index.html`
  - Handle authentication and session management
  - Interact with D1 database and R2 storage

**Edge Deployment Benefits:**
- **Low latency:** Code runs close to users globally
- **Zero cold starts:** V8 isolates spin up in <1ms
- **Infinite scale:** Cloudflare handles traffic spikes automatically
- **Cost-effective:** Pay-per-request pricing

#### Storage Layer

**D1 Database (SQLite at Edge):**
- **Schema:** `entries` table (blog posts), `canvases` table (visual entries)
- **Access:** SQL queries via Cloudflare's D1 API
- **Replication:** Automatic global replication by Cloudflare
- **Migrations:** Applied via `wrangler d1 execute` command

**R2 Bucket (Object Storage):**
- **Purpose:** Store uploaded blog images
- **Access:** S3-compatible API
- **URLs:** Served via `/images/:filename` route in Worker
- **Caching:** Immutable cache headers for performance

**Assets Binding:**
- **Source:** Vite build output in `dist/` directory
- **Content:** Bundled JS, CSS, fonts, static assets
- **Configuration:** Defined in `wrangler.toml` under `[assets]`

**Secrets (Environment Variables):**
- `ADMIN_USERNAME` - Admin panel login username
- `ADMIN_PASSWORD` - Admin panel login password
- `GIPHY_API_KEY` - API key for GIF search functionality
- **Storage:** Cloudflare's encrypted secret manager
- **Set via:** `npx wrangler secret put SECRET_NAME`

### 4. Single Page Application (SPA)

**Client-Side Architecture:**

#### Router (`utils/router.js`)
- **Type:** Hash-based routing (`#/path`)
- **Pattern Matching:** Simple string and regex pattern matching
- **Lazy Loading:** Routes load page modules dynamically
- **History:** Handles browser back/forward navigation
- **404 Handling:** Fallback to NotFoundPage

**Why Hash-based?**
- Avoids server configuration for SPA routes
- Works with Cloudflare Worker asset serving
- Simpler development workflow
- No need for fallback rewrites in production

#### Components (`components/`)
- **Pattern:** Class-based components with `render()` and `attachEventListeners()` methods
- **State Management:** Simple class properties, no global state management
- **Rendering:** Template strings returning HTML
- **Event Handling:** Event delegation where appropriate

**Component Lifecycle:**
1. Instantiate component class
2. Call `render()` to generate HTML string
3. Insert HTML into DOM via `innerHTML`
4. Call `attachEventListeners()` to bind event handlers

#### Theme System
- **Themes:** Moonlight (dark blue), Daylight (light), Forest (dark green), Beach (gold-blue)
- **Storage:** `localStorage` key `theme`
- **Application:** CSS custom properties via Tailwind classes
- **Toggle:** Keyboard shortcut `\` key or UI button
- **Icons:** Moon, Sun, Leaf, Kite

#### Content Loader
- **Async Fetching:** Loads markdown files from `/content` directory
- **Parsing:** Basic markdown to HTML conversion
- **Caching:** No client-side caching (relies on browser cache)
- **Error Handling:** Graceful fallback for missing content

### 5. Worker Application (Server-Side)

**Hono.js Framework:**
- **Type:** Lightweight web framework (~12KB)
- **API:** Express-like routing and middleware
- **TypeScript:** Full TypeScript support
- **Performance:** Optimized for edge runtime

#### Route Structure

**Public Routes (No Authentication):**
- `GET /blog` - List published blog entries (HTML or JSON)
- `GET /blog/entry/:id` - Redirect to specific entry anchor
- `GET /rss.xml` - RSS feed of published entries

**Admin Routes (Authentication Required):**
- `GET /admin` - Admin dashboard (redirects to login if not authenticated)
- `POST /admin/login` - Handle login form submission
- `GET /admin/logout` - Clear session cookie
- `POST /admin/entry` - Create new blog entry
- `GET /admin/entry/:id` - Get single entry
- `PUT /admin/entry/:id` - Update entry
- `DELETE /admin/entry/:id` - Delete entry
- `POST /admin/upload` - Upload image to R2
- `GET /admin/create` - Canvas creator interface
- `POST /admin/canvas` - Create canvas entry
- `GET /admin/canvas/:id` - Get canvas entry
- `GET /admin/giphy` - Search Giphy API (proxied)

**Asset Routes:**
- `GET /images/:filename` - Serve images from R2 bucket
- `GET /*` - Serve static assets from Assets binding or SPA fallback

#### Middleware

**Session Authentication:**
- **Type:** Cookie-based sessions
- **Cookie Name:** `admin_session`
- **Value:** Simple token (`authenticated`)
- **Security:** `httpOnly`, `secure`, `sameSite: Lax`
- **Expiration:** 7 days
- **Single-user system:** No multi-user support needed

**Security Headers:**
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: unsafe-url`
- `Cache-Control: public, max-age=31536000, immutable` (for assets)

**CORS:**
- Not currently configured (not needed for same-origin requests)

### 6. Build Process

**Vite Build Pipeline:**

1. **Entry Point:** `index.html` → `src/main.js`
2. **Module Bundling:** Rollup bundles all imported modules
3. **Code Splitting:** Lazy-loaded routes split into separate chunks
4. **CSS Processing:**
   - PostCSS processes `src/style.css`
   - Tailwind JIT generates utility classes
   - Autoprefixer adds vendor prefixes
   - Output minified to `dist/assets/*.css`
5. **Asset Handling:**
   - Fonts preserved without hashing (custom config)
   - Images copied with hashing
   - SVGs inlined or copied based on size
6. **Output:** `dist/` directory with:
   - `index.html` (processed)
   - `assets/*.js` (chunked, hashed)
   - `assets/*.css` (minified, hashed)
   - `fonts/` (unhashed)
   - Static assets

**TypeScript Compilation (Worker):**
- `src/worker.ts` compiled to JavaScript
- Type checking performed
- Source maps generated for debugging

**Asset Manifest Generation:**
- Script: `scripts/generate-asset-manifest.js`
- **Purpose:** Maps asset names to hashed filenames
- **Output:** `src/asset-manifest.json`
- **Usage:** Worker imports this manifest to inject correct asset URLs into HTML template

**Build Command:**
```bash
npm run build
# Runs: vite build && node scripts/generate-asset-manifest.js
```

### 7. External Services

**Giphy API:**
- **Purpose:** GIF search in admin panel
- **Authentication:** API key stored in Cloudflare secrets
- **Endpoint:** `/admin/giphy?q={search}`
- **Proxying:** Worker proxies requests to avoid exposing API key to client
- **Rate Limiting:** Relies on Giphy's rate limits (no custom throttling)

## Core Technologies

### Frontend Stack
- **Vanilla JavaScript (ES6+)** - No framework overhead
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Modern build tool with HMR
- **Hash Router** - Client-side routing

### Backend Stack
- **Cloudflare Workers** - Serverless edge runtime
- **Hono.js** - Lightweight web framework
- **TypeScript** - Type-safe server code
- **D1** - SQLite database at edge
- **R2** - Object storage

### Development Tools
- **Wrangler** - Cloudflare Worker CLI
- **Vite Dev Server** - Development with HMR
- **PostCSS** - CSS processing pipeline
- **Node.js Scripts** - Build automation

## Design Patterns

### Separation of Concerns

**SPA vs Worker Routes:**
- **SPA handles:** Static portfolio content, client-side navigation
- **Worker handles:** Dynamic blog, admin panel, database operations

This separation allows:
- Independent development and testing
- Different deployment strategies if needed
- Clear boundaries for feature ownership

### Progressive Enhancement

**Base HTML:** Semantic, accessible structure in `index.html`
**Enhanced with JS:** Client-side routing and interactivity
**Fallback:** All routes work without JavaScript (static content)

### Code Splitting

**Pattern:** Lazy-loaded route modules reduce initial bundle size

```javascript
{
  path: '/apps/carbon-acx',
  load: () => import('./pages/apps/index.js').then(m => m.renderCarbonAcxPage)
}
```

**Benefits:**
- Faster initial page load
- Smaller JavaScript bundles per route
- Better caching (unchanged routes don't re-download)

### Asset Optimization

**Fonts:** No hashing for stable URLs and better caching
**Images:** Hashed for cache busting
**CSS/JS:** Minified and hashed for optimal performance

## Key Architectural Decisions

### Why Dual-Server Architecture?

**Alternative Considered:** Single Cloudflare Worker handling everything

**Reasons for Dual-Server:**
1. **Development Speed:** Vite HMR is faster than Worker reloads
2. **Separation of Concerns:** Clear boundary between static and dynamic routes
3. **Easier Testing:** Can test SPA independently from Worker logic
4. **Cost Optimization:** Static routes don't incur Worker invocation costs

### Why Cloudflare Workers?

**Alternatives Considered:** Traditional server (Node.js, Express), Serverless functions (AWS Lambda, Vercel)

**Reasons for Cloudflare:**
1. **Edge Performance:** Low latency globally
2. **Integrated Storage:** D1 and R2 in same ecosystem
3. **Cost-Effective:** Free tier generous, pay-per-request pricing
4. **Simplicity:** Single platform for hosting, database, storage
5. **Zero Configuration:** No server management

### Why Vanilla JavaScript?

**Alternatives Considered:** React, Vue, Svelte

**Reasons for Vanilla:**
1. **No Framework Lock-In:** Full control over code
2. **Smaller Bundle Size:** No framework overhead (~50KB+ saved)
3. **Faster Load Times:** Less JavaScript to parse and execute
4. **Learning Opportunity:** Deeper understanding of web fundamentals
5. **Simpler Debugging:** No framework-specific quirks

### Why Hash-Based Routing?

**Alternatives Considered:** History API (`pushState`)

**Reasons for Hash Routing:**
1. **Simpler Worker Logic:** No need to rewrite all routes to `index.html`
2. **No Server Configuration:** Works out-of-the-box with any server
3. **Development Simplicity:** No proxy configuration needed
4. **Edge Case Handling:** Easier to debug when route doesn't match

### Why Hono.js vs Express?

**Reasons for Hono:**
1. **Edge-Optimized:** Built specifically for edge runtimes
2. **Lightweight:** Much smaller than Express
3. **Modern API:** Built for async/await, Web Standards
4. **TypeScript Native:** Better type support
5. **Active Development:** Well-maintained, growing ecosystem

## Areas of Technical Debt

### Asset Manifest Pattern

**Current Approach:** Generate JSON manifest mapping asset names to hashed filenames

**Issue:** Requires custom build script, tightly couples Worker to Vite output

**Potential Improvement:** Use Vite's built-in manifest or dynamic asset resolution

### Markdown Parsing

**Current Approach:** Basic custom markdown parser in `utils/markdown.js`

**Limitations:** Only handles basic markdown (paragraphs, headings, links)

**Potential Improvement:** Use a library like `marked` or `markdown-it` for full spec support

### No Server-Side Rendering for SPA Routes

**Current Approach:** Client-side rendering only

**Issue:** SEO implications, slower first contentful paint

**Potential Improvement:** Pre-render static pages or implement SSR for critical routes

### Authentication System

**Current Approach:** Simple cookie-based session with hardcoded token

**Limitations:** Single-user only, no session management, no refresh tokens

**Potential Improvement:** Implement proper session store, multi-user support, OAuth integration

### No Automated Testing

**Current State:** No test suite

**Risk:** Regressions can go unnoticed

**Potential Improvement:** Add unit tests (components), integration tests (routes), E2E tests (Playwright)

## Performance Considerations

### Client-Side Performance

**Optimizations:**
- Code splitting reduces initial bundle
- Lazy loading of route modules
- Tailwind JIT minimizes CSS payload
- Font preloading in HTML

**Metrics to Watch:**
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

### Server-Side Performance

**Optimizations:**
- D1 indexes on `created_at`, `published`, `position_index`
- Immutable cache headers for static assets
- Edge deployment reduces network latency
- Hono.js minimal overhead

**Metrics to Watch:**
- Worker CPU time (Cloudflare metrics)
- D1 query duration
- R2 request latency
- Cache hit rate

## Security Considerations

### Authentication

**Current Implementation:**
- Cookie-based sessions
- HttpOnly cookies prevent XSS theft
- Secure flag requires HTTPS
- SameSite=Lax prevents CSRF

**Recommendations:**
- Implement rate limiting on login endpoint
- Add CAPTCHA for brute force protection
- Consider 2FA for production

### Data Validation

**Current State:** Basic validation on content types

**Recommendations:**
- Add input sanitization for user-submitted content
- Validate image uploads (file type, size, dimensions)
- Escape HTML in blog entries to prevent XSS

### Secret Management

**Current Implementation:** Cloudflare Secrets (encrypted, not in code)

**Good Practices:**
- Never commit secrets to Git
- Rotate secrets periodically
- Use different secrets for dev/staging/prod

## Deployment Strategy

### Development → Production Flow

1. **Local Development:**
   - Make changes in feature branch
   - Test with `npm run dev:all`
   - Commit changes

2. **Build:**
   - `npm run build` generates production assets
   - Asset manifest created
   - TypeScript compiled

3. **Deploy:**
   - `wrangler deploy` (or `npx wrangler deploy`)
   - Uploads Worker code to Cloudflare
   - Uploads assets to Assets binding
   - Applies configuration from `wrangler.toml`

4. **Database Migrations:**
   - Apply manually with `wrangler d1 execute`
   - Must be applied BEFORE deploying code that depends on schema changes

5. **Secrets:**
   - Set once with `wrangler secret put`
   - Persist across deployments
   - Update manually when needed

### Rollback Strategy

**Worker Code:** Cloudflare keeps deployment history, can rollback via dashboard

**Database:** No built-in rollback, must write reversible migrations

**Assets:** Re-deploy previous commit to restore assets

## Related Documentation

- **wireframes/v2-2025-11-18/component-map.notes.md** - Detailed component breakdown
- **wireframes/v2-2025-11-18/data-flow.notes.md** - Request/response cycles
- **wireframes/v2-2025-11-18/deployment-infrastructure.notes.md** - Deployment details
- **CLAUDE.md** - Development conventions
- **docs/clw/CLW006 Four-Theme System Implementation.md** - Theme system specifics
