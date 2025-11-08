%% Entry Points - Chris Lyons Website
%% Generated: 2025-11-08
%% All ways to interact with the codebase and application initialization

flowchart TD
    subgraph BrowserEntry["Browser Entry Points"]
        URL["URL Navigation<br/>(Direct or bookmarked)"]
        LINK["Link Click<br/>(Internal navigation)"]
        BACK["Browser Back/Forward<br/>(History navigation)"]
        KEYBOARD["Keyboard Shortcuts<br/>(\ for theme toggle)"]
    end

    subgraph AppInit["Application Initialization"]
        LOAD["Page Load Event"]
        INDEX["index.html"]
        VITE_SCRIPT["Vite-injected Script Tag"]
        MAIN_JS["src/main.js<br/>(Module entry point)"]

        LOAD --> INDEX
        INDEX --> VITE_SCRIPT
        VITE_SCRIPT --> MAIN_JS
    end

    subgraph InitSequence["Initialization Sequence"]
        INIT["main.js: init()"]
        THEME_INIT["Initialize ThemeToggle<br/>(Read localStorage)"]
        APPLY_THEME["Apply saved theme<br/>(or default: moonlight)"]
        KEYBOARD_SETUP["setupKeyboardShortcuts()"]
        NAV_INIT["Initialize Navigation"]
        FOOTER_INIT["Initialize Footer"]
        RENDER_NAV["renderNavigation()"]
        RENDER_FOOTER["renderFooter()"]
        SETUP_ROUTES["setupRoutes()"]
        ROUTER_INIT["router.init()"]
        HANDLE_ROUTE["handleRoute(currentPath)"]

        INIT --> THEME_INIT
        THEME_INIT --> APPLY_THEME
        APPLY_THEME --> KEYBOARD_SETUP
        KEYBOARD_SETUP --> NAV_INIT
        NAV_INIT --> FOOTER_INIT
        FOOTER_INIT --> RENDER_NAV
        RENDER_NAV --> RENDER_FOOTER
        RENDER_FOOTER --> SETUP_ROUTES
        SETUP_ROUTES --> ROUTER_INIT
        ROUTER_INIT --> HANDLE_ROUTE
    end

    subgraph WorkerEntry["Worker Entry Points"]
        WORKER_DEPLOY["Cloudflare Deployment"]
        WORKER_DEV["wrangler dev<br/>(Local development)"]
        WORKER_FETCH["fetch Event"]
        WORKER_TS["src/worker.ts<br/>(Hono app)"]

        WORKER_DEPLOY --> WORKER_FETCH
        WORKER_DEV --> WORKER_FETCH
        WORKER_FETCH --> WORKER_TS
    end

    subgraph WorkerInit["Worker Initialization"]
        HONO_INIT["Hono App Creation"]
        BINDINGS["Environment Bindings<br/>(DB, R2, GIPHY_API_KEY)"]
        ROUTES_DEF["Route Definitions"]
        MIDDLEWARE["Authentication Middleware"]
        EXPORT["Export default app"]

        HONO_INIT --> BINDINGS
        BINDINGS --> ROUTES_DEF
        ROUTES_DEF --> MIDDLEWARE
        MIDDLEWARE --> EXPORT
    end

    subgraph DevEntry["Development Entry Points"]
        NPM_DEV["npm run dev<br/>(Vite only)"]
        NPM_WORKER["npm run dev:worker<br/>(Worker only)"]
        NPM_ALL["npm run dev:all<br/>(Both servers)"]
        VITE_SERVER["Vite Dev Server<br/>(Port 5173)"]
        WORKER_SERVER["Wrangler Dev Server<br/>(Port 8787)"]

        NPM_DEV --> VITE_SERVER
        NPM_WORKER --> WORKER_SERVER
        NPM_ALL --> VITE_SERVER
        NPM_ALL --> WORKER_SERVER
    end

    subgraph BuildEntry["Build Entry Points"]
        NPM_BUILD["npm run build"]
        VITE_BUILD["vite build"]
        MANIFEST_SCRIPT["generate-asset-manifest.js"]
        DIST["dist/<br/>(Production build)"]

        NPM_BUILD --> VITE_BUILD
        VITE_BUILD --> MANIFEST_SCRIPT
        MANIFEST_SCRIPT --> DIST
    end

    subgraph ScriptEntry["Script Entry Points"]
        PARSE_LYRICS["node scripts/parse-song-lyrics.js"]
        GENERATE_MANIFEST["node scripts/generate-asset-manifest.js"]
        INJECT_ASSETS["node scripts/inject-assets.js"]

        PARSE_LYRICS --> SONGS_JS["src/data/songs.js<br/>(Generated)"]
        GENERATE_MANIFEST --> MANIFEST_JSON["asset-manifest.json<br/>(Generated)"]
    end

    subgraph APIEntry["API Entry Points (Worker)"]
        API_BLOG["GET /blog"]
        API_ADMIN["GET /admin"]
        API_LOGIN["POST /admin/login"]
        API_CREATE["POST /admin/entry"]
        API_UPDATE["PUT /admin/entry/:id"]
        API_DELETE["DELETE /admin/entry/:id"]
        API_UPLOAD["POST /admin/upload"]
        API_GIPHY["GET /admin/giphy"]
        API_CANVAS["POST /admin/canvas"]
        API_RSS["GET /rss.xml"]
        API_IMAGES["GET /images/:filename"]
    end

    subgraph RouteEntry["SPA Route Entry Points"]
        ROUTE_HOME["/ (Home)"]
        ROUTE_APPS["GET /apps<br/>GET /apps/*"]
        ROUTE_IDEAS["GET /ideas<br/>GET /ideas/*"]
        ROUTE_SOUNDS["GET /sounds<br/>GET /sounds/*"]
        ROUTE_CONNECT["GET /connect"]
        ROUTE_404["404 Handler"]

        ROUTE_HOME --> HANDLE_ROUTE
        ROUTE_APPS --> HANDLE_ROUTE
        ROUTE_IDEAS --> HANDLE_ROUTE
        ROUTE_SOUNDS --> HANDLE_ROUTE
        ROUTE_CONNECT --> HANDLE_ROUTE
        ROUTE_404 --> HANDLE_ROUTE
    end

    %% Connect browser entry to app init
    URL --> LOAD
    LINK --> ROUTER_INIT
    BACK --> ROUTER_INIT
    KEYBOARD --> KEYBOARD_SETUP

    %% Connect dev entry to servers
    VITE_SERVER --> INDEX
    WORKER_SERVER --> WORKER_TS

    %% Connect API entry to worker
    API_BLOG --> WORKER_TS
    API_ADMIN --> WORKER_TS
    API_LOGIN --> WORKER_TS
    API_CREATE --> WORKER_TS
    API_UPDATE --> WORKER_TS
    API_DELETE --> WORKER_TS
    API_UPLOAD --> WORKER_TS
    API_GIPHY --> WORKER_TS
    API_CANVAS --> WORKER_TS
    API_RSS --> WORKER_TS
    API_IMAGES --> WORKER_TS

    style MAIN_JS fill:#ffe1e1
    style WORKER_TS fill:#e1f5ff
    style DIST fill:#e1ffe1
