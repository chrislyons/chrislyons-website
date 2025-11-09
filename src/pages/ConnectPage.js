/**
 * Connect Page
 */

import contentLoader from '../utils/contentLoader.js';

export function renderConnectPage() {
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
