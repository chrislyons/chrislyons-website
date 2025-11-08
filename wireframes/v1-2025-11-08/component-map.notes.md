# Component Map - Notes

## Module Organization

The component architecture follows a **layered approach** with clear separation between:
1. **Application Core** (main.js)
2. **UI Components** (components/)
3. **Utilities** (utils/)
4. **Data** (data/)
5. **Worker** (worker.ts)
6. **Build Scripts** (scripts/)

## Component Boundaries

### Application Core (main.js)

**Responsibilities**:
- Initialize router and static components (Navigation, Footer, ThemeToggle)
- Define all route handlers for SPA pages
- Coordinate between router, components, and content loader
- Set up global keyboard shortcuts (\ for theme toggle)
- Manage page rendering lifecycle

**Dependencies**:
- All UI components
- Router utility
- ContentLoader utility
- Songs data

**Public API**:
- `init()` - Bootstrap application
- Route handlers (private functions, called by router)

**Key Patterns**:
- Central orchestrator pattern
- Route handlers render into `#page-content` div
- Static components (nav, footer) rendered once on init
- Dynamic content rendered per route

**Concerns**:
- **Technical Debt**: File is very large (36,659 tokens)
- Contains all route handlers inline
- Could be split into route modules

### Router (utils/router.js)

**Responsibilities**:
- Client-side routing with History API
- Link click interception (except /blog, /admin)
- Route matching (exact and parameterized)
- Browser back/forward handling
- Accessibility announcements

**Dependencies**:
- None (standalone utility)

**Public API**:
- `on(path, handler)` - Register route
- `notFound(handler)` - Register 404 handler
- `navigate(path, pushState=true)` - Navigate programmatically
- `init()` - Initialize router
- `getCurrentRoute()` - Get current path

**Internal State**:
- `routes`: Map of path → handler
- `currentRoute`: Current path
- `notFoundHandler`: 404 handler function

**Key Patterns**:
- Observer pattern (popstate listener)
- Strategy pattern (route handlers)
- Singleton (default export is instance)

**Route Matching**:
- Exact match first: `/apps` matches `/apps` exactly
- Parameterized second: `/blog/:slug` matches `/blog/my-post`
- Parameters extracted and passed to handler

### Navigation Component

**Location**: `src/components/Navigation.js`

**Responsibilities**:
- Render main navigation bar
- Mobile menu toggle
- Active route highlighting
- Embed theme toggle

**State**:
- `mobileMenuOpen`: Boolean for mobile menu visibility

**Public API**:
- `render()` - Returns HTML string
- `attachEventListeners()` - Adds click handlers
- `toggleMobileMenu()` - Open/close mobile menu
- `closeMobileMenu()` - Force close mobile menu

**DOM Structure**:
```html
<nav>
  <div class="desktop-nav">
    <a href="/">Home</a>
    <a href="/apps">Apps</a>
    <!-- ... -->
    <div id="theme-toggle-container"></div>
  </div>
  <div class="mobile-nav">
    <button id="mobile-menu-toggle">☰</button>
  </div>
</nav>
```

**Dependencies**:
- ThemeToggle (embedded via container div)

**Key Patterns**:
- Component pattern (render/attach)
- Responsive design (desktop/mobile variants)
- Event delegation for link clicks

### Footer Component

**Location**: `src/components/Footer.js`

**Responsibilities**:
- Render site footer
- Social links
- Copyright notice

**State**: None (stateless)

**Public API**:
- `render()` - Returns HTML string

**Dependencies**: None

**Key Patterns**:
- Stateless functional component
- Simplest possible component

### ThemeToggle Component

**Location**: `src/components/ThemeToggle.js`

**Responsibilities**:
- Manage four-theme system (Moonlight, Daylight, Forest, Beach)
- Persist theme preference to localStorage
- Apply CSS classes to document root
- Cycle through themes on click
- Keyboard shortcut integration (\ key)

**State**:
- `theme`: Current theme name (string)
- `themes`: Array of theme names

**Public API**:
- `constructor()` - Initialize from localStorage or default
- `render()` - Returns HTML button with theme icon
- `attachEventListeners()` - Add click handler
- `toggle()` - Cycle to next theme
- `setTheme(theme)` - Set specific theme
- `applyTheme(theme)` - Update DOM classes

**Internal Methods**:
- `getNextTheme()` - Calculate next theme in cycle
- `getIcon(theme)` - Return icon for theme (Moon, Sun, Leaf, Kite)

**localStorage Key**: `theme`

**CSS Classes Applied**:
- Removes all theme classes
- Adds current theme class (e.g., `theme-moonlight`)

**Key Patterns**:
- State persistence (localStorage)
- Cyclic state machine (theme rotation)
- Immediately invoked on construction (apply saved theme)

**Related Documentation**:
- `docs/clw/CLW006 Four-Theme System Implementation.md`

### Card Component

**Location**: `src/components/Card.js`

**Responsibilities**:
- Render card UI for projects/apps/ideas
- Display title, description, link

**Props**:
- `title`: Card heading
- `description`: Card body text
- `link`: Destination URL

**Public API**:
- `constructor(props)` - Store props
- `render()` - Returns HTML string

**Dependencies**: None

**Key Patterns**:
- Pure presentation component
- Props-based rendering
- No internal state

**Usage**:
```javascript
const card = new Card({
  title: 'My Project',
  description: 'A cool project',
  link: '/projects/my-project'
});
document.getElementById('container').innerHTML = card.render();
```

### CollapsibleSection Component

**Location**: `src/components/CollapsibleSection.js`

**Responsibilities**:
- Render expandable/collapsible content sections
- Toggle open/close state
- Accessibility (aria attributes)

**Props**:
- `title`: Section heading
- `content`: Section body (HTML)
- `isOpen`: Initial state (default: false)
- `id`: Unique identifier

**State**:
- `isOpen`: Boolean for expanded state

**Public API**:
- `constructor(props)` - Store props and state
- `render()` - Returns HTML string
- `attachEventListeners()` - Add toggle handler
- `toggle()` - Switch open/close state

**DOM Structure**:
```html
<div class="collapsible-section">
  <button aria-expanded="true|false">
    <span>Title</span>
    <span>▼</span>
  </button>
  <div class="collapsible-content">
    <!-- content -->
  </div>
</div>
```

**Key Patterns**:
- Stateful component
- Progressive disclosure
- Accessibility (ARIA attributes)

### TableResponsive Component

**Location**: `src/components/TableResponsive.js`

**Responsibilities**:
- Render responsive tables
- Adapt layout for mobile (stacked view)

**Props**:
- `headers`: Array of column headers
- `rows`: Array of row data (arrays)

**Public API**:
- `constructor(data)` - Store table data
- `render()` - Returns HTML string

**Dependencies**: None

**Key Patterns**:
- Responsive design (CSS-based)
- Data-driven rendering

**Usage**:
```javascript
const table = new TableResponsive({
  headers: ['Name', 'Email', 'Role'],
  rows: [
    ['Alice', 'alice@example.com', 'Admin'],
    ['Bob', 'bob@example.com', 'User']
  ]
});
```

### PageHeader Component

**Location**: `src/components/PageHeader.js`

**Responsibilities**:
- Render consistent page headers
- Display title and optional subtitle

**Props**:
- `title`: Page heading
- `subtitle`: Optional subheading

**Public API**:
- `constructor(props)` - Store props
- `render()` - Returns HTML string

**Dependencies**: None

**Key Patterns**:
- Pure presentation component
- Consistent styling across pages

### SongAccordion Component

**Location**: `src/components/SongAccordion.js`

**Responsibilities**:
- Render expandable song lyrics
- Show/hide lyrics on click
- Only one song open at a time

**Props**:
- `songs`: Array of {title, lyrics} objects

**State**:
- `openSongId`: Currently expanded song (or null)

**Public API**:
- `constructor(songs)` - Store songs data
- `render()` - Returns HTML string
- `attachEventListeners()` - Add toggle handlers
- `toggle(songId)` - Expand/collapse specific song

**DOM Structure**:
```html
<div class="song-accordion">
  <div class="song-card" data-song-id="0">
    <button>Song Title</button>
    <div class="song-lyrics">
      <!-- HTML lyrics -->
    </div>
  </div>
</div>
```

**Key Patterns**:
- Accordion pattern (one open at a time)
- Data-driven rendering
- Event delegation

**Data Source**:
- `src/data/songs.js` (imported in main.js)

### ContentLoader Utility

**Location**: `src/utils/contentLoader.js`

**Responsibilities**:
- Load site-wide data (content.json)
- Load page-specific data (markdown files)
- Update document title and meta tags
- Provide consistent content API

**Public API**:
- `getSiteData()` - Returns site config object
- `getPageData(pageName)` - Returns page content object
- `updateDocumentTitle(title)` - Set page title
- `updateMetaDescription(desc)` - Set meta description
- `loadMarkdown(path)` - Fetch and parse markdown

**Internal State**:
- Cached content data

**Key Patterns**:
- Facade pattern (simplifies content access)
- Singleton (likely default export)

**Usage in Route Handlers**:
```javascript
function renderHomePage() {
  const pageData = contentLoader.getPageData('home');
  contentLoader.updateDocumentTitle('');
  // ... render page
}
```

### Worker (worker.ts)

**Location**: `src/worker.ts`

**Framework**: Hono

**Responsibilities**:
- Handle all server-side routes
- Authenticate admin users
- CRUD operations for blog entries
- Serve SPA index.html for unmatched routes
- Serve static assets via ASSETS binding

**Route Map**:
- `GET /blog` - List blog entries
- `GET /blog/entry/:id` - Redirect to blog with anchor
- `GET /rss.xml` - RSS feed
- `GET /admin` - Admin dashboard (protected)
- `POST /admin/login` - Authenticate
- `GET /admin/logout` - Clear session
- `POST /admin/entry` - Create entry (protected)
- `GET /admin/entry/:id` - Get entry (protected)
- `PUT /admin/entry/:id` - Update entry (protected)
- `DELETE /admin/entry/:id` - Delete entry (protected)
- `POST /admin/upload` - Upload image to R2 (protected)
- `GET /images/:filename` - Serve image from R2
- `GET /admin/create` - Canvas creator (protected)
- `POST /admin/canvas` - Save canvas (protected)
- `GET /admin/canvas/:id` - Get canvas (protected)
- `GET /admin/giphy` - Search Giphy (protected)
- `GET *` - SPA fallback or static assets

**Authentication**:
- Cookie-based session management
- `isAuthenticated(c)` middleware
- HTTP-only cookies, 7-day expiration

**Dependencies**:
- Hono framework
- D1 database binding
- R2 bucket binding
- GIPHY_API_KEY secret
- ASSETS binding

**Key Patterns**:
- RESTful API design
- Middleware pattern (authentication)
- Template rendering (HTML responses)
- JSON API (for AJAX requests)

**Related Files**:
- `src/templates.ts` - HTML templates for blog/admin
- `public/admin.js` - Admin dashboard client code
- `public/canvas-creator.js` - Canvas creator client code

### Admin Client (admin.js)

**Location**: `public/admin.js`

**Environment**: Browser (loaded via script tag)

**Responsibilities**:
- Admin dashboard interactivity
- CRUD operations via fetch API
- Entry editor (text, image, gif, quote)
- Image upload
- Giphy search
- Publish/unpublish entries

**Key Functions** (likely):
- `initEditor()` - Set up editor UI
- `createEntry(type)` - POST to /admin/entry
- `updateEntry(id)` - PUT to /admin/entry/:id
- `deleteEntry(id)` - DELETE to /admin/entry/:id
- `uploadImage(file)` - POST to /admin/upload
- `searchGiphy(query)` - GET /admin/giphy
- `publishEntry(id)` - Update published flag

**Dependencies**:
- Worker API endpoints
- Browser Fetch API

**Key Patterns**:
- AJAX-driven interactivity
- Form submission handling
- Dynamic UI updates

### Canvas Creator (canvas-creator.js)

**Location**: `public/canvas-creator.js`

**Environment**: Browser (loaded via script tag)

**Responsibilities**:
- Instagram Stories-style canvas editor
- Add/remove/position elements
- Text, image, GIF, sticker elements
- Rotation and z-index control
- Background customization
- Export to database

**Key Functions** (likely):
- `initCanvas()` - Set up canvas editor
- `addElement(type)` - Add text/image/gif/sticker
- `updateElement(id, props)` - Change position/rotation/size
- `deleteElement(id)` - Remove element
- `setBackground(bg)` - Change canvas background
- `saveCanvas()` - POST to /admin/canvas
- `exportCanvas()` - Generate JSON representation

**Canvas State**:
- Background config (color/gradient/image)
- Dimensions (width, height)
- Elements array (positioned content)

**Dependencies**:
- Worker API endpoints
- Canvas/DOM manipulation

**Key Patterns**:
- Interactive canvas editor
- Drag-and-drop (likely)
- JSON serialization

### SongsData Module

**Location**: `src/data/songs.js`

**Type**: Static data module

**Exports**:
- `songs`: Array of {title, lyrics} objects

**Generated By**: `scripts/parse-song-lyrics.js`

**Source Files**: `src/data/songs/*.md`

**Format**:
```javascript
export const songs = [
  {
    title: 'Song Title',
    lyrics: '<p>Verse 1<br/>Line 2</p><p>Verse 2<br/>Line 2</p>'
  }
];
```

**Usage**:
- Imported in main.js
- Passed to SongAccordion component

**Regeneration**:
```bash
node scripts/parse-song-lyrics.js
```

### Parse Song Lyrics Script

**Location**: `scripts/parse-song-lyrics.js`

**Type**: Build script (run manually)

**Responsibilities**:
- Read markdown files from src/data/songs/
- Parse markdown format (title, author, verses)
- Convert verses to HTML (paragraphs with line breaks)
- Generate src/data/songs.js

**Input Format** (markdown):
```
# Song Title

C. Lyons

Verse one line one
Verse one line two

Verse two line one
Verse two line two
```

**Output Format** (JavaScript):
```javascript
export const songs = [
  {
    title: 'Song Title',
    lyrics: '<p>Verse one line one<br/>Verse one line two</p>...'
  }
];
```

**Workflow**:
1. Edit markdown files
2. Run script
3. Commit both markdown and generated songs.js

### Generate Asset Manifest Script

**Location**: `scripts/generate-asset-manifest.js`

**Type**: Build script (run automatically after Vite build)

**Responsibilities**:
- Find hashed JS and CSS files in dist/
- Create asset-manifest.json with paths
- Used by worker to inline asset paths

**Output**:
```json
{
  "js": "/assets/main.abc123.js",
  "css": "/assets/style.xyz789.css"
}
```

**Workflow**:
1. Vite builds and hashes assets
2. Script extracts paths
3. Worker imports manifest
4. Worker inlines paths into index.html template

**Why Needed?**
- Asset filenames are hashed for cache busting
- Worker needs to know current filenames
- Manifest bridges build output to runtime

## Component Dependencies

### Dependency Graph

```
Main (entry point)
├── Router (routing)
├── Navigation (layout)
│   └── ThemeToggle (embedded)
├── Footer (layout)
├── ThemeToggle (global instance)
├── ContentLoader (data)
├── SongsData (static data)
└── UI Components
    ├── Card
    ├── CollapsibleSection
    ├── TableResponsive
    ├── PageHeader
    └── SongAccordion
        └── SongsData (data source)

Worker (separate runtime)
├── Database (D1)
├── AdminClient (served)
└── CanvasCreator (served)

Build Scripts (offline)
├── ParseSongLyrics → SongsData
└── GenerateAssetManifest → Worker
```

### Shared Dependencies

**None!** Components are deliberately decoupled:
- No shared state
- No component-to-component imports
- All coordinated through main.js

**Benefits**:
- Easy to test in isolation
- Easy to refactor
- No circular dependencies
- Simple mental model

**Trade-offs**:
- More coordination code in main.js
- Some duplication (e.g., render pattern)

## Module Boundaries

### Clear Boundaries

1. **Client vs. Worker**: Zero shared code (different runtimes)
2. **Components vs. Utils**: Components render UI, utils provide services
3. **Static vs. Dynamic**: SPA components separate from worker templates
4. **Build vs. Runtime**: Scripts run offline, don't pollute runtime

### Unclear Boundaries (Technical Debt)

1. **Main.js Scope**: Does too much (routing, rendering, coordination)
2. **Admin Files**: admin.js and canvas-creator.js in public/ instead of src/
3. **Worker Templates**: Should templates be separate from worker logic?

## Public APIs

### Component API Pattern

All components follow this contract:
```javascript
class Component {
  constructor(props) { }  // Initialize with props
  render() { return '' }  // Return HTML string
  attachEventListeners() { } // Optional: add interactivity
}
```

**Why This Pattern?**
- Predictable interface
- Easy to understand
- Vanilla JS friendly
- No framework lock-in

### Utility API Pattern

Utilities export named functions or singleton instances:
```javascript
export class Utility {
  method() { }
}

export default new Utility(); // Singleton
```

## Where to Make Changes

### Adding a New Component

1. Create `src/components/ComponentName.js`
2. Follow component pattern (constructor, render, attachEventListeners)
3. Export class
4. Import in main.js
5. Use in route handlers

### Modifying a Component

1. Update render() method for UI changes
2. Update attachEventListeners() for behavior changes
3. Update constructor for new props/state

### Adding Worker Functionality

1. Add route handler in src/worker.ts
2. Add authentication check if needed
3. Add database queries if needed
4. Return HTML or JSON response

### Changing Data Sources

**Static Content**:
- Edit files in content/ directory
- No build step needed

**Song Lyrics**:
- Edit src/data/songs/*.md
- Run `node scripts/parse-song-lyrics.js`
- Commit both markdown and generated songs.js

**Blog Content**:
- Use /admin interface
- Or manipulate D1 database directly

## Related Diagrams

- [repo-structure.mermaid.md](repo-structure.mermaid.md) - Directory layout
- [architecture-overview.mermaid.md](architecture-overview.mermaid.md) - System design
- [data-flow.mermaid.md](data-flow.mermaid.md) - How data moves
- [entry-points.mermaid.md](entry-points.mermaid.md) - Initialization
- [database-schema.mermaid.md](database-schema.mermaid.md) - Database structure
