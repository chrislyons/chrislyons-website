# Chris Lyons Website Rebuild - Claude Code Sprint Plan

## Project Overview
- **Source**: Notion workspace content (chrislyons.super.site)
- **Target**: Custom HTML/CSS/JS site at http://chrislyons.boot.industries
- **Local Repository**: `~/dev/chrislyons-website`
- **Deployment**: Cloudflare Pages
- **Goal**: Capture current state of chrislyons.super.site in custom code

---

## Content Access Strategy

### Notion Pages to Extract
The following Notion page IDs contain the source content:

```
Main Page: 22085dd4fdf2807b8545fa8281c500e1 (hey it's ChrisLyons.com)
├── Systems: 22085dd4fdf280d7b523c7df08b28c03
│   ├── Boot Industries: 22185dd4fdf280e89594c41b0625ebc9
│   └── Hydrophobic Field Harvesters: 22185dd4fdf280cbac3cf3af0a97ae86
├── Sounds: 22085dd4fdf2805ca4fbf7b8852b8a9c
│   ├── Discography: 22085dd4fdf280e68829e72222f3bc9a
│   └── Audio Samples: 22085dd4fdf2800eae4dc7e01a7853af
├── Writing: 22085dd4fdf280ceb39ff4f3f5b5d464
│   ├── Essays: 22085dd4fdf280ec9e48f28743c43fab
│   ├── Lyrics: 22085dd4fdf280f08bedd01916067631
│   ├── Poems: 22085dd4fdf28054b52bc3de052782e4
│   ├── 27 Suppositions: 22085dd4fdf28051bccaf312c73712f1
│   └── Protocols of Sound: 22085dd4fdf2801fbe4efd0feaa98e9a
└── Connect: 22085dd4fdf2801ea8c2e43ccb5af1b5
```

### Content Extraction Method
Use Notion MCP tools available in Claude Code:
```bash
# In Claude Code, use these tools to fetch content:
Notion:notion-fetch with page_id parameter
```

---

## SPRINT 0: Content Extraction & Preparation
**Duration**: 30 minutes  
**Goal**: Download all Notion content and assets locally

### Tasks:
1. **Create content directory structure**
   ```bash
   mkdir -p content/{systems,sounds,writing,connect}
   mkdir -p assets/images
   ```

2. **Fetch all Notion pages**
   - Use `Notion:notion-fetch` for each page ID above
   - Save markdown/JSON output to `content/` directory
   - Create content manifest: `content/manifest.json`

3. **Download images from Notion**
   - Extract all image URLs from fetched pages
   - Download Boot Industries images (2 diagrams + artistic rendering)
   - Save to `assets/images/` with descriptive names
   - Create image manifest for easy reference

4. **Parse Notion markdown to HTML-ready format**
   - Convert Notion-flavored markdown to standard format
   - Extract tables and preserve formatting
   - Note any special formatting needs

5. **Create content.json**
   - Single source of truth for all site content
   - Include navigation structure
   - Include all text content
   - Include image paths and metadata

**Deliverables**:
- `content/` directory with all Notion pages as markdown
- `assets/images/` with all downloaded images
- `content.json` with structured site data
- Image manifest with local paths

---

## Core Site Content (Extracted from Notion)

### Home Page Content
```markdown
# hey it's ChrisLyons.com

Since 2007 I've been building multichannel recording studios and broadcast systems, researching emerging technologies and writing, producing, and recording music and voice.

My focus is creating reliable systems that serve the people who use them. My 'Numa' initiative is aimed at better supporting creative communities through equitable attribution frameworks, while broader research interests include bio-manufacturing methods and microplastics filtration systems.
```

### Navigation Structure
```json
{
  "nav": [
    {
      "title": "Systems",
      "path": "/systems",
      "children": [
        {
          "title": "Boot Industries, Inc.",
          "path": "/systems/boot-industries"
        },
        {
          "title": "Hydrophobic Field Harvesters",
          "path": "/systems/hydrophobic-field-harvesters"
        }
      ]
    },
    {
      "title": "Sounds",
      "path": "/sounds",
      "children": [
        {
          "title": "Discography",
          "path": "/sounds/discography"
        },
        {
          "title": "Audio Samples",
          "path": "/sounds/audio-samples"
        }
      ]
    },
    {
      "title": "Writing",
      "path": "/writing",
      "children": [
        {
          "title": "Essays",
          "path": "/writing/essays"
        },
        {
          "title": "Lyrics",
          "path": "/writing/lyrics"
        },
        {
          "title": "Poems",
          "path": "/writing/poems"
        },
        {
          "title": "27 Suppositions",
          "path": "/writing/27-suppositions"
        },
        {
          "title": "Protocols of Sound",
          "path": "/writing/protocols-of-sound"
        }
      ]
    },
    {
      "title": "Connect",
      "path": "/connect"
    }
  ]
}
```

### Boot Industries Content (Key Sections)
**Note**: Full content is ~4000 words with tables and images. Include complete executive summary, tables for market data, roadmap, financials, and 3 images.

Key sections to include:
- Executive Summary (opening paragraph)
- Market Opportunity (table)
- The Boot Solution (comparison table)
- Technology Status (table with checkmarks)
- Target Segments (table)
- Development Roadmap (color-coded table)
- Financial Projections (table)
- Images: 2 technical diagrams + 1 artistic rendering
- Environmental Impact bullet points
- Competitive Positioning (table)
- Contact information

---

## SPRINT 1: Project Foundation & Build System
**Duration**: 1-2 hours  
**Goal**: Modern, production-ready build system

### Tasks:
1. **Initialize Vite Project**
   ```bash
   cd ~/dev/chrislyons-website
   npm init -y
   npm install -D vite
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Setup HK Grotesk Font**
   ```css
   /* src/style.css */
   @font-face {
     font-family: 'HK Grotesk';
     src: url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Regular.woff2') format('woff2'),
          url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Regular.woff') format('woff');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'HK Grotesk';
     src: url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Medium.woff2') format('woff2'),
          url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Medium.woff') format('woff');
     font-weight: 500;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'HK Grotesk';
     src: url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-SemiBold.woff2') format('woff2'),
          url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-SemiBold.woff') format('woff');
     font-weight: 600;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'HK Grotesk';
     src: url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Bold.woff2') format('woff2'),
          url('/fonts/HKGrotesk_3003/WEB/HKGrotesk-Bold.woff') format('woff');
     font-weight: 700;
     font-style: normal;
     font-display: swap;
   }
   ```

3. **Project Structure**
   ```
   chrislyons-website/
   ├── content/              # From Sprint 0
   │   ├── manifest.json
   │   └── [all-pages].md
   ├── assets/
   │   └── images/           # From Sprint 0
   ├── src/
   │   ├── main.js
   │   ├── style.css
   │   ├── components/
   │   ├── pages/
   │   └── utils/
   ├── public/
   │   └── favicon.ico
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── tailwind.config.js
   └── README.md
   ```

3. **Configure Tailwind CSS**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           primary: '#1a365d',
           secondary: '#3182ce',
           success: '#38a169',
           warning: '#dd6b20',
           error: '#e53e3e',
           neutral: '#718096',
         },
         fontFamily: {
           sans: ['HK Grotesk', 'system-ui', 'sans-serif'],
         },
         fontSize: {
           'xs': ['0.563rem', { lineHeight: '0.75rem' }],      // 9px (75% of 12px)
           'sm': ['0.656rem', { lineHeight: '0.938rem' }],     // 10.5px (75% of 14px)
           'base': ['0.75rem', { lineHeight: '1.125rem' }],    // 12px (75% of 16px)
           'lg': ['1rem', { lineHeight: '1.5rem' }],           // 16px
           'xl': ['0.938rem', { lineHeight: '1.5rem' }],       // 15px (75% of 20px)
           '2xl': ['1.125rem', { lineHeight: '1.688rem' }],    // 18px (75% of 24px)
           '3xl': ['1.5rem', { lineHeight: '2rem' }],          // 24px
           '4xl': ['1.688rem', { lineHeight: '2.25rem' }],     // 27px (75% of 36px)
           '5xl': ['2.25rem', { lineHeight: '2.625rem' }],     // 36px (75% of 48px)
           '6xl': ['2.813rem', { lineHeight: '3rem' }],        // 45px (75% of 60px)
         },
       },
     },
   }
   ```

4. **Base HTML Structure**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Chris Lyons - Audio Engineer & Systems Architect</title>
     <meta name="description" content="Building multichannel recording studios, broadcast systems, and researching emerging technologies since 2007.">
   </head>
   <body>
     <div id="app"></div>
     <script type="module" src="/src/main.js"></script>
   </body>
   </html>
   ```

5. **Package.json Scripts**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

**Deliverables**:
- Working `npm run dev` server on localhost
- Tailwind CSS configured and working
- Base HTML structure
- Clean project organization

---

## SPRINT 2: Component System & Navigation
**Duration**: 2 hours  
**Goal**: Reusable components and global navigation

### Tasks:
1. **Create Component Architecture**
   ```javascript
   // src/components/Navigation.js
   // src/components/Footer.js
   // src/components/PageHeader.js
   // src/components/Card.js
   // src/components/TableResponsive.js
   ```

2. **Navigation Component**
   - Responsive header with logo/title
   - Desktop: horizontal nav with dropdowns
   - Mobile: hamburger menu
   - Active page highlighting
   - Smooth scroll behavior
   - Sticky header on scroll

3. **Footer Component**
   - Copyright: "© 2025 Chris Lyons"
   - Email: heychrislyons@gmail.com
   - Minimal, clean design
   - Consistent across all pages

4. **Utility Functions**
   ```javascript
   // src/utils/contentLoader.js - Load from content.json
   // src/utils/markdown.js - Parse markdown to HTML
   // src/utils/router.js - Simple client-side routing
   ```

5. **Global Styles**
   - Typography scale
   - Spacing system (16px grid)
   - Color variables
   - Responsive breakpoints
   - Animation utilities

**Deliverables**:
- Reusable component system
- Working navigation across all pages
- Clean, consistent styling foundation

---

## SPRINT 3: Home Page Implementation
**Duration**: 2 hours  
**Goal**: Complete, polished home page

### Tasks:
1. **Hero Section**
   ```html
   - Large heading: "hey it's ChrisLyons.com"
   - Intro paragraph (from content above)
   - Subtle fade-in animation
   - Responsive typography (text-3xl → text-2xl on mobile)
   ```

2. **Collapsible Navigation Section**
   - Brown background toggle: "Pages (hidden)"
   - Four cards: Systems, Sounds, Writing, Connect
   - Hover effects with subtle scale
   - Click to expand/collapse
   - Grid layout (2x2 on desktop, 1 column on mobile)

3. **About Section**
   - Professional positioning text
   - Clean paragraph spacing
   - Max-width container for readability
   - Centered layout

4. **Load Animation**
   - Fade in on page load
   - Stagger navigation items
   - Smooth, professional feel

**Deliverables**:
- Complete home page matching Notion content
- Fully responsive design
- Professional polish and animations

---

## SPRINT 4: Systems Section - Boot Industries
**Duration**: 3 hours  
**Goal**: Complex content page with tables and images

### Tasks:
1. **Systems Landing Page** (`/systems`)
   - Section headers: "Design & Studio Builds", "Research & Inventions"
   - Two cards linking to sub-pages
   - Clean, grid-based layout

2. **Boot Industries Page** (`/systems/boot-industries`)
   - Page title and tagline
   - Executive summary section
   - **5 data tables** (responsive design):
     - Market comparison table
     - Technology status table
     - Target segments table
     - Development roadmap (with color coding)
     - Financial projections table
   - **3 images**:
     - 2 technical diagrams (side-by-side on desktop)
     - 1 artistic rendering (full-width)
   - Environmental impact bullets
   - Competitive positioning table
   - Contact section

3. **Responsive Table Component**
   - Desktop: full table layout
   - Mobile: card-based stacked view
   - Horizontal scroll option for complex tables
   - Color coding preserved (yellow, red, purple, green backgrounds)
   - Clean typography and spacing

4. **Image Handling**
   - Lazy loading
   - Responsive images (srcset)
   - Captions below images
   - Lightbox/zoom on click (optional)
   - Proper alt text for accessibility

**Deliverables**:
- Complete Boot Industries page
- Responsive tables working on all devices
- Images optimized and loading properly
- Professional technical documentation layout

---

## SPRINT 5: Systems - Hydrophobic & Sounds Section
**Duration**: 2 hours  
**Goal**: Complete Systems section and Sounds structure

### Tasks:
1. **Hydrophobic Field Harvesters Page**
   - Fetch content from Notion (ID: 22185dd4fdf280cbac3cf3af0a97ae86)
   - Apply same template as Boot Industries
   - Ensure styling consistency

2. **Sounds Landing Page** (`/sounds`)
   - Header: "Sounds"
   - Two section cards: Discography, Audio Samples
   - Minimal, clean design
   - Placeholder imagery if needed

3. **Discography Page** (`/sounds/discography`)
   - Check Notion page for content (currently blank)
   - If blank: create placeholder with message
   - Grid layout ready for album covers
   - Design prepared for future content

4. **Audio Samples Page** (`/sounds/audio-samples`)
   - Check Notion page for content
   - If blank: create placeholder
   - Layout ready for audio player embeds
   - Description areas prepared

**Deliverables**:
- Complete Systems section (all pages)
- Sounds section structure ready
- Consistent navigation and styling

---

## SPRINT 6: Writing Section - All Pages
**Duration**: 3-4 hours  
**Goal**: Complete Writing section with all sub-pages

### Tasks:
1. **Writing Landing Page** (`/writing`)
   - 5 cards in grid: Essays, Lyrics, Poems, 27 Suppositions, Protocols of Sound
   - Brief description for each
   - Hover effects
   - Responsive grid (3-2-1 columns)

2. **Essays Page** (`/writing/essays`)
   - Fetch content from Notion
   - List layout for essay titles
   - Reading time estimates
   - Click to read full essay
   - If blank: create placeholder

3. **Lyrics Page** (`/writing/lyrics`)
   - Fetch content from Notion
   - I found 30+ song pages (C. Lyons, A. Smith collaborations)
   - List all songs with links to individual pages
   - Individual lyric pages with clean typography
   - Centered text, generous spacing
   - Song credits (C. Lyons / A. Smith)

4. **Poems Page** (`/writing/poems`)
   - Similar layout to Lyrics
   - Elegant typography
   - Individual poem pages

5. **27 Suppositions Page** (`/writing/27-suppositions`)
   - Long-form content layout
   - Table of contents sidebar
   - Chapter navigation
   - Reading progress indicator
   - Bookmark functionality

6. **Protocols of Sound Page** (`/writing/protocols-of-sound`)
   - Historical timeline design
   - Chapter structure
   - Visual timeline component
   - 20th century audio technology focus

**Deliverables**:
- Complete Writing section
- All 5 sub-sections functional
- Lyrics pages for 30+ songs
- Long-form content properly formatted

---

## SPRINT 7: Connect Page & Final Pages
**Duration**: 1-2 hours  
**Goal**: Complete all remaining pages

### Tasks:
1. **Connect Page** (`/connect`)
   - Contact information
   - Email: heychrislyons@gmail.com
   - Professional bio/introduction
   - Simple, clean design

2. **Contact Form (Optional)**
   - Name, Email, Subject, Message fields
   - Client-side validation
   - Cloudflare Workers endpoint OR Netlify Forms
   - Success/error states
   - Spam protection

3. **404 Page**
   - Custom 404 design
   - Navigation back to home
   - Search functionality (optional)

4. **Sitemap & SEO**
   - Generate sitemap.xml
   - Meta tags for all pages
   - Open Graph tags
   - Twitter card metadata
   - robots.txt

**Deliverables**:
- Complete Connect page
- Working contact form (if applicable)
- SEO metadata complete
- 404 page styled

---

## SPRINT 8: Polish, Performance & Testing
**Duration**: 2-3 hours  
**Goal**: Production-ready optimization

### Tasks:
1. **Performance Optimization**
   - Image optimization (WebP format, compression)
   - Lazy loading for images below fold
   - Code splitting for large pages
   - Minify CSS/JS
   - Remove unused CSS with PurgeCSS
   - Add loading states

2. **Accessibility**
   - ARIA labels on all interactive elements
   - Keyboard navigation support
   - Focus indicators
   - Screen reader testing
   - Color contrast validation (WCAG AA)
   - Alt text on all images

3. **Cross-browser Testing**
   - Chrome (desktop/mobile)
   - Firefox
   - Safari (macOS/iOS)
   - Edge
   - Fix any compatibility issues

4. **Mobile Responsiveness**
   - Test all pages on mobile viewports
   - Touch-friendly tap targets (44px minimum)
   - Readable text without zoom
   - No horizontal scroll
   - Hamburger menu functional

5. **Animation & Polish**
   - Smooth page transitions
   - Scroll animations (fade in)
   - Hover states consistent
   - Loading spinners
   - Error handling for missing content

6. **Final QA Checklist**
   - All links work
   - All images load
   - Navigation functional
   - Forms work (if applicable)
   - No console errors
   - Fast load times (<3s)

**Deliverables**:
- Fully optimized site
- Accessible to WCAG AA standard
- Fast loading (90+ Lighthouse score)
- Works across all browsers/devices

---

## SPRINT 9: Cloudflare Pages Deployment
**Duration**: 1 hour  
**Goal**: Live site at chrislyons.boot.industries

### Tasks:
1. **Git Repository Setup**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Chris Lyons website"
   # Note: Not pushing to GitHub yet per requirements
   ```

2. **Build for Production**
   ```bash
   npm run build
   # Verify dist/ folder contents
   # Test with: npm run preview
   ```

3. **Cloudflare Pages Setup**
   - Log into Cloudflare Dashboard
   - Create new Pages project
   - Connect to Git (or direct upload if not pushed)
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Node version: 18+

4. **Custom Domain Configuration**
   - Point chrislyons.boot.industries DNS to Cloudflare
   - Add CNAME record to Pages project
   - Enable HTTPS (automatic)
   - Test SSL certificate

5. **Post-Deployment Verification**
   - Visit http://chrislyons.boot.industries
   - Test all pages and navigation
   - Verify images load
   - Check mobile responsiveness
   - Test forms (if applicable)
   - Review Cloudflare Analytics

6. **Performance Check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify caching headers
   - Test from different geographic locations

**Deliverables**:
- Live website at chrislyons.boot.industries
- HTTPS enabled
- All functionality verified in production
- Performance metrics documented

---

## Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vanilla JavaScript** - Lightweight, no framework overhead
- **Vite** - Fast build tool and dev server

### Content Management
- **content.json** - Single source of truth for all content
- **Markdown files** - Individual page content
- **Local assets** - All images stored locally

### Build & Deployment
- **Vite** - Build tool (fast, modern)
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility
- **Cloudflare Pages** - Hosting & CDN
- **Custom domain** - chrislyons.boot.industries

### Assets
- **HK Grotesk** - Local font files (400, 500, 600, 700 weights)
- **WebP images** - Optimized format
- **SVG icons** - Scalable, small file size

---

## Content Checklist (From Notion)

### ✅ Content Confirmed Available
- Home page intro text
- Boot Industries full page (tables, images, content)
- Navigation structure
- 30+ song lyric pages (individual pages like "Headlong", "Jack & Morrie", etc.)

### ⚠️ Content To Verify (Fetch from Notion)
- Hydrophobic Field Harvesters page
- Essays content
- Poems content  
- 27 Suppositions content
- Protocols of Sound content
- Discography details
- Audio sample information

### 📝 Placeholder Pages (Currently Blank in Notion)
- Discography page
- Audio Samples page
- Connect page (minimal content)

---

## Sprint Execution Guide for Claude Code

### Before Starting:
1. Ensure you're in the correct directory: `cd ~/dev/chrislyons-website`
2. Check if directory exists, if not: `mkdir -p ~/dev/chrislyons-website`
3. Verify Node.js installed: `node --version` (need v18+)

### Sprint 0 Special Instructions:
Use these Notion MCP tools to fetch ALL content before building:

```javascript
// Fetch each page ID and save to files
const pages = {
  'home': '22085dd4fdf2807b8545fa8281c500e1',
  'systems': '22085dd4fdf280d7b523c7df08b28c03',
  'boot-industries': '22185dd4fdf280e89594c41b0625ebc9',
  'hydrophobic': '22185dd4fdf280cbac3cf3af0a97ae86',
  'sounds': '22085dd4fdf2805ca4fbf7b8852b8a9c',
  'discography': '22085dd4fdf280e68829e72222f3bc9a',
  'audio-samples': '22085dd4fdf2800eae4dc7e01a7853af',
  'writing': '22085dd4fdf280ceb39ff4f3f5b5d464',
  'essays': '22085dd4fdf280ec9e48f28743c43fab',
  'lyrics': '22085dd4fdf280f08bedd01916067631',
  'poems': '22085dd4fdf28054b52bc3de052782e4',
  '27-suppositions': '22085dd4fdf28051bccaf312c73712f1',
  'protocols-of-sound': '22085dd4fdf2801fbe4efd0feaa98e9a',
  'connect': '22085dd4fdf2801ea8c2e43ccb5af1b5'
};

// For each page, use: Notion:notion-fetch
// Save output to: content/[page-name].json
```

### After Each Sprint:
1. Test locally: `npm run dev`
2. Verify changes in browser
3. Commit: `git commit -m "Sprint X: [description]"`

### Final Deployment:
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Deploy to Cloudflare Pages
4. Test live site

---

## Success Criteria

### Functional Requirements
✅ All pages from Notion are accessible  
✅ Navigation works on desktop and mobile  
✅ Images load correctly  
✅ Tables are responsive  
✅ Forms work (if applicable)  
✅ Links are functional  

### Performance Requirements
✅ Lighthouse score 90+ (Performance)  
✅ Page load under 3 seconds  
✅ Images optimized (WebP)  
✅ Mobile-friendly  

### Design Requirements
✅ Matches Notion content structure  
✅ Professional, clean aesthetic  
✅ Consistent typography and spacing  
✅ Responsive across all devices  

### Deployment Requirements
✅ Live at chrislyons.boot.industries  
✅ HTTPS enabled  
✅ No console errors  
✅ Works in all major browsers  

---

## Notes for Future Development

After this "capture the present state" phase is complete:
- Site can be enhanced with more sophisticated features
- Content can be migrated to CMS (Sanity, Contentful, etc.)
- Interactive features can be added
- Blog/news section can be implemented
- Authentication for private content
- Analytics integration

For now: Focus on clean, fast, functional site that captures all current Notion content.