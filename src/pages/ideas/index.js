/**
 * Ideas Page Render Functions
 *
 * Contains render functions for all ideas-related pages:
 * - 27 Suppositions
 * - Protocols of Sound
 * - Numa Network
 * - OSD Events
 */

import contentLoader from '../../utils/contentLoader.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * Helper function to render placeholder pages
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

/**
 * Render 27 Suppositions page
 */
export function render27SuppositionsPage() {
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

/**
 * Render Protocols of Sound page
 */
export function renderProtocolsOfSoundPage() {
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

/**
 * Render Numa Network page
 */
export function renderNumaNetworkPage() {
  contentLoader.updateDocumentTitle('Numa Network');
  const pageData = contentLoader.getPageData('numa-network');
  renderPlaceholderPage('Numa Network', pageData?.meta?.description || 'Research into distributed systems and network architectures');
}

/**
 * Render OSD Events page
 */
export function renderOSDEventsPage() {
  contentLoader.updateDocumentTitle('OSD Events');
  const pageData = contentLoader.getPageData('osd-events');
  renderPlaceholderPage('OSD Events', pageData?.meta?.description || 'On-screen display event system');
}
