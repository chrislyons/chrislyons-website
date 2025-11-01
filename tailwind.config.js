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
        sans: ['HK Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.563rem', { lineHeight: '0.75rem' }],      // 9px (75% of 12px)
        'sm': ['0.656rem', { lineHeight: '0.938rem' }],     // 10.5px (75% of 14px)
        'base': ['0.75rem', { lineHeight: '1.125rem' }],    // 12px (75% of 16px)
        'lg': ['1rem', { lineHeight: '1.5rem' }],           // 16px
        'xl': ['0.938rem', { lineHeight: '1.5rem' }],       // 15px (75% of 20px)
        '2xl': ['1.125rem', { lineHeight: '1.688rem' }],    // 18px (75% of 24px)
        '3xl': ['1.5rem', { lineHeight: '2rem' }],          // 24px
        '4xl': ['1.688rem', { lineHeight: '2.25rem' }],     // 27px (75% of 36px)
        '5xl': ['2.25rem', { lineHeight: '2.625rem' }],     // 36px (75% of 48px)
        '6xl': ['2.813rem', { lineHeight: '3rem' }],        // 45px (75% of 60px)
      },
    },
  },
  plugins: [],
}

