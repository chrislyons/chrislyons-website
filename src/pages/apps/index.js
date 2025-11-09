/**
 * App Page Renderers
 *
 * Individual page render functions for each app in the /apps section
 */

import contentLoader from '../../utils/contentLoader.js';

export function renderCarbonAcxPage() {
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

export function renderListMakerPage() {
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

export function renderOrpheusSDKPage() {
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

export function renderTidalMCPPage() {
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

export function renderWordBirdPage() {
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

export function renderHotboxPage() {
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

export function renderClipComposerPage() {
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
