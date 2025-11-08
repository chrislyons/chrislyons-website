# Deployment Infrastructure - Notes

## Overview

The chrislyons-website uses a **dual-environment architecture**:

1. **Local Development**: Vite + Wrangler for rapid iteration
2. **Production**: Cloudflare Workers on global edge network

This setup provides:
- **Fast development**: HMR and local testing
- **Low latency**: Global edge computing
- **Scalability**: Serverless auto-scaling
- **Cost efficiency**: Free tier for most usage

## Development Environment

### Local Development Modes

The project supports **three development modes**:

#### Mode 1: SPA Only (npm run dev)

**Command**: `npm run dev`

**What Runs**:
- Vite development server on port 5173
- No worker (dynamic routes show fallback message)

**Use Case**:
- Developing static pages (/, /apps, /ideas, /sounds, /connect)
- Working on UI components
- Testing theme system
- No database needed

**Pros**:
- Fast startup
- Minimal resources
- Hot module replacement

**Cons**:
- /blog and /admin not functional
- No database access

**Access**:
```
http://localhost:5173/
http://localhost:5173/apps
http://localhost:5173/sounds/lyrics
```

#### Mode 2: Worker Only (npm run dev:worker)

**Command**: `npm run dev:worker`

**What Runs**:
- Wrangler development server on port 8787
- Local D1 database (SQLite file)
- Serves static assets from dist/

**Use Case**:
- Developing blog/admin features
- Testing database queries
- Working on authentication
- Testing worker logic

**Pros**:
- Full-stack environment
- Database access
- Realistic production simulation

**Cons**:
- Requires `npm run build` first (to populate dist/)
- No HMR for client code
- Slower iteration

**Access**:
```
http://localhost:8787/
http://localhost:8787/blog
http://localhost:8787/admin
```

**Important**: Run `npm run build` first to create dist/ directory!

#### Mode 3: Full Stack (npm run dev:all)

**Command**: `npm run dev:all`

**What Runs**:
- Vite on port 5173 (SPA routes)
- Wrangler on port 8787 (dynamic routes)
- Vite proxies /blog and /admin to Wrangler

**Use Case**:
- Full-stack development
- Testing integration
- Most realistic development setup

**Pros**:
- HMR for client code
- Database access
- All routes functional from single port

**Cons**:
- Highest resource usage
- Two processes to manage

**Access**:
```
http://localhost:5173/        (Vite serves SPA)
http://localhost:5173/blog    (Vite proxies to Wrangler)
http://localhost:5173/admin   (Vite proxies to Wrangler)
```

**How It Works**:
1. Vite serves SPA routes directly
2. Vite proxy forwards /blog and /admin to localhost:8787
3. Wrangler handles dynamic routes
4. All accessible from port 5173

**Proxy Configuration** (vite.config.js):
```javascript
server: {
  proxy: {
    '/blog': {
      target: 'http://localhost:8787',
      changeOrigin: true,
      configure: (proxy) => {
        proxy.on('error', () => { /* show fallback message */ });
      }
    }
  }
}
```

### Local Data Storage

**Wrangler State Directory**: `.wrangler/state/`

Contains:
- Local D1 database file
- Local KV data (if used)
- Other local bindings

**Important**: Add to `.gitignore` (already configured)

### Environment Variables (Development)

**wrangler.toml**:
```toml
[dev]
port = 8787
local_protocol = "http"

[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "741a89af-1617-491f-991b-0bde7cf81d69"
```

**Secrets** (not in wrangler.toml):
```bash
# Set secrets for local development
npx wrangler secret put GIPHY_API_KEY --local
```

## Build Pipeline

### Build Process

**Command**: `npm run build`

**Steps**:

1. **Vite Build**
   - Compiles TypeScript (if any)
   - Bundles JavaScript modules
   - Processes CSS (Tailwind, PostCSS)
   - Optimizes assets (images, fonts)
   - Minifies code
   - Hashes filenames for cache busting
   - Outputs to `dist/`

2. **Asset Manifest Generation**
   - Runs `scripts/generate-asset-manifest.js`
   - Scans dist/ for hashed files
   - Creates `asset-manifest.json`
   - Used by worker to inline asset paths

**Output Structure**:
```
dist/
├── index.html
├── assets/
│   ├── main.abc123.js        (hashed)
│   ├── style.xyz789.css      (hashed)
│   ├── chunk.def456.js       (hashed)
│   └── ...
├── fonts/
│   └── HKGrotesk_3003/       (NOT hashed - stable paths)
│       ├── HKGrotesk-Bold.woff2
│       └── ...
├── favicon.svg
└── asset-manifest.json
```

**Asset Hashing**:
- JavaScript and CSS files hashed for cache busting
- Fonts preserved with stable paths (configured in vite.config.js)
- Format: `[name].[hash][extname]`

**Why Fonts Aren't Hashed**:
- CSS `@font-face` rules need stable paths
- Fonts change rarely (no need for cache busting)
- Simplifies font loading

**Vite Configuration** (vite.config.js):
```javascript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        // Don't hash font files
        if (/\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)) {
          return assetInfo.name; // Keep full path
        }
        // Hash other assets
        return 'assets/[name].[hash][extname]';
      }
    }
  }
}
```

### Build Artifacts

**dist/ Directory**:
- Production-ready static files
- Minified and optimized
- Ready for deployment

**asset-manifest.json**:
```json
{
  "js": "/assets/main.abc123.js",
  "css": "/assets/style.xyz789.css"
}
```

**Why Asset Manifest?**
- Worker needs to know hashed filenames
- Inlines paths into index.html template
- Bridges build output to runtime

## Deployment to Cloudflare

### Deployment Process

**Command**: `npx wrangler deploy`

**Prerequisites**:
1. Run `npm run build` (create dist/)
2. Authenticate with Cloudflare: `npx wrangler login`
3. Configure wrangler.toml (already done)

**What Happens**:
1. Wrangler reads wrangler.toml
2. Wrangler bundles worker code (src/worker.ts)
3. Wrangler uploads code to Cloudflare
4. Wrangler uploads assets from dist/ to ASSETS binding
5. Wrangler configures bindings (D1, R2, secrets)
6. Worker deployed to all edge locations
7. DNS updated to route traffic

**Deployment Time**: 10-30 seconds

**Output**:
```
✨ Successfully deployed worker
   URL: https://hey.chrislyons.workers.dev
```

### Cloudflare Configuration

**Worker Name**: `hey` (from wrangler.toml)

**Compatibility Date**: `2024-11-01`
- Ensures stable behavior
- Locks worker to specific API version

**Main Entry Point**: `src/worker.ts`
- TypeScript file compiled to JavaScript
- Exports Hono app

**Bindings**:

**D1 Database**:
```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "741a89af-1617-491f-991b-0bde7cf81d69"
```

**R2 Bucket** (disabled):
```toml
# [[r2_buckets]]
# binding = "BLOG_IMAGES"
# bucket_name = "blog-images"
```

**Secrets**:
- `GIPHY_API_KEY`: Set via `npx wrangler secret put GIPHY_API_KEY`

**ASSETS Binding**:
```toml
[assets]
directory = "./dist"
binding = "ASSETS"
```

### Environment Configuration

**Development vs Production**:

| Feature           | Development       | Production         |
|-------------------|-------------------|--------------------|
| Server            | Vite + Wrangler   | Cloudflare Worker  |
| Port              | 5173 / 8787       | 443 (HTTPS)        |
| Database          | Local SQLite      | Distributed D1     |
| Assets            | Vite serves       | ASSETS binding     |
| Domain            | localhost         | chrislyons.workers.dev |
| HTTPS             | Optional          | Always             |
| Logs              | Terminal          | Wrangler tail      |

**Environment Detection**:
- No environment variable needed (worker runs same code)
- Local vs production determined by bindings

## Cloudflare Edge Network

### Global Distribution

**Edge Locations**: 300+ cities worldwide

**How It Works**:
1. User makes request from anywhere in the world
2. DNS routes to nearest Cloudflare edge location
3. Worker executes at that edge location
4. D1 database accessed from nearest region
5. Response returned to user

**Latency Benefits**:
- User in Tokyo: Worker runs in Tokyo
- User in London: Worker runs in London
- User in New York: Worker runs in New York

**Cold Start**: 5-20ms (rare)
**Warm Request**: <5ms (most requests)

### Cloudflare Workers Runtime

**Technology**: V8 Isolates (not containers)

**Characteristics**:
- Lightweight (faster than containers)
- Isolated from other workers
- No Node.js APIs (browser-like environment)
- ES Modules support
- TypeScript support (compiled to JS)

**Memory Limit**: 128 MB (default)
**CPU Limit**: 50ms per request (can be increased)

**Execution Model**:
- One worker handles multiple requests concurrently
- Isolates provide security and isolation
- Shared worker code, isolated state

### ASSETS Binding

**Purpose**: Serve static files from dist/

**How It Works**:
1. `npm run build` creates dist/
2. `npx wrangler deploy` uploads dist/ to Cloudflare
3. ASSETS binding provides `fetch()` interface
4. Worker fetches assets via `c.env.ASSETS.fetch(request)`

**Example** (worker.ts):
```typescript
const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
```

**Benefits**:
- Assets served from CDN
- No worker CPU time used
- Automatic caching
- Global distribution

**Cache Headers**:
```javascript
headers.set('Cache-Control', 'public, max-age=31536000, immutable');
```
- 1 year cache for hashed assets
- Immutable (never changes)

### D1 Database (Production)

**Technology**: Distributed SQLite

**Characteristics**:
- Globally replicated
- Eventually consistent
- Low latency reads
- Strong consistency for writes (single-region)

**Access Pattern**:
```typescript
const db = c.env.DB;
const result = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first();
```

**Replication**:
- Primary region (where writes go)
- Read replicas in other regions
- Automatic failover

**Backup**:
- Automatic backups (Cloudflare manages)
- Manual backups via `npx wrangler d1 export`

**Limits** (Free Tier):
- 5 GB storage
- 5 million reads per day
- 100k writes per day

### R2 Object Storage (Disabled)

**Purpose**: Store blog images

**Why Disabled**: Commented out in wrangler.toml
```toml
# [[r2_buckets]]
# binding = "BLOG_IMAGES"
# bucket_name = "blog-images"
```

**To Enable**:
1. Uncomment lines in wrangler.toml
2. Create R2 bucket: `npx wrangler r2 bucket create blog-images`
3. Redeploy worker

**Access Pattern**:
```typescript
const bucket = c.env.BLOG_IMAGES;
await bucket.put(filename, fileStream, { httpMetadata: { contentType } });
const object = await bucket.get(filename);
```

**Limits** (Free Tier):
- 10 GB storage
- No egress fees (unlike S3)

### Secrets Management

**Setting Secrets**:
```bash
# Development
npx wrangler secret put GIPHY_API_KEY --local

# Production
npx wrangler secret put GIPHY_API_KEY
```

**Accessing Secrets**:
```typescript
const apiKey = c.env.GIPHY_API_KEY;
```

**Security**:
- Encrypted at rest
- Not visible in Cloudflare dashboard after creation
- Not included in wrangler.toml (for security)
- Separate for dev and production

## Service Dependencies

### External Services

**Giphy API**:
- Purpose: GIF search in admin interface
- Access: Via `GIPHY_API_KEY` secret
- Endpoint: `https://api.giphy.com/v1/gifs/search`
- Free tier: 1000 requests per day

**Cloudflare DNS**:
- Routes traffic to edge locations
- Managed automatically by Cloudflare

### Internal Dependencies

**Hono Framework**:
- Routing for worker
- Middleware support
- TypeScript-friendly
- ~12KB bundle size

**Vite**:
- Development server
- Build tool
- HMR support

**Tailwind CSS**:
- Utility-first CSS
- PostCSS processing
- Purged in production (small bundle)

## Monitoring and Logging

### Development Logs

**Vite Logs**:
```bash
npm run dev
# Logs appear in terminal
```

**Wrangler Logs**:
```bash
npm run dev:worker
# Logs appear in terminal
```

**Browser Console**:
```javascript
console.log('🚀 Chris Lyons Website Initializing...');
console.log('✅ Application Initialized');
```

### Production Logs

**Live Tailing**:
```bash
npx wrangler tail
# Shows real-time logs from production
```

**Cloudflare Dashboard**:
- Analytics: Request count, bandwidth, errors
- Logs: Searchable log history
- Metrics: Performance graphs

**Log Output**:
```bash
# Wrangler tail output
2025-11-08T12:00:00Z GET /blog 200 OK (50ms)
2025-11-08T12:00:01Z GET /admin 401 Unauthorized (10ms)
```

### Error Tracking

**Worker Errors**:
- Caught by Hono error handler
- Logged to console
- Returned as JSON response

**Client Errors**:
- Caught by browser
- Logged to console
- Can add external error tracking (Sentry, etc.)

## CI/CD Pipeline

**Current Setup**: Manual deployment

**Manual Process**:
```bash
# 1. Build
npm run build

# 2. Deploy
npx wrangler deploy
```

**Future: Automated CI/CD**:

**GitHub Actions Example**:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Benefits**:
- Automatic deployment on git push
- Testing before deployment
- Consistent builds
- Rollback capability

## Performance Optimization

### Edge Computing Benefits
- **Global Distribution**: Sub-50ms latency worldwide
- **No Cold Starts**: V8 isolates spin up in <20ms
- **Automatic Scaling**: Handles traffic spikes automatically

### Caching Strategy

**Static Assets**:
- Cache-Control: `max-age=31536000, immutable`
- Hashed filenames ensure safe caching
- Served from Cloudflare CDN

**Dynamic Routes**:
- No caching (always fresh data)
- Consider adding Cache-Control headers for blog entries

**Database Queries**:
- Indexed columns for fast lookups
- LIMIT clauses prevent unbounded queries
- Read replicas for low latency

### Bundle Optimization

**Code Splitting**:
- Vite automatically splits code
- Separate chunks for routes (if needed)

**Tree Shaking**:
- Unused code removed
- Dead code elimination

**Minification**:
- JavaScript minified (Terser)
- CSS minified (cssnano)
- HTML minified

## Cost Analysis

### Cloudflare Workers (Free Tier)

**Limits**:
- 100,000 requests per day
- 10 ms CPU time per request
- 128 MB memory

**Overages**:
- $0.50 per million requests
- Paid plan: $5/month + usage

### D1 Database (Free Tier)

**Limits**:
- 5 GB storage
- 5 million reads per day
- 100,000 writes per day

**Overages**:
- Paid plan pricing TBD

### R2 Storage (Free Tier)

**Limits**:
- 10 GB storage
- No egress fees

**Overages**:
- $0.015 per GB/month storage

### Estimated Cost

**Typical Traffic** (10k requests/day):
- Workers: Free (within limits)
- D1: Free (within limits)
- R2: Free (if enabled)

**Total**: $0/month (free tier)

## Rollback Strategy

### Quick Rollback

**Revert Deployment**:
```bash
# Get previous deployment ID
npx wrangler deployments list

# Rollback to specific deployment
npx wrangler rollback [deployment-id]
```

**Or**:
```bash
# Redeploy from previous git commit
git checkout [previous-commit]
npm run build
npx wrangler deploy
git checkout main
```

### Database Rollback

**No Native Rollback**: D1 doesn't support automatic rollback

**Manual Process**:
1. Export current database: `npx wrangler d1 export blog-db --output backup.sql`
2. Restore from backup: `npx wrangler d1 execute blog-db --file previous-backup.sql`

**Prevention**:
- Test migrations locally first
- Backup before schema changes
- Use transactions for multi-step changes

## Security Considerations

### HTTPS
- **Always enabled** in production (Cloudflare enforces)
- HTTP automatically redirects to HTTPS

### CORS
- Not configured (same-origin only)
- Add CORS headers if needed for external API access

### Security Headers
```javascript
headers.set('X-XSS-Protection', '1; mode=block');
headers.set('X-Content-Type-Options', 'nosniff');
headers.set('X-Frame-Options', 'DENY');
headers.set('Referrer-Policy', 'unsafe-url');
```

### Authentication
- HTTP-only cookies (prevents XSS)
- Secure flag (HTTPS only)
- SameSite=Lax (CSRF protection)

## Technical Debt

1. **Manual Deployment**: No CI/CD (should automate)
2. **No Staging Environment**: Deploys directly to production
3. **Hardcoded Credentials**: Admin password in source (should use secrets)
4. **No Error Monitoring**: No external error tracking (Sentry, etc.)
5. **No Analytics**: No user analytics (Google Analytics, Plausible, etc.)
6. **R2 Disabled**: Image upload not functional

## Related Diagrams

- [repo-structure.mermaid.md](repo-structure.mermaid.md) - Directory layout
- [architecture-overview.mermaid.md](architecture-overview.mermaid.md) - System design
- [component-map.mermaid.md](component-map.mermaid.md) - Component relationships
- [data-flow.mermaid.md](data-flow.mermaid.md) - Data movement
- [entry-points.mermaid.md](entry-points.mermaid.md) - Application initialization
- [database-schema.mermaid.md](database-schema.mermaid.md) - Database structure
