%% Repository Structure for chrislyons-website
%% Complete directory tree visualization showing organization and purpose

graph TB
    subgraph root[" "]
        Root["chrislyons-website/<br/>(Repository Root)"]

        subgraph config["Configuration Files"]
            CLAUDE["CLAUDE.md<br/>(Dev conventions)"]
            README["README.md<br/>(Project docs)"]
            Package["package.json<br/>(Dependencies)"]
            Vite["vite.config.js<br/>(SPA build)"]
            Wrangler["wrangler.toml<br/>(Worker config)"]
            Tailwind["tailwind.config.js<br/>(CSS framework)"]
            PostCSS["postcss.config.mjs<br/>(CSS processing)"]
            IndexHTML["index.html<br/>(SPA entry)"]
        end

        subgraph src["src/ - Source Code"]
            Worker["worker.ts<br/>(Cloudflare Worker)"]
            Main["main.js<br/>(SPA entry point)"]
            Routes["routes.js<br/>(Route config)"]
            Style["style.css<br/>(Global styles)"]

            subgraph components["components/"]
                Nav["Navigation.js"]
                Footer["Footer.js"]
                Theme["ThemeToggle.js"]
                Card["Card.js"]
                Header["PageHeader.js"]
                Accordion["SongAccordion.js"]
                Collapsible["CollapsibleSection.js"]
                Table["TableResponsive.js"]
            end

            subgraph pages["pages/"]
                Home["HomePage.js"]
                Apps["AppsPage.js"]
                Ideas["IdeasPage.js"]
                Sounds["SoundsPage.js"]
                Connect["ConnectPage.js"]
                NotFound["NotFoundPage.js"]

                subgraph appsPages["apps/"]
                    AppDetails["index.js<br/>(7 app detail pages)"]
                end

                subgraph ideasPages["ideas/"]
                    IdeaDetails["index.js<br/>(4 idea detail pages)"]
                end

                subgraph soundsPages["sounds/"]
                    Lyrics["Lyrics page"]
                    Disco["Discography page"]
                    Portfolio["Portfolio page"]
                end
            end

            subgraph utils["utils/"]
                Router["router.js<br/>(Client-side routing)"]
                Content["contentLoader.js<br/>(Load markdown)"]
                Markdown["markdown.js<br/>(MD parsing)"]
                Template["templateHelpers.js<br/>(Rendering utils)"]
            end

            subgraph data["data/"]
                Songs["songs.js<br/>(Generated lyrics)"]

                subgraph songsDir["songs/"]
                    SongMD["*.md<br/>(39 song files)"]
                end
            end
        end

        subgraph content["content/ - Markdown Content"]
            ContentApps["apps/"]
            ContentIdeas["ideas/"]
            ContentSounds["sounds/"]
            ContentSystems["systems/"]
            ContentWriting["writing/"]
            ContentConnect["connect/"]
        end

        subgraph public["public/ - Static Assets"]
            Fonts["fonts/<br/>(HK Grotesk)"]
            Favicon["favicon.*"]
        end

        subgraph scripts["scripts/"]
            Parse["parse-song-lyrics.js<br/>(MD to JS)"]
            Manifest["generate-asset-manifest.js<br/>(Build helper)"]
        end

        subgraph migrations["migrations/"]
            Entries["001_create_entries_table.sql"]
            Canvases["001_create_canvases_table.sql"]
        end

        subgraph docs["docs/"]
            CLW["clw/<br/>(CLW### docs)"]
        end

        subgraph wireframes["wireframes/"]
            V1["v1-2025-11-08/"]
            V2["v2-2025-11-18/"]
            WireREADME["README.md"]
        end

        subgraph dotfiles["Hidden/Config"]
            Claude[".claude/<br/>(Claude config)"]
            Git[".git/<br/>(Git repo)"]
            Wrangler2[".wrangler/<br/>(Worker state)"]
            Ignore[".gitignore"]
            ClaudeIgnore[".claudeignore"]
        end

        subgraph workers["workers-site/"]
            WorkerSite["(Legacy worker assets)"]
        end

        subgraph assets["assets/"]
            Images["images/<br/>(Static images)"]
        end
    end

    Root --> config
    Root --> src
    Root --> content
    Root --> public
    Root --> scripts
    Root --> migrations
    Root --> docs
    Root --> wireframes
    Root --> dotfiles
    Root --> workers
    Root --> assets

    src --> Worker
    src --> Main
    src --> Routes
    src --> Style
    src --> components
    src --> pages
    src --> utils
    src --> data

    pages --> Home
    pages --> Apps
    pages --> Ideas
    pages --> Sounds
    pages --> Connect
    pages --> NotFound
    pages --> appsPages
    pages --> ideasPages
    pages --> soundsPages

    data --> Songs
    data --> songsDir
