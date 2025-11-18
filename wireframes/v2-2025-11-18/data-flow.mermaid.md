%% Data Flow Diagrams - Request/response cycles and state management
%% Shows how data moves through the system

sequenceDiagram
    participant User
    participant Browser
    participant Vite as Vite Dev<br/>(Port 5173)
    participant Worker as Cloudflare<br/>Worker
    participant D1 as D1<br/>Database
    participant R2 as R2<br/>Bucket
    participant Giphy as Giphy<br/>API

    Note over User,Giphy: Flow 1: Initial SPA Page Load (Development)

    User->>Browser: Navigate to https://localhost:5173
    Browser->>Vite: GET /
    Vite->>Browser: Return index.html
    Browser->>Vite: GET /assets/main.js
    Vite->>Browser: Return bundled JS (with HMR)
    Browser->>Vite: GET /assets/style.css
    Vite->>Browser: Return processed CSS
    Browser->>Browser: Execute main.js
    Browser->>Browser: Initialize Router
    Browser->>Browser: Apply saved theme from localStorage
    Browser->>Browser: Render Navigation & Footer
    Browser->>Browser: Match route, lazy load HomePage
    Browser->>Browser: Render HomePage content
    Browser->>User: Display page

    Note over User,Giphy: Flow 2: Client-Side Navigation (SPA Route)

    User->>Browser: Click link to /apps
    Browser->>Browser: Intercept click, prevent default
    Browser->>Browser: Update window.location.hash to #/apps
    Browser->>Browser: Router detects hashchange
    Browser->>Browser: Match route /apps
    Browser->>Browser: Lazy load AppsPage module
    Browser->>Browser: Call renderAppsPage()
    Browser->>Browser: Generate HTML with Card components
    Browser->>Browser: Update #page-content innerHTML
    Browser->>User: Display new page (no reload)

    Note over User,Giphy: Flow 3: Loading Markdown Content

    User->>Browser: Navigate to /apps/carbon-acx
    Browser->>Browser: Router lazy loads AppDetailPages
    Browser->>Browser: Call renderCarbonAcxPage()
    Browser->>Browser: contentLoader.loadMarkdown()
    Browser->>Vite: GET /content/apps/carbon-acx.md
    Vite->>Browser: Return markdown file
    Browser->>Browser: Parse markdown to HTML
    Browser->>Browser: Cache parsed content
    Browser->>Browser: Insert HTML into #page-content
    Browser->>User: Display app detail page

    Note over User,Giphy: Flow 4: Theme Toggle

    User->>Browser: Press \ key or click theme button
    Browser->>Browser: ThemeToggle.toggle()
    Browser->>Browser: Cycle to next theme
    Browser->>Browser: Update localStorage['theme']
    Browser->>Browser: Update <html> class attribute
    Browser->>Browser: CSS custom properties update
    Browser->>User: Theme changes instantly

    Note over User,Giphy: Flow 5: Blog Page Load (Production)

    User->>Browser: Navigate to https://example.com/blog
    Browser->>Worker: GET /blog
    Worker->>D1: SELECT * FROM entries WHERE published = 1
    D1->>Worker: Return entries array
    Worker->>Worker: renderBlog(entries)
    Worker->>Browser: Return full HTML page
    Browser->>User: Display blog entries

    Note over User,Giphy: Flow 6: Admin Login

    User->>Browser: Navigate to /admin
    Browser->>Worker: GET /admin
    Worker->>Worker: isAuthenticated()?
    Worker->>Browser: Return login form (not authenticated)
    User->>Browser: Enter credentials, submit form
    Browser->>Worker: POST /admin/login
    Worker->>Worker: Validate against ADMIN_USERNAME/PASSWORD
    Worker->>Worker: Set session cookie (httpOnly, secure)
    Worker->>Browser: Redirect to /admin
    Browser->>Worker: GET /admin
    Worker->>Worker: isAuthenticated()? (check cookie)
    Worker->>D1: SELECT * FROM entries
    D1->>Worker: Return all entries
    Worker->>Worker: renderAdmin(entries)
    Worker->>Browser: Return admin dashboard HTML
    Browser->>User: Display admin panel

    Note over User,Giphy: Flow 7: Create Blog Entry

    User->>Browser: Fill out entry form in /admin
    User->>Browser: Click "Create Entry"
    Browser->>Worker: POST /admin/entry<br/>{type, content, published}
    Worker->>Worker: Check session cookie
    Worker->>D1: INSERT INTO entries
    D1->>Worker: Return new entry with ID
    Worker->>Browser: Return JSON {entry}
    Browser->>Browser: Update UI with new entry
    Browser->>User: Show success message

    Note over User,Giphy: Flow 8: Upload Image to Blog

    User->>Browser: Select image file in /admin
    User->>Browser: Click "Upload"
    Browser->>Worker: POST /admin/upload<br/>(multipart/form-data)
    Worker->>Worker: Check session cookie
    Worker->>Worker: Generate filename (timestamp + sanitized name)
    Worker->>R2: PUT image-123.jpg
    R2->>Worker: Success
    Worker->>Browser: Return JSON {url: '/images/image-123.jpg'}
    Browser->>Browser: Insert image URL into entry form
    Browser->>User: Show image preview

    Note over User,Giphy: Flow 9: Giphy GIF Search

    User->>Browser: Type search query in /admin GIF search
    User->>Browser: Click "Search"
    Browser->>Worker: GET /admin/giphy?q=cats
    Worker->>Worker: Check session cookie
    Worker->>Giphy: GET /v1/gifs/search?q=cats&api_key=***
    Giphy->>Worker: Return JSON {data: [...]}
    Worker->>Browser: Proxy response to client
    Browser->>Browser: Render GIF grid
    Browser->>User: Display searchable GIFs
    User->>Browser: Click GIF
    Browser->>Browser: Insert GIF URL into entry

    Note over User,Giphy: Flow 10: Serve Image from R2

    User->>Browser: Load blog page with images
    Browser->>Worker: GET /images/image-123.jpg
    Worker->>R2: GET image-123.jpg
    R2->>Worker: Return image stream
    Worker->>Browser: Return image with cache headers
    Browser->>User: Display image

    Note over User,Giphy: Flow 11: Development Proxy (Vite → Worker)

    User->>Browser: Navigate to https://localhost:5173/blog
    Browser->>Vite: GET /blog
    Vite->>Vite: Check proxy config
    Vite->>Worker: Proxy to http://localhost:8787/blog
    Worker->>D1: SELECT * FROM entries WHERE published = 1
    D1->>Worker: Return entries
    Worker->>Vite: Return HTML
    Vite->>Browser: Forward response
    Browser->>User: Display blog page
