# chrislyons-website Development Guide

**Workspace:** Inherits conventions from `~/chrislyons/dev/CLAUDE.md`
**Documentation PREFIX:** CLW

---

## Configuration Inheritance

This repository follows a three-tier configuration hierarchy:

1. **This file (CLAUDE.md)** — Repository-specific rules and conventions
2. **Workspace config** (`~/chrislyons/dev/CLAUDE.md`) — Cross-repo patterns
3. **Global config** (`~/.claude/CLAUDE.md`) — Universal rules

**Conflict Resolution:** Repo > Workspace > Global > Code behavior

---

## Documentation Standards

### Naming Convention

**CRITICAL:** All PREFIX-numbered documentation MUST include a descriptive title.

**Pattern:** `{CLW###} {Verbose Title}.md`

- **PREFIX:** CLW (all caps)
- **NUMBER:** 3-4 digits, sequential
- **SPACE:** Single space separator (REQUIRED)
- **TITLE:** Descriptive title indicating content (REQUIRED)
- **Extension:** `.md` or `.mdx`

**Examples (CORRECT):**
- `CLW001 Project Overview.md`
- `CLW042 Sprint 7 Implementation.md`
- `CLW100 Architecture Decisions.md`

**Examples (WRONG - DO NOT USE):**
- ❌ `CLW001.md` (missing title)
- ❌ `CLW-001-Overview.md` (wrong separator format)
- ❌ `001 Overview.md` (missing PREFIX)

### Creating New Documents

1. **Check existing numbers:**
   ```bash
   ls -1 docs/clw/ | grep -E '^CLW[0-9]{3,4}\s+' | sort
   ```

2. **Find next number:**
   ```bash
   # Get highest number + 1
   last=$(ls -1 docs/clw/ | grep -E '^CLW[0-9]{3}' | sed -E 's/CLW([0-9]+).*/\1/' | sort -n | tail -1)
   next=$((last + 1))
   echo "Next: CLW${next} Your Title Here.md"
   ```

3. **Use template:**
   ```markdown
   # Title

   Brief 1-4 sentence purpose statement.

   ## Context

   Background and motivation.

   ## Decisions / Implementation

   Technical details and rationale.

   ## Next Actions

   - [ ] Task 1
   - [ ] Task 2

   ## References

   [1] https://example.com/resource1
   [2] https://example.com/resource2
   ```

### Citation Style

Use IEEE-style numbered citations: `[1]`, `[2]`, etc.

References section should contain plain URLs (no markdown links in references).

---

## Documentation Indexing

**Active Documentation:**
- `docs/clw/` — All current documents

**Excluded from Indexing:**
- `docs/clw/archive/**` — Archived documents (180+ days old)
- `*.draft.md` — Draft documents not yet finalized

**Archive Management:**
Use `~/dev/scripts/archive-old-docs.sh` to move docs older than 180 days.

---

## Skill Loading

Skills are lazy-loaded based on file patterns to reduce context overhead.

**Template-Based Skills** (from `~/dev/.claude/skill-templates/`):

- **ci-troubleshooter** → `.github/workflows/**/*.yml`
- **test-analyzer** → `tests/**/*`, `**/*.test.*`
- **schema-linter** → `**/*.{json,yaml,yml}` (excludes build, node_modules)
- **dependency-audit** → `package.json`, `pnpm-lock.yaml`, etc. (triggers on change)
- **doc-standards** → `docs/clw/**/*.md`

**Skip Skills For:**
- Quick edits (<5 min, single file changes)
- Read-only exploration
- Docs-only sessions without code changes

**Config:** See `.claude/skills.json` for file pattern mappings.

---

## Project Structure

```
chrislyons-website/
├── CLAUDE.md              # This file (repo conventions)
├── README.md              # Project overview
├── docs/clw/              # Documentation (CLW### Title.md files)
│   └── INDEX.md           # Document registry
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   └── SongAccordion.js  # Expandable song cards
│   ├── data/              # Application data
│   │   ├── songs.js       # Song lyrics (auto-generated)
│   │   └── songs/         # Markdown source files
│   ├── utils/             # Utility functions
│   └── main.js            # Application entry point
├── scripts/               # Build and utility scripts
│   └── parse-song-lyrics.js  # Convert markdown to songs.js
├── tests/                 # Test suite
├── .claude/               # Claude Code configuration
│   ├── skills.json        # Skill loading configuration
│   └── scratch/           # Temporary workspace (gitignored)
├── .claudeignore          # Claude Code ignore patterns
└── .gitignore             # Git ignore patterns
```

---

## Development Setup

### Architecture Overview

This project uses a **dual-server architecture**:

1. **Vite Dev Server** (port 5173) — Serves SPA routes
   - Routes: `/`, `/apps/*`, `/ideas/*`, `/sounds/*`, `/connect`
   - Client-side routing with vanilla JavaScript

2. **Cloudflare Worker** (port 8787 in development) — Serves dynamic routes
   - Routes: `/blog`, `/admin`
   - Server-side rendering with Hono framework
   - Database: D1 (SQLite), Storage: R2

### Development Commands

**Option 1: SPA Only** (default)
```bash
npm run dev
```
- Runs Vite on port 5173
- `/blog` and `/admin` show development message with instructions

**Option 2: Worker Only**
```bash
npm run dev:worker
```
- Runs Cloudflare Worker on port 8787
- Access `/blog` and `/admin` at `http://localhost:8787`

**Option 3: Full Stack** (both servers)
```bash
npm run dev:all
```
- Runs both Vite (5173) AND Worker (8787) simultaneously
- Access everything at `http://localhost:5173`
- Vite proxy forwards `/blog` and `/admin` to Worker automatically

### Theme System

The site supports **four color themes**:

1. **Moonlight** (dark mode) — Navy blue accessibility theme
2. **Daylight** (light mode) — Clean white accessibility theme
3. **Forest** — Dark green variation
4. **Beach** — Warm gold-yellow-blue variation

- Theme selector cycles through all four modes
- Each theme has chromatically complementary colors
- Preference persists in localStorage
- Icons: Moon, Sun, Leaf, Kite

**Implementation Details:** See `docs/clw/CLW006 Four-Theme System Implementation.md`

### Build Configuration

**Important Files:**
- `vite.config.js` — Vite SPA mode, proxy configuration for worker routes
- `postcss.config.mjs` — PostCSS configuration (must use .mjs extension)
- `wrangler.toml` — Cloudflare Worker configuration
- `package.json` — Scripts and dependencies

**Build Process:**
```bash
npm run build
```
- Runs Vite build
- Generates asset manifest (`scripts/generate-asset-manifest.js`)
- Output: `dist/` directory

### Song Lyrics Management

Song lyrics are stored as markdown files in `src/data/songs/` and converted to JavaScript.

**Workflow:**
1. Edit markdown files in `src/data/songs/`
2. Run conversion script: `node scripts/parse-song-lyrics.js`
3. Script generates `src/data/songs.js` with formatted HTML
4. Lyrics appear in expandable accordion on `/sounds/lyrics`

**Markdown Format:**
```markdown
# Song Title

C. Lyons

Verse one line one
Verse one line two

Verse two line one
Verse two line two
```

**Manual Editing:**
You can also edit `src/data/songs.js` directly. Each song has:
```javascript
{
  title: 'Song Title',
  lyrics: `
    <p>Verse one line one<br>
    Verse one line two</p>

    <p>Verse two line one<br>
    Verse two line two</p>
  `
}
```

---

## Typography and Design Resources

### Shared Font Library Access

**Source:** `~/dev/shared-fonts/fontshare/` (workspace-level shared resource)

**Current Setup:**
- HK Grotesk — Currently used (not in shared library)
- Opportunity to upgrade with sophisticated editorial pairing

**Recommended Editorial/Portfolio Pairing:**

```bash
# 1. Copy recommended fonts for editorial design
mkdir -p public/fonts/fontshare
cp -r ~/dev/shared-fonts/fontshare/serif/melodrama \
      public/fonts/fontshare/
cp -r ~/dev/shared-fonts/fontshare/body-text/switzer \
      public/fonts/fontshare/

# Alternative: Keep current clean aesthetic
cp -r ~/dev/shared-fonts/fontshare/display/cabinet-grotesk \
      public/fonts/fontshare/
cp -r ~/dev/shared-fonts/fontshare/body-text/satoshi \
      public/fonts/fontshare/
```

**Integration Pattern (Vanilla JS + Vite):**

```css
/* Add to src/style.css */

/* Editorial Pairing */
@font-face {
  font-family: 'Melodrama';
  src: url('/fonts/fontshare/melodrama/Melodrama-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Switzer';
  src: url('/fonts/fontshare/switzer/Switzer-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-heading: 'Melodrama', Georgia, serif;
  --font-body: 'Switzer', system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
}
```

**Design System Reference:**
- `~/dev/docs/frontend-ux-guide.md` — Comprehensive UX patterns and best practices
- `~/dev/docs/fontshare-integration-guide.md` — Font integration quick reference
- `~/dev/shared-fonts/INVENTORY.md` — Complete font inventory

**Performance:**
- Preload primary body font (Switzer-Variable.woff2)
- Use font-display: swap for all fonts
- Consider font subsetting for production

**Theme System Compatibility:**
- Current 4-theme system (Moonlight, Daylight, Forest, Beach) works with any font pairing
- Melodrama adds editorial sophistication to all themes
- Switzer provides excellent readability across all color schemes

### File Access for Typography

**READ freely:**
- `~/dev/shared-fonts/fontshare/**/*.{woff2,woff,ttf}`
- `~/dev/docs/frontend-ux-guide.md`
- `~/dev/docs/fontshare-*.md`

**MODIFY after copying to project:**
- `src/style.css` (add @font-face declarations)
- `tailwind.config.js` (optional: add font families)

**NEVER modify:**
- Source font files in `~/dev/shared-fonts/`
- Shared workspace documentation without user approval

---

## Audio-Visual Asset Handling

### Workspace Standards Reference

**Comprehensive Guide:** `~/dev/docs/media-asset-handling-guide.md`

**Follow workspace standards for:**
- Image optimization (AVIF/WebP/JPEG)
- Audio delivery (songs, podcast-style content)
- Video delivery (if adding portfolio/demo content)
- Accessibility (WCAG 2.2 Level AA)

### Audio Assets (Song Lyrics + Playback)

**Current Setup:**
- Song lyrics stored in `src/data/songs/*.md`
- Converted to HTML via `scripts/parse-song-lyrics.js`
- Displayed in `SongAccordion.js` component

**Recommended Audio Player Integration:**

```bash
# Directory structure for audio files
mkdir -p public/audio/songs
```

**Audio Format Strategy:**

For each song, provide:
1. **Opus** (128kbps) — Modern, excellent compression
2. **MP3** (192kbps) — Universal fallback

```bash
# Encoding example (FFmpeg)
# From high-quality source (WAV, FLAC)
ffmpeg -i "song-title.wav" -c:a libopus -b:a 128k "song-title.opus"
ffmpeg -i "song-title.wav" -c:a libmp3lame -b:a 192k "song-title.mp3"
```

**HTML Integration:**

```html
<!-- In src/components/SongAccordion.js -->
<div class="song-player">
  <h3>{{ song.title }}</h3>

  <!-- Audio player -->
  <audio controls preload="metadata">
    <source src="/audio/songs/{{ song.slug }}.opus" type="audio/opus">
    <source src="/audio/songs/{{ song.slug }}.mp3" type="audio/mpeg">
    Your browser doesn't support the audio element.
  </audio>

  <!-- Lyrics (acts as transcript for accessibility) -->
  <details class="lyrics">
    <summary>Lyrics</summary>
    <div>{{{ song.lyrics }}}</div>
  </details>
</div>
```

**Accessibility Requirements:**
- ✅ Lyrics serve as transcript (WCAG 2.2 Level AA compliant)
- ✅ Audio player has native keyboard controls
- ✅ Provide both formats (Opus + MP3)

### Image Assets

**Format Strategy:**

For photos, artwork, and album covers:

```html
<picture>
  <source srcset="/images/{{ slug }}.avif" type="image/avif">
  <source srcset="/images/{{ slug }}.webp" type="image/webp">
  <img src="/images/{{ slug }}.jpg" alt="..." loading="lazy">
</picture>
```

**Optimization Pipeline:**

```bash
# Install Sharp for image processing
npm install sharp --save-dev

# Create optimization script
# scripts/optimize-images.js
```

```javascript
import sharp from 'sharp';
import { readdirSync } from 'fs';

const sizes = [640, 1280, 1920];
const formats = ['avif', 'webp', 'jpeg'];

readdirSync('src/images/original').forEach(async (file) => {
  if (!file.match(/\.(jpg|png)$/)) return;

  for (const size of sizes) {
    for (const format of formats) {
      await sharp(`src/images/original/${file}`)
        .resize(size, null, { withoutEnlargement: true })
        .toFormat(format, { quality: 80 })
        .toFile(`public/images/${format}/${file.replace(/\.(jpg|png)$/, '')}-${size}w.${format}`);
    }
  }
});
```

### Special Features

**Cover Flow Graphics:**
- Apple Cover Flow-style 3D graphics implemented
- Unlikely to be reused in other repos (project-specific)
- Visual-only feature, no audio/video integration needed
- ⚠️ **Not verified for WCAG 2.2 AA compliance** — May need keyboard navigation and screen reader support

### Performance Targets

**Images:**
- Hero/LCP image: <100KB (AVIF or WebP)
- Thumbnails: <20KB
- Lazy load all below-fold images

**Audio:**
- Song files: <5MB per track (Opus @ 128kbps)
- Preload: `metadata` only (not full audio)
- Progressive download (no streaming needed for songs <5min)

### File Access Rules

**READ freely:**
- `~/dev/docs/media-asset-handling-guide.md`
- Audio files in `public/audio/`
- Images in `public/images/`

**GENERATE when needed:**
- Optimized images (AVIF, WebP, responsive sizes)
- Audio files from source recordings
- Never commit source audio files (WAV, FLAC) to git

**NEVER commit:**
- Uncompressed audio (WAV, FLAC, >10MB)
- Unoptimized images
- Use R2 or external storage for source files

**ALWAYS include:**
- Lyrics/transcripts for all audio (already implemented ✅)
- Alt text for all images
- Multiple audio formats (Opus + MP3)

### Quick Commands

**Process song audio:**
```bash
# From high-quality source
ffmpeg -i source/song.wav \
  -c:a libopus -b:a 128k public/audio/songs/song.opus \
  -c:a libmp3lame -b:a 192k public/audio/songs/song.mp3
```

**Optimize images:**
```bash
node scripts/optimize-images.js
```

**Update song data:**
```bash
node scripts/parse-song-lyrics.js
```

---

## Quick Reference

### Common Tasks

**Update song lyrics from markdown:**
```bash
node scripts/parse-song-lyrics.js
```

**Check for documentation clutter:**
```bash
~/dev/scripts/find-root-clutter.sh
```

**Check for PREFIX collisions:**
```bash
~/dev/scripts/check-prefix-collisions.sh --verbose
```

**Archive old documentation:**
```bash
~/dev/scripts/archive-old-docs.sh
```

**Validate configuration hierarchy:**
```bash
~/dev/scripts/validate-config-hierarchy.sh
```

---

## Additional Resources

- **Workspace config:** `~/chrislyons/dev/CLAUDE.md`
- **Global config:** `~/.claude/CLAUDE.md`
- **Skill templates:** `~/dev/.claude/skill-templates/`
- **Automation scripts:** `~/dev/scripts/`
- **Design system:** `~/dev/docs/frontend-ux-guide.md`
- **Font library:** `~/dev/shared-fonts/INVENTORY.md`

---

**Last Updated:** 2025-11-03
