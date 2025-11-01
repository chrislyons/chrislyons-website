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
├── docs/clw/    # Documentation (CLW### Title.md files)
│   └── INDEX.md           # Document registry
├── src/                   # Source code
├── tests/                 # Test suite
├── .claude/               # Claude Code configuration
│   ├── skills.json        # Skill loading configuration
│   └── scratch/           # Temporary workspace (gitignored)
├── .claudeignore          # Claude Code ignore patterns
└── .gitignore             # Git ignore patterns
```

---

## Quick Reference

### Common Tasks

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

---

**Last Updated:** 2025-11-01
