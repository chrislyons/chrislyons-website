# Deployment Infrastructure - Detailed Notes

## Overview

The chrislyons-website is deployed entirely on Cloudflare's edge network, leveraging Workers, D1, R2, and Assets bindings. This serverless architecture provides low-latency global distribution with zero server management. This document covers the deployment architecture, CI/CD pipeline, environment configurations, and operational considerations.

## Infrastructure Components

### Cloudflare Workers

**What:** Serverless JavaScript execution at the edge
**Runtime:** V8 isolates (same as Chrome)
**Cold Start:** <1ms (V8 isolates are pre-warmed)

**Worker Configuration (wrangler.toml):**
```toml
name = "hey"
compatibility_date = "2024-11-01"
main = "src/worker.ts"

[dev]
port = 8787
local_protocol = "http"
```

**Execution Model:**
1. Request arrives at nearest Cloudflare edge node
2. Worker code executes in V8 isolate
3. Access bindings (D1, R2, Secrets)
4. Return response
5. Request completes in ~50-200ms total

**Resource Limits:**
- CPU time: 30s (paid), 10ms (free)
- Memory: 128MB
- Subrequests: 50 per request
- Script size: 1MB (after compression)

### D1 Database

**What:** Distributed SQLite database at the edge
**Technology:** SQLite (WASM compiled for edge)
**Replication:** Automatic global replication

**Configuration:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "741a89af-1617-491f-991b-0bde7cf81d69"
```

**Access Pattern:**
```typescript
const db = c.env.DB;
const { results } = await db.prepare('SELECT * FROM entries').all();
```

**Characteristics:**
- Read latency: 5-20ms
- Write latency: 20-50ms
- Consistency: Strong consistency per database
- Size limit: 500MB per database
- Queries per database: 1000/second (burst)

### R2 Object Storage

**What:** S3-compatible object storage
**Use Case:** Store uploaded blog images
**Pricing:** No egress fees (within Cloudflare)

**Configuration (currently disabled in wrangler.toml):**
```toml
# [[r2_buckets]]
# binding = "BLOG_IMAGES"
# bucket_name = "blog-images"
```

**Access Pattern:**
```typescript
const bucket = c.env.BLOG_IMAGES;
await bucket.put('filename.jpg', stream, { httpMetadata: { contentType: 'image/jpeg' } });
const object = await bucket.get('filename.jpg');
```

**Characteristics:**
- No egress fees
- S3-compatible API
- Automatic global distribution
- Object size: Up to 5GB
- Operations: PUT, GET, DELETE, LIST

### Assets Binding

**What:** Serve static files from Worker
**Source:** Vite build output (`dist/` directory)
**Purpose:** Serve SPA assets (JS, CSS, fonts, images)

**Configuration:**
```toml
[assets]
directory = "./dist"
binding = "ASSETS"
```

**Access Pattern:**
```typescript
const response = await c.env.ASSETS.fetch(c.req.raw);
```

**Characteristics:**
- Automatic caching
- Content-Type detection
- No separate CDN needed
- Files uploaded during deploy

### Secrets Manager

**What:** Encrypted environment variables
**Purpose:** Store sensitive configuration
**Storage:** Encrypted at rest, decrypted at runtime

**Configured Secrets:**
- `ADMIN_USERNAME` - Admin panel login
- `ADMIN_PASSWORD` - Admin panel password
- `GIPHY_API_KEY` - Giphy API key

**Setting Secrets:**
```bash
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put GIPHY_API_KEY
```

**Access Pattern:**
```typescript
const username = c.env.ADMIN_USERNAME;
const password = c.env.ADMIN_PASSWORD;
```

**Characteristics:**
- Encrypted storage
- Per-environment (dev, staging, prod)
- Not in version control
- Persist across deployments

---

## Deployment Pipeline

### Build Process

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Vite build:**
   ```bash
   npx vite build
   ```
   - Bundles JavaScript modules
   - Processes CSS with PostCSS and Tailwind
   - Generates hashed filenames
   - Creates source maps (optional)
   - Output: `dist/`

3. **Asset manifest generation:**
   ```bash
   node scripts/generate-asset-manifest.js
   ```
   - Scans `dist/` for JS and CSS files
   - Creates `src/asset-manifest.json`
   - Maps entry names to hashed filenames

4. **TypeScript compilation:**
   - Worker code (`src/worker.ts`) compiled during deploy
   - Wrangler handles TypeScript automatically

**Build Output (`dist/`):**
```
dist/
├── index.html
├── assets/
│   ├── main.abc123.js
│   └── style.def456.css
├── fonts/
│   └── HKGrotesk/
└── favicon.svg
```

### Deployment Command

```bash
npx wrangler deploy
```

**What happens:**

1. **Build Worker:**
   - Compile TypeScript to JavaScript
   - Bundle dependencies
   - Minify code

2. **Upload Worker:**
   - Upload compiled code to Cloudflare
   - Configure bindings (D1, R2, Assets, Secrets)
   - Set compatibility date

3. **Upload Assets:**
   - Upload `dist/` directory contents
   - Configure Assets binding

4. **Activate:**
   - Route requests to new deployment
   - Old deployment kept for rollback

**Output:**
```
Deployed hey to https://hey.{account}.workers.dev
```

### Deployment Verification

**After deploying:**

1. **Check Worker status:**
   ```bash
   npx wrangler deployment list
   ```

2. **Test routes:**
   - `/` - SPA home page
   - `/blog` - Blog entries
   - `/admin` - Admin panel

3. **Check logs:**
   ```bash
   npx wrangler tail
   ```

---

## Environment Configuration

### Development Environment

**Servers:**
- Vite: `http://localhost:5173`
- Wrangler: `http://localhost:8787`

**Database:**
- Local SQLite in `.wrangler/state/v3/d1/`
- Separate from production

**Secrets:**
- `.dev.vars` file (gitignored)
  ```
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD=localpassword
  GIPHY_API_KEY=test-key
  ```

**Assets:**
- Served by Vite dev server
- HMR enabled
- Source maps included

### Production Environment

**URL:** `https://chrislyons.boot.industries` (or Worker subdomain)

**Database:**
- D1 cloud database
- ID: `741a89af-1617-491f-991b-0bde7cf81d69`

**Secrets:**
- Cloudflare Secrets Manager
- Set via `wrangler secret put`

**Assets:**
- Uploaded to Assets binding
- Minified, hashed filenames
- Immutable cache headers

### Environment Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| URL | localhost:5173 | chrislyons.boot.industries |
| Worker | Wrangler local | Cloudflare edge |
| Database | Local SQLite | D1 cloud |
| Storage | Local simulation | R2 cloud |
| Secrets | .dev.vars | Secrets Manager |
| HMR | Yes | No |
| Minification | No | Yes |
| Source Maps | Yes | No |
| Caching | None | Aggressive |

---

## Service Dependencies

### External Services

**Giphy API:**
- **Purpose:** GIF search in admin panel
- **Endpoint:** `https://api.giphy.com/v1/gifs/search`
- **Authentication:** API key in secrets
- **Rate Limits:** 42 req/hour (free tier)
- **Fallback:** None (feature unavailable if down)

### Cloudflare Services

**DNS:**
- Manages domain routing
- SSL/TLS certificates automatic
- No configuration needed (Cloudflare dashboard)

**SSL/TLS:**
- Automatic certificate provisioning
- Edge-to-origin encryption
- Always HTTPS

**CDN:**
- Built into Workers edge network
- No separate CDN configuration
- Automatic global distribution

---

## Operational Considerations

### Monitoring

**Cloudflare Dashboard:**
- Request volume
- Error rates
- CPU time
- Bandwidth

**Logs:**
```bash
# Real-time logs
npx wrangler tail

# With filter
npx wrangler tail --filter "error"
```

**Alerts:**
- Configure in Cloudflare dashboard
- Email/webhook notifications
- Threshold-based triggers

### Scaling

**Automatic Scaling:**
- Workers scale automatically
- No manual provisioning
- Handles traffic spikes seamlessly

**D1 Scaling:**
- Automatic query routing
- Read replicas at edge
- Write forwarding to primary

**R2 Scaling:**
- Unlimited storage
- No bandwidth limits
- Global distribution

### Performance Optimization

**Worker:**
- Keep scripts small (<1MB)
- Minimize subrequests
- Use streaming responses for large data

**D1:**
- Use indexes
- Limit query results
- Cache frequent queries (in-memory)

**Assets:**
- Immutable cache headers (1 year)
- Minification in build
- Compression automatic

### Security

**Authentication:**
- Cookie-based sessions
- HttpOnly cookies
- Secure flag (HTTPS only)
- SameSite for CSRF protection

**Secrets:**
- Encrypted at rest
- Runtime-only access
- Never in code or logs

**Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: unsafe-url

**Rate Limiting:**
- No custom rate limiting currently
- Consider adding for login endpoint
- Cloudflare has built-in DDoS protection

---

## CI/CD Pipeline

### Current State

**Manual deployment:** No automated CI/CD

**Workflow:**
1. Make changes locally
2. Test with `npm run dev:all`
3. Build with `npm run build`
4. Deploy with `npx wrangler deploy`

### Recommended CI/CD Setup

**GitHub Actions example:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN` - API token with Workers write access
- Create in Cloudflare dashboard → API Tokens

### Database Migration in CI/CD

**Manual approach (before deploy):**
```yaml
- name: Apply migrations
  run: npx wrangler d1 execute blog-db --file migrations/new_migration.sql
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Considerations:**
- Run migrations before code deploy
- Keep migrations backward compatible
- Test migrations in staging first

---

## Rollback Strategy

### Worker Rollback

**Via Cloudflare Dashboard:**
1. Go to Workers → hey → Deployments
2. Find previous deployment
3. Click "Rollback"

**Via CLI:**
```bash
# List deployments
npx wrangler deployment list

# Rollback to previous
npx wrangler rollback
```

### Database Rollback

**No automatic rollback.**

**Manual process:**
1. Identify problematic changes
2. Write reverse migration SQL
3. Apply reverse migration
4. Verify data integrity

**Example:**
```sql
-- Reverse: Remove new column
ALTER TABLE entries DROP COLUMN new_column;
```

### Assets Rollback

**Deploy previous commit:**
```bash
git checkout <previous-commit>
npm run build
npx wrangler deploy
```

---

## Cost Considerations

### Cloudflare Workers

**Free Tier:**
- 100,000 requests/day
- 10ms CPU time per request
- Workers KV: 100,000 reads/day

**Paid (Workers Paid):**
- $5/month base
- +$0.50 per million requests
- 30s CPU time per request

### D1 Database

**Free Tier:**
- 5 million rows read/month
- 100,000 rows written/month
- 500MB storage

**Paid:**
- Part of Workers Paid plan
- Additional charges for high volume

### R2 Storage

**Free Tier:**
- 10GB storage
- 10 million Class A operations (writes)
- 1 million Class B operations (reads)

**Paid:**
- $0.015/GB storage
- Operations priced per million

### Current Cost Estimate

**For a personal blog site:**
- **Likely free tier eligible**
- Low traffic (<100K requests/day)
- Small database (<500MB)
- Minimal storage (<10GB)

---

## Disaster Recovery

### Data Backup

**D1 Database:**
```bash
# Export to JSON
npx wrangler d1 execute blog-db --command "SELECT * FROM entries" > backup.json
```

**R2 Bucket:**
```bash
# List objects
npx wrangler r2 object list blog-images

# Download objects (manual)
# Use S3 CLI or Cloudflare dashboard
```

### Recovery Procedures

**Database corruption:**
1. Export data from backup
2. Recreate database
3. Apply migrations
4. Import data

**Worker failure:**
1. Check Cloudflare status
2. Rollback to previous deployment
3. Check logs for errors

**Assets corruption:**
1. Re-run build
2. Re-deploy with `wrangler deploy`

### Incident Response

1. **Detect:** Monitor alerts, user reports
2. **Diagnose:** Check logs, status pages
3. **Mitigate:** Rollback if needed
4. **Resolve:** Fix root cause
5. **Review:** Post-incident analysis

---

## Development Workflow

### Local Development Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/chrislyons/chrislyons-website.git
   cd chrislyons-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create local database:**
   ```bash
   npx wrangler d1 execute blog-db --local --file migrations/001_create_entries_table.sql
   npx wrangler d1 execute blog-db --local --file migrations/001_create_canvases_table.sql
   ```

4. **Create `.dev.vars`:**
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=localpass
   GIPHY_API_KEY=your-api-key
   ```

5. **Start development servers:**
   ```bash
   npm run dev:all
   ```

6. **Access application:**
   - SPA: http://localhost:5173
   - Worker direct: http://localhost:8787

### Deployment Workflow

1. **Make changes:**
   - Edit code
   - Test locally
   - Commit to Git

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

4. **Verify:**
   - Test production URL
   - Check Cloudflare dashboard
   - Monitor logs

### Database Migration Workflow

1. **Write migration:**
   - Create SQL file in `migrations/`
   - Name: `{sequence}_{description}.sql`

2. **Test locally:**
   ```bash
   npx wrangler d1 execute blog-db --local --file migrations/your_migration.sql
   ```

3. **Apply to production:**
   ```bash
   npx wrangler d1 execute blog-db --file migrations/your_migration.sql
   ```

4. **Deploy code:**
   ```bash
   npx wrangler deploy
   ```

---

## Troubleshooting

### Common Issues

**"Worker not found" error:**
- Check `wrangler.toml` configuration
- Verify account authentication
- Ensure deployment completed

**D1 query errors:**
- Check SQL syntax
- Verify table exists
- Check binding name matches

**Assets not loading:**
- Verify build completed
- Check asset manifest generated
- Confirm Assets binding configured

**Authentication failures:**
- Verify secrets are set
- Check cookie configuration
- Confirm HTTPS in production

### Debug Commands

```bash
# Check Worker status
npx wrangler deployment list

# View real-time logs
npx wrangler tail

# Test D1 query
npx wrangler d1 execute blog-db --command "SELECT COUNT(*) FROM entries"

# List R2 objects
npx wrangler r2 object list blog-images

# Check secrets (lists names only)
npx wrangler secret list
```

### Useful Links

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **D1 Docs:** https://developers.cloudflare.com/d1/
- **R2 Docs:** https://developers.cloudflare.com/r2/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **Cloudflare Status:** https://www.cloudflarestatus.com/

---

## Related Documentation

- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - System architecture
- **wireframes/v2-2025-11-18/database-schema.notes.md** - Database structure
- **wireframes/v2-2025-11-18/entry-points.notes.md** - Commands and scripts
- **wrangler.toml** - Cloudflare configuration
- **CLAUDE.md** - Development conventions
- **README.md** - Project overview
