/**
 * Apps Landing Page
 */

import { renderLandingPage } from '../utils/templateHelpers.js';

export function renderAppsPage() {
  renderLandingPage({
    sectionId: 'apps',
    title: 'Apps',
    subtitle: 'Software & Tools',
    description: 'Software applications and tools built by Chris Lyons',
    emptyMessage: 'No apps currently available.'
  });
}
