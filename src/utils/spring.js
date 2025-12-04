/**
 * Spring Physics Utility
 *
 * Implements spring-based animations for smooth, physically-based motion.
 * Based on critically-damped spring physics for natural-feeling animations.
 *
 * Reference: Frontend Architecture Sovereign (frontend-2026 skill)
 */

export class Spring {
  /**
   * Create a spring animation
   *
   * @param {Object} config - Spring configuration
   * @param {number} config.stiffness - Spring stiffness (speed) - default: 170
   * @param {number} config.damping - Spring damping (friction) - default: 26
   * @param {number} config.mass - Mass of the object - default: 1
   * @param {number} config.precision - Stop threshold - default: 0.01
   */
  constructor({ stiffness = 170, damping = 26, mass = 1, precision = 0.01 } = {}) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.precision = precision;

    this.currentValue = 0;
    this.targetValue = 0;
    this.velocity = 0;
    this.lastTime = null;
    this.animationFrameId = null;
    this.onUpdate = null;
  }

  /**
   * Set target value and start animation
   *
   * @param {number} target - Target value to animate to
   * @param {Function} callback - Function called on each frame with current value
   */
  to(target, callback) {
    this.targetValue = target;
    this.onUpdate = callback;

    if (!this.animationFrameId) {
      this.lastTime = performance.now();
      this.tick();
    }
  }

  /**
   * Animation tick using spring physics
   */
  tick = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.064); // Cap at ~15fps to prevent spiral
    this.lastTime = now;

    // Spring physics calculation
    const springForce = -this.stiffness * (this.currentValue - this.targetValue);
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / this.mass;

    // Update velocity and position
    this.velocity += acceleration * deltaTime;
    this.currentValue += this.velocity * deltaTime;

    // Call update callback
    if (this.onUpdate) {
      this.onUpdate(this.currentValue);
    }

    // Check if spring has settled
    const isAtRest =
      Math.abs(this.velocity) < this.precision &&
      Math.abs(this.currentValue - this.targetValue) < this.precision;

    if (isAtRest) {
      // Snap to target and stop
      this.currentValue = this.targetValue;
      this.velocity = 0;
      if (this.onUpdate) {
        this.onUpdate(this.currentValue);
      }
      this.stop();
    } else {
      // Continue animation
      this.animationFrameId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Set current value without animation
   *
   * @param {number} value - Value to set
   */
  set(value) {
    this.currentValue = value;
    this.targetValue = value;
    this.velocity = 0;
    this.stop();
  }

  /**
   * Stop animation
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current value
   */
  getValue() {
    return this.currentValue;
  }
}

/**
 * Motion presets based on Frontend Architecture Sovereign guidelines
 *
 * These tokens ensure consistent physics across all animations.
 * Export as CSS custom properties for use in transitions.
 */
export const MOTION_PRESETS = {
  // High-frequency actions (typing, sliders) - Critical damping (no overshoot)
  immediate: {
    stiffness: 400,
    damping: 40,
    mass: 1,
    duration: 150, // approximate ms
  },

  // Interface transitions (modals, dropdowns) - Slight bounce (under-damped)
  interface: {
    stiffness: 280,
    damping: 26,
    mass: 1,
    duration: 300, // approximate ms
  },

  // Page transitions - Smooth and gentle
  page: {
    stiffness: 200,
    damping: 30,
    mass: 1,
    duration: 500, // approximate ms
  },

  // Gentle - Very smooth for large movements
  gentle: {
    stiffness: 120,
    damping: 20,
    mass: 1,
    duration: 800, // approximate ms
  },
};

/**
 * Export motion tokens as CSS custom properties
 * Call this on app initialization to set CSS variables
 */
export function injectMotionTokens() {
  const root = document.documentElement;

  // Duration tokens
  root.style.setProperty('--motion-immediate', `${MOTION_PRESETS.immediate.duration}ms`);
  root.style.setProperty('--motion-interface', `${MOTION_PRESETS.interface.duration}ms`);
  root.style.setProperty('--motion-page', `${MOTION_PRESETS.page.duration}ms`);
  root.style.setProperty('--motion-gentle', `${MOTION_PRESETS.gentle.duration}ms`);

  // Easing curves (approximate spring with cubic-bezier)
  root.style.setProperty('--ease-immediate', 'cubic-bezier(0.34, 1.56, 0.64, 1)'); // slight overshoot
  root.style.setProperty('--ease-interface', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'); // smooth acceleration
  root.style.setProperty('--ease-page', 'cubic-bezier(0.16, 1, 0.3, 1)'); // gentle deceleration
  root.style.setProperty('--ease-gentle', 'cubic-bezier(0.05, 0.7, 0.1, 1)'); // very smooth
}

/**
 * Helper function to animate an element's CSS property with spring physics
 *
 * @param {HTMLElement} element - Element to animate
 * @param {string} property - CSS property to animate
 * @param {number} target - Target value
 * @param {Object} config - Spring configuration (or preset name)
 * @param {string} unit - CSS unit (default: 'px')
 * @returns {Spring} Spring instance for control
 */
export function animateSpring(element, property, target, config = MOTION_PRESETS.interface, unit = 'px') {
  // If config is a string, use preset
  const springConfig = typeof config === 'string' ? MOTION_PRESETS[config] : config;

  const spring = new Spring(springConfig);

  // Get current value
  const currentValue = parseFloat(getComputedStyle(element)[property]) || 0;
  spring.set(currentValue);

  // Animate to target
  spring.to(target, (value) => {
    element.style[property] = `${value}${unit}`;
  });

  return spring;
}

/**
 * Helper to animate transform with spring physics
 *
 * @param {HTMLElement} element - Element to animate
 * @param {Object} transforms - Transform properties { x, y, scale, rotate }
 * @param {Object} config - Spring configuration
 * @returns {Object} Object containing spring instances for each transform
 */
export function animateTransform(element, transforms, config = MOTION_PRESETS.interface) {
  const springs = {};

  // Create spring for each transform property
  Object.keys(transforms).forEach((key) => {
    const spring = new Spring(config);
    spring.set(0);
    springs[key] = spring;
  });

  // Update function to apply all transforms
  const updateTransform = () => {
    const transformString = Object.keys(transforms)
      .map((key) => {
        const value = springs[key].getValue();
        switch (key) {
          case 'x':
            return `translateX(${value}px)`;
          case 'y':
            return `translateY(${value}px)`;
          case 'scale':
            return `scale(${value})`;
          case 'rotate':
            return `rotate(${value}deg)`;
          default:
            return '';
        }
      })
      .join(' ');

    element.style.transform = transformString;
  };

  // Animate each property
  Object.keys(transforms).forEach((key) => {
    springs[key].to(transforms[key], updateTransform);
  });

  return springs;
}

export default Spring;
