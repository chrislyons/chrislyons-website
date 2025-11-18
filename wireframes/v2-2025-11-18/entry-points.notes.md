# Entry Points - Detailed Notes

## Overview

This document catalogs all entry points into the chrislyons-website codebase. Entry points include web routes (SPA and Worker), development commands, build scripts, database operations, deployment commands, and keyboard shortcuts. Understanding these entry points is essential for development, debugging, and maintenance.

## Application Entry Points

### Main Application Initialization (`src/main.js`)

**Primary entry point for the SPA.**

**Initialization Sequence:**
1. Import dependencies (components, router, routes)
2. Create ThemeToggle instance (applies saved theme immediately)
3. Set up keyboard shortcuts
4. Create Navigation and Footer instances
5. Render static components
6. Register routes with router
7. Initialize router (match initial URL)

**Code:**
```javascript
function init() {
  console.log('🚀 Chris Lyons Website Initializing...');

  // Initialize theme (must be first)
  themeToggle = new ThemeToggle();

  // Set up keyboard shortcuts
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
}
```

**DOM Ready Check:**
```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

### Worker Entry Point (`src/worker.ts`)

**Primary entry point for Cloudflare Worker.**

**Export:** Default export of Hono app instance

```typescript
export default dynamicApp;
```

**Cloudflare invokes:** `export default` handler for every request

**Route Registration:** All routes defined inline in `worker.ts`

---

## SPA Routes (Client-Side)

All SPA routes are handled by the client-side router via hash-based URLs.

### Home Route

**Path:** `/` (or `#/`)
**Module:** `src/pages/HomePage.js`
**Function:** `renderHomePage()`
**Content:** Introduction, featured projects, navigation to sections

### App Routes

**Index:** `/apps`
- **Module:** `src/pages/AppsPage.js`
- **Function:** `renderAppsPage()`
- **Content:** Grid of portfolio app cards

**Detail Pages:**
| Path | Function |
|------|----------|
| `/apps/carbon-acx` | `renderCarbonAcxPage()` |
| `/apps/clip-composer` | `renderClipComposerPage()` |
| `/apps/hotbox` | `renderHotboxPage()` |
| `/apps/listmaker` | `renderListMakerPage()` |
| `/apps/orpheus-sdk` | `renderOrpheusSDKPage()` |
| `/apps/tidal-mcp` | `renderTidalMCPPage()` |
| `/apps/wordbird` | `renderWordBirdPage()` |

**Module:** `src/pages/apps/index.js`
**Content:** Loads markdown from `/content/apps/{app-name}.md`

### Idea Routes

**Index:** `/ideas`
- **Module:** `src/pages/IdeasPage.js`
- **Function:** `renderIdeasPage()`
- **Content:** Grid of research/idea cards

**Detail Pages:**
| Path | Function |
|------|----------|
| `/ideas/27-suppositions` | `render27SuppositionsPage()` |
| `/ideas/numa-network` | `renderNumaNetworkPage()` |
| `/ideas/osd-events` | `renderOSDEventsPage()` |
| `/ideas/protocols-of-sound` | `renderProtocolsOfSoundPage()` |

**Module:** `src/pages/ideas/index.js`
**Content:** Loads markdown from `/content/ideas/{idea-name}.md`

### Sound Routes

**Index:** `/sounds`
- **Module:** `src/pages/SoundsPage.js`
- **Function:** `renderSoundsPage()`
- **Content:** Navigation to sound subpages

**Subpages:**
| Path | Function | Content |
|------|----------|---------|
| `/sounds/lyrics` | `renderLyricsPage()` | 39 songs in accordion |
| `/sounds/discography` | `renderDiscographyPage()` | Album table |
| `/sounds/portfolio` | `renderPortfolioPage()` | Work history |

**Module:** `src/pages/sounds/index.js`

### Connect Route

**Path:** `/connect`
**Module:** `src/pages/ConnectPage.js`
**Function:** `renderConnectPage()`
**Content:** Contact information, email, social links

### 404 Route

**Handler:** Router's `notFound` callback
**Module:** `src/pages/NotFoundPage.js`
**Function:** `render404Page()`
**Trigger:** Any URL not matching defined routes

### Adding a New SPA Route

**Steps:**

1. **Create page module:**
   ```javascript
   // src/pages/NewPage.js
   export function renderNewPage() {
     const container = document.getElementById('page-content');
     container.innerHTML = '<h1>New Page</h1>';
   }
   ```

2. **Register in routes.js:**
   ```javascript
   {
     path: '/new-page',
     load: () => import('./pages/NewPage.js').then(m => m.renderNewPage)
   }
   ```

3. **Add navigation link (optional):**
   Edit `src/components/Navigation.js`

---

## Worker Routes (Server-Side)

All Worker routes are handled by the Hono.js framework in `src/worker.ts`.

### Public API Endpoints

**No authentication required.**

#### GET /blog

**Purpose:** Retrieve list of published blog entries
**Query Params:**
- `before` - ISO timestamp for pagination
- `format` - `json` for JSON response, default HTML

**Response:**
- HTML: Full page with rendered entries
- JSON: `{ entries: [...] }`

**Example:**
```
GET /blog
GET /blog?format=json
GET /blog?before=2025-11-01T00:00:00Z
```

#### GET /blog/entry/:id

**Purpose:** Redirect to specific entry anchor
**Response:** 302 redirect to `/blog#entry-{id}`
**Example:**
```
GET /blog/entry/123 → 302 /blog#entry-123
```

#### GET /rss.xml

**Purpose:** Generate RSS 2.0 feed
**Response:** XML document with last 50 published entries
**Content-Type:** `application/rss+xml; charset=utf-8`

#### GET /images/:filename

**Purpose:** Serve images from R2 bucket
**Response:** Binary image data with appropriate Content-Type
**Cache:** 1 year immutable headers

**Example:**
```
GET /images/1634567890123-photo.jpg
```

### Admin API Endpoints

**Authentication required via session cookie.**

#### GET /admin

**Purpose:** Admin dashboard
**Response:**
- Not authenticated: Login form HTML
- Authenticated: Dashboard HTML with entry list

#### POST /admin/login

**Purpose:** Handle login form submission
**Content-Type:** `application/x-www-form-urlencoded`
**Body:** `username=...&password=...`
**Response:**
- Success: 302 redirect to `/admin` with session cookie
- Failure: Login form HTML with error message

#### GET /admin/logout

**Purpose:** Clear session and log out
**Response:** 302 redirect to `/admin`
**Action:** Deletes `admin_session` cookie

#### POST /admin/entry

**Purpose:** Create new blog entry
**Content-Type:** `application/json`
**Body:**
```json
{
  "type": "text|image|gif|quote",
  "content": { ... },
  "published": true|false,
  "metadata": { ... }
}
```
**Response:** 201 with created entry JSON

#### GET /admin/entry/:id

**Purpose:** Retrieve single entry
**Response:** Entry JSON object

#### PUT /admin/entry/:id

**Purpose:** Update existing entry
**Content-Type:** `application/json`
**Body:** Partial update fields
```json
{
  "content": { ... },
  "published": true
}
```
**Response:** Updated entry JSON

#### DELETE /admin/entry/:id

**Purpose:** Delete entry
**Response:** `{ "success": true }`

#### POST /admin/upload

**Purpose:** Upload image to R2
**Content-Type:** `multipart/form-data`
**Body:** `file` field with image data
**Response:**
```json
{
  "url": "/images/timestamp-filename.jpg"
}
```

#### GET /admin/create

**Purpose:** Canvas creator interface
**Response:** HTML page with canvas editor

#### POST /admin/canvas

**Purpose:** Create canvas entry
**Content-Type:** `application/json`
**Body:**
```json
{
  "title": "My Canvas",
  "background": { "type": "solid", "value": "#fff" },
  "dimensions": { "width": 1080, "height": 1920 },
  "elements": [ ... ],
  "published": true|false
}
```
**Response:** 201 with created canvas JSON

#### GET /admin/canvas/:id

**Purpose:** Retrieve canvas entry
**Response:** Canvas JSON with parsed fields

#### GET /admin/giphy

**Purpose:** Search Giphy for GIFs
**Query Params:** `q` - search term
**Response:** Giphy API response JSON
**Example:**
```
GET /admin/giphy?q=cats
```

### Asset Serving

#### GET /*.(js|css|woff2|png|jpg|svg|etc)

**Purpose:** Serve static assets from Vite build
**Source:** Assets binding (`dist/` directory)
**Headers:**
- `Content-Type`: Based on file extension
- `Cache-Control`: 1 year immutable

#### GET /* (No file extension)

**Purpose:** SPA fallback for client-side routes
**Response:** `index.html` content (with asset URLs from manifest)
**Condition:** Path has no file extension

---

## Development Commands

Commands defined in `package.json` scripts.

### npm run dev

**Purpose:** Start Vite development server for SPA only
**Port:** 5173
**Features:**
- Hot Module Replacement
- Source maps
- Tailwind JIT
- Fast refresh

**Usage:**
```bash
npm run dev
```

**When to use:**
- UI component development
- Theme changes
- Page layouts
- No Worker functionality needed

**Note:** `/blog` and `/admin` show development messages with instructions to start Worker.

### npm run dev:worker

**Purpose:** Start Wrangler development server for Worker only
**Port:** 8787
**Features:**
- Local D1 database
- Local R2 simulation
- TypeScript compilation
- Live reload

**Usage:**
```bash
npm run dev:worker
```

**When to use:**
- Blog/admin development
- Database work
- Worker routes testing
- API development

### npm run dev:all

**Purpose:** Start both Vite and Wrangler servers concurrently
**Ports:** 5173 (Vite), 8787 (Wrangler)
**Features:**
- All features from both servers
- Vite proxies `/blog` and `/admin` to Worker
- Single URL for testing

**Usage:**
```bash
npm run dev:all
```

**When to use:**
- Full application testing
- End-to-end development
- Production-like environment

**Note:** Use `http://localhost:5173` for all routes.

### npm run build

**Purpose:** Create production build
**Output:** `dist/` directory
**Steps:**
1. Vite builds SPA (bundling, minification)
2. Asset manifest generated for Worker
3. Output ready for deployment

**Usage:**
```bash
npm run build
```

### npm run preview

**Purpose:** Preview production build locally
**Serves:** `dist/` directory via Vite preview server
**Port:** Default Vite preview port

**Usage:**
```bash
npm run build
npm run preview
```

---

## Build Scripts

Located in `scripts/` directory.

### parse-song-lyrics.js

**Purpose:** Convert markdown song files to JavaScript
**Input:** `src/data/songs/*.md` (39 files)
**Output:** `src/data/songs.js`

**Usage:**
```bash
node scripts/parse-song-lyrics.js
```

**Process:**
1. Read all `.md` files from songs directory
2. Extract title from `# Heading`
3. Convert paragraphs to `<p>` tags
4. Convert line breaks to `<br>`
5. Generate JavaScript export

**When to run:**
- After editing any markdown song file
- Before committing song changes

### generate-asset-manifest.js

**Purpose:** Create asset name → hashed filename mapping
**Input:** `dist/` directory (Vite build output)
**Output:** `src/asset-manifest.json`

**Usage:**
```bash
node scripts/generate-asset-manifest.js
```

**Output format:**
```json
{
  "js": "/assets/main.abc123.js",
  "css": "/assets/style.def456.css"
}
```

**Used by:** `src/worker.ts` to inject asset URLs into HTML

**When to run:**
- Automatically during `npm run build`
- After Vite build completes

---

## Database Commands

Using Wrangler CLI for D1 database operations.

### Apply Entries Migration

**Purpose:** Create `entries` table for blog posts
**Migration:** `migrations/001_create_entries_table.sql`

**Usage:**
```bash
npx wrangler d1 execute blog-db --file migrations/001_create_entries_table.sql
```

**Local development:**
```bash
npx wrangler d1 execute blog-db --file migrations/001_create_entries_table.sql --local
```

### Apply Canvases Migration

**Purpose:** Create `canvases` table for visual entries
**Migration:** `migrations/001_create_canvases_table.sql`

**Usage:**
```bash
npx wrangler d1 execute blog-db --file migrations/001_create_canvases_table.sql
```

### Custom SQL Queries

**Purpose:** Execute arbitrary SQL

**Examples:**
```bash
# Count entries
npx wrangler d1 execute blog-db --command "SELECT COUNT(*) FROM entries"

# List published entries
npx wrangler d1 execute blog-db --command "SELECT id, type, created_at FROM entries WHERE published = 1"

# Local database
npx wrangler d1 execute blog-db --local --command "SELECT * FROM entries"
```

### Database Console

**Purpose:** Interactive SQL console

**Usage:**
```bash
npx wrangler d1 execute blog-db
```

---

## Deployment Commands

### Deploy to Cloudflare

**Purpose:** Deploy Worker and assets to production
**Uploads:**
- Worker code (compiled TypeScript)
- Static assets (from `dist/`)
- Configuration (from `wrangler.toml`)

**Usage:**
```bash
npx wrangler deploy
```

**Prerequisites:**
- `npm run build` completed
- Wrangler authenticated (`npx wrangler login`)
- Secrets configured

### Set Admin Credentials

**Purpose:** Configure admin authentication secrets
**Secrets:**
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password
- `GIPHY_API_KEY` - Giphy API key (optional)

**Usage:**
```bash
npx wrangler secret put ADMIN_USERNAME
# Enter value when prompted

npx wrangler secret put ADMIN_PASSWORD
# Enter value when prompted

npx wrangler secret put GIPHY_API_KEY
# Enter value when prompted
```

**Notes:**
- Secrets are encrypted by Cloudflare
- Never stored in version control
- Persist across deployments
- Can be updated at any time

### List Deployed Resources

**Purpose:** View deployment status

**Usage:**
```bash
# View Worker info
npx wrangler deployment list

# View D1 databases
npx wrangler d1 list

# View R2 buckets
npx wrangler r2 bucket list
```

---

## Keyboard Shortcuts

User-accessible keyboard shortcuts in the application.

### Theme Toggle

**Key:** `\` (backslash)
**Action:** Cycle to next theme
**Themes:** Moonlight → Daylight → Forest → Beach → Moonlight

**Implementation:**
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === '\\' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Don't trigger if typing in input
    if (!isTyping) {
      e.preventDefault();
      themeToggle.toggle();
      // Update UI
    }
  }
});
```

**Notes:**
- Disabled when typing in input/textarea
- Prevents default browser behavior
- Updates localStorage immediately
- Re-renders theme button with new icon

---

## Environment Differences

### Development vs. Production

| Aspect | Development | Production |
|--------|-------------|------------|
| SPA Server | Vite (5173) | Cloudflare Worker |
| Worker Server | Wrangler (8787) | Cloudflare Worker |
| Database | Local SQLite | D1 Edge Database |
| Storage | Local R2 simulation | R2 Bucket |
| Secrets | `.dev.vars` file | Cloudflare Secrets |
| Assets | Vite dev server | Assets binding |
| HMR | Yes | No |
| Source Maps | Yes | No (minified) |

### Local Development Setup

**1. Install dependencies:**
```bash
npm install
```

**2. Create local database:**
```bash
npx wrangler d1 execute blog-db --local --file migrations/001_create_entries_table.sql
npx wrangler d1 execute blog-db --local --file migrations/001_create_canvases_table.sql
```

**3. Create `.dev.vars` for local secrets:**
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=localpassword
GIPHY_API_KEY=your-api-key
```

**4. Start development:**
```bash
npm run dev:all
```

**5. Access application:**
- SPA: `http://localhost:5173`
- Worker: `http://localhost:8787`
- All routes: `http://localhost:5173` (with proxy)

---

## Entry Point Summary Table

| Entry Point | Type | Location | Purpose |
|-------------|------|----------|---------|
| `main.js` | Code | `src/` | SPA initialization |
| `worker.ts` | Code | `src/` | Worker handler |
| `/` | Route | SPA | Home page |
| `/apps/*` | Route | SPA | Portfolio apps |
| `/ideas/*` | Route | SPA | Research ideas |
| `/sounds/*` | Route | SPA | Music content |
| `/connect` | Route | SPA | Contact page |
| `/blog` | Route | Worker | Blog entries |
| `/admin` | Route | Worker | Admin panel |
| `/rss.xml` | Route | Worker | RSS feed |
| `npm run dev` | Command | CLI | Dev SPA |
| `npm run dev:worker` | Command | CLI | Dev Worker |
| `npm run dev:all` | Command | CLI | Dev both |
| `npm run build` | Command | CLI | Production build |
| `parse-song-lyrics.js` | Script | `scripts/` | Generate songs.js |
| `wrangler deploy` | Command | CLI | Deploy to CF |
| `\` key | Shortcut | Browser | Toggle theme |

---

## Common Workflows by Entry Point

### Make UI Change

1. `npm run dev` - Start SPA server
2. Edit component/page files
3. See changes instantly (HMR)
4. Test in browser

### Update Blog Feature

1. `npm run dev:all` - Start both servers
2. Edit `worker.ts`
3. Test `/blog` or `/admin` routes
4. Wrangler auto-reloads on change

### Add New Song

1. Create `src/data/songs/newsong.md`
2. Run `node scripts/parse-song-lyrics.js`
3. Commit both `.md` and `songs.js`

### Deploy to Production

1. `npm run build` - Create production build
2. `npx wrangler deploy` - Deploy to Cloudflare
3. Verify at production URL

### Apply Database Migration

1. Write migration SQL in `migrations/`
2. Test locally: `npx wrangler d1 execute blog-db --local --file migrations/your_migration.sql`
3. Apply to production: `npx wrangler d1 execute blog-db --file migrations/your_migration.sql`
4. Deploy code that uses new schema

---

## Related Documentation

- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - System architecture
- **wireframes/v2-2025-11-18/data-flow.notes.md** - Request/response cycles
- **wireframes/v2-2025-11-18/deployment-infrastructure.notes.md** - Deployment details
- **CLAUDE.md** - Development conventions
- **README.md** - Quick start guide
