# Codebase Bloat Audit Report

**chrislyons-website** | Generated: 2025-11-18

---

## Executive Summary

**Total Potential Savings: ~1.3 MB (88% reduction in font assets)**

The codebase is remarkably lean with excellent dependency management. The primary bloat is in font assets where 88% of font files are unused. Secondary issues include minor dead code and SVG duplication.

### Quick Wins (High Impact, Low Risk)

1. **Remove unused font files** - Save ~1.28 MB
2. **Remove unused import in Footer.js** - Cleanup dead code
3. **Extract GitHub SVG icon to component** - Reduce 3.5KB duplication

---

## 1. Asset & Resource Bloat - CRITICAL

### Font Files (MAJOR ISSUE)

**Location:** `/public/fonts/HKGrotesk_3003/WEB/`
**Type:** Asset Bloat
**Size Impact:** ~1.28 MB can be removed (88% reduction)
**Risk Level:** Safe

**Finding:**

- **Total font files:** 36 (18 weights x 2 formats: .woff + .woff2)
- **Total size:** 1.43 MB
- **Actually used:** Only 4 weights declared in `src/style.css:7-41`
  - Regular (400)
  - Medium (500)
  - SemiBold (600)
  - Bold (700)

**Unused Font Files (28 files, ~1.28 MB):**

```
Thin, ThinItalic
ExtraLight, ExtraLightItalic
Light, LightItalic
Italic
MediumItalic
SemiBoldItalic
BoldItalic
ExtraBold, ExtraBoldItalic
Black, BlackItalic
```

**Action:**

```bash
# Remove all unused font files
cd public/fonts/HKGrotesk_3003/WEB/
rm -f HKGrotesk-{Thin,ThinItalic,ExtraLight,ExtraLightItalic,Light,LightItalic,Italic,MediumItalic,SemiBoldItalic,BoldItalic,ExtraBold,ExtraBoldItalic,Black,BlackItalic}.{woff,woff2}
```

**Keep only these 8 files:**

- HKGrotesk-Regular.woff2 (34K)
- HKGrotesk-Regular.woff (43K)
- HKGrotesk-Medium.woff2 (35K)
- HKGrotesk-Medium.woff (44K)
- HKGrotesk-SemiBold.woff2 (35K)
- HKGrotesk-SemiBold.woff (44K)
- HKGrotesk-Bold.woff2 (36K)
- HKGrotesk-Bold.woff (45K)

**Total kept:** ~315 KB (vs current 1.43 MB)

---

## 2. Code Duplication

### GitHub Icon SVG Duplication

**Location:** `src/pages/apps/index.js`
**Type:** Code Duplication
**Size Impact:** ~3.5 KB (500 bytes x 7 instances)
**Risk Level:** Safe

**Finding:**

The complete GitHub icon SVG (32-line SVG markup) is duplicated 7 times across different page render functions.

**Action:**

Create a reusable SVG component or constant:

```javascript
// In src/components/GitHubIcon.js or similar
export const GitHubIcon = {
  render: (size = 32) => `
    <svg class="github-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387..."/>
    </svg>
  `
};
```

Then replace all 7 inline SVGs with `${GitHubIcon.render(32)}`.

**Estimated savings:** ~3.5 KB source code reduction

---

### Page Render Functions (Moderate Duplication)

**Location:** `src/pages/apps/index.js` (1,008 lines)
**Type:** Code Duplication
**Size Impact:** Maintenance overhead (not significant bundle impact)
**Risk Level:** Needs Review

**Finding:**

7 similar page render functions with repeated HTML structure patterns. However, some abstraction already exists via `templateHelpers.js` for simpler pages.

**Action:**

Consider creating a `DetailPageTemplate` component similar to the existing `renderLandingPage` helper to reduce boilerplate in the 7 app detail pages.

**Priority:** Medium (improves maintainability, minor bundle impact)

---

## 3. Dead Code

### Unused Variable

**Location:** `src/pages/HomePage.js:8`
**Type:** Dead Code
**Size Impact:** Negligible
**Risk Level:** Safe

**Finding:**

```javascript
const pageData = contentLoader.getPageData('home'); // Line 8 - UNUSED
```

**Action:**

Remove line 8 or add comment if kept for future use.

---

### Unused Import

**Location:** `src/components/Footer.js:7`
**Type:** Dead Code
**Size Impact:** Negligible
**Risk Level:** Safe

**Finding:**

```javascript
import contentData from '../../content/content.json'; // Line 7 - UNUSED
```

**Action:**

Remove the import statement.

---

## 4. Dependency Analysis - EXCELLENT

**Finding:** The project has exemplary dependency management.

### Runtime Dependencies (1)

- `hono@^4.10.4` - Used in `src/worker.ts` for Cloudflare Worker

### Dev Dependencies (4)

- `vite@^7.1.12` - Build tool
- `tailwindcss@^3.4.18` - Used extensively (921 class occurrences)
- `postcss@^8.5.6` - Required by Tailwind
- `autoprefixer@^10.4.21` - Used in `postcss.config.mjs`

**No unused dependencies found.** All imports are efficient (e.g., `import { getCookie } from 'hono/cookie'` uses tree-shakeable imports).

---

## 5. Theme System Documentation Mismatch

**Location:** `CLAUDE.md` vs `src/style.css` and `src/components/ThemeToggle.js`
**Type:** Documentation Drift (not bloat)
**Size Impact:** None
**Risk Level:** Informational

**Finding:**

- **CLAUDE.md** documents 4 themes: Moonlight, Daylight, Forest, Beach
- **Actual implementation** has 6 themes: moonlight, daylight, forest, beach, plum, char
- All 6 themes are fully implemented in CSS (src/style.css:290-417) and ThemeToggle.js

**Action:**

Update `CLAUDE.md` Theme System section to document all 6 themes:

1. Moonlight (dark mode)
2. Daylight (light mode)
3. Forest (dark green)
4. Beach (warm gold-yellow-blue)
5. Plum (purple/fuchsia light)
6. Char (dark burnt orange/ember)

**Priority:** Documentation consistency

---

## 6. Bundle Size Analysis

### Current State

- **node_modules:** Not installed during audit
- **dist:** No build output present
- **Source size:** Very lean
  - src/ JavaScript: ~3-4K LOC
  - Largest file: `src/pages/apps/index.js` (1,008 lines)

### Build Recommendations

1. Ensure Vite tree-shaking is enabled (default: yes)
2. Tailwind CSS purge is configured (configured in `tailwind.config.js:4-7`)
3. Font preloading for critical weights (Regular, SemiBold)

---

## 7. Inefficient Patterns

### None Found

All imports use efficient patterns:

- Tree-shakeable imports: `import { Hono } from 'hono'`
- No entire library imports like `import _ from 'lodash'`
- Tailwind configured for purging unused CSS
- Vite configured for code splitting

---

## Summary Metrics

| Category | Count | Size Impact |
|----------|-------|-------------|
| **Unused font files** | 28 files | **-1.28 MB** |
| Unused dependencies | 0 | 0 KB |
| Dead code lines | 2 | <1 KB |
| SVG duplication | 7 instances | -3.5 KB |
| **Total Savings** | | **~1.3 MB** |

---

## Prioritized Action Plan

### High Priority (Do Immediately)

1. **Remove 28 unused font files** (saves 1.28 MB)
   - Keep only: Regular, Medium, SemiBold, Bold (woff + woff2)
   - Risk: None (unused files)
   - Impact: 88% reduction in font assets

### Medium Priority (This Sprint)

2. **Remove unused import** in Footer.js:7
3. **Remove or comment unused variable** in HomePage.js:8
4. **Extract GitHub icon SVG** to reusable component
5. **Update CLAUDE.md** to document plum and char themes

### Low Priority (Future Refactor)

6. **Consider abstracting app detail pages** into template (improves maintainability)

---

## Additional Notes

### Strengths

- Excellent dependency hygiene (only 5 total dependencies)
- Efficient import patterns throughout
- Good use of template helpers (renderLandingPage)
- Tailwind purge configured correctly

### Areas of Excellence

- **No over-abstraction** - code is straightforward
- **No heavy polyfills** detected
- **No duplicate packages** in dependency tree
- **Minimal JavaScript** - appropriate for the project scope

---

## References

[1] https://web.dev/font-best-practices/
[2] https://tailwindcss.com/docs/optimizing-for-production
