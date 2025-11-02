# Asset Manifest System

Automated solution for managing Vite build asset hashes across worker and templates.

## Problem

Vite generates content-hashed filenames (e.g., `index-Dh0H5aJG.js`) that change with every build. Previously, these paths were hardcoded in:
- `src/worker.ts` - SPA index.html template
- `src/templates.ts` - /blog and /admin page templates

This caused MIME type errors and 404s after each build because the references became stale.

## Solution

### 1. Asset Manifest Generator
**File:** `scripts/generate-asset-manifest.js`

Post-build script that:
- Reads `dist/index.html` after Vite build
- Extracts actual JS and CSS asset paths using regex
- Generates `src/asset-manifest.json` with current paths

```json
{
  "js": "/assets/index-Dh0H5aJG.js",
  "css": "/assets/index.D16jICwo.css",
  "generated": "2025-11-02T21:03:28.105Z"
}
```

### 2. Dynamic Import in Worker
**File:** `src/worker.ts`

```typescript
import assetManifest from './asset-manifest.json';

const INDEX_HTML = `...
  <script type="module" crossorigin src="${assetManifest.js}"></script>
  <link rel="stylesheet" crossorigin href="${assetManifest.css}">
...`;
```

### 3. Dynamic Import in Templates
**File:** `src/templates.ts`

```typescript
import assetManifest from './asset-manifest.json';

// Used in renderBlog() and renderAdmin()
<link rel="stylesheet" href="${assetManifest.css}">
```

### 4. Updated Build Script
**File:** `package.json`

```json
{
  "scripts": {
    "build": "vite build && node scripts/generate-asset-manifest.js"
  }
}
```

## Benefits

- **No more brittle hashes** - Asset paths update automatically on every build
- **Correct MIME types** - Worker properly serves JS as `application/javascript`
- **Single source of truth** - `dist/index.html` is the authority for asset paths
- **Build-time generation** - Manifest created before Worker bundling
- **Zero manual updates** - Completely automated workflow

## Deployment Flow

1. `npm run build` runs Vite
2. Vite generates `dist/index.html` with hashed assets
3. `generate-asset-manifest.js` reads HTML, writes manifest
4. `npx wrangler deploy` bundles worker with manifest
5. Worker and templates use correct asset paths

## Files Modified

- `scripts/generate-asset-manifest.js` - Created
- `src/asset-manifest.json` - Generated (in .gitignore)
- `src/worker.ts` - Import and use manifest
- `src/templates.ts` - Import and use manifest
- `package.json` - Updated build script

## Next Steps

None - system is fully automated.

## References

[1] https://vitejs.dev/guide/build.html#building-for-production
[2] https://developers.cloudflare.com/workers/wrangler/custom-builds/
