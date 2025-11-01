/**
 * Footer Component
 *
 * Simple, accessible footer with copyright and contact information
 */

import contentData from '../../content/content.json';

export class Footer {
  /**
   * Render the footer component
   */
  render() {
    const currentYear = new Date().getFullYear();
    const email = contentData.site.email;

    return `
      <footer class="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
        <div class="container-custom py-8">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <!-- Copyright -->
            <div class="text-base text-gray-600">
              <p>&copy; ${currentYear} Chris Lyons. All rights reserved.</p>
            </div>

            <!-- Contact Email -->
            <div class="text-base text-gray-600">
              <a
                href="mailto:${email}"
                class="text-secondary hover:text-primary underline transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded"
                aria-label="Send email to ${email}"
              >
                ${email}
              </a>
            </div>
          </div>

          <!-- Optional: Additional Links -->
          <div class="mt-6 pt-6 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
              Built with
              <a href="https://vitejs.dev" class="text-secondary hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Vite</a>,
              <a href="https://tailwindcss.com" class="text-secondary hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>,
              and vanilla JavaScript
            </p>
          </div>
        </div>
      </footer>
    `;
  }
}

export default Footer;
