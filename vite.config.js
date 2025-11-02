import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa', // Enable SPA mode - serves index.html for all routes
  server: {
    // Custom middleware to handle /blog and /admin routes
    middlewareMode: false,
    proxy: {
      // Proxy /blog and /admin to a placeholder in development
      // In production, these are handled by the Cloudflare Worker
      '^/(blog|admin).*': {
        target: 'http://localhost:8787', // Wrangler dev server (if running)
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            // If wrangler isn't running, show a friendly message
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>${req.url} - Development Mode</title>
                <style>
                  body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; }
                  h1 { color: #666; }
                  code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
                </style>
              </head>
              <body>
                <h1>🚧 Worker Route (Development)</h1>
                <p>The route <code>${req.url}</code> is handled by the Cloudflare Worker in production.</p>
                <p>To test this route locally:</p>
                <ol>
                  <li>Run <code>npm run dev:worker</code> in a separate terminal</li>
                  <li>Access this route through <a href="http://localhost:8787${req.url}">http://localhost:8787${req.url}</a></li>
                </ol>
                <p><a href="/">← Back to home</a></p>
              </body>
              </html>
            `);
          });
        },
      },
    },
  },
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
