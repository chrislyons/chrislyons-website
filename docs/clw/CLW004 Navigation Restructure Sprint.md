# Navigation Restructure Sprint

Comprehensive restructuring of website navigation from Home/Systems/Sounds/Writing to APPS | IDEAS | SOUNDS. Completed during Notion MCP installation session.

## Context

User requested random sprint to reorganize navigation while testing MCP functionality. Restructured entire site navigation and content organization to better reflect project categories.

## Navigation Changes

### Before
- Home
- Systems (Carbon ACX, Hydrophobic Field Harvesters, ListMaker, Orpheus SDK, Tidal MCP Server, WordBird)
- Sounds (Discography, Audio Samples)
- Writing (Essays, Hotbox, Lyrics, Poems, 27 Suppositions, Protocols of Sound)
- Connect

### After
- **APPS** (Carbon ACX, Clip Composer, ListMaker, Hotbox, Tidal MCP Server, WordBird)
- **IDEAS** (27 Suppositions, Numa Network, OSD Events, Protocols of Sound)
- **SOUNDS** (Collected Lyrics, Discography, Portfolio)
- Connect

### Removed
- Home tab (home.md still exists for root path)

## Implementation Details

### Files Modified
- `content/content.json` — Updated navigation structure and page definitions

### Content Reorganization
- Created `content/apps/` directory
- Created `content/ideas/` directory
- Moved `writing/27-suppositions.md` → `ideas/`
- Moved `writing/protocols-of-sound.md` → `ideas/`
- Moved `writing/lyrics-index.md` → `sounds/`
- Renamed `sounds/audio-samples.md` → `sounds/portfolio.md`

### New Pages Created
- `content/apps/clip-composer.md` — Professional audio clip sequencer
- `content/ideas/numa-network.md` — Distributed systems research
- `content/ideas/osd-events.md` — On-screen display event system

### Legacy Content
Preserved but not in navigation:
- `content/systems/boot-industries.md`
- `content/systems/hydrophobic-field-harvesters.md`
- `content/writing/essays.md`
- `content/writing/poems.md`

## Technical Notes

- Navigation component (`src/components/Navigation.js`) pulls from `content.json`
- No code changes required; navigation is data-driven
- Legacy directories (`systems/`, `writing/`) preserved for content files not in new navigation
- Path structure updated from `/systems/` to `/apps/` for all app pages
- Path structure updated from `/writing/` to `/ideas/` for conceptual content

## File Count
- Total content files: 16
- New directories: 2 (apps, ideas)
- New content files: 3 (clip-composer, numa-network, osd-events)
- Files moved: 5
- Files renamed: 1

## Next Actions

- [ ] Test navigation rendering in browser
- [ ] Verify all internal links still work
- [ ] Update any hardcoded paths in other components
- [ ] Consider cleanup of legacy systems/ and writing/ directories if content is no longer needed

## References

User message: "Random sprint while I figure out MCP stuff: Tabs rebuilt into: APPS | IDEAS | SOUNDS"
Session context: Installing Notion MCP server
