import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: [
        'src/data/**',
        'src/pages/**',
        '**/*.d.ts'
      ],
      thresholds: {
        statements: 40,
        branches: 35,
        functions: 35,
        lines: 40
      }
    }
  },
  resolve: {
    alias: {
      '@': '/home/user/chrislyons-website/src'
    }
  }
});
