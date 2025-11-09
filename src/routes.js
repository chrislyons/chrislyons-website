/**
 * Route Configuration
 *
 * Maps route paths to page modules with code splitting via dynamic imports
 */

export const routes = [
  // Home
  {
    path: '/',
    load: () => import('./pages/HomePage.js').then(m => m.renderHomePage)
  },

  // Apps Section
  {
    path: '/apps',
    load: () => import('./pages/AppsPage.js').then(m => m.renderAppsPage)
  },
  {
    path: '/apps/carbon-acx',
    load: () => import('./pages/apps/index.js').then(m => m.renderCarbonAcxPage)
  },
  {
    path: '/apps/clip-composer',
    load: () => import('./pages/apps/index.js').then(m => m.renderClipComposerPage)
  },
  {
    path: '/apps/hotbox',
    load: () => import('./pages/apps/index.js').then(m => m.renderHotboxPage)
  },
  {
    path: '/apps/listmaker',
    load: () => import('./pages/apps/index.js').then(m => m.renderListMakerPage)
  },
  {
    path: '/apps/orpheus-sdk',
    load: () => import('./pages/apps/index.js').then(m => m.renderOrpheusSDKPage)
  },
  {
    path: '/apps/tidal-mcp',
    load: () => import('./pages/apps/index.js').then(m => m.renderTidalMCPPage)
  },
  {
    path: '/apps/wordbird',
    load: () => import('./pages/apps/index.js').then(m => m.renderWordBirdPage)
  },

  // Ideas Section
  {
    path: '/ideas',
    load: () => import('./pages/IdeasPage.js').then(m => m.renderIdeasPage)
  },
  {
    path: '/ideas/27-suppositions',
    load: () => import('./pages/ideas/index.js').then(m => m.render27SuppositionsPage)
  },
  {
    path: '/ideas/numa-network',
    load: () => import('./pages/ideas/index.js').then(m => m.renderNumaNetworkPage)
  },
  {
    path: '/ideas/osd-events',
    load: () => import('./pages/ideas/index.js').then(m => m.renderOSDEventsPage)
  },
  {
    path: '/ideas/protocols-of-sound',
    load: () => import('./pages/ideas/index.js').then(m => m.renderProtocolsOfSoundPage)
  },

  // Sounds Section
  {
    path: '/sounds',
    load: () => import('./pages/SoundsPage.js').then(m => m.renderSoundsPage)
  },
  {
    path: '/sounds/lyrics',
    load: () => import('./pages/sounds/index.js').then(m => m.renderLyricsPage)
  },
  {
    path: '/sounds/discography',
    load: () => import('./pages/sounds/index.js').then(m => m.renderDiscographyPage)
  },
  {
    path: '/sounds/portfolio',
    load: () => import('./pages/sounds/index.js').then(m => m.renderPortfolioPage)
  },

  // Connect
  {
    path: '/connect',
    load: () => import('./pages/ConnectPage.js').then(m => m.renderConnectPage)
  }
];

// 404 handler
export const notFoundRoute = {
  load: () => import('./pages/NotFoundPage.js').then(m => m.render404Page)
};
