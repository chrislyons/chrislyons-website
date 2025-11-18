# Database Schema - Detailed Notes

## Overview

The chrislyons-website uses Cloudflare D1, a distributed SQLite database at the edge. The schema supports two main features: a blog with multiple entry types and a canvas-based visual entry system. All data is stored in the `blog-db` database.

## Database Configuration

**Database Name:** `blog-db`
**Database ID:** `741a89af-1617-491f-991b-0bde7cf81d69`
**Binding Name:** `DB`
**Technology:** Cloudflare D1 (SQLite at edge)

**Configuration in `wrangler.toml`:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "741a89af-1617-491f-991b-0bde7cf81d69"
```

## Tables

### entries Table

**Purpose:** Store blog entries of various types (text, image, gif, quote)

**Migration:** `migrations/001_create_entries_table.sql`

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('text', 'image', 'gif', 'quote')),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published INTEGER DEFAULT 0,
  position_index INTEGER,
  metadata TEXT
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `type` | TEXT | NOT NULL, CHECK | Entry type: text, image, gif, quote |
| `content` | TEXT | NOT NULL | JSON blob with type-specific content |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| `published` | INTEGER | DEFAULT 0 | Boolean (0/1) for visibility |
| `position_index` | INTEGER | | Manual ordering value |
| `metadata` | TEXT | | Optional JSON for fonts, styles |

**Indexes:**
```sql
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_published ON entries(published);
CREATE INDEX IF NOT EXISTS idx_position ON entries(position_index);
```

### canvases Table

**Purpose:** Store visual canvas entries (Instagram Stories-style layouts)

**Migration:** `migrations/001_create_canvases_table.sql`

**Schema:**
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

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `title` | TEXT | | Canvas title |
| `background` | TEXT | NOT NULL, DEFAULT | JSON background configuration |
| `dimensions` | TEXT | NOT NULL, DEFAULT | JSON canvas size |
| `elements` | TEXT | NOT NULL, DEFAULT | JSON array of positioned elements |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| `published` | INTEGER | DEFAULT 0 | Boolean (0/1) for visibility |
| `position_index` | INTEGER | | Manual ordering value |

**Indexes:**
```sql
CREATE INDEX IF NOT EXISTS idx_canvases_published ON canvases(published);
CREATE INDEX IF NOT EXISTS idx_canvases_created ON canvases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canvases_position ON canvases(position_index);
```

---

## JSON Content Structures

### Entry Content (by type)

The `content` column stores a JSON blob with different structure based on `type`.

#### Text Entry
```json
{
  "text": "Main text content here",
  "font": "Inter",
  "fontSize": "20px",
  "color": "#333333"
}
```

**Fields:**
- `text` (required): The main text content
- `font` (optional): Font family name
- `fontSize` (optional): CSS font size
- `color` (optional): Text color in hex

#### Image Entry
```json
{
  "url": "/images/1634567890123-photo.jpg",
  "alt": "Description of image",
  "caption": "Photo caption"
}
```

**Fields:**
- `url` (required): Image URL (R2 or external)
- `alt` (optional): Alt text for accessibility
- `caption` (optional): Display caption

#### GIF Entry
```json
{
  "url": "https://media.giphy.com/media/abc123/giphy.gif",
  "title": "Funny cat"
}
```

**Fields:**
- `url` (required): GIF URL (usually from Giphy)
- `title` (optional): GIF title

#### Quote Entry
```json
{
  "text": "The quote content here",
  "author": "Quote Author"
}
```

**Fields:**
- `text` (required): The quote text
- `author` (optional): Attribution

### Entry Metadata

Optional JSON stored in `metadata` column.

```json
{
  "font": "Inter",
  "style": "italic",
  "theme": "dark"
}
```

**Use Cases:**
- Override default fonts
- Store style preferences
- Add custom attributes

### Canvas Background

```json
// Solid color
{
  "type": "solid",
  "value": "#ffffff"
}

// Gradient
{
  "type": "gradient",
  "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}

// Image
{
  "type": "image",
  "value": "/images/bg-123.jpg"
}
```

**Types:**
- `solid`: Single color (hex)
- `gradient`: CSS gradient string
- `image`: Background image URL

### Canvas Dimensions

```json
// Stories (9:16 portrait)
{
  "width": 1080,
  "height": 1920
}

// Square (1:1)
{
  "width": 1080,
  "height": 1080
}

// Desktop (16:9 widescreen)
{
  "width": 1440,
  "height": 810
}
```

**Presets:**
- Stories: 1080×1920 (default)
- Square: 1080×1080
- Desktop: 1440×810

### Canvas Elements

Array of positioned elements.

```json
[
  {
    "id": "el-abc123",
    "type": "text",
    "content": {
      "text": "Hello World",
      "font": "Inter",
      "fontSize": 32,
      "color": "#000000"
    },
    "position": { "x": 100, "y": 200 },
    "size": { "width": 300, "height": "auto" },
    "rotation": 0,
    "zIndex": 1
  },
  {
    "id": "el-def456",
    "type": "image",
    "content": {
      "url": "/images/photo.jpg"
    },
    "position": { "x": 50, "y": 500 },
    "size": { "width": 400, "height": 400 },
    "rotation": 5,
    "zIndex": 2
  }
]
```

**Element Fields:**
- `id`: Unique element ID (`el-{uuid}`)
- `type`: Element type (text, image, gif, sticker)
- `content`: Type-specific content object
- `position`: `{ x, y }` coordinates (px)
- `size`: `{ width, height }` dimensions (px or "auto")
- `rotation`: Rotation in degrees
- `zIndex`: Layer order (higher = on top)

**Element Types:**
- `text`: Text with font/size/color
- `image`: Image URL
- `gif`: GIF URL
- `sticker`: Emoji or icon

---

## Common Queries

### Get Published Entries (Paginated)

```sql
SELECT id, type, content, created_at, metadata
FROM entries
WHERE published = 1
ORDER BY created_at DESC
LIMIT 20;
```

**With pagination:**
```sql
SELECT id, type, content, created_at, metadata
FROM entries
WHERE published = 1
  AND created_at < '2025-11-01T00:00:00Z'
ORDER BY created_at DESC
LIMIT 20;
```

### Get All Entries (Admin)

```sql
SELECT * FROM entries
ORDER BY created_at DESC;
```

### Get Single Entry

```sql
SELECT * FROM entries
WHERE id = ?;
```

### Create Entry

```sql
INSERT INTO entries (type, content, published, metadata, position_index)
VALUES (
  ?,
  ?,
  ?,
  ?,
  (SELECT COALESCE(MAX(position_index), 0) + 1 FROM entries)
);
```

### Update Entry

```sql
UPDATE entries
SET content = ?,
    published = ?,
    metadata = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

### Delete Entry

```sql
DELETE FROM entries WHERE id = ?;
```

### Get Published Canvases

```sql
SELECT * FROM canvases
WHERE published = 1
ORDER BY created_at DESC;
```

### Create Canvas

```sql
INSERT INTO canvases (title, background, dimensions, elements, published, position_index)
VALUES (
  ?,
  ?,
  ?,
  ?,
  ?,
  (SELECT COALESCE(MAX(position_index), 0) + 1 FROM canvases)
);
```

---

## Index Strategy

### Performance Indexes

**`idx_created_at` (entries, canvases):**
- Optimizes `ORDER BY created_at DESC`
- Used in every list query
- Descending for newest-first ordering

**`idx_published` (entries, canvases):**
- Optimizes `WHERE published = 1`
- Filters unpublished in public queries
- Boolean filter is very fast

**`idx_position` (entries, canvases):**
- Optimizes manual reordering
- Used for custom display order
- Not currently exposed in UI

### Query Performance

**Typical query patterns:**
1. List published entries (DESC by date) - Very fast
2. Get single entry by ID - Very fast (PK lookup)
3. Count entries - Fast (index scan)
4. Full table scan (admin) - Fast for small tables

**D1 Considerations:**
- Edge deployment means low latency
- SQLite engine optimized for reads
- Queries typically <20ms

---

## Migration Strategy

### Current Approach

**Manual Migration:**
1. Write SQL file in `migrations/`
2. Test locally with `--local` flag
3. Apply to production with `wrangler d1 execute`

**Migration Naming:**
```
{sequence}_{description}.sql
001_create_entries_table.sql
001_create_canvases_table.sql
002_add_tags_column.sql
```

### Applying Migrations

**Local (development):**
```bash
npx wrangler d1 execute blog-db --local --file migrations/001_create_entries_table.sql
```

**Production:**
```bash
npx wrangler d1 execute blog-db --file migrations/001_create_entries_table.sql
```

### Migration Best Practices

**Do:**
- Always include `IF NOT EXISTS` for creates
- Add `DEFAULT` values for new columns
- Create indexes after table creation
- Test migrations locally first
- Keep migrations idempotent (can run multiple times)

**Don't:**
- Drop tables without backup
- Remove columns with data
- Change column types without migration plan
- Apply migrations after code deploy (do before)

### Rollback Strategy

**No automated rollback.** Manual rollback:

1. **Backup before migration:**
   ```bash
   npx wrangler d1 execute blog-db --command "SELECT * FROM entries" > backup.json
   ```

2. **Write reverse migration:**
   ```sql
   -- migrations/002_rollback_001.sql
   ALTER TABLE entries DROP COLUMN new_column;
   ```

3. **Apply reverse migration:**
   ```bash
   npx wrangler d1 execute blog-db --file migrations/002_rollback_001.sql
   ```

---

## Data Types

### SQLite Type Affinity

D1 uses SQLite, which has type affinity (not strict types).

**INTEGER:**
- Used for: `id`, `published`, `position_index`
- Stored as: 64-bit signed integer
- Boolean: 0 = false, 1 = true

**TEXT:**
- Used for: `type`, `content`, `metadata`, `background`, `dimensions`, `elements`, `title`
- Stored as: UTF-8 string
- JSON stored as TEXT (parse with `JSON.parse()`)

**DATETIME:**
- Used for: `created_at`, `updated_at`
- Stored as: TEXT in ISO format
- Default: `CURRENT_TIMESTAMP`

### JSON Storage Pattern

**Why store JSON in TEXT?**
- Flexible schema per entry type
- No need for separate tables
- Easy to extend without migrations
- SQLite doesn't have native JSON type

**Drawbacks:**
- Can't query inside JSON efficiently
- Must parse in application code
- No schema validation by database

**D1 JSON Support:**
- `json_extract()` function available
- `json_array_length()` function available
- Can query JSON paths (but not indexed)

**Example:**
```sql
SELECT * FROM entries
WHERE json_extract(content, '$.text') LIKE '%hello%';
```

---

## Data Validation

### Database-Level Validation

**Check Constraints:**
```sql
CHECK(type IN ('text', 'image', 'gif', 'quote'))
```

**Not Null:**
- `type`, `content` - Required fields

**Defaults:**
- `published` defaults to 0 (unpublished)
- `created_at` and `updated_at` default to current timestamp
- `background`, `dimensions`, `elements` have sensible defaults

### Application-Level Validation

**Worker code should validate:**
- Content is valid JSON
- Required fields present per type
- URLs are valid format
- File types are allowed (image uploads)

**Current State:**
- Basic validation in Worker
- No comprehensive input sanitization
- Trust client data (consider hardening)

---

## Relationships

### Conceptual Relationships

**entries → entry content types:**
- One-to-one based on `type` column
- Content JSON structure varies by type
- Not enforced by foreign key

**canvases → elements:**
- One-to-many in JSON array
- Elements nested in `elements` column
- Not a separate table

### No Foreign Keys

**Why?**
- Simple schema
- All data self-contained in row
- JSON flexibility preferred
- No complex joins needed

**If foreign keys needed:**
```sql
-- Example: entries → tags (many-to-many)
CREATE TABLE entry_tags (
  entry_id INTEGER REFERENCES entries(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (entry_id, tag_id)
);
```

---

## R2 Storage (Related)

While not a database table, R2 stores related data.

**Bucket:** `blog-images` (currently disabled in wrangler.toml)
**Binding:** `BLOG_IMAGES`

**Stored Files:**
- Uploaded blog images
- Format: `{timestamp}-{sanitized-filename}`
- Content-Type preserved from upload

**Access Pattern:**
- Upload: `POST /admin/upload` → R2.put()
- Serve: `GET /images/:filename` → R2.get()

---

## Performance Considerations

### Query Optimization

**Use indexes:**
- Always filter by `published` first
- Order by `created_at` DESC
- Limit results (default 20)

**Avoid:**
- Full table scans in production
- Complex JSON queries
- Large result sets

### Database Size

**Current state:**
- Small dataset (<1000 entries expected)
- No performance concerns yet
- D1 handles up to 500MB per database

**Future considerations:**
- Archive old entries
- Add pagination to admin
- Consider read replicas if needed

### Connection Pooling

**D1 automatically handles:**
- Connection management
- Query routing
- Edge replication

**No manual pooling needed.**

---

## Security Considerations

### SQL Injection Prevention

**Always use prepared statements:**
```javascript
// Good
db.prepare('SELECT * FROM entries WHERE id = ?').bind(id)

// Bad
db.exec(`SELECT * FROM entries WHERE id = ${id}`)
```

**Worker code follows this pattern consistently.**

### Data Exposure

**Public queries:**
- Only return published entries
- No admin-only fields exposed

**Admin queries:**
- Require authentication
- Return all fields

### Sensitive Data

**Not stored in database:**
- Admin credentials (in Cloudflare Secrets)
- API keys (in Cloudflare Secrets)

**Stored in database:**
- User-generated content
- No personally identifiable information (single-user system)

---

## Backup and Recovery

### Backup Strategy

**Manual backup (export to JSON):**
```bash
npx wrangler d1 execute blog-db --command "SELECT * FROM entries" > entries_backup.json
npx wrangler d1 execute blog-db --command "SELECT * FROM canvases" > canvases_backup.json
```

**Cloudflare D1 Point-in-Time Recovery:**
- Available for paid plans
- Automatic backups
- Restore to specific point

### Recovery

**From JSON backup:**
1. Drop existing tables (or create new database)
2. Apply migrations
3. Insert data from backup JSON

**From Cloudflare backup:**
- Use D1 dashboard
- Select restore point
- Automatic restoration

---

## Future Schema Considerations

### Potential Additions

**Tags/Categories:**
```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE entry_tags (
  entry_id INTEGER REFERENCES entries(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (entry_id, tag_id)
);
```

**Comments:**
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER REFERENCES entries(id),
  content TEXT NOT NULL,
  author_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Views/Analytics:**
```sql
CREATE TABLE entry_views (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER REFERENCES entries(id),
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT
);
```

### Schema Evolution Tips

1. Add columns with defaults (backward compatible)
2. Create new tables before code changes
3. Deprecate columns before dropping
4. Maintain JSON flexibility for content
5. Consider D1's SQLite version for features

---

## Related Documentation

- **migrations/001_create_entries_table.sql** - Entry table migration
- **migrations/001_create_canvases_table.sql** - Canvas table migration
- **wireframes/v2-2025-11-18/architecture-overview.notes.md** - System architecture
- **wireframes/v2-2025-11-18/data-flow.notes.md** - How data moves
- **CLAUDE.md** - Development conventions
