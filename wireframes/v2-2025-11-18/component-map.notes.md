# Component Map - Detailed Notes

## Overview

This document details all components, modules, and their relationships in the chrislyons-website codebase. Components are organized by layer (UI, utility, pages, worker) with clear boundaries and dependencies.

## UI Components (`src/components/`)

### Navigation Component

**File:** `src/components/Navigation.js`

**Responsibilities:**
- Render main navigation bar with logo and links
- Handle mobile menu toggle (hamburger icon)
- Highlight active navigation link based on current route
- Provide theme toggle container

**Public API:**
```javascript
class Navigation {
  render() // Returns HTML string
  attachEventListeners() // Binds mobile menu toggle
}
```

**Usage:**
```javascript
const nav = new Navigation();
document.getElementById('nav-container').innerHTML = nav.render();
nav.attachEventListeners();
```

**Navigation Links:**
- Home (`/`)
- Apps (`/apps`)
- Ideas (`/ideas`)
- Sounds (`/sounds`)
- Blog (`/blog`)
- Connect (`/connect`)

**Mobile Behavior:**
- Hamburger menu icon on small screens
- Slide-down menu with smooth animation
- Click outside to close (event delegation)

**Dependencies:** None (standalone component)

---

### Footer Component

**File:** `src/components/Footer.js`

**Responsibilities:**
- Render site footer with copyright and links
- Display social media links
- Show last updated date

**Public API:**
```javascript
class Footer {
  render() // Returns HTML string
}
```

**Usage:**
```javascript
const footer = new Footer();
document.getElementById('footer-container').innerHTML = footer.render();
```

**Footer Content:**
- Copyright notice
- Links to GitHub, LinkedIn, etc.
- Email contact
- RSS feed link

**Dependencies:** None

---

### ThemeToggle Component

**File:** `src/components/ThemeToggle.js`

**Responsibilities:**
- Manage four-theme system (Moonlight, Daylight, Forest, Beach)
- Persist theme preference in `localStorage`
- Apply theme classes to `<html>` element
- Provide theme toggle button with icon

**Public API:**
```javascript
class ThemeToggle {
  constructor() // Initializes and applies saved theme
  theme // Current theme name
  render() // Returns theme toggle button HTML
  toggle() // Cycles to next theme
  attachEventListeners() // Binds click handler
}
```

**Theme Cycle:**
1. Moonlight (dark blue) → Moon icon
2. Daylight (light) → Sun icon
3. Forest (dark green) → Leaf icon
4. Beach (gold-blue) → Kite icon

**LocalStorage Key:** `theme`

**CSS Application:**
- Adds class to `<html>` element (e.g., `theme-moonlight`)
- Tailwind config defines theme-specific colors
- CSS custom properties update automatically

**Keyboard Shortcut:**
- `\` key toggles theme (handled in `main.js`)
- Prevents toggle when typing in input fields

**Dependencies:** `localStorage` API

**Usage Notes:**
- Must be instantiated BEFORE other components to apply theme immediately
- Prevents flash of incorrect theme on page load

---

### Card Component

**File:** `src/components/Card.js`

**Responsibilities:**
- Render consistent card layout for portfolio items
- Display title, description, tags, and link
- Provide hover effects and accessibility

**Public API:**
```javascript
class Card {
  constructor({ title, description, link, tags })
  render() // Returns card HTML string
}
```

**Usage:**
```javascript
const card = new Card({
  title: 'Carbon ACX',
  description: 'High-precision carbon accounting platform',
  link: '/apps/carbon-acx',
  tags: ['TypeScript', 'React', 'D3.js']
});
container.innerHTML += card.render();
```

**Card Structure:**
- Title (heading)
- Description paragraph
- Tag list (pills)
- "Learn more" link
- Hover effects (scale, shadow)

**Accessibility:**
- Semantic HTML (`<article>`, headings)
- ARIA labels where needed
- Keyboard navigable

**Dependencies:** None

---

### PageHeader Component

**File:** `src/components/PageHeader.js`

**Responsibilities:**
- Render consistent page header across all pages
- Display page title and optional subtitle
- Provide breadcrumb navigation context

**Public API:**
```javascript
class PageHeader {
  constructor({ title, subtitle })
  render() // Returns header HTML string
}
```

**Usage:**
```javascript
const header = new PageHeader({
  title: 'Portfolio Apps',
  subtitle: 'Software projects and professional work'
});
container.innerHTML = header.render();
```

**Styling:**
- Large title (responsive sizing)
- Subtitle in muted color
- Bottom border or divider
- Consistent spacing

**Dependencies:** None

---

### SongAccordion Component

**File:** `src/components/SongAccordion.js`

**Responsibilities:**
- Render expandable accordion for song lyrics
- Handle expand/collapse interactions
- Display 39 songs from `songs.js`

**Public API:**
```javascript
class SongAccordion {
  constructor(songs)
  render() // Returns accordion HTML string
  attachEventListeners() // Binds expand/collapse handlers
}
```

**Usage:**
```javascript
import { songs } from '../data/songs.js';
const accordion = new SongAccordion(songs);
container.innerHTML = accordion.render();
accordion.attachEventListeners();
```

**Interaction:**
- Click song title to expand
- Click again to collapse
- Smooth height animation
- Icon rotation (chevron)

**Accessibility:**
- ARIA `aria-expanded` attribute
- ARIA `aria-controls` linking
- Keyboard accessible (Enter/Space)

**Dependencies:** `src/data/songs.js`

---

### CollapsibleSection Component

**File:** `src/components/CollapsibleSection.js`

**Responsibilities:**
- Generic collapsible content section
- Can be open or closed by default
- Smooth expand/collapse animation

**Public API:**
```javascript
class CollapsibleSection {
  constructor({ title, content, defaultOpen = false })
  render() // Returns section HTML string
  attachEventListeners() // Binds toggle handler
}
```

**Usage:**
```javascript
const section = new CollapsibleSection({
  title: 'Technical Details',
  content: '<p>Implementation details here...</p>',
  defaultOpen: true
});
container.innerHTML += section.render();
section.attachEventListeners();
```

**Dependencies:** None

---

### TableResponsive Component

**File:** `src/components/TableResponsive.js`

**Responsibilities:**
- Render accessible, responsive tables
- Handle mobile layout (stack or scroll)
- Format headers and rows

**Public API:**
```javascript
class TableResponsive {
  constructor({ headers, rows })
  render() // Returns table HTML string
}
```

**Usage:**
```javascript
const table = new TableResponsive({
  headers: ['Album', 'Year', 'Label'],
  rows: [
    ['Bloom', '2012', 'Transgressive'],
    ['Depression Cherry', '2015', 'Sub Pop']
  ]
});
container.innerHTML = table.render();
```

**Responsive Behavior:**
- Desktop: Standard table layout
- Mobile: Horizontal scroll or stacked layout

**Dependencies:** None

---

## Utility Modules (`src/utils/`)

### Router Module

**File:** `src/utils/router.js`

**Responsibilities:**
- Manage client-side routing (hash-based)
- Match routes to handlers
- Handle browser navigation (back/forward)
- Provide programmatic navigation

**Public API:**
```javascript
const router = {
  on(path, handler),        // Register route
  notFound(handler),         // Register 404 handler
  init(),                    // Start listening for route changes
  navigate(path)             // Programmatically navigate
}
```

**Route Matching:**
- Exact match: `/apps`
- Wildcard: `/apps/*`
- Regex patterns supported

**Usage:**
```javascript
import router from './utils/router.js';

router.on('/', () => console.log('Home'));
router.on('/apps/:id', (params) => console.log(params.id));
router.notFound(() => console.log('404'));
router.init();
```

**Hash Format:** `#/path` (e.g., `https://example.com#/apps`)

**Event Handling:**
- Listens to `hashchange` event
- Listens to `load` event for initial route

**Navigation:**
```javascript
router.navigate('/apps/carbon-acx'); // Sets window.location.hash
```

**Dependencies:** None (uses Web APIs)

---

### ContentLoader Module

**File:** `src/utils/contentLoader.js`

**Responsibilities:**
- Load markdown files from `/content` directory
- Parse markdown to HTML
- Cache loaded content (in-memory)
- Handle loading errors gracefully

**Public API:**
```javascript
const contentLoader = {
  loadMarkdown(path) // Returns Promise<string>
}
```

**Usage:**
```javascript
import { contentLoader } from './utils/contentLoader.js';

const html = await contentLoader.loadMarkdown('/content/apps/carbon-acx.md');
container.innerHTML = html;
```

**Caching:**
- `Map` object stores loaded content
- Key: file path
- Value: parsed HTML string
- Cache persists for session (no persistence across page reloads)

**Error Handling:**
- Returns fallback message on 404
- Logs errors to console
- Doesn't throw exceptions (graceful degradation)

**Dependencies:** `MarkdownParser`

---

### MarkdownParser Module

**File:** `src/utils/markdown.js`

**Responsibilities:**
- Parse markdown syntax to HTML
- Support basic markdown features
- Sanitize output (prevent XSS)

**Public API:**
```javascript
const markdownParser = {
  parse(markdown) // Returns HTML string
}
```

**Supported Syntax:**
- Headings: `# H1`, `## H2`, etc.
- Paragraphs: Blank line separated
- Links: `[text](url)`
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Lists: `- item` or `1. item`
- Code: `` `code` `` or ` ```block``` `

**Limitations:**
- No table support
- No image support
- No HTML passthrough
- Basic implementation (not full CommonMark spec)

**Security:**
- HTML escaping for user content
- Link validation (no `javascript:` URLs)

**Dependencies:** `TemplateHelpers` (for escaping)

**Potential Improvement:**
Replace with library like `marked` or `markdown-it` for full spec support.

---

### TemplateHelpers Module

**File:** `src/utils/templateHelpers.js`

**Responsibilities:**
- Provide utility functions for HTML generation
- Format dates consistently
- Escape HTML to prevent XSS
- Truncate text with ellipsis

**Public API:**
```javascript
const templateHelpers = {
  escapeHTML(text),         // Escape <, >, &, ", '
  formatDate(date, format), // Format Date object
  truncate(text, length)    // Truncate with ellipsis
}
```

**Usage:**
```javascript
import { templateHelpers } from './utils/templateHelpers.js';

const safe = templateHelpers.escapeHTML(userInput);
const formatted = templateHelpers.formatDate(new Date(), 'YYYY-MM-DD');
const short = templateHelpers.truncate('Long text here', 50);
```

**Dependencies:** None

---

## Page Modules (`src/pages/`)

### HomePage Module

**File:** `src/pages/HomePage.js`

**Responsibilities:**
- Render home page with introduction
- Display featured projects
- Show call-to-action links

**Public API:**
```javascript
export function renderHomePage()
```

**Page Structure:**
- Hero section with name and tagline
- Brief bio paragraph
- Featured projects grid (3-4 cards)
- Links to main sections

**Dependencies:**
- `Card` component
- `PageHeader` component
- `ContentLoader` (for bio content)

---

### AppsPage Module

**File:** `src/pages/AppsPage.js`

**Responsibilities:**
- Render portfolio apps landing page
- Display grid of app cards
- Link to individual app detail pages

**Public API:**
```javascript
export function renderAppsPage()
```

**Apps Listed:**
1. Carbon ACX
2. Clip Composer
3. Hotbox
4. ListMaker
5. Orpheus SDK
6. Tidal MCP
7. WordBird

**Dependencies:**
- `Card` component
- `PageHeader` component

---

### AppDetailPages Module

**File:** `src/pages/apps/index.js`

**Responsibilities:**
- Render individual app detail pages
- Load and display app-specific content
- Show screenshots, features, tech stack

**Public API:**
```javascript
export function renderCarbonAcxPage()
export function renderClipComposerPage()
export function renderHotboxPage()
export function renderListMakerPage()
export function renderOrpheusSDKPage()
export function renderTidalMCPPage()
export function renderWordBirdPage()
```

**Pattern:**
Each function loads markdown from `/content/apps/{app-name}.md` and renders with consistent layout.

**Dependencies:**
- `ContentLoader`
- `PageHeader`
- `Card` (for related projects)

---

### IdeasPage Module

**File:** `src/pages/IdeasPage.js`

**Responsibilities:**
- Render research and ideas landing page
- Display grid of idea cards
- Link to individual idea detail pages

**Public API:**
```javascript
export function renderIdeasPage()
```

**Ideas Listed:**
1. 27 Suppositions
2. NUMA Network
3. OSD Events
4. Protocols of Sound

**Dependencies:**
- `Card` component
- `PageHeader` component

---

### IdeaDetailPages Module

**File:** `src/pages/ideas/index.js`

**Responsibilities:**
- Render individual idea detail pages
- Load and display idea-specific content

**Public API:**
```javascript
export function render27SuppositionsPage()
export function renderNumaNetworkPage()
export function renderOSDEventsPage()
export function renderProtocolsOfSoundPage()
```

**Dependencies:**
- `ContentLoader`
- `PageHeader`

---

### SoundsPage Module

**File:** `src/pages/SoundsPage.js`

**Responsibilities:**
- Render music section landing page
- Link to Lyrics, Discography, Portfolio

**Public API:**
```javascript
export function renderSoundsPage()
```

**Dependencies:**
- `Card` component
- `PageHeader` component

---

### SoundsDetailPages Module

**File:** `src/pages/sounds/index.js`

**Responsibilities:**
- Render Lyrics page with song accordion
- Render Discography page with album table
- Render Portfolio page with work history

**Public API:**
```javascript
export function renderLyricsPage()
export function renderDiscographyPage()
export function renderPortfolioPage()
```

**Lyrics Page:**
- Uses `SongAccordion` component
- Loads 39 songs from `songs.js`
- Expandable lyrics display

**Discography Page:**
- Uses `TableResponsive` component
- Lists albums chronologically

**Portfolio Page:**
- Uses `ContentLoader`
- Displays professional work history

**Dependencies:**
- `SongAccordion`
- `TableResponsive`
- `SongData`
- `ContentLoader`
- `PageHeader`

---

### ConnectPage Module

**File:** `src/pages/ConnectPage.js`

**Responsibilities:**
- Render contact information
- Display email, social links
- Show contact form (if implemented)

**Public API:**
```javascript
export function renderConnectPage()
```

**Dependencies:**
- `ContentLoader`
- `PageHeader`

---

### NotFoundPage Module

**File:** `src/pages/NotFoundPage.js`

**Responsibilities:**
- Render 404 error page
- Provide navigation back to home
- Suggest search or navigation

**Public API:**
```javascript
export function render404Page()
```

**Dependencies:**
- `PageHeader`

---

## Data Modules (`src/data/`)

### SongData Module

**File:** `src/data/songs.js` (GENERATED)

**Responsibilities:**
- Export array of 39 song objects
- Provide lyrics in HTML format

**Public API:**
```javascript
export const songs = [
  { title: 'Song Title', lyrics: '<p>...</p>' },
  // ... 38 more songs
]
```

**Generation:**
- Source: `src/data/songs/*.md` (39 markdown files)
- Script: `node scripts/parse-song-lyrics.js`
- Converts markdown paragraphs to `<p>` tags with `<br>` for line breaks

**Important:**
- **DO NOT** manually edit `songs.js` unless absolutely necessary
- Edit markdown source files and regenerate instead
- If manual edits needed, document why

**Song Structure:**
```javascript
{
  title: 'Myth',
  lyrics: `
    <p>Help me to name it<br>
    Help me to name it</p>

    <p>Does it feel good?<br>
    Does it feel right?</p>
  `
}
```

**Dependencies:** None (pure data)

---

## Worker Modules (`src/worker.ts`)

### WorkerApp (Main Export)

**File:** `src/worker.ts`

**Responsibilities:**
- Hono.js application instance
- Route all Worker requests
- Integrate bindings (D1, R2, Assets, Secrets)

**Export:**
```typescript
export default dynamicApp; // Hono instance
```

**Bindings:**
```typescript
type Bindings = {
  DB: D1Database;
  BLOG_IMAGES: R2Bucket;
  GIPHY_API_KEY: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  ASSETS: Fetcher;
}
```

**Dependencies:**
- Hono.js
- D1Database
- R2Bucket
- AssetBinding

---

### BlogRoutes

**Defined in:** `src/worker.ts`

**Routes:**

**`GET /blog`**
- Query params: `before` (pagination), `format` (json/html)
- Returns list of published blog entries
- HTML rendering by default, JSON if `?format=json`

**`GET /blog/entry/:id`**
- Redirects to `/blog#entry-{id}` for client-side scroll

**`GET /rss.xml`**
- Generates RSS 2.0 feed
- Last 50 published entries
- Content formatted per entry type

**Dependencies:**
- D1Database
- Templates

---

### AdminRoutes

**Defined in:** `src/worker.ts`

**Authentication:** All routes require `AuthMiddleware` except login

**Routes:**

**`GET /admin`**
- Shows login form if not authenticated
- Shows dashboard with entry list if authenticated

**`POST /admin/login`**
- Validates credentials against secrets
- Sets session cookie on success
- Returns login form with error on failure

**`GET /admin/logout`**
- Clears session cookie
- Redirects to `/admin`

**`POST /admin/entry`**
- Creates new blog entry
- JSON body: `{ type, content, published, metadata }`
- Returns created entry

**`GET /admin/entry/:id`**
- Returns single entry as JSON

**`PUT /admin/entry/:id`**
- Updates existing entry
- JSON body: partial update
- Returns updated entry

**`DELETE /admin/entry/:id`**
- Deletes entry by ID
- Returns `{ success: true }`

**`POST /admin/upload`**
- Uploads image to R2 bucket
- Returns `{ url: '/images/timestamp-filename.jpg' }`

**`GET /admin/create`**
- Shows canvas creator interface (HTML)

**`POST /admin/canvas`**
- Creates canvas entry
- JSON body: `{ title, background, dimensions, elements, published }`

**`GET /admin/canvas/:id`**
- Returns canvas entry with parsed JSON fields

**`GET /admin/giphy`**
- Query param: `q` (search term)
- Proxies request to Giphy API
- Returns JSON response

**Dependencies:**
- D1Database
- R2Bucket
- AuthMiddleware
- Templates
- Giphy API

---

### AssetRoutes

**Defined in:** `src/worker.ts`

**Routes:**

**`GET /images/:filename`**
- Serves images from R2 bucket
- Sets cache headers (1 year immutable)
- Returns 404 if not found

**`GET /*` (Catch-all)**
- Serves static assets from Assets binding (.js, .css, fonts, etc.)
- Returns SPA `index.html` for routes without file extension
- Sets correct `Content-Type` headers
- Adds security headers

**Dependencies:**
- R2Bucket
- AssetBinding

---

### AuthMiddleware

**Defined in:** `src/worker.ts`

**Functions:**

**`isAuthenticated(context)`**
- Checks if `admin_session` cookie equals `authenticated`
- Returns boolean

**Usage:**
```typescript
if (!isAuthenticated(c)) {
  return c.json({ error: 'Unauthorized' }, 401);
}
```

**Session Cookie:**
- Name: `admin_session`
- Value: `authenticated` (simple token)
- Flags: `httpOnly`, `secure`, `sameSite: Lax`
- Expires: 7 days

**Security:**
- Single-user system (no multi-user support)
- Simple token (no JWT or complex session management)
- HttpOnly prevents XSS cookie theft
- Secure flag requires HTTPS

**Potential Improvements:**
- Use cryptographically secure session tokens
- Add session expiration checks
- Implement refresh tokens
- Add rate limiting on login

**Dependencies:** Hono cookie helpers

---

### Templates Module

**Defined in:** `src/templates` (imported into `worker.ts`)

**Functions:**

**`renderBlog(entries)`**
- Generates HTML for blog page
- Renders entries in infinite scroll layout
- Returns full HTML page

**`renderAdmin(entries)`**
- Generates admin dashboard HTML
- Lists all entries (published and unpublished)
- Includes entry creation forms

**`renderAdminLogin(error)`**
- Generates login form HTML
- Shows error message if provided
- Returns full HTML page

**`renderCanvasCreator()`**
- Generates canvas creator interface
- Interactive element positioning
- Returns full HTML page

**Dependencies:**
- `TemplateHelpers`
- Asset manifest (for CSS/JS URLs)

---

## Database Modules

### D1Database

**Interface:** Cloudflare D1 API

**Methods:**
```typescript
prepare(query: string): Statement
exec(query: string): Result
```

**Statement Methods:**
```typescript
bind(...params: any[]): Statement
all(): Promise<{ results: any[] }>
first(): Promise<any | null>
run(): Promise<{ meta: { last_row_id: number } }>
```

**Usage:**
```typescript
const { results } = await env.DB
  .prepare('SELECT * FROM entries WHERE published = 1')
  .all();
```

**Tables:**
- `entries` - Blog entries (text, image, gif, quote)
- `canvases` - Canvas entries (visual layouts)

**Schema:** See `wireframes/v2-2025-11-18/database-schema.notes.md`

---

### R2Bucket

**Interface:** Cloudflare R2 API (S3-compatible)

**Methods:**
```typescript
get(key: string): Promise<R2Object | null>
put(key: string, value: ReadableStream, options: R2PutOptions): Promise<void>
delete(key: string): Promise<void>
```

**Usage:**
```typescript
await env.BLOG_IMAGES.put('image.jpg', fileStream, {
  httpMetadata: { contentType: 'image/jpeg' }
});

const object = await env.BLOG_IMAGES.get('image.jpg');
```

**Bucket:** `blog-images` (configured in `wrangler.toml`)

---

### AssetBinding

**Interface:** Cloudflare Assets Binding

**Method:**
```typescript
fetch(request: Request): Promise<Response>
```

**Usage:**
```typescript
const assetResponse = await env.ASSETS.fetch(request);
```

**Source:** Vite build output in `dist/` directory

---

## Component Interaction Patterns

### Component Creation Pattern

1. **Instantiate:** `const component = new Component(props)`
2. **Render:** `container.innerHTML = component.render()`
3. **Attach Events:** `component.attachEventListeners()`

**Example:**
```javascript
const nav = new Navigation();
const navContainer = document.getElementById('nav-container');
navContainer.innerHTML = nav.render();
nav.attachEventListeners();
```

### Page Render Pattern

1. **Get container:** `const container = document.getElementById('page-content')`
2. **Generate HTML:** Build HTML string with components
3. **Insert:** `container.innerHTML = html`
4. **Attach events:** Call `attachEventListeners()` for interactive components

**Example:**
```javascript
export function renderAppsPage() {
  const container = document.getElementById('page-content');

  const header = new PageHeader({
    title: 'Portfolio Apps',
    subtitle: 'Professional work and projects'
  });

  const cards = apps.map(app => new Card(app).render()).join('');

  container.innerHTML = header.render() + '<div class="grid">' + cards + '</div>';
}
```

### Content Loading Pattern

1. **Import loader:** `import { contentLoader } from './utils/contentLoader.js'`
2. **Await load:** `const html = await contentLoader.loadMarkdown(path)`
3. **Render:** Insert HTML into page
4. **Error handling:** Check if load failed

**Example:**
```javascript
export async function renderCarbonAcxPage() {
  const container = document.getElementById('page-content');

  try {
    const content = await contentLoader.loadMarkdown('/content/apps/carbon-acx.md');
    container.innerHTML = content;
  } catch (error) {
    container.innerHTML = '<p>Failed to load content</p>';
  }
}
```

### Route Registration Pattern

**In `src/routes.js`:**
```javascript
{
  path: '/apps/carbon-acx',
  load: () => import('./pages/apps/index.js').then(m => m.renderCarbonAcxPage)
}
```

**In `src/main.js`:**
```javascript
routes.forEach(route => {
  router.on(route.path, async () => {
    const renderFunction = await route.load();
    renderFunction();
  });
});
```

---

## Module Boundaries

### Clear Separation of Concerns

**Components (`src/components/`):**
- Reusable UI elements
- No route knowledge
- No content loading
- Pure rendering logic

**Pages (`src/pages/`):**
- Page-specific layouts
- Compose components
- Load content
- Handle page-specific interactions

**Utils (`src/utils/`):**
- Shared functionality
- No UI rendering
- No page knowledge
- Stateless helpers

**Data (`src/data/`):**
- Pure data exports
- No business logic
- No dependencies

**Worker (`src/worker.ts`):**
- Server-side only
- No client-side dependencies
- Database and storage access
- Authentication

---

## Shared Utilities

### TemplateHelpers

Used by:
- `MarkdownParser` - HTML escaping
- Templates (Worker) - Date formatting, escaping
- Various components - Text truncation

### Router

Used by:
- `main.js` - Route registration
- Pages - Programmatic navigation (rare)

### ContentLoader

Used by:
- Detail pages (apps, ideas, etc.)
- Any page loading markdown content

---

## Areas of Complexity

### SongData Generation

**Issue:** Two sources of truth (`*.md` and `songs.js`)

**Workflow:**
1. Edit markdown in `src/data/songs/`
2. Run `node scripts/parse-song-lyrics.js`
3. Review generated `songs.js`
4. Commit both markdown and generated file

**Risk:** Forgetting to regenerate after markdown changes

**Potential Improvement:**
- Vite plugin to auto-generate during build
- Or load markdown directly in browser (skip generation)

### Worker Template Rendering

**Issue:** Templates are server-side, but share helpers with client

**Current State:** `TemplateHelpers` duplicated or imported carefully

**Potential Improvement:** Share utilities via build-time bundling

### Component Event Handling

**Issue:** `innerHTML` replacement destroys event listeners

**Current Pattern:** Call `attachEventListeners()` after every render

**Risk:** Memory leaks if listeners not properly cleaned up

**Potential Improvement:**
- Event delegation at app level
- Or use framework with virtual DOM

---

## Testing Considerations

### Unit Testing Components

**Test:**
- `render()` returns expected HTML structure
- Event handlers bound correctly
- Props handled properly

**Example:**
```javascript
test('Card renders with title', () => {
  const card = new Card({ title: 'Test' });
  const html = card.render();
  expect(html).toContain('Test');
});
```

### Integration Testing Pages

**Test:**
- Page modules render without errors
- Content loading works
- Components composed correctly

### E2E Testing

**Test:**
- Full user flows (navigation, theme toggle)
- Blog and admin functionality
- Authentication flows

**Tool:** Playwright or Cypress

---

## Related Documentation

- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - System architecture
- **wireframes/v2-2025-11-18/data-flow.notes.md** - Request/response cycles
- **wireframes/v2-2025-11-18/entry-points.notes.md** - Application initialization
- **CLAUDE.md** - Development conventions
- **docs/clw/CLW006 Four-Theme System Implementation.md** - Theme system details
