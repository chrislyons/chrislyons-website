/**
 * Scroll-Triggered Animations Utility
 *
 * Uses Intersection Observer to trigger animations when elements enter viewport
 * Supports fade-in, slide-up, and staggered children animations
 */

export class ScrollAnimations {
  /**
   * Initialize scroll animations for elements with data-animate attribute
   *
   * Usage:
   * <div data-animate="fade-up">Content</div>
   * <div data-animate="fade-up" data-delay="200">Content with delay</div>
   * <div data-animate="stagger" data-stagger-delay="100">
   *   <div>Child 1</div>
   *   <div>Child 2</div>
   * </div>
   */
  static init() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animationType = element.getAttribute('data-animate');
            const delay = parseInt(element.getAttribute('data-delay') || '0');

            setTimeout(() => {
              if (animationType === 'stagger') {
                this.animateStagger(element);
              } else {
                element.classList.add('animate-in');
              }
            }, delay);

            // Unobserve after animating (only animate once)
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * Animate children with staggered delays
   */
  static animateStagger(parent) {
    const children = Array.from(parent.children);
    const staggerDelay = parseInt(parent.getAttribute('data-stagger-delay') || '100');

    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('animate-in');
      }, index * staggerDelay);
    });
  }

  /**
   * Reinitialize animations (useful after dynamic content loads)
   */
  static refresh() {
    this.init();
  }
}

export default ScrollAnimations;
