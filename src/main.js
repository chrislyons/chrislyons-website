/**
 * Chris Lyons Website - Main Entry Point
 *
 * Initializes the application with routing, components, and content loading
 */

import './style.css';

// Import components
import { Navigation } from './components/Navigation.js';
import { Footer } from './components/Footer.js';
import { Card } from './components/Card.js';
import { CollapsibleSection } from './components/CollapsibleSection.js';
import { TableResponsive } from './components/TableResponsive.js';
import { PageHeader } from './components/PageHeader.js';
import { ThemeToggle } from './components/ThemeToggle.js';
import { SongAccordion } from './components/SongAccordion.js';

// Import utilities
import router from './utils/router.js';
import contentLoader from './utils/contentLoader.js';

// Import data
import { songs } from './data/songs.js';

// Global state
let navigation = null;
let footer = null;
let themeToggle = null;

/**
 * Set up global keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // '\' key to cycle themes
    if (e.key === '\\' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Don't trigger if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      if (!isTyping) {
        e.preventDefault();
        themeToggle.toggle();

        // Re-render theme toggle buttons with new icon
        const themeToggleContainer = document.getElementById('theme-toggle-container');
        const themeToggleContainerMobile = document.getElementById('theme-toggle-container-mobile');

        if (themeToggleContainer) {
          themeToggleContainer.innerHTML = themeToggle.render();
          themeToggle.attachEventListeners();
        }

        if (themeToggleContainerMobile) {
          themeToggleContainerMobile.innerHTML = themeToggle.render();
        }
      }
    }
  });
}

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 Chris Lyons Website Initializing...');

  // Initialize theme (must be first to apply dark mode immediately)
  themeToggle = new ThemeToggle();

  // Set up global keyboard shortcuts
  setupKeyboardShortcuts();

  // Initialize components
  navigation = new Navigation();
  footer = new Footer();

  // Render static components
  renderNavigation();
  renderFooter();

  // Set up routes
  setupRoutes();

  // Initialize router
  router.init();

  console.log('✅ Application Initialized');
  console.log(`🎨 Theme: ${themeToggle.theme}`);
}

/**
 * Render navigation component
 */
function renderNavigation() {
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = navigation.render();
    navigation.attachEventListeners();

    // Render theme toggle in navigation
    const themeToggleContainer = document.getElementById('theme-toggle-container');
    const themeToggleContainerMobile = document.getElementById('theme-toggle-container-mobile');

    if (themeToggleContainer) {
      themeToggleContainer.innerHTML = themeToggle.render();
      themeToggle.attachEventListeners();
    }

    if (themeToggleContainerMobile) {
      themeToggleContainerMobile.innerHTML = themeToggle.render();
      // Note: Event listeners are already attached from desktop render
    }
  }
}

/**
 * Render footer component
 */
function renderFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = footer.render();
  }
}

/**
 * Set up application routes
 */
function setupRoutes() {
  // Home page
  router.on('/', renderHomePage);

  // Apps section (new)
  router.on('/apps', renderAppsPage);
  router.on('/apps/carbon-acx', renderCarbonAcxPage);
  router.on('/apps/clip-composer', renderClipComposerPage);
  router.on('/apps/hotbox', renderHotboxPage);
  router.on('/apps/listmaker', renderListMakerPage);
  router.on('/apps/orpheus-sdk', renderOrpheusSDKPage);
  router.on('/apps/tidal-mcp', renderTidalMCPPage);
  router.on('/apps/wordbird', renderWordBirdPage);

  // Ideas section (new)
  router.on('/ideas', renderIdeasPage);
  router.on('/ideas/27-suppositions', render27SuppositionsPage);
  router.on('/ideas/numa-network', renderNumaNetworkPage);
  router.on('/ideas/osd-events', renderOSDEventsPage);
  router.on('/ideas/protocols-of-sound', renderProtocolsOfSoundPage);

  // Sounds section
  router.on('/sounds', renderSoundsPage);
  router.on('/sounds/lyrics', renderLyricsPage);
  router.on('/sounds/discography', renderDiscographyPage);
  router.on('/sounds/portfolio', renderPortfolioPage);

  // Connect page
  router.on('/connect', renderConnectPage);

  // 404 handler
  router.notFound(render404Page);
}

/**
 * Render home page
 */
function renderHomePage() {
  const pageData = contentLoader.getPageData('home');
  const siteData = contentLoader.getSiteData();

  contentLoader.updateDocumentTitle('');
  contentLoader.updateMetaDescription(siteData.description);

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section with Enhanced Animations -->
      <header class="text-center mb-12 mt-12 fade-in" style="animation-delay: 0.6s">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary leading-tight">
          hey it's ChrisLyons.com
        </h1>

        <!-- Blog Button -->
        <div class="mt-8 fade-in" style="animation-delay: 0.9s">
          <a href="/blog" class="blog-button">
            Blog
          </a>
        </div>

        <!-- Temporarily hidden - will be re-enabled later
        <p class="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed px-4">
          Since 2007 I've been building multichannel recording studios and broadcast systems,
          researching emerging technologies and writing, producing, and recording music and voice.
        </p>
        -->
      </header>

      <!-- Mission Statement - Temporarily hidden - will be re-enabled later
      <section class="mb-12 fade-in" style="animation-delay: 0.8s">
        <p class="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto px-4">
          My focus is creating reliable systems that serve the people who use them.
          My 'Numa' initiative is aimed at better supporting creative communities through
          equitable attribution frameworks, while broader research interests include
          bio-manufacturing methods and microplastics filtration systems.
        </p>
      </section>
      -->
    </div>
  `;
}

/**
 * Render Apps landing page
 */
function renderAppsPage() {
  contentLoader.updateDocumentTitle('Apps');

  // Get Apps navigation item and children
  const navigation = contentLoader.getNavigation();
  const appsNav = navigation.find(item => item.id === 'apps');
  const children = appsNav?.children || [];

  // Build cards for children
  const projectCards = children.map(child => {
    const pageData = contentLoader.getPageData(child.id);
    return {
      title: child.title,
      description: pageData?.meta?.description || '',
      link: child.path,
      clickable: true
    };
  });

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Apps',
        subtitle: 'Software & Tools',
        description: 'Software applications and tools built by Chris Lyons'
      })}

      <section class="mb-12">
        ${projectCards.length > 0 ? Card.renderGrid(projectCards) : '<p class="text-gray-600">No apps currently available.</p>'}
      </section>

      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render Ideas landing page
 */
function renderIdeasPage() {
  contentLoader.updateDocumentTitle('Ideas');

  // Get Ideas navigation item and children
  const navigation = contentLoader.getNavigation();
  const ideasNav = navigation.find(item => item.id === 'ideas');
  const children = ideasNav?.children || [];

  // Build cards for children
  const projectCards = children.map(child => {
    const pageData = contentLoader.getPageData(child.id);
    return {
      title: child.title,
      description: pageData?.meta?.description || '',
      link: child.path,
      clickable: true
    };
  });

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Ideas',
        subtitle: 'Concepts & Research',
        description: 'Long-form writing, research projects, and conceptual explorations by Chris Lyons'
      })}

      <section class="mb-12">
        ${projectCards.length > 0 ? Card.renderGrid(projectCards) : '<p class="text-gray-600">No ideas currently available.</p>'}
      </section>

      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render Systems landing page
 */
function renderSystemsPage() {
  contentLoader.updateDocumentTitle('Systems');

  // Get Systems navigation item and filter out hidden children
  const navigation = contentLoader.getNavigation();
  const systemsNav = navigation.find(item => item.id === 'systems');
  const visibleChildren = systemsNav?.children?.filter(child => !child.hidden) || [];

  // Build cards for visible children
  const projectCards = visibleChildren.map(child => {
    const pageData = contentLoader.getPageData(child.id);
    return {
      title: child.title,
      description: pageData?.meta?.description || '',
      link: child.path,
      clickable: true
    };
  });

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Systems',
        subtitle: 'Design & Studio Builds | Research & Inventions',
        description: 'Building multichannel recording studios, broadcast systems, and researching emerging technologies for climate innovation and sustainable manufacturing.'
      })}

      <!-- Research & Innovation Projects -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Research & Innovation</h2>
        ${projectCards.length > 0 ? Card.renderGrid(projectCards) : '<p class="text-gray-600">No projects currently available.</p>'}
      </section>

      <!-- Studio Design & Builds -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Studio Design & Builds</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <p class="text-lg text-gray-700 leading-relaxed">
            Since 2007, I've designed and built multichannel recording studios and broadcast systems,
            focusing on creating reliable infrastructure that serves creative communities and technical workflows.
          </p>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render placeholder page
 */
function renderPlaceholderPage(title, description) {
  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto text-center py-20">
      <h1 class="text-5xl font-bold mb-6 text-primary">${title}</h1>
      <p class="text-xl text-gray-600 mb-8">${description}</p>
      <p class="text-base text-gray-500">Content coming soon.</p>
      <div class="mt-8">
        <a href="/" class="link">← Back to home</a>
      </div>
    </div>
  `;
}

// Helper function to check if a page is hidden
function isPageHidden(pageId) {
  const navigation = contentLoader.getNavigation();

  const checkNavItem = (items) => {
    for (const item of items) {
      if (item.id === pageId && item.hidden) {
        return true;
      }
      if (item.children) {
        if (checkNavItem(item.children)) {
          return true;
        }
      }
    }
    return false;
  };

  return checkNavItem(navigation);
}

// Boot Industries page implementation
function renderBootIndustriesPage() {
  // Check if page is hidden
  if (isPageHidden('boot-industries')) {
    render404Page();
    return;
  }

  contentLoader.updateDocumentTitle('Boot Industries, Inc.');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-5xl mx-auto">
      ${PageHeader.render({
        title: 'Boot Industries, Inc.',
        subtitle: 'Carbon Nanomaterials Platform',
        description: 'Transforming agricultural waste into high-performance electrodes for energy storage systems'
      })}

      <!-- Executive Summary -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Executive Summary</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            <strong>Boot Industries Inc.</strong> is developing a proprietary carbon nanomaterials platform
            that transforms agricultural waste into high-performance electrodes for energy storage systems.
          </p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Projected materials cost up to <strong>90% lower</strong> than conventional carbon materials</li>
            <li>Targeting commercial-grade electrochemical performance</li>
            <li>Positioned at intersection of climate innovation, localized manufacturing, and energy storage economics</li>
          </ul>
        </div>
      </section>

      <!-- Market Opportunity -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Market Opportunity</h2>
        <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <h3 class="text-xl font-semibold mb-4 text-gray-800">Global Addressable Market:</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>$6.6B</strong> for carbon-based capacitor materials</li>
            <li><strong>25–50%</strong> of BOM cost in energy storage systems</li>
            <li>Supercapacitor market growing <strong>25% CAGR</strong> through 2030</li>
            <li><strong>Initial Target Market (3-Year Focus):</strong> ~$450M in North American battery and energy hardware markets</li>
          </ul>
        </div>
      </section>

      <!-- Comparative Technology Features Table -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Comparative Technology Features</h2>
        ${TableResponsive.render({
          headers: ['Attribute', 'Boot Industries (Projected)', 'Incumbents'],
          rows: [
            ['Feedstock', 'Agricultural waste (biogenic)', 'Petroleum-based/synthetic graphite'],
            ['Energy Input', 'Sub-700°C, low emissions', '800–1200°C, high energy demand'],
            ['Surface Area (BET)', '>1,500 m²/g (projected)', '1,000–2,000 m²/g typical'],
            ['Cost per kg', '< CAD $7', 'CAD $67–$530'],
            ['Carbon Footprint', 'Biogenic carbon, potentially negative', 'Net-positive, fossil-linked']
          ],
          caption: 'Comparison of Boot Industries technology features versus incumbent solutions',
          striped: true,
          hoverable: true
        })}
      </section>

      <!-- Technology Status Table -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Technology Status</h2>
        ${TableResponsive.render({
          headers: ['Milestone', 'Status'],
          rows: [
            ['Bench-scale carbonization system', '✅ Functional prototype complete'],
            ['Sample-grade carbon produced', '✅ Multiple batches created'],
            ['Surface area estimates', '✅ Targeting >1,500 m²/g'],
            ['Formal material testing', '🔄 In planning (Q3 2025)'],
            ['Patent status', '✅ Provisional filed (2025)'],
            ['TRL level', 'TRL 4 → Target TRL 6 by Q4 2025']
          ],
          caption: 'Current development status and milestones',
          striped: true,
          hoverable: true
        })}
      </section>

      <!-- Target Segments -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Target Segments</h2>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-lg text-gray-700 mb-4">
            Identified <strong>23 Canadian prospects</strong> across:
          </p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Energy Storage Integrators</li>
            <li>Battery & EV Supply Chain</li>
            <li>Power Electronics & Hardware</li>
          </ul>
        </div>
      </section>

      <!-- Image Placeholders -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Technical Diagrams</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="font-medium">Technical Diagram 1</p>
              <p class="text-sm">Carbonization Process</p>
            </div>
          </div>
          <div class="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="font-medium">Technical Diagram 2</p>
              <p class="text-sm">Material Structure</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300">
          <div class="text-center text-gray-500">
            <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="font-medium text-lg">Artistic Rendering</p>
            <p class="text-sm">Manufacturing Facility Concept</p>
          </div>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderHydrophobicPage() {
  contentLoader.updateDocumentTitle('Hydrophobic Field Harvesters');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-5xl mx-auto">
      ${PageHeader.render({
        title: 'Hydrophobic Field Harvesters',
        subtitle: 'Passive Adsorbers for Waterborne Microplastics Removal',
        description: 'Modular technology designed to extract hydrophobic contaminants from water sources'
      })}

      <!-- Overview -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Overview</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            The Hydrophobic Field Harvesters (HFHs) are a passive, modular technology designed to extract hydrophobic contaminants from water sources, including:
          </p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Microplastics</strong></li>
            <li><strong>Oils</strong></li>
            <li><strong>PFAS chemicals</strong></li>
            <li><strong>Synthetic runoff</strong></li>
          </ul>
        </div>
      </section>

      <!-- Product Series -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-8 text-primary">Product Series</h2>

        <!-- HFH::FlowTrap Series -->
        <div class="mb-10">
          <h3 class="text-2xl font-bold mb-4 text-secondary">1. HFH::FlowTrap Series</h3>
          <p class="text-lg font-semibold text-gray-600 mb-4">Urban Runoff Interceptors</p>

          <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Purpose</h4>
              <p class="text-gray-700">Capture pollutants at discharge points before entering natural waterways</p>
            </div>

            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Deployment Points</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul class="list-disc list-inside space-y-1 text-gray-700">
                  <li>Washing machine lines</li>
                  <li>Shower lines</li>
                  <li>Storm drains</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-gray-700">
                  <li>Downspouts</li>
                  <li>Greywater pipes</li>
                  <li>Commercial floor drains</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Key Features</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li>Modular cartridges with layered hydrophobic sorbents</li>
                <li>DIY-install or wall-mount housing</li>
                <li>Built-in overflow safeguards</li>
                <li>No power required</li>
                <li>Optional saturation indicator</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- HFH::Field Series -->
        <div class="mb-10">
          <h3 class="text-2xl font-bold mb-4 text-secondary">2. HFH::Field Series</h3>
          <p class="text-lg font-semibold text-gray-600 mb-4">Distributed Environmental Harvesters</p>

          <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Purpose</h4>
              <p class="text-gray-700">Passively adsorb floating microplastics and pollutants from open water environments</p>
            </div>

            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Deployment Points</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul class="list-disc list-inside space-y-1 text-gray-700">
                  <li>Shorelines and docks</li>
                  <li>Ponds</li>
                  <li>Stormwater retention basins</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-gray-700">
                  <li>Lakefront areas</li>
                  <li>Slow-moving river sections</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 class="text-xl font-semibold mb-3 text-gray-800">Key Features</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li>Compact floating design</li>
                <li>Exchangeable sorbent core</li>
                <li>No power or anchors required</li>
                <li>Optional solar-assisted active model</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Funding Roadmap -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Funding Roadmap</h2>
        ${TableResponsive.render({
          headers: ['Phase', 'Focus Area', 'Estimated Budget', 'Deliverables', 'Funding Sources'],
          rows: [
            ['1', 'Tier 1 Prototype', '$25,000-$30,000', 'Proof-of-concept units', 'Grants, angel R&D capital'],
            ['2', 'Pilot Programs', '$150,000-$300,000', 'Municipal/cottage pilots', 'Environment Canada, IRAP'],
            ['3', 'National Deployment', '$3M-$12M', 'Manufacturing run', 'Provincial/Green Infrastructure funds']
          ],
          caption: 'Three-phase funding roadmap for Hydrophobic Field Harvesters',
          striped: true,
          hoverable: true
        })}
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderSoundsPage() {
  contentLoader.updateDocumentTitle('Sounds');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Sounds',
        subtitle: 'Production Work | Compositions',
        description: 'Music production, recording, and audio engineering work spanning 17+ years'
      })}

      <!-- Music & Production -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Music & Production</h2>
        ${Card.renderGrid([
          {
            title: 'Discography',
            description: 'Albums, EPs, and releases across multiple projects and collaborations.',
            link: '/sounds/discography',
            clickable: true
          },
          {
            title: 'Audio Samples',
            description: 'Technical audio examples and production showcases from studio work.',
            link: '/sounds/audio-samples',
            clickable: true
          }
        ])}
      </section>

      <!-- Production Focus -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Production Focus</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            Since 2007, I've produced, recorded, and engineered music across genres, focusing on:
          </p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Multichannel recording and mix engineering</li>
            <li>Broadcast system design and implementation</li>
            <li>Technical audio workflows and signal path optimization</li>
            <li>Creative collaboration and session production</li>
          </ul>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

function renderDiscographyPage() {
  contentLoader.updateDocumentTitle('Discography');

  const albums = [
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3394260668/size=large/bgcol=ffffff/linkcol=333333/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/transbastardized-orphan-under-a-harvest-moon">Transbastardized Orphan under a Harvest Moon by Heartbeat Hotel</a></iframe>',
      title: 'Transbastardized Orphan under a Harvest Moon',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3513920352/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/cottage-country-lost-tracks-rarities">Cottage Country (Lost Tracks &amp; Rarities) by Heartbeat Hotel</a></iframe>',
      title: 'Cottage Country (Lost Tracks & Rarities)',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2794385769/size=large/bgcol=333333/linkcol=fe7eaf/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/fetus-dreams">Fetus Dreams by Heartbeat Hotel</a></iframe>',
      title: 'Fetus Dreams',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2124895145/size=large/bgcol=333333/linkcol=fe7eaf/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/coughdrops-ep">CoughDrops EP by Heartbeat Hotel</a></iframe>',
      title: 'CoughDrops EP',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=4015725829/size=large/bgcol=333333/linkcol=9a64ff/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/intae-woe">Intae Woe by Heartbeat Hotel</a></iframe>',
      title: 'Intae Woe',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3126550928/size=large/bgcol=ffffff/linkcol=e99708/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/alton-sterling-ep">ALTON STERLING EP by Magical Superflowers</a></iframe>',
      title: 'ALTON STERLING EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3108652218/size=large/bgcol=ffffff/linkcol=63b2cc/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/hello-world-ep">HELLO WORLD EP by Magical Superflowers</a></iframe>',
      title: 'HELLO WORLD EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=4026392449/size=large/bgcol=ffffff/linkcol=de270f/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/holding-pattern-ep">HOLDING PATTERN EP by Magical Superflowers</a></iframe>',
      title: 'HOLDING PATTERN EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3578788191/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/moonbulbs-ep">MOONBULBS EP by Magical Superflowers</a></iframe>',
      title: 'MOONBULBS EP',
      artist: 'Magical Superflowers'
    }
  ];

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <!-- Header with inline Volume Control -->
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Discography</h1>
          <div class="volume-control-container">
            <button id="volume-button" class="volume-button" aria-label="Volume control">
              <svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
            <div id="volume-slider-container" class="volume-slider-container">
              <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="90" aria-label="Volume slider">
              <span id="volume-percentage" class="volume-percentage">90%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Carousel Container -->
      <div class="carousel-3d-wrapper">
        <!-- Navigation Arrows -->
        <button id="carousel-prev" class="carousel-nav carousel-nav-left" aria-label="Previous album">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button id="carousel-next" class="carousel-nav carousel-nav-right" aria-label="Next album">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- 3D Carousel Scene -->
        <div class="carousel-3d-scene">
          <div id="carousel-3d" class="carousel-3d">
            ${albums.map((album, index) => `
              <div class="carousel-3d-item" data-index="${index}">
                <div class="bandcamp-embed-container">
                  ${album.embed}
                </div>
                <div class="album-info">
                  <h3 class="font-semibold text-gray-900">${album.title}</h3>
                  <p class="text-sm text-gray-600">${album.artist}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Back Navigation -->
      <div style="margin-top: 14rem;" class="text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>

    <style>
      .carousel-3d-wrapper {
        position: relative;
        width: 100%;
        height: 900px;
        margin: 0 0 2rem;
      }

      .carousel-3d-scene {
        width: 100%;
        height: 100%;
        perspective: 2000px;
        perspective-origin: 50% 45%;
        overflow: visible;
      }

      .carousel-3d {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .carousel-3d-item {
        position: absolute;
        left: 50%;
        top: 55%;
        width: 380px;
        transform-style: preserve-3d;
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: -190px;
        margin-top: -280px;
      }

      .bandcamp-embed-container {
        width: 100%;
        height: 560px;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        background: #fff;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .album-info {
        text-align: center;
        margin-top: 1.5rem;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .carousel-3d-item[data-position="0"] .album-info {
        opacity: 1;
      }

      .carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #333;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .carousel-nav:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(-50%) scale(1.15);
      }

      .carousel-nav:active {
        transform: translateY(-50%) scale(1.05);
      }

      .carousel-nav-left {
        left: 10%;
      }

      .carousel-nav-right {
        right: 10%;
      }

      /* Volume Control Styles */
      .volume-control-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .volume-button {
        background: var(--card-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-primary, #333);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .volume-button:hover {
        background: var(--card-bg-hover, rgba(255, 255, 255, 1));
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
      }

      .volume-button svg {
        width: 24px;
        height: 24px;
      }

      .volume-slider-container {
        position: absolute;
        left: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: var(--card-bg, rgba(255, 255, 255, 0.98));
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 1rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
        white-space: nowrap;
      }

      .volume-slider-container.visible {
        opacity: 1;
        pointer-events: auto;
      }

      .volume-slider {
        width: 120px;
        height: 4px;
        border-radius: 2px;
        background: var(--border-color, #ddd);
        outline: none;
        -webkit-appearance: none;
        appearance: none;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color, #4A90E2);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .volume-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        background: var(--primary-hover, #3A7BC8);
      }

      .volume-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color, #4A90E2);
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }

      .volume-slider::-moz-range-thumb:hover {
        transform: scale(1.2);
        background: var(--primary-hover, #3A7BC8);
      }

      .volume-percentage {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary, #333);
        min-width: 40px;
        text-align: right;
      }

      @media (max-width: 1200px) {
        .carousel-3d-wrapper {
          height: 700px;
        }

        .carousel-3d-item {
          width: 340px;
          margin-left: -170px;
          margin-top: -260px;
        }

        .bandcamp-embed-container {
          height: 520px;
        }

        .carousel-nav-left {
          left: 5%;
        }

        .carousel-nav-right {
          right: 5%;
        }
      }

      @media (max-width: 768px) {
        .carousel-3d-wrapper {
          height: 600px;
        }

        .carousel-3d-item {
          width: 300px;
          margin-left: -150px;
          margin-top: -240px;
        }

        .bandcamp-embed-container {
          height: 480px;
        }

        .carousel-nav {
          width: 48px;
          height: 48px;
        }

        .carousel-nav-left {
          left: 20px;
        }

        .carousel-nav-right {
          right: 20px;
        }
      }
    </style>
  `;

  // Add 3D carousel navigation functionality
  setTimeout(() => {
    const carousel = document.getElementById('carousel-3d');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const items = document.querySelectorAll('.carousel-3d-item');

    if (!carousel || !prevBtn || !nextBtn || items.length === 0) return;

    let currentIndex = 0;
    const totalAlbums = 9;
    const anglePerItem = 360 / totalAlbums;
    const radius = 650; // Distance from center

    function updateCarousel() {
      // Rotate the entire carousel
      const rotationAngle = -anglePerItem * currentIndex;
      carousel.style.transform = 'rotateY(' + rotationAngle + 'deg)';

      // Position and style each item
      items.forEach((item, index) => {
        const itemAngle = anglePerItem * index;
        const relativePosition = (index - currentIndex + totalAlbums) % totalAlbums;

        // Position in 3D space
        item.style.transform = 'rotateY(' + itemAngle + 'deg) translateZ(' + radius + 'px)';

        // Calculate distance from center (0 = center, higher = further)
        const distanceFromCenter = Math.min(relativePosition, totalAlbums - relativePosition);

        // Apply Cover Flow lighting and scaling effects
        let opacity = 1;
        let scale = 1;
        let brightness = 1;
        let zIndex = 50;

        if (distanceFromCenter === 0) {
          // Center item - full brightness
          opacity = 1;
          scale = 1;
          brightness = 1;
          zIndex = 100;
        } else if (distanceFromCenter === 1) {
          // Adjacent items - slightly dimmed
          opacity = 0.7;
          scale = 0.85;
          brightness = 0.8;
          zIndex = 80;
        } else if (distanceFromCenter === 2) {
          // Second tier - more dimmed
          opacity = 0.4;
          scale = 0.7;
          brightness = 0.6;
          zIndex = 60;
        } else {
          // Far items - heavily dimmed
          opacity = 0.2;
          scale = 0.6;
          brightness = 0.4;
          zIndex = 40;
        }

        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.querySelector('.bandcamp-embed-container').style.transform = 'scale(' + scale + ')';
        item.querySelector('.bandcamp-embed-container').style.filter = 'brightness(' + brightness + ')';
        item.setAttribute('data-position', distanceFromCenter);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalAlbums) % totalAlbums;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalAlbums;
      updateCarousel();
    });

    // Keyboard navigation (scoped to discography page)
    const handleKeydown = (e) => {
      if (window.location.pathname === '/sounds/discography') {
        if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + totalAlbums) % totalAlbums;
          updateCarousel();
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % totalAlbums;
          updateCarousel();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    // Initialize carousel
    updateCarousel();

    // Volume Control Logic
    const volumeButton = document.getElementById('volume-button');
    const volumeSliderContainer = document.getElementById('volume-slider-container');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentage = document.getElementById('volume-percentage');
    const volumeIcon = document.getElementById('volume-icon');
    const carouselScene = document.querySelector('.carousel-3d-scene');

    let hideTimeout;

    function updateVolumeIcon(volume) {
      if (volume === 0) {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      } else if (volume < 50) {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      } else {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
      }
    }

    function showVolumeSlider() {
      volumeSliderContainer.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        volumeSliderContainer.classList.remove('visible');
      }, 3000);
    }

    function hideVolumeSlider() {
      clearTimeout(hideTimeout);
      volumeSliderContainer.classList.remove('visible');
    }

    function toggleVolumeSlider() {
      if (volumeSliderContainer.classList.contains('visible')) {
        hideVolumeSlider();
      } else {
        showVolumeSlider();
      }
    }

    function setVolume(volume) {
      const normalizedVolume = volume / 100;
      carouselScene.style.opacity = 0.3 + (normalizedVolume * 0.7); // Keep min opacity at 0.3

      // Store volume in localStorage
      localStorage.setItem('discographyVolume', volume);
      volumePercentage.textContent = volume + '%';
      updateVolumeIcon(volume);
    }

    // Load saved volume
    const savedVolume = localStorage.getItem('discographyVolume') || 90;
    volumeSlider.value = savedVolume;
    setVolume(parseInt(savedVolume));

    volumeButton.addEventListener('click', () => {
      toggleVolumeSlider();
    });

    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      setVolume(volume);
      showVolumeSlider(); // Reset hide timer on interaction
    });

    // Keep slider visible when hovering over it
    volumeSliderContainer.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    volumeSliderContainer.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        volumeSliderContainer.classList.remove('visible');
      }, 1000);
    });

    // Single player logic - pause others when one plays
    const iframes = document.querySelectorAll('.bandcamp-embed-container iframe');
    let currentlyPlayingIndex = null;

    // Create observer for each iframe
    iframes.forEach((iframe, index) => {
      // Add click listener to track active player
      iframe.addEventListener('load', () => {
        iframe.contentWindow.addEventListener('click', () => {
          if (currentlyPlayingIndex !== null && currentlyPlayingIndex !== index) {
            // Attempt to pause the currently playing iframe
            // Note: This has limited cross-origin support
            const currentIframe = iframes[currentlyPlayingIndex];
            try {
              currentIframe.contentWindow.postMessage('{"method":"pause"}', '*');
            } catch (e) {
              // Cross-origin restriction, user will need to manually pause
            }
          }
          currentlyPlayingIndex = index;
        });
      });
    });

  }, 100);
}

function renderAudioSamplesPage() {
  contentLoader.updateDocumentTitle('Audio Samples');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Audio Samples',
        subtitle: 'Technical Audio Examples',
        description: 'Production showcases and technical demonstrations from studio work'
      })}

      <div class="bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-xl text-gray-600 mb-4">Audio samples content coming soon.</p>
        <p class="text-base text-gray-500">Technical audio examples and production showcases will be hosted here.</p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>
  `;
}

function renderWritingPage() {
  contentLoader.updateDocumentTitle('Writing');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Writing',
        subtitle: 'Essays | Lyrics | Long-form Work',
        description: 'Essays, song lyrics, poems, and long-form explorations spanning technical systems, creative processes, and sound'
      })}

      <!-- Writing Categories -->
      <section class="mb-12">
        ${Card.renderGrid([
          {
            title: 'Essays',
            description: 'Thoughts on technical systems, creative processes, and research.',
            link: '/writing/essays',
            clickable: true
          },
          {
            title: 'Hotbox',
            description: 'Narrative compiler for interactive essays backed by verified facts.',
            link: '/writing/hotbox',
            clickable: true
          },
          {
            title: 'Lyrics',
            description: '39 song compositions and collaborative works.',
            link: '/writing/lyrics',
            clickable: true
          },
          {
            title: 'Poems',
            description: 'Poetry collection exploring themes of technology and nature.',
            link: '/writing/poems',
            clickable: true
          },
          {
            title: '27 Suppositions',
            description: 'Long-form exploration of creative and technical concepts.',
            link: '/writing/27-suppositions',
            clickable: true
          },
          {
            title: 'Protocols of Sound',
            description: 'Historical exploration of 20th century audio technology.',
            link: '/writing/protocols-of-sound',
            clickable: true
          }
        ])}
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

function renderEssaysPage() {
  contentLoader.updateDocumentTitle('Essays');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-3xl mx-auto">
      ${PageHeader.render({
        title: 'Essays',
        subtitle: 'Thoughts & Explorations',
        description: 'Essays exploring technical systems, creative processes, and research'
      })}

      <!-- Coming Soon -->
      <div class="bg-gray-50 rounded-lg p-12 text-center mb-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Essays Coming Soon</h3>
        <p class="text-gray-600">
          This section will feature essays on technical systems, creative methodologies, and research explorations.
        </p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

function renderLyricsPage() {
  contentLoader.updateDocumentTitle('Lyrics');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Collected Lyrics',
        subtitle: 'Song Compositions',
        description: ''
      })}

      <!-- Song Accordion -->
      <section class="mb-12">
        ${SongAccordion.render(songs)}
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>
  `;

  // Attach event listeners after rendering
  SongAccordion.attachEventListeners();
}

function renderPoemsPage() {
  contentLoader.updateDocumentTitle('Poems');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-3xl mx-auto">
      ${PageHeader.render({
        title: 'Poems',
        subtitle: 'Poetry Collection',
        description: 'Poems exploring themes of technology, nature, and human experience'
      })}

      <!-- Coming Soon -->
      <div class="bg-gray-50 rounded-lg p-12 text-center mb-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Poems Coming Soon</h3>
        <p class="text-gray-600">
          Poetry exploring the intersection of technical systems and natural patterns.
        </p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

function render27SuppositionsPage() {
  contentLoader.updateDocumentTitle('27 Suppositions');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: '27 Suppositions',
        subtitle: 'Long-form Exploration',
        description: 'An extended exploration of creative and technical concepts'
      })}

      <!-- Coming Soon -->
      <div class="bg-gray-50 rounded-lg p-12 text-center mb-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">27 Suppositions</h3>
        <p class="text-gray-600 mb-4">
          A long-form work exploring 27 interconnected ideas about creativity, technology, and systems thinking.
        </p>
        <p class="text-sm text-gray-500">
          Content will be published here soon.
        </p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

function renderProtocolsOfSoundPage() {
  contentLoader.updateDocumentTitle('Protocols of Sound');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Protocols of Sound',
        subtitle: 'Historical Exploration',
        description: 'A historical exploration of 20th century audio technology and recording practices'
      })}

      <!-- Overview -->
      <div class="bg-white rounded-lg border border-gray-200 p-8 mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">About This Work</h2>
        <p class="text-lg text-gray-700 mb-4">
          <em>Protocols of Sound</em> examines the evolution of audio recording technology throughout the 20th century,
          exploring how technical constraints shaped creative practices and how innovation emerged from limitations.
        </p>
        <p class="text-gray-600">
          Topics include: early recording technology, magnetic tape development, multitrack recording,
          signal processing evolution, and the transition from analog to digital workflows.
        </p>
      </div>

      <!-- Coming Soon -->
      <div class="bg-gray-50 rounded-lg p-12 text-center mb-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Full Text Coming Soon</h3>
        <p class="text-gray-600">
          The complete manuscript is currently being prepared for publication.
        </p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

// New Systems Project Pages

function renderCarbonAcxPage() {
  contentLoader.updateDocumentTitle('Carbon ACX');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Carbon ACX</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://github.com/chrislyons/carbon-acx" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Open reference stack for trustworthy carbon accounting
        </p>
        <p class="text-sm text-gray-500">v1.2 • Open Source • MIT License</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Measurement You Can Inspect</h3>
            <p class="text-sm text-gray-700 mb-2">Every published number carries lineage and checksums</p>
            <p class="text-xs text-gray-600">Python derivation • Validation logic • Manifest tracking</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Multi-Surface Delivery</h3>
            <p class="text-sm text-gray-700 mb-2">Dash, React, and Cloudflare Workers all consume identical artifacts</p>
            <p class="text-xs text-gray-600">Interactive tooling • Static sites • Edge APIs</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Reproducible Datasets</h3>
            <p class="text-sm text-gray-700 mb-2">Canonical CSVs for activities, emission factors, and grid intensity</p>
            <p class="text-xs text-gray-600">Version control • Auditable • Rebuild-ready</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Manifest-First Architecture</h3>
            <p class="text-sm text-gray-700 mb-2">Byte hashes, schema versions, and provenance tracking</p>
            <p class="text-xs text-gray-600">Figure lineage • Content-addressed • Immutable artifacts</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Multiple Emission Layers</h3>
            <p class="text-sm text-gray-700 mb-2">12 layer types from professional services to defense installations</p>
            <p class="text-xs text-gray-600">Industry categories • Scenario simulations • Earth system feedbacks</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Local Chat with WebGPU</h3>
            <p class="text-sm text-gray-700 mb-2">Browser-based LLM inference for data exploration</p>
            <p class="text-xs text-gray-600">@mlc-ai/web-llm • Privacy-first • No server required</p>
          </div>
        </div>
      </section>

      <!-- Emission Layers -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Emission Layers</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Professional Services</span>
            </div>
            <p class="text-sm text-gray-600">Coffee consumption • Transit • SaaS productivity suites</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Industrial Operations</span>
            </div>
            <p class="text-sm text-gray-600">Manufacturing • Heavy equipment • Lab operations</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Defense & Military</span>
            </div>
            <p class="text-sm text-gray-600">Aviation • Installations • Supply chain • Weapons manufacturing</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Scenario Simulations</span>
            </div>
            <p class="text-sm text-gray-600">Armed conflict • Wildfire impacts • Disaster modeling</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Earth System Feedbacks</span>
            </div>
            <p class="text-sm text-gray-600">Ocean CO₂ uptake • Cryosphere albedo loss • Climate dynamics</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">Industrial Externalities</span>
            </div>
            <p class="text-sm text-gray-600">Tailings ponds • Acid mine drainage • Environmental impact</p>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Use Cases</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="text-gray-700">Climate disclosure teams</div>
          <div class="text-gray-700">Operational emissions tracking</div>
          <div class="text-gray-700">Analyst exploration</div>
          <div class="text-gray-700">Scenario modeling</div>
          <div class="text-gray-700">Supply chain analysis</div>
          <div class="text-gray-700">Auditable reporting</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Python 3.11+</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Poetry</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Pydantic</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Dash</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">React + Vite</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Tailwind CSS</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Cloudflare Pages</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Cloudflare Workers</span>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

function renderListMakerPage() {
  contentLoader.updateDocumentTitle('ListMaker');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">ListMaker</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://listmaker.boot.industries" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Launch App
            </a>
            <a href="https://github.com/chrislyons/listmaker" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Structured lists with custom columns, offline storage, and password protection
        </p>
        <p class="text-sm text-gray-500">v0.1.0 • Open Source • Local-First</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Custom Columns</h3>
            <p class="text-sm text-gray-700 mb-2">Text, numbers, dropdowns, checkboxes, commands, URLs</p>
            <p class="text-xs text-gray-600">Auto-increment • Required validation • Select options</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Project Organization</h3>
            <p class="text-sm text-gray-700 mb-2">Color-coded projects with collapsible hierarchy</p>
            <p class="text-xs text-gray-600">Editable labels • Bulk operations • Custom colors</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Global Search</h3>
            <p class="text-sm text-gray-700 mb-2">Search across all lists and fields with inline results</p>
            <p class="text-xs text-gray-600">Keyboard nav • Live filtering • Auto-expand</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Password Protection</h3>
            <p class="text-sm text-gray-700 mb-2">Bcrypt hashing with rate limiting</p>
            <p class="text-xs text-gray-600">Session management • Reset capability</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Export Options</h3>
            <p class="text-sm text-gray-700 mb-2">CSV, JSON, or print-friendly HTML</p>
            <p class="text-xs text-gray-600">Metadata preservation • Timestamp naming</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Six Themes</h3>
            <p class="text-sm text-gray-700 mb-2">Daylight, Moonlight, Forest, Beach, Plum, Char</p>
            <p class="text-xs text-gray-600">Cycle with backslash • Epilogue variable font</p>
          </div>
        </div>
      </section>

      <!-- Templates -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Templates</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="font-semibold text-gray-900">Grocery List</span>
            </div>
            <p class="text-sm text-gray-600">Store sections • Quantity tracking • Checkboxes</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span class="font-semibold text-gray-900">Errand Tracker</span>
            </div>
            <p class="text-sm text-gray-600">Priority levels • Notes • Completion status</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span class="font-semibold text-gray-900">Gift Planner</span>
            </div>
            <p class="text-sm text-gray-600">Recipients • Budget • Purchase tracking</p>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Use Cases</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="text-gray-700">Project management</div>
          <div class="text-gray-700">Inventory tracking</div>
          <div class="text-gray-700">Event planning</div>
          <div class="text-gray-700">Research notes</div>
          <div class="text-gray-700">Equipment logs</div>
          <div class="text-gray-700">Contact management</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">React 18</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">TypeScript</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Vite 5</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Tailwind CSS</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">IndexedDB</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Dexie.js</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Cloudflare Pages</span>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-primary">FAQ</h2>
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Why not just use Google Sheets?</h3>
            <p class="text-gray-700">
              Google Sheets requires an account, stores your data on Google's servers, and needs constant internet access.
              ListMaker works offline, keeps data local, and has no login requirements. Plus, collapsible sections,
              global search, and password protection are built in.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Where is my data stored?</h3>
            <p class="text-gray-700">
              All data lives in your browser's IndexedDB. Nothing is sent to a server unless you explicitly export it.
              Clear your browser data and it's gone—make sure to export important lists.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Can I sync across devices?</h3>
            <p class="text-gray-700">
              Not yet. The architecture supports optional Cloudflare R2 sync, but it's not enabled in v0.1.0.
              For now, export as JSON and import on other devices.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">What happens if I forget my password?</h3>
            <p class="text-gray-700">
              Passwords are bcrypt-hashed and not recoverable. You'll need to use the reset function, which clears
              the password but keeps your data intact.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Is this suitable for large datasets?</h3>
            <p class="text-gray-700">
              ListMaker handles hundreds of rows comfortably. Beyond ~1,000 rows per list, you might notice slower search.
              For massive datasets, export to CSV and use a database.
            </p>
          </div>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

function renderOrpheusSDKPage() {
  contentLoader.updateDocumentTitle('Orpheus SDK');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Orpheus SDK</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://github.com/chrislyons/orpheus-sdk" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Host-neutral C++20 SDK for professional audio applications
        </p>
        <p class="text-sm text-gray-500">v0.2.1 • C++20 • MIT License</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Sample-Accurate Transport</h3>
            <p class="text-sm text-gray-700 mb-2">±1 sample precision with deterministic playback</p>
            <p class="text-xs text-gray-600">Multi-clip support • Seamless loops • Per-clip gain</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Real-Time Safety</h3>
            <p class="text-sm text-gray-700 mb-2">Zero allocations on audio thread</p>
            <p class="text-xs text-gray-600">Lock-free commands • AddressSanitizer clean • 24/7 stable</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Cross-Platform Audio I/O</h3>
            <p class="text-sm text-gray-700 mb-2">CoreAudio, WASAPI, ASIO support</p>
            <p class="text-xs text-gray-600">WAV/AIFF/FLAC • libsndfile • 2-32 channels</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Deterministic Behavior</h3>
            <p class="text-sm text-gray-700 mb-2">Same input → same output, every time</p>
            <p class="text-xs text-gray-600">Reproducible mixes • Session graphs • Tempo maps</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Developer Tools</h3>
            <p class="text-sm text-gray-700 mb-2">32-test suite with comprehensive coverage</p>
            <p class="text-xs text-gray-600">Click-track rendering • ABI negotiation • Session export</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Host-Neutral Architecture</h3>
            <p class="text-sm text-gray-700 mb-2">Build JUCE apps, DAWs, broadcast systems</p>
            <p class="text-xs text-gray-600">CMake build • GoogleTest • No vendor lock-in</p>
          </div>
        </div>
      </section>

      <!-- Applications -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Built With Orpheus SDK</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Orpheus Clip Composer (in development)</h3>
          <p class="text-gray-700 mb-3">
            Professional soundboard for broadcast playout, theater sound design, and live performance with 384-clip grid (expanding to 960), waveform editing, and multi-channel routing.
          </p>
          <p class="text-sm text-gray-600">
            Target markets: Broadcast radio/TV, theater sound design, live performance production
          </p>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Use Cases</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="text-gray-700">Broadcast playout systems</div>
          <div class="text-gray-700">Live performance apps</div>
          <div class="text-gray-700">Theater sound design</div>
          <div class="text-gray-700">DAW plugins</div>
          <div class="text-gray-700">Audio testing tools</div>
          <div class="text-gray-700">Sample-accurate recording</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">C++20</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">CMake 3.20+</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">JUCE 7</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">libsndfile</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">CoreAudio</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">WASAPI/ASIO</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">GoogleTest</span>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

function renderTidalMCPPage() {
  contentLoader.updateDocumentTitle('Tidal MCP Server');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Tidal MCP Server</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://github.com/chrislyons/tidal-mcp-server" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Manage your Tidal library through Claude Desktop with BPM filtering and advanced search
        </p>
        <p class="text-sm text-gray-500">v0.2 RC1 • Python 3.10+ • Model Context Protocol</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">BPM-Matched Mixing</h3>
            <p class="text-sm text-gray-700 mb-2">~90% track coverage via Spotify integration</p>
            <p class="text-xs text-gray-600">BPM range filtering • Permanent caching • No Spotify subscription</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">14 Advanced Filters</h3>
            <p class="text-sm text-gray-700 mb-2">Explicit content, year ranges, artist exclusions, versions</p>
            <p class="text-xs text-gray-600">Duration constraints • Popularity ranges • Audio quality</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Full Catalog Search</h3>
            <p class="text-sm text-gray-700 mb-2">Search your collection AND Tidal's full catalog</p>
            <p class="text-xs text-gray-600">Create playlists from any tracks • Album track listings</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Intelligent Caching</h3>
            <p class="text-sm text-gray-700 mb-2">5-minute TTL on collection data + permanent BPM cache</p>
            <p class="text-xs text-gray-600">SQLite storage • Faster repeated queries</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Artist Discovery</h3>
            <p class="text-sm text-gray-700 mb-2">Find similar artists for genre exploration</p>
            <p class="text-xs text-gray-600">Browse discographies • Filter by release type</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Visual Browsing</h3>
            <p class="text-sm text-gray-700 mb-2">Album artwork in markdown tables (80x80 thumbnails)</p>
            <p class="text-xs text-gray-600">Text wrapping • Metadata display • Quality flags</p>
          </div>
        </div>
      </section>

      <!-- Example Queries -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Example Queries</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-3">
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700 text-sm">
              <strong>"Create a 120-140 BPM techno playlist, exclude radio edits, minimum 6 minutes per track"</strong>
            </p>
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700 text-sm">
              <strong>"Find deep house from 2020-2024, no explicit tracks, HiRes quality only"</strong>
            </p>
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700 text-sm">
              <strong>"Search Tidal catalog for artists similar to Nina Kraviz"</strong>
            </p>
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700 text-sm">
              <strong>"Build a clean modern techno set, no overplayed producers, 5-8 minute tracks, max 40 songs"</strong>
            </p>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Use Cases</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="text-gray-700">DJ set planning</div>
          <div class="text-gray-700">BPM-matched mixing</div>
          <div class="text-gray-700">Genre exploration</div>
          <div class="text-gray-700">Library curation</div>
          <div class="text-gray-700">Event planning</div>
          <div class="text-gray-700">Broadcast preparation</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Python 3.10+</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Poetry</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">MCP SDK</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Tidal API</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Spotify API</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">SQLite</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Claude Desktop</span>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

function renderWordBirdPage() {
  contentLoader.updateDocumentTitle('WordBird');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">WordBird</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://wordbird.pages.dev" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Launch App
            </a>
            <a href="https://github.com/wordbird-dev/wordbird" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Offline-first dictionary and translator toolkit with verifiable data packs
        </p>
        <p class="text-sm text-gray-500">v0.1.1 • Web, Desktop, Mobile • Privacy-First</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Instant, Offline Search</h3>
            <p class="text-sm text-gray-700 mb-2">Definitions, synonyms, antonyms, idioms without network</p>
            <p class="text-xs text-gray-600">Multiword expressions • Part-of-speech filters • Fast FTS</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Cross-Platform Everywhere</h3>
            <p class="text-sm text-gray-700 mb-2">Same workspace on web, desktop (Tauri), and mobile</p>
            <p class="text-xs text-gray-600">Quick panel • Deep links • Keyboard shortcuts • Browser extension</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Verifiable Data Packs</h3>
            <p class="text-sm text-gray-700 mb-2">SHA-256 digests, attribution, ShareAlike metadata</p>
            <p class="text-xs text-gray-600">Integrity-checked • Licensed for redistribution • Auditable</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Privacy-Respecting</h3>
            <p class="text-sm text-gray-700 mb-2">No telemetry, no cloud dependencies</p>
            <p class="text-xs text-gray-600">CLI tooling • URL hooks • wordbird:// scheme</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">18 Core Languages (v0.2.0)</h3>
            <p class="text-sm text-gray-700 mb-2">Expanding ETL pipeline for language packs</p>
            <p class="text-xs text-gray-600">First Nations • European • African • Themed packs</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Air-Gap Ready</h3>
            <p class="text-sm text-gray-700 mb-2">Download once, verify hashes, deploy via removable media</p>
            <p class="text-xs text-gray-600">Classroom • Newsroom • Humanitarian • No cloud fallback</p>
          </div>
        </div>
      </section>

      <!-- Language Packs -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Current Language Support</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <span class="text-gray-700">English</span>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <span class="text-gray-700">French</span>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <span class="text-gray-700">Spanish</span>
          </div>
          <div class="bg-white rounded-lg p-3 border border-gray-200 text-center text-gray-500">
            <span>+15 more in v0.2.0</span>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Who Benefits</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="text-gray-700">Learners and educators</div>
          <div class="text-gray-700">Translators and journalists</div>
          <div class="text-gray-700">Developers and researchers</div>
          <div class="text-gray-700">Air-gapped environments</div>
          <div class="text-gray-700">Humanitarian deployments</div>
          <div class="text-gray-700">Classroom settings</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Rust</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">React + Vite</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Tauri</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">SQLite WASM</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Cloudflare R2</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">PWA</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Browser Extension</span>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

// Writing Section: Hotbox

function renderHotboxPage() {
  contentLoader.updateDocumentTitle('Hotbox');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Hotbox</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://github.com/chrislyons/hotbox" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Narrative compiler for citation-grounded interactive essays
        </p>
        <p class="text-sm text-gray-500">v0.2.0 • Open Source • MIT License</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Coverage-First Chat</h3>
            <p class="text-sm text-gray-700 mb-2">85% citation threshold with automatic escalation</p>
            <p class="text-xs text-gray-600">Hashed debug logs • Receipt tracking • Copyright validation</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Beat-Driven Composition</h3>
            <p class="text-sm text-gray-700 mb-2">LLM-powered drafts from structured beat packs</p>
            <p class="text-xs text-gray-600">beats.yaml • claims.csv • edges.csv • Optional manual mode</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Validator-Gated Pipeline</h3>
            <p class="text-sm text-gray-700 mb-2">Compose → Stitch → Validate → Render → Index</p>
            <p class="text-xs text-gray-600">Author Console • Progress tracking • Token-gated access</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Hybrid Search</h3>
            <p class="text-sm text-gray-700 mb-2">Dense + sparse ranking with snippet highlighting</p>
            <p class="text-xs text-gray-600">Vectorize • BM25 • Casefile enrichment • Cached responses</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Chapter Graph Architecture</h3>
            <p class="text-sm text-gray-700 mb-2">Verified claims + entities + edges in knowledge graph</p>
            <p class="text-xs text-gray-600">Core Registry • Beat packs • Cross-chapter navigation</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Local LLM Support</h3>
            <p class="text-sm text-gray-700 mb-2">Ollama integration for free draft generation</p>
            <p class="text-xs text-gray-600">llama3.2 recommended • OpenAI fallback • API flexibility</p>
          </div>
        </div>
      </section>

      <!-- Authoring Workflow -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Authoring Workflow</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <ol class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">1.</span>
              <span><strong>Define structure</strong> – beats.yaml with goals, tones, transitions</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">2.</span>
              <span><strong>Populate claims</strong> – claims.csv with atomic, citable facts (A/B/C priority)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">3.</span>
              <span><strong>Link entities</strong> – edges.csv relationships using Core Registry</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">4.</span>
              <span><strong>Build beat packs</strong> – JSON bundles with beat metadata + A/B claims</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">5.</span>
              <span><strong>Compose drafts</strong> – LLM generation or manual templates</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">6.</span>
              <span><strong>Stitch chapter</strong> – Merge beats with section headers + transitions</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">7.</span>
              <span><strong>Validate</strong> – Orphan claims, citation resolution, coverage thresholds</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-semibold text-secondary">8.</span>
              <span><strong>Ingest</strong> – Generate embeddings + BM25 indexes for retrieval</span>
            </li>
          </ol>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Use Cases</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="text-gray-700">Book-length essays</div>
          <div class="text-gray-700">Policy analysis</div>
          <div class="text-gray-700">Historical research</div>
          <div class="text-gray-700">Investigative journalism</div>
          <div class="text-gray-700">Academic writing</div>
          <div class="text-gray-700">Complex narratives</div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Node.js 20</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">TypeScript</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Hono</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">React + Vite</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Cloudflare Workers</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Vectorize</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">KV/R2/DO</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Ollama/OpenAI</span>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

// Missing placeholder pages for new structure

function renderClipComposerPage() {
  contentLoader.updateDocumentTitle('Clip Composer');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Clip Composer</h1>
          <div class="flex flex-wrap gap-3">
            <a href="https://github.com/chrislyons/orpheus-sdk/releases" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Download v0.2.0
            </a>
            <a href="https://github.com/chrislyons/orpheus-sdk" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View on GitHub">
              <svg class="github-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-xl text-gray-600 mb-2">
          Professional soundboard for broadcast, theater, and live performance
        </p>
        <p class="text-sm text-gray-500">v0.2.0-alpha • macOS 12+ (Apple Silicon) • Orpheus SDK</p>
      </div>

      <!-- Core Features -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">384 Clip Grid (48×8 tabs)</h3>
            <p class="text-sm text-gray-700 mb-2">Real-time audio playback with keyboard shortcuts</p>
            <p class="text-xs text-gray-600">QWERTY layout • Drag & drop • Color coding</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Sample-Accurate Timing</h3>
            <p class="text-sm text-gray-700 mb-2">±1 sample precision @ 48kHz with CoreAudio</p>
            <p class="text-xs text-gray-600"><5ms latency • Deterministic playback</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Waveform Editor</h3>
            <p class="text-sm text-gray-700 mb-2">Visual trim points with click-to-jog seeking</p>
            <p class="text-xs text-gray-600">Fade in/out • Cue points • Gap-free playback</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Session Management</h3>
            <p class="text-sm text-gray-700 mb-2">Save/load with full metadata preservation</p>
            <p class="text-xs text-gray-600">JSON format • Drag-to-reorder • Clip groups</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Stop Others On Play</h3>
            <p class="text-sm text-gray-700 mb-2">Per-clip solo mode with smooth fade-out</p>
            <p class="text-xs text-gray-600">No distortion • 240ms hold • Real-time visual sync</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-2 text-gray-900">Multi-Format Support</h3>
            <p class="text-sm text-gray-700 mb-2">WAV, AIFF, FLAC via libsndfile</p>
            <p class="text-xs text-gray-600">48kHz locked • Auto-conversion coming</p>
          </div>
        </div>
      </section>

      <!-- Target Markets -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Built For</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span class="font-semibold text-gray-900">Broadcast Radio/TV</span>
            </div>
            <p class="text-sm text-gray-600">Playout automation • Jingles • Sound effects</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span class="font-semibold text-gray-900">Theater Sound Design</span>
            </div>
            <p class="text-sm text-gray-600">Cue playback • Multi-scene control</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span class="font-semibold text-gray-900">Live Performance</span>
            </div>
            <p class="text-sm text-gray-600">Concert soundscapes • DJ sets • Installations</p>
          </div>
        </div>
      </section>

      <!-- Compare To -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Compare To</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-3">
          <div class="flex items-start gap-3">
            <div class="font-semibold text-gray-900 w-32">SpotOn (€1,200)</div>
            <div class="text-gray-700">Broadcast playout • Windows-only</div>
          </div>
          <div class="flex items-start gap-3">
            <div class="font-semibold text-gray-900 w-32">QLab (€700)</div>
            <div class="text-gray-700">Theater cues • macOS-only</div>
          </div>
          <div class="flex items-start gap-3">
            <div class="font-semibold text-gray-900 w-32">Ovation (€500)</div>
            <div class="text-gray-700">Live performance • Basic routing</div>
          </div>
          <div class="border-t border-gray-300 pt-3 mt-3">
            <div class="font-semibold text-secondary mb-1">Clip Composer Advantage:</div>
            <p class="text-gray-700">Cross-platform • Open SDK • Sovereign (no cloud dependencies)</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">C++20</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">JUCE Framework</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">Orpheus SDK</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">CoreAudio</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">libsndfile</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">CMake</span>
          <span class="bg-gray-100 px-3 py-1 rounded border border-gray-200">GoogleTest</span>
        </div>
      </section>

      <!-- Roadmap -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-primary">What's Next</h2>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-green-600">✅</span>
              <span class="text-gray-700"><strong>v0.2.0:</strong> UX fixes, smooth stop others, 75fps button sync</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-blue-600">⏳</span>
              <span class="text-gray-700"><strong>v0.3.0:</strong> Audio device selection, latch acceleration, modal styling</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-400">🎯</span>
              <span class="text-gray-700"><strong>v1.0 MVP:</strong> 960 clips, routing matrix, remote control (6 months)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Back Navigation -->
      <div class="text-center">
        <a href="/apps" class="link text-lg">← Back to Apps</a>
      </div>
    </div>
  `;
}

function renderNumaNetworkPage() {
  contentLoader.updateDocumentTitle('Numa Network');
  const pageData = contentLoader.getPageData('numa-network');
  renderPlaceholderPage('Numa Network', pageData?.meta?.description || 'Research into distributed systems and network architectures');
}

function renderOSDEventsPage() {
  contentLoader.updateDocumentTitle('OSD Events');
  const pageData = contentLoader.getPageData('osd-events');
  renderPlaceholderPage('OSD Events', pageData?.meta?.description || 'On-screen display event system');
}

function renderPortfolioPage() {
  contentLoader.updateDocumentTitle('Portfolio');
  const pageData = contentLoader.getPageData('portfolio');
  renderPlaceholderPage('Portfolio', pageData?.meta?.description || 'Professional audio portfolio and technical recordings');
}

function renderConnectPage() {
  contentLoader.updateDocumentTitle('Connect');
  const email = contentLoader.getSiteData().email;

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-2xl mx-auto text-center py-20">
      <h1 class="text-5xl font-bold mb-8 text-primary">Connect</h1>
      <p class="text-xl text-gray-700 mb-12">
        Get in touch for collaborations, projects, or inquiries.
      </p>
      <div class="mb-8">
        <a
          href="mailto:${email}"
          class="btn btn-primary text-xl"
          aria-label="Send email to ${email}"
        >
          Email Me
        </a>
      </div>
    </div>
  `;
}

/**
 * Render 404 page
 */
function render404Page() {
  contentLoader.updateDocumentTitle('Page Not Found');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-2xl mx-auto text-center py-20">
      <h1 class="text-6xl font-bold mb-6 text-error">404</h1>
      <p class="text-2xl text-gray-700 mb-8">Page not found</p>
      <p class="text-lg text-gray-600 mb-12">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" class="btn btn-primary">
        Go to home page
      </a>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for use in other modules
export { init };
