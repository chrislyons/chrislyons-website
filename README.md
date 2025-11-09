# chrislyons-website

Personal website for Chris Lyons featuring portfolio projects, blog, collected song lyrics, and professional work.

**Live Site:** https://chrislyons.boot.industries

---

## Features

- **Dual-Server Architecture** — Vite SPA + Cloudflare Workers
- **Four-Theme System** — Moonlight, Daylight, Forest, Beach
- **Collected Lyrics** — 39 songs with expandable accordion interface
- **Blog System** — D1 database + R2 storage with admin panel
- **Portfolio Sections** — Apps, Ideas, Sounds, Writing

---

## Documentation PREFIX Registry

| Prefix | Purpose |
|--------|---------|
| **CLW** | Primary documentation for chrislyons-website |

---

## Quick Start

```bash
# Install dependencies
npm install

# Development (SPA only)
npm run dev

# Development (with Worker for blog/admin)
npm run dev:all

# Build for production
npm run build

# Deploy
npm run deploy
```

**Access:**
- SPA: http://localhost:5173
- Worker (if running): http://localhost:8787

### Admin Setup

To use the `/admin` panel, you must configure authentication credentials as Cloudflare Worker secrets:

```bash
# Set admin credentials (prompted for values)
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD

# Optional: Set Giphy API key for GIF search
npx wrangler secret put GIPHY_API_KEY
```

**Security Note:** Never commit credentials to version control. These are stored securely in Cloudflare's secret manager.

---

## Song Lyrics Management

Edit markdown files in `src/data/songs/` and run:

```bash
node scripts/parse-song-lyrics.js
```

This converts markdown to `src/data/songs.js` which powers the `/sounds/lyrics` page.

---

## Architecture

### Vite SPA Routes
- `/` — Home
- `/apps/*` — Portfolio apps
- `/ideas/*` — Research & concepts
- `/sounds/*` — Music & lyrics
- `/connect` — Contact

### Cloudflare Worker Routes
- `/blog` — Blog entries (D1 + R2)
- `/admin` — Content management

See [`CLAUDE.md`](./CLAUDE.md) for detailed development conventions.

---

## Documentation

See [`docs/clw/`](./docs/clw/) for detailed documentation.

---

## License

Personal portfolio site © 2025 Chris Lyons

