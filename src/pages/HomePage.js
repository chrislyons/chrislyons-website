/**
 * Home Page
 */

import contentLoader from '../utils/contentLoader.js';

export function renderHomePage() {
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
