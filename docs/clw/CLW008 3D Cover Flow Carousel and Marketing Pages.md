# 3D Cover Flow Carousel and Marketing Pages

Implementation of a 3D rotating Cover Flow carousel for the discography page displaying 9 Bandcamp album embeds, plus marketing pages for 6 projects.

## Context

User requested a horizontal scrolling carousel styled like the classic macOS/iPod Cover Flow for the discography page, along with marketing pages for multiple projects using the Listmaker template as reference.

## Implementation

### 3D Cover Flow Carousel

**Location:** `/sounds/discography` (src/main.js:728-1300)

**Key Features:**
- 9 Bandcamp album embeds arranged in circular 3D space
- 360° rotation with 40° spacing between items (360/9)
- Radius of 650px from center
- CSS 3D transforms using `perspective`, `preserve-3d`, `rotateY`, `translateZ`
- Smooth 0.8s cubic-bezier transitions

**Lighting Effects (Distance-Based):**
- Center (distance 0): 100% opacity, 100% brightness, 100% scale
- Adjacent (±1): 70% opacity, 80% brightness, 85% scale
- Second tier (±2): 40% opacity, 60% brightness, 70% scale
- Far items (±3+): 20% opacity, 40% brightness, 60% scale

**Volume Control:**
- Speaker icon in top right of page header
- Toggle visibility with click (auto-hide after 3s)
- Vertical slider with percentage display
- Default: 90% volume
- LocalStorage persistence
- Dynamic icon based on volume level (muted, low, high)
- Theme-compatible styling using CSS variables

**Navigation:**
- Left/right arrow buttons
- Keyboard arrow keys support
- Album title and artist displayed for center item only

**Responsive Sizing:**
- Desktop: 380px × 560px cards in 900px wrapper
- Tablet (≤1200px): 340px × 520px cards in 700px wrapper
- Mobile (≤768px): 300px × 480px cards in 600px wrapper

**Data Source:**
- Album embeds stored in `src/data/discography-embeds.md`
- 9 albums total (5 Heartbeat Hotel, 4 Magical Superflowers)

### Marketing Pages

**Added routes for:**
1. Carbon ACX (`/apps/carbon-acx`)
2. Clip Composer (`/apps/clip-composer`)
3. Hotbox (`/apps/hotbox`)
4. Orpheus SDK (`/apps/orpheus-sdk`)
5. Tidal MCP Server (`/apps/tidal-mcp`)
6. Wordbird (`/apps/wordbird`)

**Template Structure (following Listmaker pattern):**
- Hero section with title, tagline, and GitHub/demo links
- Core Features grid (6 feature cards)
- Use Cases section
- Tech Stack section
- Responsive max-w-4xl container

**Research:**
- Gathered information from README files in `~/dev/` for each project
- Extracted key features, tech stacks, and use cases

## Technical Decisions

1. **Absolute positioning** for carousel items within fixed-height wrapper to ensure proper 3D rotation
2. **14rem top margin** on back navigation link to prevent collision with carousel content
3. **Removed album counter** to reduce clutter
4. **Removed subtitle description** ("Music releases and collaborations...") per user feedback
5. **Perspective origin at 50% 45%** to give more headroom for front-facing item
6. **Overflow: visible** on carousel scene to prevent clipping of scaled items

## Spacing Fixes

Multiple iterations to resolve element collisions:
- Initial: 800px wrapper, 3rem bottom margin
- Adjusted: 900px wrapper, 5rem bottom margin
- Final: 900px wrapper, 2rem bottom, 14rem top margin on nav link

## Files Modified

- `src/main.js` (lines 728-1300) - Discography page with carousel
- `src/main.js` (lines 142-650) - Marketing page render functions
- `content/content.json` - Added Orpheus SDK navigation entry
- `src/data/discography-embeds.md` - New file with Bandcamp embed codes

## Next Actions

- [ ] Consider extracting carousel logic into reusable component
- [ ] Add touch/swipe gestures for mobile navigation
- [ ] Evaluate single-player logic (current limitation: cross-origin iframe security)
- [ ] Test accessibility with screen readers

## References

[1] https://bandcamp.com/EmbeddedPlayer documentation
[2] CSS 3D transforms: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style
[3] Cover Flow design reference: macOS Finder/iTunes classic view
