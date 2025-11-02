#!/usr/bin/env node
/**
 * Generate asset manifest from Vite build output
 * Reads dist/index.html to find the actual hashed asset filenames
 * and creates a manifest that can be imported by the worker
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const distIndexPath = join(projectRoot, 'dist', 'index.html');
const manifestPath = join(projectRoot, 'src', 'asset-manifest.json');

try {
  const indexHtml = readFileSync(distIndexPath, 'utf-8');

  // Extract JS and CSS paths using regex
  const jsMatch = indexHtml.match(/src="(\/assets\/index-[^"]+\.js)"/);
  const cssMatch = indexHtml.match(/href="(\/assets\/index\.[^"]+\.css)"/);

  if (!jsMatch || !cssMatch) {
    console.error('❌ Could not find asset paths in dist/index.html');
    process.exit(1);
  }

  const manifest = {
    js: jsMatch[1],
    css: cssMatch[1],
    generated: new Date().toISOString()
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('✅ Asset manifest generated:');
  console.log(`   JS:  ${manifest.js}`);
  console.log(`   CSS: ${manifest.css}`);
  console.log(`   Saved to: ${manifestPath}`);

} catch (error) {
  console.error('❌ Error generating asset manifest:', error.message);
  process.exit(1);
}
