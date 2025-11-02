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

    return `
      <footer class="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
        <div class="container-custom py-8">
          <div class="flex flex-col md:flex-row justify-center items-center">
            <!-- Copyright -->
            <div class="text-base text-gray-600">
              <p>&copy; ${currentYear} Chris Lyons. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

export default Footer;
