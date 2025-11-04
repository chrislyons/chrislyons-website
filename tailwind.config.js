/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion-inspired blue color scheme
        // Dark mode uses the rich navy blue as base
        primary: '#3B82F6',      // Bright blue for dark mode
        secondary: '#60A5FA',    // Lighter blue accent
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        neutral: '#6B7280',
      },
      fontFamily: {
        sans: ['Switzer', 'HK Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Melodrama', 'Georgia', 'serif'],
        display: ['Melodrama', 'Georgia', 'serif'],
      },
      fontSize: {
        // Proportional scale with accessibility rounding
        // Base: 12px (0.75rem) | Ratio: ~0.875 (minor seventh)
        'xxs': ['0.563rem', { lineHeight: '0.813rem' }],    // 9px (0.5625 → 0.563)
        'xs': ['0.625rem', { lineHeight: '0.875rem' }],     // 10px (0.625 exact)
        'sm': ['0.688rem', { lineHeight: '1rem' }],         // 11px (0.6875 → 0.688)
        'base': ['0.75rem', { lineHeight: '1.125rem' }],    // 12px (0.75 exact) - reference
        'lg': ['1rem', { lineHeight: '1.5rem' }],           // 16px (1.0 exact)
        'xl': ['0.938rem', { lineHeight: '1.406rem' }],     // 15px (0.9375 → 0.938)
        '2xl': ['1.125rem', { lineHeight: '1.688rem' }],    // 18px (1.125 exact)
        '3xl': ['1.5rem', { lineHeight: '2rem' }],          // 24px (1.5 exact)
        '4xl': ['1.688rem', { lineHeight: '2.25rem' }],     // 27px (1.6875 → 1.688)
        '5xl': ['2.25rem', { lineHeight: '2.813rem' }],     // 36px (2.25 exact)
        '6xl': ['2.813rem', { lineHeight: '3.375rem' }],    // 45px (2.8125 → 2.813)
      },
    },
  },
  plugins: [],
}

