%% Deployment Infrastructure - Chris Lyons Website
%% Generated: 2025-11-08
%% How the code runs in development and production

flowchart TB
    subgraph Developer["Developer Machine"]
        CODE["Source Code<br/>(Git repository)"]
        NPM_DEV["npm run dev<br/>(Vite dev server)"]
        NPM_WORKER["npm run dev:worker<br/>(Wrangler local)"]
        NPM_BUILD["npm run build<br/>(Production build)"]
        WRANGLER_DEPLOY["npx wrangler deploy<br/>(Deploy to edge)"]
    end

    subgraph LocalDev["Local Development Environment"]
        VITE_LOCAL["Vite Server<br/>Port 5173"]
        WORKER_LOCAL["Wrangler Local<br/>Port 8787"]
        D1_LOCAL["Local D1 Database<br/>(SQLite file)"]
        STORAGE_LOCAL[".wrangler/state/<br/>(Local storage)"]

        VITE_LOCAL --> WORKER_LOCAL
        WORKER_LOCAL --> D1_LOCAL
        WORKER_LOCAL --> STORAGE_LOCAL
    end

    subgraph BuildPipeline["Build Pipeline"]
        VITE_COMPILER["Vite Compiler"]
        BUNDLER["JavaScript Bundler"]
        MINIFIER["Minifier"]
        ASSET_HASHER["Asset Hasher"]
        MANIFEST_GEN["Asset Manifest<br/>Generator"]
        DIST_DIR["dist/<br/>(Build output)"]

        VITE_COMPILER --> BUNDLER
        BUNDLER --> MINIFIER
        MINIFIER --> ASSET_HASHER
        ASSET_HASHER --> MANIFEST_GEN
        MANIFEST_GEN --> DIST_DIR
    end

    subgraph CloudflareEdge["Cloudflare Edge Network"]
        EDGE_LOCATIONS["Global Edge Locations<br/>(300+ cities)"]
        WORKER_RUNTIME["Cloudflare Worker<br/>(V8 Isolates)"]
        ASSETS_BINDING["ASSETS Binding<br/>(Static files)"]
        D1_PROD["D1 Database<br/>(Distributed SQLite)"]
        R2_PROD["R2 Bucket<br/>(Object storage)"]
        SECRETS["Secrets<br/>(Environment variables)"]

        EDGE_LOCATIONS --> WORKER_RUNTIME
        WORKER_RUNTIME --> ASSETS_BINDING
        WORKER_RUNTIME --> D1_PROD
        WORKER_RUNTIME --> R2_PROD
        WORKER_RUNTIME --> SECRETS
    end

    subgraph ExternalServices["External Services"]
        GIPHY_API["Giphy API<br/>(GIF search)"]
    end

    subgraph Users["Users / Clients"]
        BROWSER["Web Browser"]
        RSS_READER["RSS Reader"]
        SEARCH_ENGINE["Search Engine<br/>(Google, etc.)"]
    end

    subgraph Monitoring["Monitoring & Logs"]
        WRANGLER_TAIL["Wrangler Tail<br/>(Live logs)"]
        CF_DASHBOARD["Cloudflare Dashboard<br/>(Analytics)"]
        CONSOLE_LOGS["Browser Console<br/>(Client-side logs)"]
    end

    %% Development flow
    CODE --> NPM_DEV
    CODE --> NPM_WORKER
    NPM_DEV --> VITE_LOCAL
    NPM_WORKER --> WORKER_LOCAL

    %% Build flow
    CODE --> NPM_BUILD
    NPM_BUILD --> BuildPipeline
    DIST_DIR --> WRANGLER_DEPLOY

    %% Deployment flow
    WRANGLER_DEPLOY --> EDGE_LOCATIONS

    %% Production request flow
    BROWSER --> EDGE_LOCATIONS
    RSS_READER --> EDGE_LOCATIONS
    SEARCH_ENGINE --> EDGE_LOCATIONS

    %% Worker interactions
    WORKER_RUNTIME --> GIPHY_API

    %% Monitoring
    WORKER_RUNTIME --> WRANGLER_TAIL
    WORKER_RUNTIME --> CF_DASHBOARD
    BROWSER --> CONSOLE_LOGS

    style CODE fill:#ffe1e1
    style DIST_DIR fill:#e1ffe1
    style EDGE_LOCATIONS fill:#e1f5ff
    style WORKER_RUNTIME fill:#fff4e1
