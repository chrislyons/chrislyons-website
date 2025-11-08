%% Component Map - Chris Lyons Website
%% Generated: 2025-11-08
%% Detailed component breakdown showing module boundaries, dependencies, and APIs

classDiagram
    class Main {
        +navigation: Navigation
        +footer: Footer
        +themeToggle: ThemeToggle
        +init()
        +setupRoutes()
        +setupKeyboardShortcuts()
        +renderNavigation()
        +renderFooter()
        +renderHomePage()
        +renderAppsPage()
        +renderIdeasPage()
        +renderSoundsPage()
        +renderConnectPage()
        +render404Page()
    }

    class Router {
        -routes: Map
        -currentRoute: string
        -notFoundHandler: Function
        +on(path, handler)
        +notFound(handler)
        +navigate(path, pushState)
        +handleRoute(path, isNew)
        +matchRoute(pattern, path)
        +announceRouteChange(path)
        +init()
        +getCurrentRoute()
    }

    class Navigation {
        -mobileMenuOpen: boolean
        +render() string
        +attachEventListeners()
        +toggleMobileMenu()
        +closeMobileMenu()
    }

    class Footer {
        +render() string
    }

    class ThemeToggle {
        -theme: string
        -themes: Array
        +constructor()
        +render() string
        +attachEventListeners()
        +toggle()
        +setTheme(theme)
        +getNextTheme()
        +applyTheme(theme)
        +getIcon(theme)
    }

    class Card {
        -title: string
        -description: string
        -link: string
        +constructor(props)
        +render() string
    }

    class CollapsibleSection {
        -title: string
        -content: string
        -isOpen: boolean
        -id: string
        +constructor(props)
        +render() string
        +attachEventListeners()
        +toggle()
    }

    class TableResponsive {
        -headers: Array
        -rows: Array
        +constructor(data)
        +render() string
    }

    class PageHeader {
        -title: string
        -subtitle: string
        +constructor(props)
        +render() string
    }

    class SongAccordion {
        -songs: Array
        -openSongId: string
        +constructor(songs)
        +render() string
        +attachEventListeners()
        +toggle(songId)
    }

    class ContentLoader {
        -siteData: Object
        -pagesData: Object
        +getSiteData() Object
        +getPageData(pageName) Object
        +updateDocumentTitle(title)
        +updateMetaDescription(desc)
        +loadMarkdown(path) Promise
    }

    class Worker {
        +dynamicApp: Hono
        +isAuthenticated(c) boolean
        +handleBlog(c)
        +handleAdmin(c)
        +handleLogin(c)
        +handleLogout(c)
        +handleCreateEntry(c)
        +handleUpdateEntry(c)
        +handleDeleteEntry(c)
        +handleUpload(c)
        +handleGiphy(c)
        +handleCanvas(c)
        +handleRSS(c)
        +handleAssets(c)
    }

    class Database {
        <<interface>>
        +prepare(sql) Statement
        +all() Results
        +first() Row
        +run() Result
    }

    class AdminClient {
        +initEditor()
        +createEntry(type)
        +updateEntry(id)
        +deleteEntry(id)
        +uploadImage(file)
        +searchGiphy(query)
        +publishEntry(id)
    }

    class CanvasCreator {
        -canvas: Object
        -elements: Array
        -selectedElement: string
        +initCanvas()
        +addElement(type)
        +updateElement(id, props)
        +deleteElement(id)
        +setBackground(bg)
        +saveCanvas()
        +exportCanvas()
    }

    class SongsData {
        <<module>>
        +songs: Array~Song~
    }

    class Song {
        +title: string
        +lyrics: string
    }

    class ParseSongLyrics {
        <<script>>
        +parseLyrics(markdown) Song
        +convertToHTML(lyrics) string
        +generateSongsFile(songs)
    }

    class GenerateAssetManifest {
        <<script>>
        +findAssets(dir) Assets
        +createManifest(assets) JSON
        +writeManifest(manifest)
    }

    %% Main dependencies
    Main --> Router : uses
    Main --> Navigation : instantiates
    Main --> Footer : instantiates
    Main --> ThemeToggle : instantiates
    Main --> ContentLoader : uses
    Main --> SongsData : imports
    Main --> Card : uses
    Main --> CollapsibleSection : uses
    Main --> TableResponsive : uses
    Main --> PageHeader : uses
    Main --> SongAccordion : uses

    %% Router dependencies
    Router --> Main : calls route handlers
    Router ..> Navigation : triggers updates

    %% Component dependencies
    Navigation --> ThemeToggle : embeds
    SongAccordion --> SongsData : reads

    %% Worker dependencies
    Worker --> Database : queries
    Worker --> AdminClient : serves
    Worker --> CanvasCreator : serves

    %% Script dependencies
    ParseSongLyrics --> SongsData : generates
    GenerateAssetManifest --> Worker : provides manifest

    %% Data dependencies
    SongsData --> Song : contains
    ContentLoader ..> Main : provides data
