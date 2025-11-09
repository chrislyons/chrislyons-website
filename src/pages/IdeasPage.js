/**
 * Ideas Landing Page
 */

import { renderLandingPage } from '../utils/templateHelpers.js';

export function renderIdeasPage() {
  renderLandingPage({
    sectionId: 'ideas',
    title: 'Ideas',
    subtitle: 'Concepts & Research',
    description: 'Long-form writing, research projects, and conceptual explorations by Chris Lyons',
    emptyMessage: 'No ideas currently available.'
  });
}
