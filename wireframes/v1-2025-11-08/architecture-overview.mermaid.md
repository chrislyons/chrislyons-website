%% Architecture Overview - Chris Lyons Website
%% Generated: 2025-11-08
%% High-level system design showing dual-server architecture and core components

graph TB
    subgraph Browser["Browser Environment"]
        USER["User"]
        SPA["SPA Application<br/>(Vanilla JS)"]
    end

    subgraph ViteServer["Vite Dev Server<br/>(Port 5173)"]
        VITE_PROXY["Proxy Middleware"]
        VITE_SERVE["Static Asset Server"]
        VITE_SPA["SPA Route Handler"]
    end

    subgraph WorkerServer["Cloudflare Worker<br/>(Port 8787 dev / Edge production)"]
        HONO["Hono Framework<br/>(Router)"]

        subgraph WorkerRoutes["Dynamic Routes"]
            BLOG_ROUTE["/blog<br/>(Public)"]
            ADMIN_ROUTE["/admin<br/>(Protected)"]
            RSS_ROUTE["/rss.xml"]
            API_ROUTES["/admin/entry/*<br/>/admin/canvas/*<br/>/images/*"]
        end

        subgraph WorkerAuth["Authentication"]
            AUTH_CHECK["Cookie-based Auth"]
            SESSION["Session Management"]
        end

        WORKER_ASSETS["ASSETS Binding<br/>(Production)"]
        WORKER_FALLBACK["SPA Fallback<br/>(Serves index.html)"]
    end

    subgraph Database["Cloudflare D1<br/>(SQLite)"]
        ENTRIES_TABLE["entries table<br/>(Blog posts)"]
        CANVASES_TABLE["canvases table<br/>(Visual canvas)"]
    end

    subgraph Storage["Cloudflare R2<br/>(Object Storage)"]
        IMAGES["Blog Images<br/>(Disabled in config)"]
    end

    subgraph ClientLayers["Client-Side Layers"]
        subgraph Routing["Routing Layer"]
            ROUTER["Router.js<br/>(History API)"]
            LINK_INTERCEPT["Link Interceptor"]
        end

        subgraph ComponentLayer["Component Layer"]
            NAV_COMP["Navigation"]
            FOOTER_COMP["Footer"]
            THEME_COMP["ThemeToggle"]
            CONTENT_COMP["Content Components"]
        end

        subgraph DataLayer["Data Layer"]
            CONTENT_LOADER["contentLoader.js"]
            STATIC_CONTENT["content/*.md<br/>content/*.json"]
            SONGS_DATA["songs.js"]
        end

        subgraph StateLayer["State Management"]
            THEME_STATE["Theme Preference<br/>(localStorage)"]
            NAV_STATE["Navigation State"]
        end
    end

    subgraph BuildProcess["Build System"]
        VITE_BUILD["Vite Build"]
        MANIFEST_GEN["Asset Manifest<br/>Generator"]
        DIST["dist/<br/>(Build Output)"]
    end

    subgraph ExternalServices["External Services"]
        GIPHY["Giphy API<br/>(GIF search)"]
    end

    %% User interactions
    USER -->|Requests| SPA
    SPA -->|Client-side routing| ROUTER
    SPA -->|Renders| ComponentLayer

    %% Development flow
    SPA -->|Dev mode<br/>SPA routes| VITE_SERVER
    SPA -->|Dev mode<br/>/blog, /admin| VITE_PROXY
    VITE_PROXY -->|Proxies to<br/>localhost:8787| HONO
    VITE_SPA -->|Serves| VITE_SERVE

    %% Production flow
    SPA -->|Production<br/>All routes| HONO
    HONO -->|Dynamic routes| WorkerRoutes
    HONO -->|SPA routes| WORKER_FALLBACK
    WORKER_FALLBACK -->|Fetches| WORKER_ASSETS

    %% Worker routes
    BLOG_ROUTE -->|Queries| ENTRIES_TABLE
    ADMIN_ROUTE -->|Protected by| WorkerAuth
    ADMIN_ROUTE -->|Manages| ENTRIES_TABLE
    ADMIN_ROUTE -->|Manages| CANVASES_TABLE
    API_ROUTES -->|Protected by| WorkerAuth
    API_ROUTES -->|Stores| IMAGES
    API_ROUTES -->|Queries| Database

    %% Client data flow
    ROUTER -->|Updates| NAV_STATE
    ComponentLayer -->|Loads content| CONTENT_LOADER
    CONTENT_LOADER -->|Reads| STATIC_CONTENT
    ComponentLayer -->|Uses| SONGS_DATA
    THEME_COMP -->|Persists| THEME_STATE

    %% Build process
    VITE_BUILD -->|Compiles| DIST
    VITE_BUILD -->|Triggers| MANIFEST_GEN
    MANIFEST_GEN -->|Creates| WORKER_ASSETS

    %% External services
    ADMIN_ROUTE -->|GIF search| GIPHY

    style USER fill:#e1f5ff
    style SPA fill:#fff4e1
    style HONO fill:#ffe1f5
    style Database fill:#e1ffe1
    style Storage fill:#f0f0f0
    style VITE_BUILD fill:#ffe1e1
