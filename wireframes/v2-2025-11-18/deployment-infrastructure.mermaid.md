%% Deployment Infrastructure - How the code runs in production
%% Cloudflare edge network, services, and CI/CD pipeline

flowchart TB
    subgraph devLocal["Local Development"]
        Dev["Developer<br/>Machine"]

        subgraph devTools["Development Tools"]
            Git["Git Repository"]
            Node["Node.js"]
            NPM["npm / package.json"]
        end

        subgraph devServers["Development Servers"]
            Vite["Vite Dev Server<br/>Port 5173"]
            Wrangler["Wrangler Dev<br/>Port 8787"]
        end

        subgraph localData["Local Development Data"]
            LocalD1["Local D1<br/>(.wrangler/state/)"]
            LocalR2["Local R2<br/>(simulated)"]
            DevVars[".dev.vars<br/>(local secrets)"]
        end

        Dev --> devTools
        devTools --> devServers
        devServers --> localData
    end

    subgraph buildProcess["Build Pipeline"]
        ViteBuild["Vite Build<br/>(npm run build)"]
        TailwindCSS["Tailwind CSS<br/>JIT compilation"]
        TSCompile["TypeScript<br/>Compilation"]
        ManifestGen["Asset Manifest<br/>Generation"]
        Dist["dist/ directory<br/>(build output)"]

        ViteBuild --> TailwindCSS
        TailwindCSS --> TSCompile
        TSCompile --> ManifestGen
        ManifestGen --> Dist
    end

    subgraph deployment["Deployment"]
        WranglerDeploy["wrangler deploy"]
        Upload["Upload to<br/>Cloudflare"]
    end

    subgraph cloudflare["Cloudflare Edge Network"]
        subgraph globalNetwork["Global Edge Network<br/>(300+ cities)"]
            EdgeNode["Edge Node<br/>(nearest to user)"]
        end

        subgraph workerRuntime["Worker Runtime"]
            V8["V8 Isolate<br/>(JavaScript engine)"]
            WorkerCode["Worker Code<br/>(src/worker.ts compiled)"]
            HonoApp["Hono.js<br/>Application"]
        end

        subgraph cloudflareServices["Cloudflare Services"]
            Assets["Assets Binding<br/>(static files from dist/)"]
            D1["D1 Database<br/>(blog-db)"]
            R2["R2 Bucket<br/>(blog-images)"]
            Secrets["Secrets Manager<br/>(ADMIN_*, GIPHY_API_KEY)"]
        end

        subgraph dns["DNS & Routing"]
            DNS["Cloudflare DNS"]
            SSL["SSL/TLS<br/>(automatic)"]
            Routes["Worker Routes"]
        end

        EdgeNode --> workerRuntime
        workerRuntime --> cloudflareServices
        workerRuntime --> dns
    end

    subgraph external["External Services"]
        GiphyAPI["Giphy API<br/>(GIF search)"]
    end

    subgraph clients["End Users"]
        Browser["Web Browser"]
        RSSReader["RSS Reader"]
        AdminUser["Admin Panel<br/>User"]
    end

    %% Flow connections
    Dev --> ViteBuild
    Dist --> WranglerDeploy
    WranglerDeploy --> Upload
    Upload --> cloudflare

    Browser --> EdgeNode
    RSSReader --> EdgeNode
    AdminUser --> EdgeNode

    WorkerCode --> Assets
    WorkerCode --> D1
    WorkerCode --> R2
    WorkerCode --> Secrets
    WorkerCode --> GiphyAPI

    classDef local fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef build fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef deploy fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef cloudflare fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef external fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef users fill:#e0f2f1,stroke:#00695c,stroke-width:2px

    class devLocal,Dev,devTools,devServers,localData local
    class buildProcess,ViteBuild,TailwindCSS,TSCompile,ManifestGen,Dist build
    class deployment,WranglerDeploy,Upload deploy
    class cloudflare,globalNetwork,workerRuntime,cloudflareServices,dns cloudflare
    class external,GiphyAPI external
    class clients,Browser,RSSReader,AdminUser users
