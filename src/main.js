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

// Import utilities
import router from './utils/router.js';
import contentLoader from './utils/contentLoader.js';

// Global state
let navigation = null;
let footer = null;
let themeToggle = null;

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 Chris Lyons Website Initializing...');

  // Initialize theme (must be first to apply dark mode immediately)
  themeToggle = new ThemeToggle();

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

  // Systems section
  router.on('/systems', renderSystemsPage);
  router.on('/systems/boot-industries', renderBootIndustriesPage);
  router.on('/systems/carbon-acx', renderCarbonAcxPage);
  router.on('/systems/hydrophobic-field-harvesters', renderHydrophobicPage);
  router.on('/systems/listmaker', renderListMakerPage);
  router.on('/systems/orpheus-sdk', renderOrpheusSDKPage);
  router.on('/systems/tidal-mcp', renderTidalMCPPage);
  router.on('/systems/wordbird', renderWordBirdPage);

  // Sounds section
  router.on('/sounds', renderSoundsPage);
  router.on('/sounds/discography', renderDiscographyPage);
  router.on('/sounds/audio-samples', renderAudioSamplesPage);

  // Writing section
  router.on('/writing', renderWritingPage);
  router.on('/writing/essays', renderEssaysPage);
  router.on('/writing/hotbox', renderHotboxPage);
  router.on('/writing/lyrics', renderLyricsPage);
  router.on('/writing/poems', renderPoemsPage);
  router.on('/writing/27-suppositions', render27SuppositionsPage);
  router.on('/writing/protocols-of-sound', renderProtocolsOfSoundPage);

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

  // Generate collapsible navigation cards content
  const navigationCardsContent = Card.renderGrid([
    {
      title: 'Systems',
      description: 'Design & Studio Builds | Research & Inventions',
      link: '/systems',
      clickable: true
    },
    {
      title: 'Sounds',
      description: 'Production Work | Compositions',
      link: '/sounds',
      clickable: true
    },
    {
      title: 'Writing',
      description: 'Essays | Lyrics | Long-form Work',
      link: '/writing',
      clickable: true
    },
    {
      title: 'Connect',
      description: 'Get in touch',
      link: '/connect',
      clickable: true
    }
  ]);

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section with Enhanced Animations -->
      <header class="text-center mb-12 fade-in" style="animation-delay: 0.1s">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary leading-tight">
          hey it's ChrisLyons.com
        </h1>
        <p class="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed px-4">
          Since 2007 I've been building multichannel recording studios and broadcast systems,
          researching emerging technologies and writing, producing, and recording music and voice.
        </p>
      </header>

      <!-- Mission Statement -->
      <section class="mb-12 fade-in" style="animation-delay: 0.2s">
        <p class="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto px-4">
          My focus is creating reliable systems that serve the people who use them.
          My 'Numa' initiative is aimed at better supporting creative communities through
          equitable attribution frameworks, while broader research interests include
          bio-manufacturing methods and microplastics filtration systems.
        </p>
      </section>
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
    <div class="fade-in max-w-4xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto text-center py-20">
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
    <div class="fade-in max-w-5xl mx-auto">
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
    <div class="fade-in max-w-5xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto">
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

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Discography',
        subtitle: 'Albums and Releases',
        description: 'Music releases and collaborations across multiple projects'
      })}

      <div class="bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-xl text-gray-600 mb-4">Discography content coming soon.</p>
        <p class="text-base text-gray-500">Albums, EPs, and releases will be catalogued here.</p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>
  `;
}

function renderAudioSamplesPage() {
  contentLoader.updateDocumentTitle('Audio Samples');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto">
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
    <div class="fade-in max-w-3xl mx-auto">
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

  const songs = [
    '2-Bit Blues', 'All The Time', 'Anything Else', 'Blurred', 'Bootsteps',
    'Coal', 'Dieter, The Winged Saint', 'Dimed', 'Drifting Bird',
    'Failures in Forgiveness', 'Fins Of A Shark', 'Flares',
    'Friday Morning Suicide (Again)', 'Friends', 'Hiding', 'Holding Pattern',
    'I, the Hog-Tied Villain', 'Know My Love',
    'Look Elsewhere For Wisdom (Look This Way With Love)', 'Mayday',
    'Monday\'s Tea & Bagel', 'Moonbulbs', 'Mychoters', 'Pocket Fulla Stones',
    'Sailors Of The Seven Seas', 'Saskachussets', 'So Gone', 'So Rral',
    'Sunshine', 'Take My Heart', 'The Dumb Fambly Song',
    'The Flashing Light In Your Eyes As You Move Rapidly Beneath The Treetops',
    'The Hello Barrel', 'The House Song', 'The Wind & Me',
    'There & Back Again', 'Weeds', 'Windowsill #1', 'Windowsill #2'
  ];

  const songList = songs.map((song, index) => `
    <li class="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors">
      <span class="text-lg text-gray-800">${song}</span>
    </li>
  `).join('');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-3xl mx-auto">
      ${PageHeader.render({
        title: 'Lyrics',
        subtitle: 'Song Compositions',
        description: 'Songs by Chris Lyons'
      })}

      <!-- Song Count -->
      <div class="mb-8 text-center">
        <p class="text-xl text-gray-600">
          <strong>${songs.length}</strong> songs
        </p>
      </div>

      <!-- Song List -->
      <section class="mb-12">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <ul class="divide-y divide-gray-100">
            ${songList}
          </ul>
        </div>
      </section>

      <!-- Note -->
      <div class="bg-gray-50 rounded-lg p-6 mb-12 text-center">
        <p class="text-base text-gray-600">
          Individual song lyrics will be added soon.
        </p>
      </div>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

function renderPoemsPage() {
  contentLoader.updateDocumentTitle('Poems');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-3xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto">
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
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Carbon ACX',
        subtitle: 'Open Carbon Accounting Stack',
        description: 'Trustworthy carbon accounting from auditable CSV inputs to interactive disclosures'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is Carbon ACX?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            Carbon ACX is an <strong>open reference stack</strong> for trustworthy carbon accounting.
            It turns auditable CSV inputs into reproducible datasets, then ships the same disclosures
            through interactive tooling, static websites, and edge delivery—so teams can communicate
            climate performance with confidence.
          </p>
          <p class="text-gray-700">
            Every chart, data layer, and disclosure ships from a manifest that records byte hashes,
            schema versions, and provenance so downstream clients can trust figure lineage before rendering.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Measurement You Can Inspect</h3>
            <p class="text-gray-700">
              Python derivation engine keeps validation logic, figure generation, and manifests in the
              same code path—every published number carries lineage and checksums.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Delivery Everywhere</h3>
            <p class="text-gray-700">
              Cloudflare Pages serves packaged artifacts, while Worker APIs power on-demand calculations
              with strict input hygiene for programmatic integrations.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Reproducible Datasets</h3>
            <p class="text-gray-700">
              Canonical CSVs for activities, emission factors, and grid intensity live under version control,
              ready for rebuilds and audits.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Multiple Interfaces</h3>
            <p class="text-gray-700">
              Dash operations client for analysts, static React site for stakeholders, and edge APIs
              for integrations—all consuming identical artifacts.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Use Cases</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 rounded-lg p-6">
          <li>Organizations tracking operational emissions across professional services, online services, and industrial operations</li>
          <li>Climate disclosure teams requiring auditable, reproducible datasets</li>
          <li>Analysts exploring scenario simulations and defense supply chain impacts</li>
          <li>Teams integrating carbon accounting into existing technical stacks</li>
        </ul>
      </section>

      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderListMakerPage() {
  contentLoader.updateDocumentTitle('ListMaker');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'ListMaker',
        subtitle: 'Browser-Based List Management',
        description: 'Create and manage structured lists with offline support and password protection'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is ListMaker?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            ListMaker is a browser-based application for creating and managing structured lists with
            custom columns, sections, and data types. All data stays local in your browser—no server
            required, no accounts needed.
          </p>
          <p class="text-gray-700">
            Perfect for task management, inventory tracking, project planning, or any scenario where
            you need organized, searchable data that stays private and works offline.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Structured Data</h3>
            <p class="text-gray-700">
              Define custom columns with different data types (text, number, select), mark fields as
              required, and organize rows into collapsible sections.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Powerful Search</h3>
            <p class="text-gray-700">
              Live search across all fields with keyboard shortcuts, result navigation, and automatic
              section expansion for matched items.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Privacy First</h3>
            <p class="text-gray-700">
              Password protection with bcrypt hashing, local-only storage, and optional cloud backup
              via Cloudflare R2 integration.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Export Anywhere</h3>
            <p class="text-gray-700">
              Export to CSV for spreadsheets, JSON for programmatic access, or print-friendly HTML
              for documentation.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Modes</h2>
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Command Mode</h3>
            <p class="text-gray-700">
              Full editing capabilities—create, update, and delete rows and sections. Perfect for
              active project management.
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Patch Mode</h3>
            <p class="text-gray-700">
              Read-only viewing for sharing and collaboration. Lists remain searchable and exportable
              but cannot be modified.
            </p>
          </div>
        </div>
      </section>

      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderOrpheusSDKPage() {
  contentLoader.updateDocumentTitle('Orpheus SDK');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Orpheus SDK',
        subtitle: 'Professional Audio SDK',
        description: 'C++20 SDK for broadcast, live performance, and DAW applications with sample-accurate control'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is Orpheus SDK?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            Orpheus is a <strong>host-neutral C++20 SDK</strong> that provides deterministic session/transport
            control, sample-accurate clip playback, and real-time audio infrastructure. Built for 24/7
            broadcast reliability with zero-allocation audio threads and lock-free command processing.
          </p>
          <p class="text-gray-700">
            Designed for professional applications that demand sample-accurate (±0 sample) tolerance,
            deterministic behavior, and real-time safety.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Core Capabilities</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Transport & Playback</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li>Multi-clip transport (tested with 16 clips)</li>
              <li>Per-clip gain control (-96 to +12 dB)</li>
              <li>Seamless loop mode</li>
              <li>Sample-accurate trim points</li>
            </ul>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Audio I/O</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li>WAV/AIFF/FLAC via libsndfile</li>
              <li>CoreAudio (macOS)</li>
              <li>WASAPI/ASIO (Windows)</li>
              <li>Multi-channel (2-32 channels)</li>
            </ul>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Real-Time Safety</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li>Zero allocations on audio thread</li>
              <li>Lock-free command processing</li>
              <li>Deterministic: same input → same output</li>
              <li>AddressSanitizer clean</li>
            </ul>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Developer Tools</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li>Session graphs & tempo maps</li>
              <li>Click-track rendering</li>
              <li>Comprehensive test suite (32 tests)</li>
              <li>ABI negotiation</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Applications</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <p class="text-lg font-semibold text-gray-800 mb-4">Orpheus Clip Composer (in development):</p>
          <p class="text-gray-700 mb-4">
            Professional soundboard for broadcast playout, theater sound design, and live performance.
            Features include 960-button clip triggering, waveform editing, multi-channel routing, and iOS remote control.
          </p>
          <p class="text-sm text-gray-600">
            Target markets: Broadcast playout, theater sound design, live performance production
          </p>
        </div>
      </section>

      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderTidalMCPPage() {
  contentLoader.updateDocumentTitle('Tidal MCP Server');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Tidal MCP Server',
        subtitle: 'Music Library Management via Claude',
        description: 'Model Context Protocol server for managing your Tidal library through conversational AI'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is Tidal MCP Server?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            A <strong>Model Context Protocol (MCP)</strong> server that lets you manage your Tidal music
            library through Claude Desktop. Built for DJs and music curators with comprehensive playlist
            management, full catalog search, advanced filtering, and intelligent caching.
          </p>
          <p class="text-gray-700">
            18 tools, 14 filter types (including BPM), ~90% BPM coverage via Spotify integration,
            and visual browsing with album artwork in markdown tables.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Features for DJs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">BPM-Matched Mixing</h3>
            <p class="text-gray-700">
              ~90% track coverage with Spotify integration (up from ~3-5% Tidal-only). Filter by BPM
              range, exclude radio edits, discover extended mixes.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Advanced Filtering</h3>
            <p class="text-gray-700">
              14 filter types: explicit content, year ranges, artist exclusions, version filtering,
              duration constraints, popularity ranges, audio quality.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Catalog Search</h3>
            <p class="text-gray-700">
              Search your collection AND Tidal's full catalog. Create playlists from any tracks,
              albums, or artists—not just saved items.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Smart Playlists</h3>
            <p class="text-gray-700">
              Build genre-specific sets with precise duration control, clean versions for broadcast,
              artist network exploration for set planning.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Example Use Cases</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-3">
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700">
              <strong>"Create a 120-140 BPM techno playlist, exclude radio edits, minimum 6 minutes per track"</strong>
            </p>
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700">
              <strong>"Find deep house from 2020-2024, no explicit tracks, HiRes quality only"</strong>
            </p>
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <p class="text-gray-700">
              <strong>"Search Tidal catalog for artists similar to Nina Kraviz"</strong>
            </p>
          </div>
        </div>
      </section>

      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

function renderWordBirdPage() {
  contentLoader.updateDocumentTitle('WordBird');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'WordBird',
        subtitle: 'Offline-First Dictionary Toolkit',
        description: 'Offline-first dictionary and translator for web, desktop, and mobile with verifiable data packs'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is WordBird?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            WordBird gives language learners, translators, and researchers a <strong>trustworthy dictionary
            experience</strong> even when the network drops. Every surface—browser PWA, native shells, and
            integrations—resolves lookups locally so the experience stays fast, private, and predictable.
          </p>
          <p class="text-gray-700">
            Pack downloads are integrity-checked, licensed for redistribution, and ready for classroom,
            newsroom, or humanitarian deployments that cannot rely on constant connectivity.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Instant, Offline Search</h3>
            <p class="text-gray-700">
              Explore definitions, synonyms, antonyms, and idioms without leaving the device. Multiword
              expressions and part-of-speech filters mirror a printed dictionary workflow.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Cross-Platform</h3>
            <p class="text-gray-700">
              Same workspace on web, desktop, and mobile. Tauri quick panel and deep links respond to
              keyboard shortcuts for lightning-fast lookups.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Verifiable Data Packs</h3>
            <p class="text-gray-700">
              Language packs travel with SHA-256 digests, attribution, and ShareAlike metadata, making
              institutional rollouts auditable from the first install.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Privacy Respecting</h3>
            <p class="text-gray-700">
              CLI tooling and URL hooks let teams wire WordBird into research notebooks or translation
              pipelines without introducing telemetry.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Who Benefits</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 rounded-lg p-6">
          <li><strong>Learners and educators</strong> who need consistent offline access to curated lexical references</li>
          <li><strong>Translators and journalists</strong> who must verify terminology quickly while safeguarding sensitive work</li>
          <li><strong>Developers and researchers</strong> who want to embed dictionary intelligence locally using documented APIs</li>
          <li><strong>Air-gapped environments</strong> requiring verified data packs with removable media distribution</li>
        </ul>
      </section>

      <div class="mt-12 text-center">
        <a href="/systems" class="link text-lg">← Back to Systems</a>
      </div>
    </div>
  `;
}

// Writing Section: Hotbox

function renderHotboxPage() {
  contentLoader.updateDocumentTitle('Hotbox');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Hotbox',
        subtitle: 'Narrative Compiler',
        description: 'Interactive essays delivered as scoped, citation-first LLM dialogues backed by deterministic authoring pipelines'
      })}

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">What is Hotbox?</h2>
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            Hotbox is a <strong>narrative compiler</strong>—a system for assembling sophisticated, citation-grounded
            long-form essays from verified, reusable facts. Authors compose book-length narratives by snapping
            together <em>claims</em> (atomic, sourced facts) into <em>beats</em> (story goals) inside a shared
            knowledge graph. The essay stays human; the evidence stays machine-readable.
          </p>
          <p class="text-gray-700">
            Readers experience these essays as scoped, citation-first dialogues backed by deterministic authoring
            pipelines—every answer is sourced, reproducible, and safe for exploring complex histories or policy debates.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Coverage-First Chat</h3>
            <p class="text-gray-700">
              Worker reruns coverage checks, aligns quotes, escalates to a second model when coverage drops
              below 85%, and logs hashed debug data for auditors.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Validator-Gated Authoring</h3>
            <p class="text-gray-700">
              Author Console surfaces progress, artifacts, and token-gated access. Compose → stitch →
              validate → render → index commands ensure rigor.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Beat-Driven Composition</h3>
            <p class="text-gray-700">
              Authors define story structure in beats.yaml, populate verified claims in claims.csv, and
              generate beat packs that bundle metadata for LLM-powered draft generation.
            </p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-xl font-semibold mb-3 text-secondary">Research-Grade Search</h3>
            <p class="text-gray-700">
              Hybrid dense/sparse ranking, snippet highlighting, casefile enrichment, and cached responses
              drive the search UI for draft QA and editorial review.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-primary">Authoring Workflow</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <ol class="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Define structure</strong> – Create beats.yaml with goals, tones, and transitions</li>
            <li><strong>Populate claims</strong> – Fill claims.csv with atomic, citable facts (priority A/B/C)</li>
            <li><strong>Link entities</strong> – Define relationships in edges.csv that reuse Core Registry entities</li>
            <li><strong>Build beat packs</strong> – Generate JSON bundles pairing beat metadata with relevant claims</li>
            <li><strong>Compose drafts</strong> – Use LLM to generate drafts from beat packs</li>
            <li><strong>Stitch chapter</strong> – Merge beat drafts into cohesive chapters</li>
            <li><strong>Validate</strong> – Check for orphan claims, citation resolution, coverage thresholds</li>
            <li><strong>Ingest for retrieval</strong> – Generate embeddings for passage-level and beat-level retrieval</li>
          </ol>
        </div>
      </section>

      <div class="mt-12 text-center">
        <a href="/writing" class="link text-lg">← Back to Writing</a>
      </div>
    </div>
  `;
}

function renderConnectPage() {
  contentLoader.updateDocumentTitle('Connect');
  const email = contentLoader.getSiteData().email;

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="fade-in max-w-2xl mx-auto text-center py-20">
      <h1 class="text-5xl font-bold mb-8 text-primary">Connect</h1>
      <p class="text-xl text-gray-700 mb-12">
        Get in touch for collaborations, projects, or inquiries.
      </p>
      <div class="mb-8">
        <a
          href="mailto:${email}"
          class="text-2xl font-medium text-secondary hover:text-primary underline transition-colors"
          aria-label="Send email to ${email}"
        >
          ${email}
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
    <div class="fade-in max-w-2xl mx-auto text-center py-20">
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
