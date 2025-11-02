import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa', // Enable SPA mode - serves index.html for all routes
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Don't hash font files - keep them with stable paths
          if (assetInfo.name && /\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)) {
            // Preserve the full path structure for fonts
            const pathParts = assetInfo.name.split('/');
            if (pathParts.length > 1) {
              return assetInfo.name; // Keep full path like fonts/HKGrotesk_3003/WEB/HKGrotesk-Bold.woff2
            }
            return `fonts/${assetInfo.name}`;
          }
          // Hash other assets normally
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    // Don't inline any assets
    assetsInlineLimit: 0,
  },
});
