/**
 * Template Helper Functions
 *
 * Reusable template patterns to reduce duplication
 */

import { PageHeader } from '../components/PageHeader.js';
import { Card } from '../components/Card.js';
import contentLoader from './contentLoader.js';

/**
 * Render a simple landing page with cards for navigation children
 */
export function renderLandingPage(config) {
  const { sectionId, title, subtitle, description, emptyMessage } = config;

  contentLoader.updateDocumentTitle(title);

  // Get navigation item and children
  const navigation = contentLoader.getNavigation();
  const navItem = navigation.find(item => item.id === sectionId);
  const children = navItem?.children || [];

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
      ${PageHeader.render({ title, subtitle, description })}

      <section class="mb-12">
        ${projectCards.length > 0
          ? Card.renderGrid(projectCards)
          : `<p class="text-gray-600">${emptyMessage || 'No content currently available.'}</p>`
        }
      </section>

      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render a simple content page with header and HTML content
 */
export function renderContentPage(config) {
  const { title, subtitle, description, content, metaDescription } = config;

  contentLoader.updateDocumentTitle(title);
  if (metaDescription) {
    contentLoader.updateMetaDescription(metaDescription);
  }

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-5xl mx-auto">
      ${PageHeader.render({ title, subtitle, description })}

      ${content}

      <div class="mt-12 text-center">
        <a href="/" class="link text-lg">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render a placeholder page
 */
export function renderPlaceholder(title, description) {
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
 * Check if a page is hidden in navigation
 */
export function isPageHidden(pageId) {
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
