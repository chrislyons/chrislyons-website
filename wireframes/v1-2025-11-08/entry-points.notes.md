# Entry Points - Notes

## Overview

The chrislyons-website has **multiple entry points** across different environments:

1. **Browser Entry Points** - User-initiated interactions
2. **Application Initialization** - SPA bootstrap sequence
3. **Worker Entry Points** - Server-side request handling
4. **Development Entry Points** - Local development commands
5. **Build Entry Points** - Production build process
6. **Script Entry Points** - Manual build scripts
7. **API Entry Points** - RESTful endpoints
8. **SPA Route Entry Points** - Client-side routes

Understanding these entry points is essential for:
- Debugging initialization issues
- Adding new features
- Understanding execution flow
- Optimizing performance

## Browser Entry Points

### 1. URL Navigation (Direct or Bookmarked)

**User Action**: Enter URL in address bar or click bookmark

**Flow**:
1. Browser makes HTTP GET request
2. **Development**:
   - Vite server receives request on port 5173
   - Serves index.html (SPA routes)
   - OR Proxies to Worker (dynamic routes)
3. **Production**:
   - Cloudflare Worker receives request
   - Serves from ASSETS binding (SPA routes)
   - OR Handles dynamically (worker routes)
4. Browser loads HTML
5. Browser executes JavaScript
6. Application initializes
7. Router handles current path

**Entry Points**:
- SPA routes: `index.html` → `main.js`
- Worker routes: `worker.ts` → Route handlers

### 2. Link Click (Internal Navigation)

**User Action**: Click `<a href="/path">` link

**Flow**:
1. Browser fires click event
2. Router's document-level click listener intercepts
3. Router checks if href starts with `/`
4. Router checks if route is worker route (`/blog` or `/admin`)
5. **If SPA route**:
   - `event.preventDefault()` (block default navigation)
   - Call `router.navigate(path)`
   - Update History API
   - Call route handler
   - Render page content
6. **If worker route**:
   - Allow default behavior (full page load)
   - Browser makes HTTP request
   - Worker handles request

**Entry Points**:
- SPA routes: `router.navigate()` → Route handlers
- Worker routes: HTTP request → `worker.ts`

**Code Location**: `src/utils/router.js:21-33`

```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="/"]')) {
    const path = e.target.getAttribute('href');

    // Don't intercept worker routes
    if (path.startsWith('/blog') || path.startsWith('/admin')) {
      return; // Allow default behavior
    }

    e.preventDefault();
    this.navigate(path);
  }
});
```

### 3. Browser Back/Forward (History Navigation)

**User Action**: Click browser back/forward button

**Flow**:
1. Browser fires `popstate` event
2. Router's popstate listener triggers
3. Router reads `window.location.pathname`
4. Router calls `handleRoute(pathname, false)`
5. Route handler renders page
6. No History API update (already handled by browser)

**Entry Point**: `router.handleRoute()` → Route handlers

**Code Location**: `src/utils/router.js:16-18`

```javascript
window.addEventListener('popstate', (e) => {
  this.handleRoute(window.location.pathname, false);
});
```

### 4. Keyboard Shortcuts

**User Action**: Press `\` key

**Flow**:
1. Browser fires `keydown` event
2. Global keyboard handler in main.js checks key
3. Handler verifies user is not typing in input field
4. Handler calls `themeToggle.toggle()`
5. ThemeToggle cycles to next theme
6. ThemeToggle updates localStorage
7. ThemeToggle applies CSS classes
8. Theme toggle buttons re-render

**Entry Point**: `setupKeyboardShortcuts()` → `themeToggle.toggle()`

**Code Location**: `src/main.js:34-65`

**Shortcuts**:
- `\` - Cycle theme (Moonlight → Daylight → Forest → Beach)

**Extensibility**: Add more shortcuts in `setupKeyboardShortcuts()`

## Application Initialization

### Bootstrap Sequence (SPA)

**Trigger**: Page load (index.html loaded)

**Sequence**:

1. **Page Load Event**
   - Browser finishes parsing HTML
   - Browser loads external resources (CSS, JS)
   - Browser executes script modules

2. **index.html**
   - Minimal HTML skeleton
   - Meta tags, favicon, title
   - Empty containers: `#nav-container`, `#page-content`, `#footer-container`
   - Vite-injected script tag: `<script type="module" src="/src/main.js">`

3. **main.js Module Execution**
   - Import statements execute (components, utils, data)
   - Global variables declared
   - `init()` function defined
   - `init()` called immediately (line ~70)

4. **init() Function**
   ```javascript
   function init() {
     console.log('🚀 Chris Lyons Website Initializing...');

     // 1. Initialize theme (MUST be first)
     themeToggle = new ThemeToggle();

     // 2. Set up global keyboard shortcuts
     setupKeyboardShortcuts();

     // 3. Initialize components
     navigation = new Navigation();
     footer = new Footer();

     // 4. Render static components
     renderNavigation();
     renderFooter();

     // 5. Set up routes
     setupRoutes();

     // 6. Initialize router
     router.init();

     console.log('✅ Application Initialized');
   }
   ```

5. **ThemeToggle Initialization**
   - Read `localStorage.theme`
   - Default to 'moonlight' if not set
   - Apply theme immediately (before render)
   - Prevents flash of unstyled content

6. **Keyboard Shortcuts Setup**
   - Attach global `keydown` listener
   - Check for `\` key
   - Verify not typing in input field
   - Call `themeToggle.toggle()` if triggered

7. **Component Initialization**
   - `navigation = new Navigation()`
   - `footer = new Footer()`
   - Components store props and state
   - No rendering yet

8. **Render Static Components**
   - `renderNavigation()`: Inject nav HTML, attach listeners, embed ThemeToggle
   - `renderFooter()`: Inject footer HTML

9. **Route Setup**
   - `setupRoutes()` registers all route handlers:
     - `router.on('/', renderHomePage)`
     - `router.on('/apps', renderAppsPage)`
     - ... (all SPA routes)
     - `router.notFound(render404Page)`

10. **Router Initialization**
    - `router.init()` called
    - Router reads `window.location.pathname`
    - Router calls `handleRoute(currentPath, false)`
    - Route handler renders initial page

11. **Initial Route Handling**
    - Router finds matching route
    - Calls route handler (e.g., `renderHomePage()`)
    - Handler loads content via contentLoader
    - Handler renders HTML into `#page-content`
    - Handler attaches event listeners
    - Page is now interactive

**Time to Interactive**: ~100-200ms (after JavaScript load)

**Critical Path**:
- Theme initialization MUST be first (prevents flash)
- Navigation/footer MUST render before router (so nav is visible)
- Routes MUST be registered before router.init()

## Worker Entry Points

### Worker Initialization (Cloudflare Workers)

**Trigger**: Deployment or local development start

**Development**:
```bash
npm run dev:worker
# OR
npx wrangler dev --port 8787 --local
```

**Production**:
```bash
npx wrangler deploy
```

**Sequence**:

1. **Worker Deployment**
   - Cloudflare loads worker code
   - V8 isolate created
   - Worker environment initialized

2. **fetch Event Registration**
   - Worker registers fetch event listener
   - Every HTTP request triggers this listener

3. **src/worker.ts Module Execution**
   - TypeScript compiled to JavaScript (in build)
   - Imports execute (Hono, templates, etc.)
   - Hono app instance created: `const dynamicApp = new Hono<{ Bindings: Bindings }>()`

4. **Environment Bindings**
   - `DB`: D1 database binding
   - `BLOG_IMAGES`: R2 bucket binding
   - `GIPHY_API_KEY`: Secret binding
   - `ASSETS`: Asset serving binding

5. **Route Definitions**
   - All routes registered on Hono app:
     - `dynamicApp.get('/blog', handler)`
     - `dynamicApp.get('/admin', handler)`
     - ... (all dynamic routes)
     - `dynamicApp.all('*', spaFallbackHandler)` (catch-all)

6. **Middleware Setup**
   - `isAuthenticated()` function defined
   - Used in protected route handlers

7. **Export**
   - `export default dynamicApp`
   - Cloudflare calls this export for each request

**Request Handling**:
1. HTTP request arrives
2. Cloudflare triggers fetch event
3. Hono app receives request
4. Hono matches route
5. Route handler executes
6. Response returned to browser

**Cold Start**: 5-20ms (V8 isolate creation)
**Warm Request**: <5ms (isolate reused)

## Development Entry Points

### npm run dev (Vite Only)

**Command**: `npm run dev`

**What It Does**:
- Starts Vite development server on port 5173
- Enables hot module replacement (HMR)
- Serves SPA routes (/, /apps, /ideas, /sounds, /connect)
- Shows fallback message for /blog and /admin

**Use When**:
- Developing static SPA pages
- Working on UI components
- Testing theme system
- No need for blog/admin features

**Access**:
- Navigate to `http://localhost:5173`

### npm run dev:worker (Worker Only)

**Command**: `npm run dev:worker`

**What It Does**:
- Starts Wrangler development server on port 8787
- Enables local D1 database
- Serves dynamic routes (/blog, /admin)
- Serves SPA routes via ASSETS binding (from dist/)

**Use When**:
- Developing blog/admin features
- Testing database queries
- Working on authentication
- Testing worker logic

**Access**:
- Navigate to `http://localhost:8787`

**Note**: Requires `npm run build` first to populate dist/

### npm run dev:all (Full Stack)

**Command**: `npm run dev:all`

**What It Does**:
- Starts BOTH Vite (5173) AND Wrangler (8787)
- Vite proxies /blog and /admin to Wrangler
- All routes accessible from single port

**Use When**:
- Full-stack development
- Testing integration between SPA and Worker
- Most realistic development environment

**Access**:
- Navigate to `http://localhost:5173` (Vite)
- SPA routes handled by Vite
- /blog and /admin proxied to Worker

**Note**: Runs two processes (may use more resources)

## Build Entry Points

### npm run build

**Command**: `npm run build`

**What It Does**:
1. Runs `vite build`
2. Compiles, bundles, and minifies JavaScript
3. Processes and minifies CSS
4. Optimizes assets (images, fonts)
5. Generates hashed filenames for cache busting
6. Outputs to `dist/`
7. Runs `node scripts/generate-asset-manifest.js`
8. Creates `asset-manifest.json` with hashed filenames

**Output**:
```
dist/
├── index.html
├── assets/
│   ├── main.abc123.js
│   ├── style.xyz789.css
│   └── [other assets]
├── fonts/
│   └── HKGrotesk_3003/ (not hashed)
└── asset-manifest.json
```

**Use When**:
- Preparing for deployment
- Testing production build locally
- Generating asset manifest for worker

**Deploy**:
```bash
npm run build
npx wrangler deploy
```

## Script Entry Points

### Parse Song Lyrics

**Command**: `node scripts/parse-song-lyrics.js`

**What It Does**:
1. Reads all .md files from `src/data/songs/`
2. Parses markdown format (title, author, verses)
3. Converts verses to HTML (paragraphs with line breaks)
4. Generates `src/data/songs.js` with JavaScript array

**When to Run**:
- After editing song markdown files
- When adding new songs
- When changing lyric formatting

**Workflow**:
```bash
# 1. Edit markdown
vim src/data/songs/new-song.md

# 2. Generate JavaScript
node scripts/parse-song-lyrics.js

# 3. Commit both files
git add src/data/songs/
git commit -m "Add new song"
```

### Generate Asset Manifest

**Command**: `node scripts/generate-asset-manifest.js`

**What It Does**:
1. Scans `dist/` directory
2. Finds hashed JS and CSS files
3. Creates `asset-manifest.json`

**When to Run**:
- Automatically after `vite build` (via npm script)
- Manually if manifest is missing

**Output**:
```json
{
  "js": "/assets/main.abc123.js",
  "css": "/assets/style.xyz789.css"
}
```

**Used By**: `src/worker.ts` (inlines paths into index.html template)

## API Entry Points (Worker)

### Public Endpoints

**GET /blog**
- List published blog entries
- Query params: `before` (pagination), `format` (json or html)
- Returns: HTML page or JSON array

**GET /blog/entry/:id**
- Redirect to /blog with anchor
- Used for RSS feed links

**GET /rss.xml**
- RSS feed of published entries
- Returns: XML response

**GET /images/:filename**
- Serve image from R2 bucket
- Public access (no auth required)
- Cache headers: 1 year immutable

### Protected Endpoints (Authentication Required)

**GET /admin**
- Admin dashboard
- Shows login page if not authenticated
- Shows admin interface if authenticated

**POST /admin/login**
- Authenticate admin user
- Sets HTTP-only session cookie
- Redirects to /admin on success

**GET /admin/logout**
- Clear session cookie
- Redirects to /admin (login page)

**POST /admin/entry**
- Create new blog entry
- Body: `{type, content, published, metadata}`
- Returns: JSON with new entry object

**GET /admin/entry/:id**
- Get single blog entry
- Returns: JSON entry object

**PUT /admin/entry/:id**
- Update blog entry
- Body: `{content?, published?, metadata?}`
- Returns: JSON updated entry

**DELETE /admin/entry/:id**
- Delete blog entry
- Returns: JSON success message

**POST /admin/upload**
- Upload image to R2
- Body: FormData with file
- Returns: JSON with image URL

**GET /admin/giphy**
- Search Giphy for GIFs
- Query param: `q` (search query)
- Returns: JSON Giphy API response

**POST /admin/canvas**
- Create visual canvas entry
- Body: `{title, background, dimensions, elements, published}`
- Returns: JSON canvas object

**GET /admin/canvas/:id**
- Get canvas entry
- Returns: JSON canvas object

**GET /admin/create**
- Canvas creator interface
- Returns: HTML editor page

## SPA Route Entry Points

All routes registered in `setupRoutes()`:

**Home**:
- `/` → `renderHomePage()`

**Apps**:
- `/apps` → `renderAppsPage()`
- `/apps/carbon-acx` → `renderCarbonAcxPage()`
- `/apps/clip-composer` → `renderClipComposerPage()`
- `/apps/hotbox` → `renderHotboxPage()`
- `/apps/listmaker` → `renderListMakerPage()`
- `/apps/orpheus-sdk` → `renderOrpheusSDKPage()`
- `/apps/tidal-mcp` → `renderTidalMCPPage()`
- `/apps/wordbird` → `renderWordBirdPage()`

**Ideas**:
- `/ideas` → `renderIdeasPage()`
- `/ideas/27-suppositions` → `render27SuppositionsPage()`
- `/ideas/numa-network` → `renderNumaNetworkPage()`
- `/ideas/osd-events` → `renderOSDEventsPage()`
- `/ideas/protocols-of-sound` → `renderProtocolsOfSoundPage()`

**Sounds**:
- `/sounds` → `renderSoundsPage()`
- `/sounds/lyrics` → `renderLyricsPage()`
- `/sounds/discography` → `renderDiscographyPage()`
- `/sounds/portfolio` → `renderPortfolioPage()`

**Connect**:
- `/connect` → `renderConnectPage()`

**404**:
- Unmatched routes → `render404Page()`

## Environment Differences

### Development vs Production

**Development (npm run dev)**:
- Vite serves unminified code
- Hot module replacement enabled
- Source maps available
- Proxy for worker routes
- Two servers (5173 + 8787)

**Production (Cloudflare)**:
- Worker serves everything
- Minified, bundled code
- No source maps
- Single server (edge)
- ASSETS binding for static files

### Local vs Edge (Worker)

**Local (wrangler dev)**:
- SQLite database (local file)
- Simulated bindings
- Port 8787
- Faster iteration

**Edge (wrangler deploy)**:
- D1 database (distributed)
- Real bindings
- Global edge network
- Production environment

## Debugging Entry Points

### Browser Console
```javascript
// Check current route
console.log(router.getCurrentRoute())

// Check theme
console.log(localStorage.theme)

// Trigger theme toggle
themeToggle.toggle()

// Navigate programmatically
router.navigate('/apps')
```

### Worker Logs (Development)
```bash
# Start worker with logs
npm run dev:worker

# Logs appear in terminal
```

### Worker Logs (Production)
```bash
# Tail production logs
npx wrangler tail
```

## Adding New Entry Points

### Adding a New SPA Route

1. Create route handler in main.js:
   ```javascript
   function renderNewPage() {
     const pageData = contentLoader.getPageData('new');
     contentLoader.updateDocumentTitle('New Page');

     const pageContent = document.getElementById('page-content');
     pageContent.innerHTML = `<h1>${pageData.title}</h1>`;
   }
   ```

2. Register route in `setupRoutes()`:
   ```javascript
   router.on('/new-page', renderNewPage);
   ```

3. Add navigation link in `src/components/Navigation.js`

### Adding a New Worker Route

1. Add route handler in `src/worker.ts`:
   ```typescript
   dynamicApp.get('/new-route', async (c) => {
     return c.json({ message: 'Hello' });
   });
   ```

2. Add authentication if needed:
   ```typescript
   dynamicApp.get('/new-route', async (c) => {
     if (!isAuthenticated(c)) {
       return c.json({ error: 'Unauthorized' }, 401);
     }
     // ... handler logic
   });
   ```

### Adding a New Build Script

1. Create script in `scripts/`:
   ```javascript
   // scripts/my-script.js
   console.log('Running my script...');
   ```

2. Add npm script in package.json:
   ```json
   {
     "scripts": {
       "my-script": "node scripts/my-script.js"
     }
   }
   ```

3. Run with `npm run my-script`

## Related Diagrams

- [repo-structure.mermaid.md](repo-structure.mermaid.md) - Directory layout
- [architecture-overview.mermaid.md](architecture-overview.mermaid.md) - System design
- [component-map.mermaid.md](component-map.mermaid.md) - Component relationships
- [data-flow.mermaid.md](data-flow.mermaid.md) - Data movement
- [database-schema.mermaid.md](database-schema.mermaid.md) - Database structure
- [deployment-infrastructure.mermaid.md](deployment-infrastructure.mermaid.md) - Deployment architecture
