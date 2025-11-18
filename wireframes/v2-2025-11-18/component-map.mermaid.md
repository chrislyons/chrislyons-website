%% Component Map - Detailed module and component breakdown
%% Shows relationships, dependencies, and responsibilities

classDiagram
    class Router {
        +on(path, handler)
        +notFound(handler)
        +init()
        +navigate(path)
        -handleRouteChange()
        -matchRoute(path)
    }

    class Navigation {
        +render() string
        +attachEventListeners()
        -toggleMobileMenu()
        -highlightActiveLink()
    }

    class Footer {
        +render() string
    }

    class ThemeToggle {
        +theme string
        +render() string
        +toggle()
        +attachEventListeners()
        -applyTheme()
        -saveTheme()
    }

    class Card {
        +title string
        +description string
        +link string
        +tags array
        +render() string
    }

    class PageHeader {
        +title string
        +subtitle string
        +render() string
    }

    class SongAccordion {
        +songs array
        +render() string
        +attachEventListeners()
        -toggleSong(id)
    }

    class CollapsibleSection {
        +title string
        +content string
        +defaultOpen boolean
        +render() string
        +attachEventListeners()
        -toggle()
    }

    class TableResponsive {
        +headers array
        +rows array
        +render() string
    }

    class ContentLoader {
        +loadMarkdown(path) Promise
        -parseMarkdown(content) string
        -cache Map
    }

    class MarkdownParser {
        +parse(markdown) string
        -parseHeadings(text) string
        -parseParagraphs(text) string
        -parseLinks(text) string
    }

    class TemplateHelpers {
        +escapeHTML(text) string
        +formatDate(date) string
        +truncate(text, length) string
    }

    class MainApp {
        +init()
        -renderNavigation()
        -renderFooter()
        -setupRoutes()
        -setupKeyboardShortcuts()
    }

    class HomePage {
        +renderHomePage()
    }

    class AppsPage {
        +renderAppsPage()
    }

    class IdeasPage {
        +renderIdeasPage()
    }

    class SoundsPage {
        +renderSoundsPage()
    }

    class ConnectPage {
        +renderConnectPage()
    }

    class NotFoundPage {
        +render404Page()
    }

    class AppDetailPages {
        +renderCarbonAcxPage()
        +renderClipComposerPage()
        +renderHotboxPage()
        +renderListMakerPage()
        +renderOrpheusSDKPage()
        +renderTidalMCPPage()
        +renderWordBirdPage()
    }

    class IdeaDetailPages {
        +render27SuppositionsPage()
        +renderNumaNetworkPage()
        +renderOSDEventsPage()
        +renderProtocolsOfSoundPage()
    }

    class SoundsDetailPages {
        +renderLyricsPage()
        +renderDiscographyPage()
        +renderPortfolioPage()
    }

    class SongData {
        +songs array~Song~
    }

    class Song {
        +title string
        +lyrics string
    }

    class WorkerApp {
        +default Hono
    }

    class BlogRoutes {
        +GET /blog
        +GET /blog/entry/:id
        +GET /rss.xml
    }

    class AdminRoutes {
        +GET /admin
        +POST /admin/login
        +GET /admin/logout
        +POST /admin/entry
        +GET /admin/entry/:id
        +PUT /admin/entry/:id
        +DELETE /admin/entry/:id
        +POST /admin/upload
        +GET /admin/create
        +POST /admin/canvas
        +GET /admin/canvas/:id
        +GET /admin/giphy
    }

    class AssetRoutes {
        +GET /images/:filename
        +GET /* (static assets)
    }

    class AuthMiddleware {
        +isAuthenticated(context) boolean
        +requireAuth(context)
    }

    class Templates {
        +renderBlog(entries) string
        +renderAdmin(entries) string
        +renderAdminLogin(error) string
        +renderCanvasCreator() string
    }

    class D1Database {
        +prepare(query) Statement
        +exec(query)
    }

    class R2Bucket {
        +get(key) Object
        +put(key, value, options)
        +delete(key)
    }

    class AssetBinding {
        +fetch(request) Response
    }

    MainApp --> Router : uses
    MainApp --> Navigation : creates
    MainApp --> Footer : creates
    MainApp --> ThemeToggle : creates

    Router --> HomePage : lazy loads
    Router --> AppsPage : lazy loads
    Router --> IdeasPage : lazy loads
    Router --> SoundsPage : lazy loads
    Router --> ConnectPage : lazy loads
    Router --> NotFoundPage : lazy loads

    HomePage --> Card : uses
    HomePage --> PageHeader : uses
    HomePage --> ContentLoader : uses

    AppsPage --> Card : uses
    AppsPage --> PageHeader : uses
    AppsPage --> Router : navigates

    Router --> AppDetailPages : lazy loads
    AppDetailPages --> ContentLoader : uses
    AppDetailPages --> PageHeader : uses
    AppDetailPages --> Card : uses

    Router --> IdeaDetailPages : lazy loads
    IdeaDetailPages --> ContentLoader : uses
    IdeaDetailPages --> PageHeader : uses

    Router --> SoundsDetailPages : lazy loads
    SoundsDetailPages --> SongAccordion : uses
    SoundsDetailPages --> SongData : reads
    SoundsDetailPages --> PageHeader : uses
    SoundsDetailPages --> TableResponsive : uses

    SongData --> Song : contains

    ConnectPage --> ContentLoader : uses
    ConnectPage --> PageHeader : uses

    ContentLoader --> MarkdownParser : uses
    MarkdownParser --> TemplateHelpers : uses

    WorkerApp --> BlogRoutes : defines
    WorkerApp --> AdminRoutes : defines
    WorkerApp --> AssetRoutes : defines
    WorkerApp --> AuthMiddleware : uses

    BlogRoutes --> D1Database : queries
    BlogRoutes --> Templates : renders

    AdminRoutes --> AuthMiddleware : requires
    AdminRoutes --> D1Database : queries
    AdminRoutes --> R2Bucket : uploads
    AdminRoutes --> Templates : renders

    AssetRoutes --> R2Bucket : serves
    AssetRoutes --> AssetBinding : serves

    Templates --> TemplateHelpers : uses
