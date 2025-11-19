%% Repository Structure - Chris Lyons Website
%% Generated: 2025-11-08
%% Complete directory tree visualization showing all major directories and key files

graph TB
    subgraph Root["Repository Root"]
        CLAUDE["CLAUDE.md<br/>(Repo conventions)"]
        README["README.md"]
        PKG["package.json"]
        VITE["vite.config.js"]
        WRANGLER["wrangler.toml<br/>(Worker config)"]
        TAILWIND["tailwind.config.js"]
        INDEX["index.html"]
    end

    subgraph Source["src/ - Application Source"]
        MAIN["main.js<br/>(Entry point)"]
        WORKER["worker.ts<br/>(Cloudflare Worker)"]
        STYLE["style.css"]

        subgraph Components["components/"]
            NAV["Navigation.js"]
            FOOTER["Footer.js"]
            CARD["Card.js"]
            COLLAPSE["CollapsibleSection.js"]
            TABLE["TableResponsive.js"]
            HEADER["PageHeader.js"]
            THEME["ThemeToggle.js"]
            SONG["SongAccordion.js"]
        end

        subgraph Utils["utils/"]
            ROUTER["router.js<br/>(Client-side routing)"]
            LOADER["contentLoader.js"]
            MARKDOWN["markdown.js"]
        end

        subgraph Data["data/"]
            SONGS["songs.js<br/>(Generated)"]
            subgraph SongsMD["songs/"]
                SONGMD["*.md<br/>(Markdown sources)"]
            end
        end
    end

    subgraph Content["content/ - Static Content"]
        CONTENTJSON["content.json"]
        HOMEMD["home.md"]
        subgraph ContentApps["apps/"]
            APPS["App descriptions"]
        end
        subgraph ContentIdeas["ideas/"]
            IDEAS["Idea descriptions"]
        end
        subgraph ContentSounds["sounds/"]
            SOUNDS["Music content"]
        end
        subgraph ContentConnect["connect/"]
            CONNECT["Contact info"]
        end
        subgraph ContentSystems["systems/"]
            SYSTEMS["System docs"]
        end
        subgraph ContentWriting["writing/"]
            WRITING["Writing samples"]
        end
    end

    subgraph PublicDir["public/ - Static Assets"]
        ADMINJS["admin.js"]
        CANVAS["canvas-creator.js"]
        subgraph Fonts["fonts/"]
            HK["HKGrotesk_3003/<br/>Font files"]
        end
    end

    subgraph Scripts["scripts/"]
        PARSE["parse-song-lyrics.js"]
        MANIFEST["generate-asset-manifest.js"]
        INJECT["inject-assets.js"]
    end

    subgraph Migrations["migrations/"]
        ENTRIES["001_create_entries_table.sql"]
        CANVASES["001_create_canvases_table.sql"]
    end

    subgraph Docs["docs/"]
        subgraph CLW["clw/"]
            CLW_DOCS["CLW### Title.md<br/>(Numbered docs)"]
            INDEX_MD["INDEX.md"]
        end
    end

    subgraph Config[".claude/ - Claude Code Config"]
        SKILLS["skills.json"]
        SCRATCH["scratch/<br/>(gitignored)"]
    end

    subgraph Assets["assets/"]
        IMAGES["images/<br/>(Static images)"]
    end

    subgraph Workers["workers-site/"]
        WORKERINDEX["index.js<br/>(Legacy worker)"]
    end

    Root --> Source
    Root --> Content
    Root --> PublicDir
    Root --> Scripts
    Root --> Migrations
    Root --> Docs
    Root --> Config
    Root --> Assets
    Root --> Workers
