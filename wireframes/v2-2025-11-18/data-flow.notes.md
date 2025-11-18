# Data Flow - Detailed Notes

## Overview

This document details how data moves through the chrislyons-website system, covering all major request/response cycles, state management, and execution paths. The dual-server architecture creates distinct flows for development vs. production, and for SPA routes vs. Worker routes.

## Flow 1: Initial SPA Page Load (Development)

### Sequence

1. **User navigates to `http://localhost:5173`**
2. **Browser requests `/`** from Vite dev server
3. **Vite returns `index.html`** with script tags
4. **Browser requests assets:** `/assets/main.js`, `/assets/style.css`
5. **Vite returns processed assets** with source maps
6. **Browser executes `main.js`:**
   - Import dependencies
   - Initialize ThemeToggle (applies saved theme immediately)
   - Initialize Router
   - Initialize Navigation and Footer components
   - Render static components
   - Set up keyboard shortcuts
   - Match initial route (usually `/`)
   - Lazy load HomePage module
   - Execute `renderHomePage()`
   - Display page content
7. **User sees rendered page**

### Key Details

**Vite Dev Server Role:**
- Serves unminified JavaScript with HMR enabled
- Processes CSS through PostCSS and Tailwind JIT
- Source maps for debugging
- Hot Module Replacement for instant updates

**Theme Application:**
- Runs BEFORE page render to prevent flash of incorrect theme
- Reads from `localStorage.getItem('theme')`
- Defaults to 'moonlight' if not set
- Applies class to `<html>` element immediately

**Initial Route Matching:**
- Router checks `window.location.hash`
- If empty, defaults to `/`
- Matches route in `routes.js`
- Dynamically imports page module
- Executes render function

**Performance Considerations:**
- Initial bundle size ~50-100KB (depends on landing page)
- Code splitting means only HomePage code loads initially
- Subsequent pages load on demand

---

## Flow 2: Client-Side Navigation (SPA Route)

### Sequence

1. **User clicks navigation link** (e.g., "Apps")
2. **Browser intercepts click event** (event listener in Navigation component)
3. **Prevent default** (stops full page reload)
4. **Update `window.location.hash`** to `#/apps`
5. **Browser fires `hashchange` event**
6. **Router detects change:**
   - Extract path from hash
   - Match against registered routes
   - Find `/apps` route
7. **Lazy load AppsPage module:**
   - `import('./pages/AppsPage.js')`
   - Returns promise with module
8. **Extract render function** from module
9. **Execute `renderAppsPage()`:**
   - Create PageHeader
   - Create Card components for each app
   - Generate HTML string
   - Update `#page-content` innerHTML
10. **User sees new page** (instant, no reload)

### Key Details

**Event Interception:**
```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#/"]')) {
    e.preventDefault();
    window.location.hash = e.target.getAttribute('href');
  }
});
```

**Hash-Based Routing:**
- URL format: `https://example.com#/apps`
- No server configuration needed
- Works with any hosting
- Browser back/forward supported

**Code Splitting:**
- Each page module is a separate chunk
- Loaded only when needed
- Cached after first load
- Reduces initial bundle size

**State Preservation:**
- `localStorage` persists across navigation
- No global state management (by design)
- Components re-instantiated on each page load

**Performance:**
- Navigation feels instant (no network request)
- Only ~10-30KB loaded per page
- Browser cache helps repeat visits

---

## Flow 3: Loading Markdown Content

### Sequence

1. **User navigates to `/apps/carbon-acx`**
2. **Router lazy loads `AppDetailPages` module**
3. **Execute `renderCarbonAcxPage()`:**
   - Call `contentLoader.loadMarkdown('/content/apps/carbon-acx.md')`
4. **ContentLoader checks cache:**
   - Check if path already loaded
   - If cached, return immediately
5. **If not cached, fetch file:**
   - `fetch('/content/apps/carbon-acx.md')`
   - Vite serves file from `/content` directory
6. **Vite returns markdown file** (raw text)
7. **ContentLoader parses markdown:**
   - `markdownParser.parse(markdownText)`
   - Convert headings, paragraphs, links to HTML
   - Escape HTML to prevent XSS
8. **Cache parsed HTML** in Map object
9. **Return HTML string**
10. **Page inserts HTML** into `#page-content`
11. **User sees rendered content**

### Key Details

**Caching Strategy:**
```javascript
const cache = new Map();

export async function loadMarkdown(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const response = await fetch(path);
  const markdown = await response.text();
  const html = markdownParser.parse(markdown);

  cache.set(path, html);
  return html;
}
```

**Cache Lifetime:**
- In-memory only (not persistent)
- Cleared on page reload
- Grows throughout session
- No eviction policy (small content size)

**Markdown Parsing:**
- Basic implementation (not full CommonMark)
- Headings: `#` → `<h1>`
- Paragraphs: Blank line separated
- Links: `[text](url)` → `<a>`
- No table or image support currently

**Error Handling:**
- 404: Return fallback message
- Network error: Log and return error message
- Parse error: Return raw text

**Performance:**
- First load: ~100-500ms (network + parse)
- Cached: <1ms
- Markdown files: 5-50KB typically

---

## Flow 4: Theme Toggle

### Sequence

1. **User presses `\` key** or clicks theme button
2. **Browser detects keydown event** (global listener in `main.js`)
3. **Check if user is typing** (ignore if in input field)
4. **Call `themeToggle.toggle()`:**
   - Get current theme
   - Cycle to next theme (Moonlight → Daylight → Forest → Beach → Moonlight)
5. **Update `themeToggle.theme` property**
6. **Save to localStorage:**
   - `localStorage.setItem('theme', newTheme)`
7. **Update `<html>` class attribute:**
   - Remove old theme class
   - Add new theme class (e.g., `theme-daylight`)
8. **CSS custom properties update automatically** (Tailwind config)
9. **Re-render theme toggle button** with new icon
10. **User sees theme change instantly**

### Key Details

**Theme Storage:**
```javascript
localStorage.setItem('theme', 'daylight');
```

**Theme Application:**
```javascript
document.documentElement.className = `theme-${theme}`;
```

**CSS Variables:**
```css
.theme-moonlight {
  --color-primary: #1a365d;
  --color-background: #0a192f;
  /* ... */
}

.theme-daylight {
  --color-primary: #2d3748;
  --color-background: #ffffff;
  /* ... */
}
```

**Keyboard Shortcut:**
- Key: `\` (backslash)
- Works globally (except in input fields)
- Prevents default behavior
- Provides quick access without mouse

**Icon Rotation:**
- Moonlight: Moon (🌙)
- Daylight: Sun (☀️)
- Forest: Leaf (🍃)
- Beach: Kite (🪁)

**Performance:**
- Theme switch: <16ms (one frame)
- No layout recalculation (only color changes)
- CSS variables prevent flash

---

## Flow 5: Blog Page Load (Production)

### Sequence

1. **User navigates to `https://example.com/blog`**
2. **Browser sends request** to Cloudflare edge
3. **Cloudflare routes to Worker**
4. **Worker handles `GET /blog`:**
   - Extract query params (`before`, `format`)
   - Check authentication (not required for blog)
5. **Query D1 database:**
   ```sql
   SELECT id, type, content, created_at, metadata
   FROM entries
   WHERE published = 1
   ORDER BY created_at DESC
   LIMIT 20
   ```
6. **D1 returns entries array** (JSON)
7. **Worker renders HTML:**
   - Call `renderBlog(entries)`
   - Generate full HTML page with entries
   - Inject CSS/JS asset URLs from manifest
8. **Worker returns HTML response** with headers
9. **Browser receives and renders page**
10. **User sees blog entries**

### Key Details

**Query Optimization:**
- Index on `published` column
- Index on `created_at DESC`
- Limit 20 entries (pagination)
- `before` param for infinite scroll

**JSON vs. HTML:**
- Default: HTML (full page render)
- `?format=json`: Return JSON array
- JSON used for client-side infinite scroll

**Entry Types:**
- `text`: Paragraph content
- `image`: Image URL + caption
- `gif`: GIF URL
- `quote`: Quote text + author

**Server-Side Rendering:**
- Full HTML generated on Worker
- SEO-friendly (content in HTML)
- Fast Time to First Byte (edge deployment)

**Caching:**
- No caching headers on blog HTML (dynamic content)
- Assets cached with immutable headers

---

## Flow 6: Admin Login

### Sequence

1. **User navigates to `/admin`**
2. **Worker checks authentication:**
   - Read `admin_session` cookie
   - Check if value equals `authenticated`
   - Not authenticated → show login form
3. **Worker returns login form HTML**
4. **User enters credentials:**
   - Username
   - Password
5. **User submits form** (POST)
6. **Browser sends `POST /admin/login`** with form data
7. **Worker extracts credentials:**
   - `username` from form data
   - `password` from form data
8. **Worker validates:**
   - Compare username to `env.ADMIN_USERNAME`
   - Compare password to `env.ADMIN_PASSWORD`
9. **If valid:**
   - Set cookie: `admin_session=authenticated`
   - Cookie flags: `httpOnly`, `secure`, `sameSite: Lax`
   - Max age: 7 days
   - Redirect to `/admin`
10. **Browser follows redirect**
11. **Worker checks authentication** (cookie now present)
12. **Worker queries all entries:**
    ```sql
    SELECT * FROM entries ORDER BY created_at DESC
    ```
13. **Worker renders admin dashboard**
14. **User sees admin panel** with entry management

### Key Details

**Session Cookie:**
```javascript
setCookie(c, 'admin_session', 'authenticated', {
  httpOnly: true,   // Prevents JS access
  secure: true,     // HTTPS only
  sameSite: 'Lax',  // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
});
```

**Security Considerations:**
- **HttpOnly:** Prevents XSS cookie theft
- **Secure:** HTTPS only (production)
- **SameSite:** CSRF protection
- **Simple token:** Single-user system (no session store needed)

**Login Failure:**
- Return login form with error message
- No account lockout (consider adding)
- No rate limiting (consider adding)
- No CAPTCHA (consider for production)

**Logout:**
- `GET /admin/logout`
- Delete cookie
- Redirect to login

**Session Expiration:**
- 7 days from login
- No refresh token
- Manual re-login required

---

## Flow 7: Create Blog Entry

### Sequence

1. **User fills out entry form** in admin dashboard
2. **User clicks "Create Entry"**
3. **Browser JavaScript:**
   - Collect form data (type, content, published, metadata)
   - Convert to JSON
4. **Browser sends `POST /admin/entry`:**
   ```json
   {
     "type": "text",
     "content": {"text": "Hello world", "font": "Inter"},
     "published": true,
     "metadata": {"font": "Inter"}
   }
   ```
5. **Worker checks authentication** (session cookie)
6. **Worker validates data:**
   - Check type is valid (`text`, `image`, `gif`, `quote`)
   - Check content is valid JSON
7. **Worker inserts into D1:**
   ```sql
   INSERT INTO entries (type, content, published, metadata, position_index)
   VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(position_index), 0) + 1 FROM entries))
   ```
8. **D1 returns last inserted row ID**
9. **Worker fetches newly created entry:**
   ```sql
   SELECT * FROM entries WHERE id = ?
   ```
10. **Worker returns JSON:** `{ id: 123, type: 'text', ... }`
11. **Browser updates UI:**
    - Add entry to list
    - Show success message
12. **User sees new entry** in dashboard

### Key Details

**Content Storage:**
- Stored as JSON string in `content` column
- Allows flexible schema per entry type
- Parsed when rendering

**Position Index:**
- Auto-incremented value
- Allows manual reordering
- Not currently exposed in UI

**Metadata:**
- Optional JSON field
- Stores fonts, styles, etc.
- Extensible for future features

**Validation:**
- Type check: Must be one of 4 valid types
- Content: Must be valid JSON
- Published: Boolean (0 or 1 in SQLite)

**Transaction Safety:**
- D1 provides ACID guarantees
- INSERT and SELECT in same request
- No race conditions

---

## Flow 8: Upload Image to Blog

### Sequence

1. **User selects image file** in admin panel
2. **User clicks "Upload"**
3. **Browser creates FormData:**
   ```javascript
   const formData = new FormData();
   formData.append('file', imageFile);
   ```
4. **Browser sends `POST /admin/upload`** (multipart/form-data)
5. **Worker checks authentication**
6. **Worker extracts file:**
   - Get file from `formData.get('file')`
   - Check file exists
7. **Worker generates filename:**
   - Timestamp: `Date.now()`
   - Sanitize original filename (remove special chars)
   - Combine: `${timestamp}-${sanitizedFilename}`
8. **Worker uploads to R2:**
   ```javascript
   await R2.put(filename, file.stream(), {
     httpMetadata: { contentType: file.type }
   });
   ```
9. **R2 stores file** and returns success
10. **Worker returns JSON:**
    ```json
    { "url": "/images/1634567890123-photo.jpg" }
    ```
11. **Browser inserts URL** into entry form
12. **User sees image preview**

### Key Details

**Filename Sanitization:**
```javascript
const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
```

**File Upload Limits:**
- No explicit size limit (R2 supports up to 5GB)
- Consider adding validation (file type, size)
- No virus scanning (consider for production)

**R2 Storage:**
- S3-compatible API
- Global distribution
- No bandwidth charges (within Cloudflare)

**Content Type:**
- Preserved from uploaded file
- Used when serving image
- Important for browser rendering

**Image Serving:**
- URL: `/images/{filename}`
- Served via Worker route
- Cache headers: 1 year immutable

---

## Flow 9: Giphy GIF Search

### Sequence

1. **User types search query** in admin GIF search
2. **User clicks "Search"**
3. **Browser sends `GET /admin/giphy?q=cats`**
4. **Worker checks authentication**
5. **Worker constructs Giphy API request:**
   ```
   https://api.giphy.com/v1/gifs/search?api_key={API_KEY}&q=cats&limit=12&rating=g
   ```
6. **Worker fetches from Giphy:**
   - Uses `GIPHY_API_KEY` from secrets
   - Adds search query from user
   - Limit 12 results
   - G-rated only
7. **Giphy returns JSON:**
   ```json
   {
     "data": [
       {"id": "abc", "images": {...}, "title": "Cat GIF"},
       ...
     ]
   }
   ```
8. **Worker proxies response** to browser
9. **Browser receives GIF data:**
   - Render GIF grid
   - Show thumbnails
   - Allow selection
10. **User clicks GIF**
11. **Browser inserts GIF URL** into entry form

### Key Details

**Proxying Benefits:**
- Hides API key from client
- Prevents client-side abuse
- Allows server-side filtering
- Enables usage tracking

**Rate Limiting:**
- Giphy free tier: 42 requests/hour
- No custom rate limiting (uses Giphy's limits)
- Consider caching popular searches

**Security:**
- API key stored in Cloudflare Secrets
- Never exposed to client
- HTTPS-only requests

**Result Filtering:**
- `rating=g`: G-rated content only
- `limit=12`: 12 results per search
- Could add more filters (stickers, trending, etc.)

---

## Flow 10: Serve Image from R2

### Sequence

1. **User loads blog page** with images
2. **Browser parses HTML:**
   - Find `<img src="/images/image-123.jpg">`
   - Request image
3. **Browser sends `GET /images/image-123.jpg`**
4. **Worker handles asset route:**
   - Extract filename from path
5. **Worker fetches from R2:**
   ```javascript
   const object = await R2.get('image-123.jpg');
   ```
6. **R2 returns object:**
   - Stream body
   - HTTP metadata (content type)
7. **Worker creates response:**
   - Set `Content-Type` from metadata
   - Set `Cache-Control: public, max-age=31536000, immutable`
   - Stream body
8. **Browser receives image** with cache headers
9. **Browser caches image** for 1 year
10. **User sees image**

### Key Details

**Cache Headers:**
```
Cache-Control: public, max-age=31536000, immutable
```

**Immutable:**
- Tells browser file never changes
- Safe to cache indefinitely
- Filename includes timestamp for versioning

**Content-Type Detection:**
- Stored in R2 metadata during upload
- Used when serving
- Examples: `image/jpeg`, `image/png`, `image/gif`

**Error Handling:**
- 404 if file not found
- Returns `c.notFound()`

**Performance:**
- R2 has Cloudflare CDN built-in
- Low latency globally
- No bandwidth charges

---

## Flow 11: Development Proxy (Vite → Worker)

### Sequence

1. **User navigates to `http://localhost:5173/blog`**
2. **Browser sends request** to Vite dev server
3. **Vite checks proxy configuration:**
   - Match `/blog` in proxy config
   - Target: `http://localhost:8787`
4. **Vite checks if Worker is running:**
   - Attempt connection to port 8787
5. **If Worker running:**
   - Proxy request to `http://localhost:8787/blog`
   - Worker queries D1
   - Worker returns HTML
   - Vite forwards response to browser
6. **If Worker NOT running:**
   - Vite proxy error handler triggers
   - Return development message with instructions
   - Message: "Run `npm run dev:worker` to test this route"
7. **User sees either:**
   - Blog page (Worker running)
   - Development message (Worker not running)

### Key Details

**Vite Proxy Config:**
```javascript
server: {
  proxy: {
    '/blog': {
      target: 'http://localhost:8787',
      changeOrigin: true,
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          // Return development message
        });
      },
    },
  },
}
```

**Development Workflow:**

**Option 1: SPA only (`npm run dev`):**
- Vite runs, Worker doesn't
- `/blog` shows development message
- Fast for UI work

**Option 2: Full stack (`npm run dev:all`):**
- Both servers run
- Proxy forwards to Worker
- Full functionality testing

**Error Handling:**
- Connection refused: Worker not running
- Show helpful development message
- Provide instructions to start Worker

**Benefits:**
- Single URL in development (`localhost:5173`)
- No CORS issues
- Mimics production routing

---

## State Management

### Client-Side State

**LocalStorage:**
- Theme preference
- No other persistent state currently

**In-Memory State:**
- ContentLoader cache (Map object)
- Router current route
- Component instances

**No Global State Management:**
- No Redux, Vuex, etc.
- Components re-instantiated on navigation
- Simple, but limits advanced features

### Server-Side State

**Database (D1):**
- Blog entries (persistent)
- Canvas entries (persistent)

**R2 Bucket:**
- Uploaded images (persistent)

**Secrets:**
- Admin credentials (persistent)
- API keys (persistent)

**No Session Store:**
- Cookie-based authentication
- No server-side session storage
- Single-user system

---

## Data Transformations

### Markdown → HTML

**Input:** Raw markdown string
**Process:** `markdownParser.parse()`
**Output:** HTML string

**Transformations:**
- `# Heading` → `<h1>Heading</h1>`
- Paragraph → `<p>Text</p>`
- `[Link](url)` → `<a href="url">Link</a>`
- `**Bold**` → `<strong>Bold</strong>`

### Database Entry → Rendered HTML

**Input:** Database row (SQLite)
**Process:** Template rendering
**Output:** HTML element

**Transformations:**
```javascript
// Database
{
  id: 1,
  type: 'text',
  content: '{"text":"Hello","font":"Inter"}',
  created_at: '2025-11-18T12:00:00Z'
}

// Rendered
<div class="entry" id="entry-1">
  <p style="font-family: Inter">Hello</p>
  <time>November 18, 2025</time>
</div>
```

### Song Markdown → Songs.js

**Input:** `src/data/songs/myth.md`
```markdown
# Myth

C. Lyons

Help me to name it
Help me to name it

Does it feel good?
Does it feel right?
```

**Process:** `scripts/parse-song-lyrics.js`

**Output:** `src/data/songs.js`
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

---

## Event Flows

### Theme Toggle Event

**Trigger:** Keydown `\` or click theme button
**Flow:** User → Browser → ThemeToggle → LocalStorage → CSS
**Side Effects:** UI update, localStorage write

### Navigation Event

**Trigger:** Click link or browser back/forward
**Flow:** User → Browser → Router → Page Module → DOM
**Side Effects:** URL hash change, page content update

### Form Submission Event

**Trigger:** Click submit button
**Flow:** User → Browser → Worker → D1 → Browser → DOM
**Side Effects:** Database insert, UI update

### Image Upload Event

**Trigger:** File selection + upload button
**Flow:** User → Browser → Worker → R2 → Browser → DOM
**Side Effects:** R2 object creation, form update with URL

---

## Performance Characteristics

### Client-Side Performance

**Initial Load:**
- HTML: <5KB
- JavaScript: 50-100KB (initial bundle)
- CSS: 20-40KB (Tailwind processed)
- **Total:** ~100-150KB (uncompressed)

**Navigation:**
- Lazy load module: 10-30KB per page
- Cached after first load
- **Perceived:** Instant (<50ms)

**Content Loading:**
- Markdown fetch: 100-500ms (first time)
- Cached: <1ms
- Parse: <10ms

### Server-Side Performance

**Worker Execution:**
- Cold start: <1ms (V8 isolates)
- Execution time: 5-50ms (typical)
- Database query: 5-20ms
- R2 fetch: 10-50ms

**Blog Page Load:**
- Worker execution: ~20ms
- D1 query: ~10ms
- HTML generation: ~5ms
- **Total Time to First Byte:** ~50-100ms

**Image Serving:**
- R2 fetch: ~20ms
- Stream: <1ms setup
- **Total:** ~50ms (edge deployed)

---

## Error Handling Patterns

### Client-Side Errors

**Content Load Failure:**
- Return fallback message
- Log error to console
- Don't throw exception

**Route Not Found:**
- Render 404 page
- Provide navigation options

**Theme Error:**
- Default to Moonlight theme
- Log error

### Server-Side Errors

**Database Error:**
- Return 500 status
- Log error details
- Don't expose SQL to client

**Authentication Failure:**
- Return 401 status
- Redirect to login

**R2 Error:**
- Return 404 for missing files
- Return 500 for R2 service errors

---

## Security Data Flows

### Authentication Flow

**Login:**
1. User submits credentials
2. Worker validates against secrets
3. Set httpOnly cookie
4. Redirect

**Authenticated Request:**
1. Browser sends cookie
2. Worker checks cookie value
3. Allow or deny

### XSS Prevention

**User Content:**
- Escape HTML in markdown parser
- Use `textContent` instead of `innerHTML` where possible
- Sanitize blog entry content

**SQL Injection Prevention:**
- Use prepared statements with parameter binding
- Never concatenate user input into SQL

---

## Related Documentation

- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - System architecture
- **wireframes/v2-2025-11-18/component-map.notes.md** - Component details
- **wireframes/v2-2025-11-18/entry-points.notes.md** - Application initialization
- **wireframes/v2-2025-11-18/database-schema.notes.md** - Database structure
- **CLAUDE.md** - Development conventions
