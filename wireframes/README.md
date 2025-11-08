# Wireframes & Architecture Documentation

This directory contains comprehensive Mermaid diagram documentation and architectural notes for the chrislyons-website codebase.

## Purpose

These wireframes are designed to:
- Fully inform human developer partners on all aspects of this codebase
- Enable developers to understand the architecture that has evolved
- Facilitate more involved development decisions
- Serve as onboarding documentation for new contributors

## Documentation Structure

Each topic has **two paired files**:

1. **{topic}.mermaid.md** - Pure Mermaid diagram only
   - Can be pasted directly into [mermaid.live](https://mermaid.live) for visualization
   - No markdown fences, just pure Mermaid syntax
   - Concise visual representation

2. **{topic}.notes.md** - Extended documentation and insights
   - Detailed explanation of the architecture shown in the diagram
   - Key architectural decisions and rationale
   - Important patterns or conventions used
   - Areas of technical debt or complexity
   - Common workflows or use cases
   - Where to look when making changes
   - Links to related diagrams

## Available Wireframes

### Version 1 (2025-11-08)

Located in `v1-2025-11-08/`:

1. **repo-structure** - Complete directory tree visualization
   - [Diagram](v1-2025-11-08/repo-structure.mermaid.md)
   - [Notes](v1-2025-11-08/repo-structure.notes.md)

2. **architecture-overview** - High-level system design
   - [Diagram](v1-2025-11-08/architecture-overview.mermaid.md)
   - [Notes](v1-2025-11-08/architecture-overview.notes.md)

3. **component-map** - Detailed component breakdown
   - [Diagram](v1-2025-11-08/component-map.mermaid.md)
   - [Notes](v1-2025-11-08/component-map.notes.md)

4. **data-flow** - How data moves through the system
   - [Diagram](v1-2025-11-08/data-flow.mermaid.md)
   - [Notes](v1-2025-11-08/data-flow.notes.md)

5. **entry-points** - All ways to interact with the codebase
   - [Diagram](v1-2025-11-08/entry-points.mermaid.md)
   - [Notes](v1-2025-11-08/entry-points.notes.md)

6. **database-schema** - Data model visualization
   - [Diagram](v1-2025-11-08/database-schema.mermaid.md)
   - [Notes](v1-2025-11-08/database-schema.notes.md)

7. **deployment-infrastructure** - How the code runs
   - [Diagram](v1-2025-11-08/deployment-infrastructure.mermaid.md)
   - [Notes](v1-2025-11-08/deployment-infrastructure.notes.md)

## How to Use

### Viewing Diagrams

**Option 1: mermaid.live (Recommended)**
1. Open [mermaid.live](https://mermaid.live)
2. Copy the entire contents of a `.mermaid.md` file
3. Paste into the editor
4. Diagram renders automatically

**Option 2: VS Code Extension**
1. Install "Markdown Preview Mermaid Support" extension
2. Open a `.mermaid.md` file
3. Add markdown fences around the content:
   ````markdown
   ```mermaid
   [paste mermaid content here]
   ```
   ````
4. Preview the markdown file

**Option 3: GitHub**
- GitHub renders Mermaid diagrams in markdown files automatically
- Add markdown fences (see Option 2) for GitHub rendering

### Reading Notes

Simply open the corresponding `.notes.md` file in any markdown viewer or text editor.

## Version History

- **v1-2025-11-08**: Initial comprehensive wireframe documentation
  - Complete system architecture
  - All 7 core topics covered
  - Generated from live codebase analysis

## Updating Wireframes

When the architecture changes significantly:

1. Create a new versioned directory: `wireframes/v{X}-YYYY-MM-DD/`
2. Generate new diagram and notes pairs for changed topics
3. Update this README with the new version
4. Keep old versions for historical reference

## Related Documentation

- **CLAUDE.md** - Repository-specific development guide
- **docs/clw/** - CLW-prefixed numbered documentation
- **README.md** - Project overview

## Feedback

If you find errors or areas that need clarification, please:
1. Open an issue describing the problem
2. Reference the specific wireframe file
3. Suggest improvements

---

**Last Updated**: 2025-11-08
**Version**: v1
**Maintainer**: Claude Code (AI-generated, human-reviewed)
