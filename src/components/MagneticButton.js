/**
 * MagneticButton Component
 *
 * Creates buttons that follow the cursor within proximity
 * Provides a delightful interactive experience for CTAs
 */

export class MagneticButton {
  /**
   * Render a magnetic button
   *
   * @param {Object} options - Button configuration
   * @param {string} options.text - Button text
   * @param {string} options.href - Optional link URL
   * @param {string} options.className - Additional CSS classes
   * @param {number} options.strength - Magnetic pull strength (0-1, default: 0.3)
   */
  static render({ text, href, className = '', strength = 0.3 }) {
    const buttonId = `magnetic-btn-${Math.random().toString(36).substr(2, 9)}`;
    const classes = `btn btn-primary magnetic-button ${className}`;
    const dataStrength = `data-magnetic-strength="${strength}"`;

    if (href) {
      return `
        <a
          href="${href}"
          class="${classes}"
          data-magnetic-id="${buttonId}"
          ${dataStrength}
        >
          ${text}
        </a>
      `;
    }

    return `
      <button
        type="button"
        class="${classes}"
        data-magnetic-id="${buttonId}"
        ${dataStrength}
      >
        ${text}
      </button>
    `;
  }

  /**
   * Attach magnetic effect to all buttons with magnetic-button class
   * Call this after rendering to enable interactivity
   *
   * Performance optimizations:
   * - Cache getBoundingClientRect() on mouseenter
   * - Use requestAnimationFrame for smooth 60fps updates
   * - Prevent layout thrashing
   */
  static attachMagneticEffects() {
    const magneticButtons = document.querySelectorAll('.magnetic-button');

    magneticButtons.forEach(button => {
      const strength = parseFloat(button.getAttribute('data-magnetic-strength') || '0.3');
      let cachedRect = null;
      let animationFrameId = null;

      // Cache rect on mouseenter to avoid repeated getBoundingClientRect calls
      button.addEventListener('mouseenter', () => {
        cachedRect = button.getBoundingClientRect();
      });

      button.addEventListener('mousemove', (e) => {
        if (!cachedRect) return;

        // Cancel previous animation frame if still pending
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        // Calculate offset from center
        const x = e.clientX - cachedRect.left - cachedRect.width / 2;
        const y = e.clientY - cachedRect.top - cachedRect.height / 2;

        // Schedule transform update on next frame
        animationFrameId = requestAnimationFrame(() => {
          button.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.02)`;
        });
      });

      button.addEventListener('mouseleave', () => {
        // Cancel any pending animation
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }

        // Reset transform
        button.style.transform = '';
        cachedRect = null;
      });
    });
  }
}

export default MagneticButton;
