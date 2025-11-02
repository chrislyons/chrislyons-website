#!/usr/bin/env node

/**
 * Inject KV-hashed asset paths into worker.ts inline HTML
 * Reads from wrangler deploy output to get the actual KV paths
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read the built index.html to extract Vite asset names (without KV hash)
const distHtmlPath = join(rootDir, 'dist', 'index.html');
const distHtml = readFileSync(distHtmlPath, 'utf-8');

// Extract the script and link tags with Vite-generated asset paths
const scriptMatch = distHtml.match(/<script type="module" crossorigin src="\/assets\/(index-[^"]+\.js)"><\/script>/);
const linkMatch = distHtml.match(/<link rel="stylesheet" crossorigin href="\/assets\/(index-[^"]+\.css)">/);

if (!scriptMatch || !linkMatch) {
  console.error('❌ Could not find asset paths in dist/index.html');
  process.exit(1);
}

const jsFilename = scriptMatch[1];  // e.g., "index-DWPkHQ4M.js"
const cssFilename = linkMatch[1];   // e.g., "index-NAEdU9ii.css"

// Find the KV-hashed versions in dist/assets/
const assetsDir = join(rootDir, 'dist', 'assets');
const files = readdirSync(assetsDir);

// Find the actual KV-hashed filenames
const jsFilePattern = jsFilename.replace('.js', '');
const cssFilePattern = cssFilename.replace('.css', '');

const kvJsFile = files.find(f => f.startsWith(jsFilePattern) && f.endsWith('.js'));
const kvCssFile = files.find(f => f.startsWith(cssFilePattern) && f.endsWith('.css'));

if (!kvJsFile || !kvCssFile) {
  console.error(`❌ Could not find KV-hashed files`);
  console.error(`   Looking for JS: ${jsFilePattern}*.js`);
  console.error(`   Looking for CSS: ${cssFilePattern}*.css`);
  console.error(`   Found files: ${files.join(', ')}`);
  process.exit(1);
}

const jsPath = `/assets/${kvJsFile}`;
const cssPath = `/assets/${kvCssFile}`;

console.log(`✓ Found Vite assets:`);
console.log(`  JS:  ${jsFilename} → ${kvJsFile}`);
console.log(`  CSS: ${cssFilename} → ${kvCssFile}`);

// Read worker.ts
const workerPath = join(rootDir, 'src', 'worker.ts');
const workerContent = readFileSync(workerPath, 'utf-8');

// Replace the inline HTML asset references (match the KV-hashed paths)
const updatedWorker = workerContent.replace(
  /<!-- Styles -->\s*<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>\s*<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/,
  `<!-- Styles -->
  <script type="module" crossorigin src="${jsPath}"></script>
  <link rel="stylesheet" crossorigin href="${cssPath}">`
);

if (updatedWorker === workerContent) {
  // Check if paths are already correct
  if (workerContent.includes(jsPath) && workerContent.includes(cssPath)) {
    console.log('✓ Asset paths already up to date in worker.ts');
  } else {
    console.error('❌ Could not find asset references in worker.ts to replace');
    process.exit(1);
  }
} else {
  // Write back to worker.ts
  writeFileSync(workerPath, updatedWorker, 'utf-8');
  console.log('✓ Updated worker.ts with KV-hashed asset paths');
  console.log(`  JS:  ${jsPath}`);
  console.log(`  CSS: ${cssPath}`);
}
