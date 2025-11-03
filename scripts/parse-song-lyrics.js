/**
 * Parse song lyrics from markdown files
 * Converts markdown lyrics to HTML format for the website
 */

import fs from 'fs';
import path from 'path';

const songsDir = 'src/data/songs';
const outputFile = 'src/data/songs.js';

// Song titles from the original list
const songTitles = [
  '2-Bit Blues', 'All The Time', 'Anything Else', 'Blurred', 'Bootsteps',
  'Coal', 'Dieter, The Winged Saint', 'Dimed', 'Drifting Bird',
  'Failures in Forgiveness', 'Fins Of A Shark', 'Flares',
  'Friday Morning Suicide (Again)', 'Friends', 'Hiding', 'Holding Pattern',
  'I, the Hog-Tied Villain', 'Know My Love',
  'Look Elsewhere For Wisdom (Look This Way With Love)', 'Mayday',
  'Monday\'s Tea & Bagel', 'Moonbulbs', 'Mychoters', 'Pocket Fulla Stones',
  'Sailors Of The Seven Seas', 'Saskachussets', 'So Gone', 'So Rral',
  'Sunshine', 'Take My Heart', 'The Dumb Fambly Song',
  'The Flashing Light In Your Eyes As You Move Rapidly Beneath The Treetops',
  'The Hello Barrel', 'The House Song', 'The Wind & Me',
  'There & Back Again', 'Weeds', 'Windowsill #1', 'Windowsill #2'
];

// Find markdown file for a given song title
function findMarkdownFile(title) {
  const files = fs.readdirSync(songsDir);

  // Try exact match first
  const exactMatch = files.find(f => f.startsWith(title + ' '));
  if (exactMatch) return exactMatch;

  // Try case-insensitive match
  const lowerTitle = title.toLowerCase();
  const match = files.find(f => f.toLowerCase().startsWith(lowerTitle + ' '));

  // Special case: Mychoters vs Mychothers
  if (!match && title === 'Mychoters') {
    return files.find(f => f.startsWith('Mychothers '));
  }

  return match;
}

// Parse markdown and convert to HTML
function parseLyrics(markdown) {
  // Remove title line (# Title)
  let lines = markdown.split('\n');

  // Find where lyrics start (after author credit)
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'C. Lyons') {
      startIdx = i + 1;
      break;
    }
  }

  // Get lyrics lines
  const lyricsLines = lines.slice(startIdx);

  // Group lines into paragraphs (separated by blank lines)
  const paragraphs = [];
  let currentPara = [];

  for (const line of lyricsLines) {
    const trimmed = line.trim();

    // Skip markdown title lines (starting with "# ")
    if (trimmed.startsWith('# ')) {
      continue;
    }

    if (trimmed === '') {
      if (currentPara.length > 0) {
        paragraphs.push(currentPara.join('<br>\n'));
        currentPara = [];
      }
    } else {
      // Add line to current paragraph
      currentPara.push(trimmed);

      // If line contains "Lyons" (author credit), add extra spacing after this paragraph
      if (trimmed.includes('Lyons')) {
        if (currentPara.length > 0) {
          paragraphs.push(currentPara.join('<br>\n') + '<br>');
          currentPara = [];
        }
      }
    }
  }

  // Don't forget the last paragraph
  if (currentPara.length > 0) {
    paragraphs.push(currentPara.join('<br>\n'));
  }

  // Wrap each paragraph in <p> tags
  return paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
}

// Process all songs
function processSongs() {
  const songsData = [];

  for (const title of songTitles) {
    const filename = findMarkdownFile(title);

    if (!filename) {
      console.warn(`⚠️  No markdown file found for: ${title}`);
      songsData.push({ title, lyrics: null });
      continue;
    }

    try {
      const filepath = path.join(songsDir, filename);
      const markdown = fs.readFileSync(filepath, 'utf-8');
      const lyrics = parseLyrics(markdown);

      songsData.push({ title, lyrics });
      console.log(`✓ Processed: ${title}`);
    } catch (err) {
      console.error(`✗ Error processing ${title}:`, err.message);
      songsData.push({ title, lyrics: null });
    }
  }

  return songsData;
}

// Generate the JavaScript file
function generateJsFile(songsData) {
  const header = `/**
 * Song Lyrics Data
 *
 * Each song object contains:
 * - title: Song title
 * - lyrics: HTML string with song lyrics (use <p> for verses, <br> for line breaks)
 *
 * Auto-generated from markdown files in src/data/songs/
 * To update lyrics, edit the markdown files and run: node scripts/parse-song-lyrics.js
 */

export const songs = [`;

  const songEntries = songsData.map(song => {
    if (!song.lyrics) {
      return `  { title: '${song.title.replace(/'/g, "\\'")}', lyrics: null }`;
    }

    const escapedLyrics = song.lyrics
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    return `  {\n    title: '${song.title.replace(/'/g, "\\'")}',\n    lyrics: \`\n${escapedLyrics}\n    \`\n  }`;
  });

  const footer = `];`;

  return header + '\n' + songEntries.join(',\n') + '\n' + footer + '\n';
}

// Main execution
console.log('Parsing song lyrics from markdown files...\n');

const songsData = processSongs();
const jsContent = generateJsFile(songsData);

fs.writeFileSync(outputFile, jsContent);

console.log(`\n✓ Generated ${outputFile}`);
console.log(`  ${songsData.filter(s => s.lyrics).length} of ${songTitles.length} songs processed successfully`);
