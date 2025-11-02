import { Hono } from 'hono';
import { renderBlog, renderAdmin, renderCanvasCreator } from './templates';
import assetManifest from './asset-manifest.json';

// TypeScript type definitions for Cloudflare Workers environment
type Bindings = {
  DB: D1Database;
  BLOG_IMAGES: R2Bucket;
  GIPHY_API_KEY: string;
  ASSETS: Fetcher;
};

// Create Hono app for dynamic routes only
const dynamicApp = new Hono<{ Bindings: Bindings }>();

// Blog routes (public)
dynamicApp.get('/blog', async (c) => {
  const db = c.env.DB;
  const before = c.req.query('before');
  const format = c.req.query('format');

  let query = `
    SELECT id, type, content, created_at, metadata
    FROM entries
    WHERE published = 1
  `;

  const params: any[] = [];

  if (before) {
    query += ` AND created_at < ?`;
    params.push(before);
  }

  query += ` ORDER BY created_at DESC LIMIT 20`;

  const { results } = await db.prepare(query).bind(...params).all();

  if (format === 'json') {
    return c.json({ entries: results });
  }

  return c.html(renderBlog(results as any[]));
});

dynamicApp.get('/blog/entry/:id', async (c) => {
  const id = c.req.param('id');
  return c.redirect(`/blog#entry-${id}`);
});

dynamicApp.get('/rss.xml', async (c) => {
  const db = c.env.DB;
  const { results } = await db
    .prepare('SELECT * FROM entries WHERE published = 1 ORDER BY created_at DESC LIMIT 50')
    .all();

  const entries = results as any[];

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Infinite Canvas Blog</title>
    <link>https://${c.req.header('host')}/blog</link>
    <description>Visual thoughts in an endless scroll</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://${c.req.header('host')}/rss.xml" rel="self" type="application/rss+xml" />
    ${entries.map(entry => {
      const content = JSON.parse(entry.content);
      let description = '';

      switch (entry.type) {
        case 'text': description = content.text; break;
        case 'image': description = `<img src="${content.url}" alt="${content.alt || ''}" />${content.caption ? `<p>${content.caption}</p>` : ''}`; break;
        case 'gif': description = `<img src="${content.url}" alt="${content.title || 'GIF'}" />`; break;
        case 'quote': description = `<blockquote>"${content.text}"${content.author ? ` — ${content.author}` : ''}</blockquote>`; break;
      }

      return `
    <item>
      <title>${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Entry</title>
      <link>https://${c.req.header('host')}/blog/entry/${entry.id}</link>
      <guid>https://${c.req.header('host')}/blog/entry/${entry.id}</guid>
      <pubDate>${new Date(entry.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
    }).join('\n')}
  </channel>
</rss>`;

  return c.text(rss, 200, { 'Content-Type': 'application/rss+xml; charset=utf-8' });
});

// Admin routes
dynamicApp.get('/admin', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM entries ORDER BY created_at DESC').all();
  return c.html(renderAdmin(results as any[]));
});

dynamicApp.post('/admin/entry', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const { type, content, published, metadata } = body;

  const result = await db
    .prepare(`INSERT INTO entries (type, content, published, metadata, position_index)
       VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(position_index), 0) + 1 FROM entries))`)
    .bind(type, JSON.stringify(content), published ? 1 : 0, metadata ? JSON.stringify(metadata) : null)
    .run();

  const newEntry = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json(newEntry, 201);
});

dynamicApp.put('/admin/entry/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json();

  const updates: string[] = [];
  const params: any[] = [];

  if (body.content !== undefined) {
    updates.push('content = ?');
    params.push(JSON.stringify(body.content));
  }

  if (body.published !== undefined) {
    updates.push('published = ?');
    params.push(body.published ? 1 : 0);
  }

  if (body.metadata !== undefined) {
    updates.push('metadata = ?');
    params.push(JSON.stringify(body.metadata));
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  await db.prepare(`UPDATE entries SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
  const updatedEntry = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first();

  return c.json(updatedEntry);
});

dynamicApp.delete('/admin/entry/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  await db.prepare('DELETE FROM entries WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

dynamicApp.post('/admin/upload', async (c) => {
  const bucket = c.env.BLOG_IMAGES;
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  const timestamp = Date.now();
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}-${sanitizedFilename}`;

  await bucket.put(filename, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const url = `/images/${filename}`;
  return c.json({ url });
});

dynamicApp.get('/images/:filename', async (c) => {
  const bucket = c.env.BLOG_IMAGES;
  const filename = c.req.param('filename');
  const object = await bucket.get(filename);

  if (!object) {
    return c.notFound();
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});

// Canvas Creator routes
dynamicApp.get('/admin/create', async (c) => {
  return c.html(renderCanvasCreator());
});

dynamicApp.post('/admin/canvas', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const { title, background, dimensions, elements, published } = body;

  const result = await db
    .prepare(`INSERT INTO canvases (title, background, dimensions, elements, published, position_index)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(position_index), 0) + 1 FROM canvases))`)
    .bind(
      title,
      JSON.stringify(background),
      JSON.stringify(dimensions),
      JSON.stringify(elements),
      published ? 1 : 0
    )
    .run();

  const newCanvas = await db.prepare('SELECT * FROM canvases WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json(newCanvas, 201);
});

dynamicApp.get('/admin/canvas/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  const canvas = await db.prepare('SELECT * FROM canvases WHERE id = ?').bind(id).first();

  if (!canvas) {
    return c.notFound();
  }

  // Parse JSON fields
  const result = {
    ...canvas,
    background: JSON.parse(canvas.background as string),
    dimensions: JSON.parse(canvas.dimensions as string),
    elements: JSON.parse(canvas.elements as string),
  };

  return c.json(result);
});

dynamicApp.get('/admin/giphy', async (c) => {
  const query = c.req.query('q');
  if (!query) {
    return c.json({ error: 'Query required' }, 400);
  }

  const apiKey = c.env.GIPHY_API_KEY;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=12&rating=g`;
  const response = await fetch(url);
  const data = await response.json();

  return c.json(data);
});

// Inline index.html content (generated during build)
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary Meta Tags -->
  <title>Chris Lyons - Audio Engineer & Systems Architect</title>
  <meta name="title" content="Chris Lyons - Audio Engineer & Systems Architect">
  <meta name="description" content="Building multichannel recording studios, broadcast systems, and researching emerging technologies since 2007.">
  <meta name="author" content="Chris Lyons">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://chrislyons.boot.industries/">
  <meta property="og:title" content="Chris Lyons - Audio Engineer & Systems Architect">
  <meta property="og:description" content="Building multichannel recording studios, broadcast systems, and researching emerging technologies since 2007.">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://chrislyons.boot.industries/">
  <meta property="twitter:title" content="Chris Lyons - Audio Engineer & Systems Architect">
  <meta property="twitter:description" content="Building multichannel recording studios, broadcast systems, and researching emerging technologies since 2007.">

  <!-- Theme Color -->
  <meta name="theme-color" content="#1a365d">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg">

  <!-- Styles -->
  <script type="module" crossorigin src="${assetManifest.js}"></script>
  <link rel="stylesheet" crossorigin href="${assetManifest.css}">
</head>
<body>
  <!-- Skip to main content link for accessibility -->
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <!-- Main Application Container -->
  <div id="app" role="application">
    <!-- Navigation will be injected here -->
    <nav id="nav-container" role="navigation" aria-label="Main navigation"></nav>

    <!-- Main Content Area -->
    <main id="main-content" class="container-custom py-8 min-h-screen" role="main">
      <!-- Dynamic page content will be injected here -->
      <div id="page-content">
        <div class="text-center py-20">
          <h1 class="text-5xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer id="footer-container" role="contentinfo"></footer>
  </div>

  <!-- Main JavaScript -->
</body>
</html>`;

// Serve static files for everything else (SPA)
dynamicApp.all('*', async (c) => {
  const url = new URL(c.req.url);

  // Check if this is a dynamic route that should NOT be handled here
  // (these are handled by earlier route definitions)
  if (url.pathname.startsWith('/blog') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/images/') ||
      url.pathname === '/rss.xml') {
    // This should never be reached if routes are defined correctly
    // But just in case, return 404
    return c.notFound();
  }

  // For SPA routes (no file extension), serve index.html
  if (!url.pathname.includes('.')) {
    return c.html(INDEX_HTML);
  }

  // For actual files (assets, etc.), serve from ASSETS binding
  try {
    const assetResponse = await c.env.ASSETS.fetch(c.req.raw);

    if (assetResponse.status === 404) {
      return c.notFound();
    }

    // Determine correct Content-Type based on file extension
    const pathname = url.pathname;
    let contentType = 'application/octet-stream';

    if (pathname.endsWith('.js')) {
      contentType = 'application/javascript; charset=utf-8';
    } else if (pathname.endsWith('.css')) {
      contentType = 'text/css; charset=utf-8';
    } else if (pathname.endsWith('.json')) {
      contentType = 'application/json; charset=utf-8';
    } else if (pathname.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    } else if (pathname.endsWith('.png')) {
      contentType = 'image/png';
    } else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (pathname.endsWith('.woff2')) {
      contentType = 'font/woff2';
    } else if (pathname.endsWith('.woff')) {
      contentType = 'font/woff';
    } else if (pathname.endsWith('.html')) {
      contentType = 'text/html; charset=utf-8';
    } else {
      // Use whatever the assets binding returns
      contentType = assetResponse.headers.get('Content-Type') || 'application/octet-stream';
    }

    // Create new response with correct headers
    const headers = new Headers(assetResponse.headers);
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'unsafe-url');
    headers.set('X-Worker-Version', '2025-11-02-assets-migration');

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  } catch (e: any) {
    return c.text(`Asset error: ${e.message}`, 404);
  }
});

export default dynamicApp;
