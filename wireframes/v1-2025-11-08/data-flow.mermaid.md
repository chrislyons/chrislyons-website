%% Data Flow - Chris Lyons Website
%% Generated: 2025-11-08
%% Request/response cycles, state management, and data transformations

sequenceDiagram
    participant User
    participant Browser
    participant Router
    participant Main
    participant ContentLoader
    participant Component
    participant ViteProxy
    participant Worker
    participant D1
    participant R2

    Note over User,R2: Flow 1: SPA Page Load (Static Content)

    User->>Browser: Navigate to /apps
    Browser->>Router: Click intercepted
    Router->>Router: Check route map
    Router->>Main: Call renderAppsPage()
    Main->>ContentLoader: getPageData('apps')
    ContentLoader->>ContentLoader: Load content.json
    ContentLoader-->>Main: Return page data
    Main->>Component: Instantiate Card components
    Component-->>Main: Return HTML
    Main->>Browser: innerHTML = rendered HTML
    Main->>Component: attachEventListeners()
    Component->>Browser: Add event handlers
    Router->>Browser: history.pushState('/apps')
    Router->>Browser: window.scrollTo(0, 0)
    Browser-->>User: Display page

    Note over User,R2: Flow 2: Blog Page Load (Dynamic Content)

    User->>Browser: Navigate to /blog
    Browser->>ViteProxy: Full page request
    alt Development Mode
        ViteProxy->>Worker: Proxy to localhost:8787
    else Production Mode
        Browser->>Worker: Direct request
    end
    Worker->>Worker: Route: GET /blog
    Worker->>D1: SELECT * FROM entries WHERE published=1
    D1-->>Worker: Return rows
    Worker->>Worker: renderBlog(entries)
    Worker-->>Browser: HTML response
    Browser-->>User: Display blog

    Note over User,R2: Flow 3: Admin Authentication

    User->>Browser: Navigate to /admin
    Browser->>Worker: GET /admin
    Worker->>Worker: isAuthenticated()?
    alt Not Authenticated
        Worker->>Worker: renderAdminLogin(null)
        Worker-->>Browser: Login page HTML
        Browser-->>User: Show login form
        User->>Browser: Submit credentials
        Browser->>Worker: POST /admin/login
        Worker->>Worker: Validate credentials
        alt Valid Credentials
            Worker->>Browser: Set HTTP-only cookie
            Worker->>Browser: Redirect to /admin
        else Invalid Credentials
            Worker->>Worker: renderAdminLogin('error')
            Worker-->>Browser: Login page with error
        end
    else Authenticated
        Worker->>D1: SELECT * FROM entries
        D1-->>Worker: Return all entries
        Worker->>Worker: renderAdmin(entries)
        Worker-->>Browser: Admin dashboard HTML
        Browser-->>User: Show admin interface
    end

    Note over User,R2: Flow 4: Create Blog Entry

    User->>Browser: Click "Create Entry" in /admin
    Browser->>Browser: admin.js: createEntry('text')
    Browser->>Worker: POST /admin/entry {type, content, published}
    Worker->>Worker: isAuthenticated()?
    alt Authenticated
        Worker->>D1: INSERT INTO entries (...)
        D1-->>Worker: Return entry ID
        Worker->>D1: SELECT * FROM entries WHERE id=?
        D1-->>Worker: Return new entry
        Worker-->>Browser: JSON response {entry}
        Browser->>Browser: Update UI with new entry
        Browser-->>User: Show success message
    else Not Authenticated
        Worker-->>Browser: 401 Unauthorized
        Browser-->>User: Show error
    end

    Note over User,R2: Flow 5: Theme Toggle

    User->>Browser: Click theme toggle (or press \)
    Browser->>Component: ThemeToggle.toggle()
    Component->>Component: getNextTheme()
    Component->>Component: setTheme(newTheme)
    Component->>Component: applyTheme(newTheme)
    Component->>Browser: document.documentElement.className = theme
    Component->>Browser: localStorage.setItem('theme', theme)
    Component->>Main: Re-render theme toggle button
    Main->>Component: ThemeToggle.render()
    Component-->>Main: Return new HTML
    Main->>Browser: innerHTML = new button HTML
    Main->>Component: attachEventListeners()
    Browser-->>User: Display new theme

    Note over User,R2: Flow 6: Upload Image (R2)

    User->>Browser: Upload image in /admin
    Browser->>Browser: admin.js: uploadImage(file)
    Browser->>Worker: POST /admin/upload FormData{file}
    Worker->>Worker: isAuthenticated()?
    Worker->>Worker: Generate filename with timestamp
    Worker->>R2: PUT object (filename, file.stream())
    R2-->>Worker: Success
    Worker-->>Browser: JSON {url: '/images/filename'}
    Browser->>Browser: Insert image URL into editor
    Browser-->>User: Show image preview

    Note over User,R2: Flow 7: Song Lyrics Display

    User->>Browser: Navigate to /sounds/lyrics
    Browser->>Router: Click intercepted
    Router->>Main: Call renderLyricsPage()
    Main->>Main: Import songs from data/songs.js
    Main->>Component: new SongAccordion(songs)
    Component-->>Main: Return HTML
    Main->>Browser: innerHTML = rendered HTML
    Main->>Component: attachEventListeners()
    Component->>Browser: Add click handlers
    Browser-->>User: Display song list
    User->>Browser: Click song title
    Browser->>Component: SongAccordion.toggle(songId)
    Component->>Component: Update openSongId state
    Component->>Browser: Toggle CSS classes
    Browser-->>User: Expand/collapse lyrics

    Note over User,R2: Flow 8: RSS Feed Generation

    User->>Browser: Navigate to /rss.xml
    Browser->>Worker: GET /rss.xml
    Worker->>D1: SELECT * FROM entries WHERE published=1 LIMIT 50
    D1-->>Worker: Return entries
    Worker->>Worker: Generate RSS XML
    Worker-->>Browser: XML response (Content-Type: application/rss+xml)
    Browser-->>User: RSS feed (or browser RSS reader)

    Note over User,R2: Flow 9: Canvas Creator

    User->>Browser: Navigate to /admin/create
    Browser->>Worker: GET /admin/create
    Worker->>Worker: isAuthenticated()?
    Worker->>Worker: renderCanvasCreator()
    Worker-->>Browser: Canvas editor HTML
    Browser-->>User: Show canvas editor
    User->>Browser: Add elements, set background
    Browser->>Browser: canvas-creator.js: updateElement()
    Browser->>Browser: Update canvas preview
    User->>Browser: Click "Save Canvas"
    Browser->>Worker: POST /admin/canvas {title, background, dimensions, elements}
    Worker->>D1: INSERT INTO canvases (...)
    D1-->>Worker: Return canvas ID
    Worker->>D1: SELECT * FROM canvases WHERE id=?
    D1-->>Worker: Return new canvas
    Worker-->>Browser: JSON response {canvas}
    Browser-->>User: Show success message
