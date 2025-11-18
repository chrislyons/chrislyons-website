%% High-level System Architecture for chrislyons-website
%% Dual-server pattern: Vite SPA + Cloudflare Worker

graph TB
    subgraph browser["Browser / Client"]
        User["User"]
        Browser["Web Browser"]
    end

    subgraph development["Development Environment"]
        subgraph viteServer["Vite Dev Server<br/>(Port 5173)"]
            ViteHMR["Hot Module Replacement"]
            ViteProxy["Proxy Middleware<br/>(/blog → 8787)<br/>(/admin → 8787)"]
            ViteStatic["Static File Serving"]
        end

        subgraph wranglerServer["Wrangler Dev Server<br/>(Port 8787)"]
            WranglerWorker["Cloudflare Worker<br/>(Local Mode)"]
            WranglerD1["D1 Database<br/>(Local SQLite)"]
        end

        ViteProxy -.->|Proxy requests| wranglerServer
    end

    subgraph production["Production Environment<br/>(Cloudflare)"]
        subgraph edge["Cloudflare Edge Network"]
            Worker["Cloudflare Worker<br/>(Hono.js Framework)"]

            subgraph workerRouting["Worker Route Handler"]
                DynamicRoutes["Dynamic Routes<br/>/blog, /admin, /rss.xml"]
                SPAFallback["SPA Fallback<br/>All other routes"]
                AssetServing["Asset Serving<br/>.js, .css, fonts, images"]
            end

            Worker --> workerRouting
        end

        subgraph storage["Cloudflare Storage"]
            D1["D1 Database<br/>(SQLite at Edge)"]
            R2["R2 Bucket<br/>(Blog Images)"]
            Assets["Assets Binding<br/>(Vite Build Output)"]
        end

        subgraph secrets["Cloudflare Secrets"]
            AdminCreds["ADMIN_USERNAME<br/>ADMIN_PASSWORD"]
            Giphy["GIPHY_API_KEY"]
        end

        Worker --> D1
        Worker --> R2
        Worker --> Assets
        Worker --> secrets
    end

    subgraph spa["Single Page Application<br/>(Client-Side)"]
        Router["Client Router<br/>(Hash-based)"]
        Components["UI Components<br/>(JS Classes)"]
        Theme["Theme System<br/>(4 themes in localStorage)"]
        Content["Content Loader<br/>(Async markdown fetch)"]

        Router --> Components
        Components --> Theme
        Router --> Content
    end

    subgraph workerApp["Worker Application<br/>(Server-Side)"]
        Hono["Hono.js Framework"]

        subgraph routes["Route Handlers"]
            BlogRoutes["Blog Routes<br/>GET /blog<br/>GET /blog/entry/:id<br/>GET /rss.xml"]
            AdminRoutes["Admin Routes<br/>GET /admin<br/>POST /admin/login<br/>POST /admin/entry<br/>etc."]
            AuthRoutes["Auth Routes<br/>POST /admin/login<br/>GET /admin/logout"]
            AssetRoutes["Asset Routes<br/>GET /images/:filename"]
        end

        subgraph middleware["Middleware"]
            Auth["Session Auth<br/>(Cookie-based)"]
            CORS["CORS Headers"]
            Security["Security Headers<br/>(XSS, CSP, etc.)"]
        end

        Hono --> routes
        Hono --> middleware
    end

    subgraph buildProcess["Build Process"]
        ViteBuild["Vite Build<br/>(Rollup bundling)"]
        AssetManifest["Asset Manifest<br/>Generation"]
        Tailwind["Tailwind CSS<br/>Processing"]
        TypeScript["TypeScript<br/>Compilation (Worker)"]

        ViteBuild --> AssetManifest
        ViteBuild --> Tailwind
        TypeScript --> AssetManifest
    end

    subgraph external["External Services"]
        GiphyAPI["Giphy API<br/>(GIF search)"]
    end

    User --> Browser
    Browser -->|Development| viteServer
    Browser -->|Production| edge

    viteServer -->|Serves| spa
    edge -->|Serves| spa
    edge --> workerApp

    workerApp --> D1
    workerApp --> R2
    workerApp --> Assets
    workerApp --> GiphyAPI

    buildProcess -->|Outputs to| Assets
    buildProcess -->|Outputs to| Worker

    classDef devEnv fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef prodEnv fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef clientEnv fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef storage fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef build fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class viteServer,wranglerServer devEnv
    class edge,Worker,workerApp prodEnv
    class spa,Router,Components,Theme,Content clientEnv
    class D1,R2,Assets,WranglerD1 storage
    class buildProcess,ViteBuild,AssetManifest,Tailwind,TypeScript build
