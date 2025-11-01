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
  router.on('/systems/hydrophobic-field-harvesters', renderHydrophobicPage);

  // Sounds section
  router.on('/sounds', renderSoundsPage);
  router.on('/sounds/discography', renderDiscographyPage);
  router.on('/sounds/audio-samples', renderAudioSamplesPage);

  // Writing section
  router.on('/writing', renderWritingPage);
  router.on('/writing/essays', renderEssaysPage);
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

      <!-- Collapsible Navigation Section with Brown Background -->
      <section class="fade-in" style="animation-delay: 0.3s">
        ${CollapsibleSection.render({
          id: 'home-pages-navigation',
          title: 'Pages (hidden)',
          content: navigationCardsContent,
          initiallyOpen: false,
          headerClass: '',
          contentClass: ''
        })}
      </section>
    </div>
  `;

  // Attach event listeners for collapsible section
  CollapsibleSection.attachEventListeners('home-pages-navigation');
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
  renderPlaceholderPage('Writing', 'Essays | Lyrics | Long-form Work');
}

function renderEssaysPage() {
  contentLoader.updateDocumentTitle('Essays');
  renderPlaceholderPage('Essays', 'Thoughts on technical systems and creative processes');
}

function renderLyricsPage() {
  contentLoader.updateDocumentTitle('Lyrics');
  renderPlaceholderPage('Lyrics', 'Song lyrics - 39 compositions');
}

function renderPoemsPage() {
  contentLoader.updateDocumentTitle('Poems');
  renderPlaceholderPage('Poems', 'Poetry collection');
}

function render27SuppositionsPage() {
  contentLoader.updateDocumentTitle('27 Suppositions');
  renderPlaceholderPage('27 Suppositions', 'Long-form exploration');
}

function renderProtocolsOfSoundPage() {
  contentLoader.updateDocumentTitle('Protocols of Sound');
  renderPlaceholderPage('Protocols of Sound', '20th century audio technology');
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
