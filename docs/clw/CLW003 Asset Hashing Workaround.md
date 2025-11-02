# Asset Hashing Workaround

Brief: Documents the current workaround for Cloudflare Workers KV asset hashing and MIME type issues.

## Context

The chrislyons-website uses Cloudflare Workers with KV asset storage. There are two levels of content hashing:

1. **Vite content hash** - Added during build (e.g., `index-DWPkHQ4M.js`)
2. **Wrangler KV hash** - Added when uploading to KV (e.g., `index-DWPkHQ4M.72f1dc2be6.js`)

## Problem

The inline HTML in `src/worker.ts` needs to reference the KV-hashed paths, but:
- Vite generates files with only Vite hashes
- Wrangler adds KV hashes during `wrangler deploy`
- The KV manifest mapping doesn't work correctly with Hono's request wrapper
- `getAssetFromKV` with ASSET_NAMESPACE alone returns 404s

## Current Solution

**Hard-code the KV-hashed asset paths in worker.ts** (src/worker.ts:242-243):

```typescript
<!-- Styles -->
<script type="module" crossorigin src="/assets/index-DWPkHQ4M.72f1dc2be6.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-NAEdU9ii.819be698a9.css">
```

Additionally, MIME types are explicitly set based on file extensions (src/worker.ts:308-340) because KV stores all files as `text/plain`.

## When to Update

Update these paths when:
1. Vite asset hash changes (first part of filename changes)
2. After running `wrangler deploy`, check the output for the actual KV-hashed filenames

**Example from deploy output:**
```
+ assets/index-DWPkHQ4M.72f1dc2be6.js (uploading new version of assets/index-DWPkHQ4M.js)
```

## Attempted Solutions

1. **ASSET_MANIFEST parameter** - Failed because `__STATIC_CONTENT_MANIFEST` is undefined with Hono
2. **serveSinglePageApp mapper** - Caused all routes to 404
3. **Auto-injection script** - Can't determine KV hash before Wrangler uploads

## Future Improvements

Potential solutions to investigate:
1. Move away from `[site]` config to `[[assets]]` (new Wrangler feature)
2. Parse wrangler deploy output to extract KV hashes
3. Query KV namespace after deploy to get actual stored filenames
4. Use a post-deploy hook to update worker.ts before final deployment
5. Investigate why `getAssetFromKV` manifest mapping doesn't work with Hono

## Related Files

- `src/worker.ts` (lines 208-350) - Inline HTML and asset serving
- `wrangler.toml` (lines 25-26) - `[site]` configuration
- `scripts/inject-assets.js` - Incomplete auto-injection script

## References

[1] https://developers.cloudflare.com/workers/configuration/sites/
[2] https://github.com/cloudflare/kv-asset-handler
