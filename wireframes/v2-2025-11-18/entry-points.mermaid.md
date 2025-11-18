%% Entry Points - All ways to interact with the codebase
%% Application initialization, API endpoints, CLI commands, scripts

flowchart TB
    subgraph userEntry["User Entry Points"]
        Browser["Web Browser<br/>(User)"]
    end

    subgraph spaRoutes["SPA Routes (Client-Side)"]
        Home["/ (Home)"]
        Apps["App Routes"]
        Ideas["Idea Routes"]
        Sounds["Sound Routes"]
        Connect["/connect"]
        NotFound["404 Page"]

        subgraph appRoutes["App Routes"]
            AppsIndex["/apps"]
            CarbonACX["/apps/carbon-acx"]
            ClipComposer["/apps/clip-composer"]
            Hotbox["/apps/hotbox"]
            ListMaker["/apps/listmaker"]
            OrpheusSDK["/apps/orpheus-sdk"]
            TidalMCP["/apps/tidal-mcp"]
            WordBird["/apps/wordbird"]
        end

        subgraph ideaRoutes["Idea Routes"]
            IdeasIndex["/ideas"]
            Suppositions["/ideas/27-suppositions"]
            NumaNetwork["/ideas/numa-network"]
            OSDEvents["/ideas/osd-events"]
            Protocols["/ideas/protocols-of-sound"]
        end

        subgraph soundRoutes["Sound Routes"]
            SoundsIndex["/sounds"]
            Lyrics["/sounds/lyrics"]
            Discography["/sounds/discography"]
            Portfolio["/sounds/portfolio"]
        end
    end

    subgraph workerRoutes["Worker Routes (Server-Side)"]
        subgraph publicAPI["Public API"]
            BlogIndex["GET /blog<br/>HTML or JSON"]
            BlogEntry["GET /blog/entry/:id<br/>Redirect to anchor"]
            RSS["GET /rss.xml<br/>RSS Feed"]
            Images["GET /images/:filename<br/>Serve from R2"]
        end

        subgraph adminAPI["Admin API (Auth Required)"]
            AdminDashboard["GET /admin<br/>Dashboard HTML"]
            AdminLogin["POST /admin/login<br/>Form submission"]
            AdminLogout["GET /admin/logout<br/>Clear session"]
            CreateEntry["POST /admin/entry<br/>Create blog entry"]
            GetEntry["GET /admin/entry/:id<br/>Get single entry"]
            UpdateEntry["PUT /admin/entry/:id<br/>Update entry"]
            DeleteEntry["DELETE /admin/entry/:id<br/>Delete entry"]
            Upload["POST /admin/upload<br/>Upload image"]
            CanvasCreate["GET /admin/create<br/>Canvas creator"]
            CanvasPost["POST /admin/canvas<br/>Save canvas"]
            CanvasGet["GET /admin/canvas/:id<br/>Get canvas"]
            GiphySearch["GET /admin/giphy<br/>Search GIFs"]
        end

        subgraph assetServing["Asset Serving"]
            StaticAssets["GET /*.(js|css|woff2|etc)<br/>Vite build output"]
            SPAFallback["GET /*<br/>Return index.html"]
        end
    end

    subgraph devCommands["Development Commands"]
        DevSPA["npm run dev<br/>Vite SPA only<br/>Port 5173"]
        DevWorker["npm run dev:worker<br/>Wrangler Worker<br/>Port 8787"]
        DevAll["npm run dev:all<br/>Both servers"]
        Build["npm run build<br/>Production build"]
        Preview["npm run preview<br/>Preview build"]
    end

    subgraph buildScripts["Build Scripts"]
        ParseLyrics["parse-song-lyrics.js<br/>MD → songs.js"]
        GenManifest["generate-asset-manifest.js<br/>Create asset map"]
    end

    subgraph dbScripts["Database Commands"]
        MigrateEntries["wrangler d1 execute<br/>001_create_entries_table.sql"]
        MigrateCanvases["wrangler d1 execute<br/>001_create_canvases_table.sql"]
        DBQuery["wrangler d1 execute<br/>Custom SQL queries"]
    end

    subgraph deployCommands["Deployment Commands"]
        WranglerDeploy["wrangler deploy<br/>Deploy to Cloudflare"]
        SetSecrets["wrangler secret put<br/>Set ADMIN credentials"]
    end

    subgraph keyboardShortcuts["Keyboard Shortcuts"]
        ThemeKey["\ (Backslash)<br/>Toggle theme"]
    end

    %% User to Routes
    Browser --> Home
    Browser --> Apps
    Browser --> Ideas
    Browser --> Sounds
    Browser --> Connect
    Browser --> publicAPI
    Browser --> adminAPI

    %% SPA Route Organization
    Apps --> appRoutes
    Ideas --> ideaRoutes
    Sounds --> soundRoutes

    %% Development Flow
    DevSPA --> spaRoutes
    DevWorker --> workerRoutes
    DevAll --> spaRoutes
    DevAll --> workerRoutes

    %% Build Flow
    Build --> GenManifest
    Build --> StaticAssets

    %% Script Outputs
    ParseLyrics --> Lyrics

    %% Database to Worker
    MigrateEntries --> publicAPI
    MigrateCanvases --> adminAPI

    %% Deployment
    WranglerDeploy --> workerRoutes
    SetSecrets --> adminAPI

    classDef user fill:#e1f5fe,stroke:#0288d1
    classDef spa fill:#e8f5e9,stroke:#388e3c
    classDef worker fill:#f3e5f5,stroke:#7b1fa2
    classDef dev fill:#fff3e0,stroke:#f57c00
    classDef script fill:#fce4ec,stroke:#c2185b
    classDef db fill:#e0f2f1,stroke:#00695c
    classDef deploy fill:#ede7f6,stroke:#5e35b1

    class Browser user
    class spaRoutes,Home,Apps,Ideas,Sounds,Connect,NotFound,appRoutes,ideaRoutes,soundRoutes spa
    class workerRoutes,publicAPI,adminAPI,assetServing worker
    class devCommands,DevSPA,DevWorker,DevAll,Build,Preview dev
    class buildScripts,ParseLyrics,GenManifest script
    class dbScripts,MigrateEntries,MigrateCanvases,DBQuery db
    class deployCommands,WranglerDeploy,SetSecrets deploy
