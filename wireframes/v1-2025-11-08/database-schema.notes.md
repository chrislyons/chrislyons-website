# Database Schema - Notes

## Overview

The chrislyons-website uses **Cloudflare D1**, a globally distributed SQLite database running at the edge. The database stores dynamic content for the blog and visual canvas features.

**Key Characteristics**:
- **Technology**: SQLite (edge-optimized)
- **Provider**: Cloudflare D1
- **Schema Version**: v001 (initial migration)
- **Tables**: 2 (entries, canvases)
- **Relationships**: None (no foreign keys)

## Database Connection

### Development
```bash
# Local D1 database
npm run dev:worker

# Database persisted in .wrangler/state/
```

### Production
```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "741a89af-1617-491f-991b-0bde7cf81d69"
```

### Access in Worker
```typescript
const db = c.env.DB;
const result = await db.prepare('SELECT * FROM entries').all();
```

## Table: entries

**Purpose**: Store blog entries (text, images, GIFs, quotes)

**Migration**: `migrations/001_create_entries_table.sql`

### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('text', 'image', 'gif', 'quote')),
  content TEXT NOT NULL, -- JSON blob
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published INTEGER DEFAULT 0, -- SQLite uses 0/1 for boolean
  position_index INTEGER,
  metadata TEXT -- JSON for fonts, styles
);
```

### Columns

**id** (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- Unique identifier for each entry
- Auto-generated on insert
- Used in API endpoints: `/admin/entry/:id`

**type** (TEXT, NOT NULL)
- Entry type: `text`, `image`, `gif`, or `quote`
- Enforced by CHECK constraint
- Determines how content is rendered

**content** (TEXT, NOT NULL)
- JSON blob with entry content
- Structure varies by type (see Content Structures below)
- Stored as JSON string

**created_at** (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- Timestamp when entry was created
- Automatically set on insert
- Used for ordering entries (newest first)
- Format: ISO 8601 (e.g., `2025-11-08T12:00:00Z`)

**updated_at** (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- Timestamp when entry was last modified
- Updated on every UPDATE query
- Not automatically updated (must be set in query)

**published** (INTEGER, DEFAULT 0)
- Publication status: 0 (draft) or 1 (published)
- SQLite doesn't have native boolean type
- Only published entries (1) shown on /blog

**position_index** (INTEGER, NULLABLE)
- Manual ordering for entries
- Allows custom sort order (override created_at)
- Auto-calculated on insert: `(SELECT COALESCE(MAX(position_index), 0) + 1 FROM entries)`
- Can be updated for reordering

**metadata** (TEXT, NULLABLE)
- JSON blob for additional data
- Used for fonts, styles, or other entry-specific settings
- Optional field

### Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_published ON entries(published);
CREATE INDEX IF NOT EXISTS idx_position ON entries(position_index);
```

**idx_created_at**:
- Optimizes queries that order by created_at
- DESC order for "newest first" queries
- Used by /blog and /rss.xml

**idx_published**:
- Optimizes queries filtering by published status
- Used by all public blog queries

**idx_position**:
- Optimizes queries ordering by position_index
- Used when custom ordering is enabled

### Content Structures (by Type)

#### Type: text

```json
{
  "text": "My blog entry text here",
  "font": "Inter",
  "fontSize": "16px",
  "color": "#333333"
}
```

**Fields**:
- `text`: Entry text content
- `font`: Font family (optional)
- `fontSize`: Font size (optional)
- `color`: Text color (optional)

#### Type: image

```json
{
  "url": "/images/123456-photo.jpg",
  "alt": "Alt text for accessibility",
  "caption": "Optional caption text"
}
```

**Fields**:
- `url`: Image URL (from R2 or external)
- `alt`: Alternative text for screen readers
- `caption`: Optional caption below image

#### Type: gif

```json
{
  "url": "https://media.giphy.com/media/abc123/giphy.gif",
  "title": "Funny GIF"
}
```

**Fields**:
- `url`: GIF URL (typically from Giphy)
- `title`: Optional GIF title

#### Type: quote

```json
{
  "text": "The quote text goes here",
  "author": "Author Name"
}
```

**Fields**:
- `text`: Quote text
- `author`: Quote attribution (optional)

### Sample Data

```sql
-- Inserted by migration for testing
INSERT INTO entries (type, content, published, metadata) VALUES (
  'text',
  '{"text": "Welcome to the infinite canvas! This is your first entry.", "font": "Inter", "fontSize": "20px", "color": "#333333"}',
  1,
  '{"font": "Inter"}'
);
```

### Common Queries

**Get all published entries**:
```sql
SELECT id, type, content, created_at, metadata
FROM entries
WHERE published = 1
ORDER BY created_at DESC
LIMIT 20;
```

**Get single entry**:
```sql
SELECT * FROM entries WHERE id = ?;
```

**Create entry**:
```sql
INSERT INTO entries (type, content, published, metadata, position_index)
VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(position_index), 0) + 1 FROM entries));
```

**Update entry**:
```sql
UPDATE entries
SET content = ?, published = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

**Delete entry**:
```sql
DELETE FROM entries WHERE id = ?;
```

## Table: canvases

**Purpose**: Store visual canvas entries (Instagram Stories-style)

**Migration**: `migrations/001_create_canvases_table.sql`

### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS canvases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  background TEXT NOT NULL DEFAULT '{"type":"solid","value":"#ffffff"}',
  dimensions TEXT NOT NULL DEFAULT '{"width":1080,"height":1920}',
  elements TEXT NOT NULL DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published INTEGER DEFAULT 0,
  position_index INTEGER
);
```

### Columns

**id** (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- Unique identifier for each canvas
- Auto-generated on insert

**title** (TEXT, NULLABLE)
- Canvas title (optional)
- Used for admin display

**background** (TEXT, NOT NULL, DEFAULT)
- JSON blob with background config
- Default: `{"type":"solid","value":"#ffffff"}` (white)
- See Background Types below

**dimensions** (TEXT, NOT NULL, DEFAULT)
- JSON blob with canvas size
- Default: `{"width":1080,"height":1920}` (Stories format)
- See Dimension Presets below

**elements** (TEXT, NOT NULL, DEFAULT)
- JSON array of positioned elements
- Default: `[]` (empty canvas)
- See Element Structure below

**created_at** (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- Timestamp when canvas was created
- Automatically set on insert

**updated_at** (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- Timestamp when canvas was last modified
- Updated on every UPDATE query

**published** (INTEGER, DEFAULT 0)
- Publication status: 0 (draft) or 1 (published)
- Only published canvases shown on /blog

**position_index** (INTEGER, NULLABLE)
- Manual ordering for canvases
- Auto-calculated on insert

### Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_canvases_published ON canvases(published);
CREATE INDEX IF NOT EXISTS idx_canvases_created ON canvases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canvases_position ON canvases(position_index);
```

### Background Types

**Solid Color**:
```json
{
  "type": "solid",
  "value": "#ffffff"
}
```

**Gradient**:
```json
{
  "type": "gradient",
  "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}
```

**Image**:
```json
{
  "type": "image",
  "value": "/images/bg-123.jpg"
}
```

### Dimension Presets

**Stories (9:16 portrait)**:
```json
{
  "width": 1080,
  "height": 1920
}
```

**Square (1:1)**:
```json
{
  "width": 1080,
  "height": 1080
}
```

**Desktop (16:9 widescreen)**:
```json
{
  "width": 1440,
  "height": 810
}
```

### Element Structure

```json
{
  "id": "el-abc123",
  "type": "text",
  "content": {
    "text": "Hello world",
    "font": "Inter",
    "fontSize": 24,
    "color": "#000000"
  },
  "position": {
    "x": 100,
    "y": 200
  },
  "size": {
    "width": 300,
    "height": "auto"
  },
  "rotation": 15,
  "zIndex": 1
}
```

**Element Types**:
- `text`: Text element
- `image`: Image element
- `gif`: GIF element
- `sticker`: Sticker/emoji element

**Common Fields**:
- `id`: Unique element identifier (e.g., `el-{uuid}`)
- `type`: Element type
- `content`: Type-specific content object
- `position`: {x, y} coordinates
- `size`: {width, height} (height can be "auto")
- `rotation`: Rotation in degrees
- `zIndex`: Stacking order

### Sample Element Types

**Text Element**:
```json
{
  "id": "el-text1",
  "type": "text",
  "content": {
    "text": "Hello world",
    "font": "Inter",
    "fontSize": 24,
    "color": "#000000"
  },
  "position": {"x": 100, "y": 100},
  "size": {"width": 200, "height": "auto"},
  "rotation": 0,
  "zIndex": 1
}
```

**Image Element**:
```json
{
  "id": "el-img1",
  "type": "image",
  "content": {
    "url": "/images/photo.jpg"
  },
  "position": {"x": 50, "y": 300},
  "size": {"width": 400, "height": 300},
  "rotation": 0,
  "zIndex": 0
}
```

**GIF Element**:
```json
{
  "id": "el-gif1",
  "type": "gif",
  "content": {
    "url": "https://media.giphy.com/media/abc/giphy.gif"
  },
  "position": {"x": 200, "y": 500},
  "size": {"width": 200, "height": 200},
  "rotation": 0,
  "zIndex": 2
}
```

**Sticker Element**:
```json
{
  "id": "el-sticker1",
  "type": "sticker",
  "content": {
    "emoji": "🎉"
  },
  "position": {"x": 400, "y": 100},
  "size": {"width": 100, "height": 100},
  "rotation": 10,
  "zIndex": 3
}
```

## Migration Strategy

### Running Migrations

**Development**:
```bash
# Apply migrations to local D1 database
npx wrangler d1 migrations apply blog-db --local
```

**Production**:
```bash
# Apply migrations to production D1 database
npx wrangler d1 migrations apply blog-db
```

### Migration Files

Located in `migrations/`:
- `001_create_entries_table.sql`
- `001_create_canvases_table.sql`

**Format**:
- Sequential numbering: `001`, `002`, etc.
- Descriptive filename
- SQL statements with comments

### Adding a New Migration

1. Create file: `migrations/002_add_new_column.sql`
2. Write SQL:
   ```sql
   -- Migration: Add new column
   -- Created: 2025-11-08

   ALTER TABLE entries ADD COLUMN new_column TEXT;
   ```
3. Apply migration:
   ```bash
   npx wrangler d1 migrations apply blog-db --local
   npx wrangler d1 migrations apply blog-db
   ```

### Migration Best Practices

- **Use IF NOT EXISTS**: Prevent errors on re-run
- **Add comments**: Document purpose and date
- **Test locally first**: Apply with `--local` flag
- **Backup production**: Before applying to production
- **Avoid breaking changes**: Don't drop columns in use

## Database Access Patterns

### Worker Access

```typescript
// Get database binding
const db = c.env.DB;

// Prepare query
const stmt = db.prepare('SELECT * FROM entries WHERE published = 1');

// Execute query
const { results } = await stmt.all();

// Single row
const entry = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first();

// Insert
const result = await db.prepare('INSERT INTO entries (...) VALUES (?, ?, ?)').bind(type, content, published).run();
const newId = result.meta.last_row_id;
```

### Parameterized Queries

**Always use parameterized queries** to prevent SQL injection:

```typescript
// ✅ SAFE
const entry = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first();

// ❌ UNSAFE (SQL injection risk)
const entry = await db.prepare(`SELECT * FROM entries WHERE id = ${id}`).first();
```

### Transactions

D1 supports transactions for atomic operations:

```typescript
const result = await db.batch([
  db.prepare('INSERT INTO entries (...) VALUES (?, ?, ?)').bind(type1, content1, 1),
  db.prepare('INSERT INTO entries (...) VALUES (?, ?, ?)').bind(type2, content2, 1),
]);
```

## Performance Considerations

### Indexing
- All commonly queried columns are indexed
- `created_at DESC` index for newest-first queries
- `published` index for filtering drafts

### JSON Storage
- JSON fields stored as TEXT
- Parsed in application code (not in SQL)
- Flexible schema without migrations for content changes

### Query Optimization
- **LIMIT results**: Prevent unbounded queries (e.g., `LIMIT 20`)
- **Pagination**: Use `WHERE created_at < ?` for pagination
- **Avoid SELECT ***: Select only needed columns in production

### Edge Distribution
- D1 is globally distributed
- Queries execute at nearest edge location
- Low latency worldwide

## Data Consistency

### Timestamps
- `created_at` auto-set on insert
- `updated_at` must be manually updated:
  ```sql
  UPDATE entries SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;
  ```

### Position Index
- Auto-calculated on insert (MAX + 1)
- Can be updated for reordering
- Nullable (falls back to created_at ordering)

### Published Flag
- 0 = draft (not shown publicly)
- 1 = published (visible on /blog)
- Admin sees all entries regardless of flag

## Backup and Recovery

### Local Backup
```bash
# Dump local database
npx wrangler d1 export blog-db --local --output backup.sql
```

### Production Backup
```bash
# Dump production database
npx wrangler d1 export blog-db --output backup.sql
```

### Restore
```bash
# Import from backup
npx wrangler d1 execute blog-db --file backup.sql
```

## Security Considerations

### Authentication
- All write operations require authentication
- `isAuthenticated()` middleware checks session cookie
- Read operations (/blog) are public

### SQL Injection
- **Always use parameterized queries**
- Never concatenate user input into SQL strings
- D1 `.bind()` method handles escaping

### Data Validation
- Type constraints enforce valid entry types
- JSON validation happens in application code
- Consider adding CHECK constraints for critical fields

## Technical Debt

1. **No Foreign Keys**: Tables are independent (could add relationships)
2. **JSON Validation**: No schema validation for JSON fields
3. **No Soft Deletes**: Entries are permanently deleted (consider `deleted_at` column)
4. **Manual updated_at**: Not automatically updated (could use triggers if supported)
5. **No Audit Log**: No tracking of who changed what when

## Future Enhancements

### Potential Schema Changes

**Add user management**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE entries ADD COLUMN author_id INTEGER REFERENCES users(id);
```

**Add tags/categories**:
```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE entry_tags (
  entry_id INTEGER REFERENCES entries(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (entry_id, tag_id)
);
```

**Add soft deletes**:
```sql
ALTER TABLE entries ADD COLUMN deleted_at DATETIME;
CREATE INDEX idx_deleted_at ON entries(deleted_at);
```

**Add view tracking**:
```sql
CREATE TABLE entry_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id INTEGER REFERENCES entries(id),
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT
);
```

## Related Diagrams

- [repo-structure.mermaid.md](repo-structure.mermaid.md) - Directory layout
- [architecture-overview.mermaid.md](architecture-overview.mermaid.md) - System design
- [component-map.mermaid.md](component-map.mermaid.md) - Component relationships
- [data-flow.mermaid.md](data-flow.mermaid.md) - Data movement
- [entry-points.mermaid.md](entry-points.mermaid.md) - Application initialization
- [deployment-infrastructure.mermaid.md](deployment-infrastructure.mermaid.md) - Deployment architecture
