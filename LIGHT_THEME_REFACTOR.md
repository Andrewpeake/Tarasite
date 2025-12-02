# Light Theme Refactoring Summary

## CSS Variables Added/Changed

All CSS variables are defined in `src/app/globals.css`:

```css
--bg: #fefcf7;              /* Warm soft white / cream - overall page background */
--bg-elevated: #fef7f2;     /* Very light pink/peach - card backgrounds */
--text-main: #5c4a3a;       /* Dark neutral/brownish - main text color */
--text-muted: #8b7355;      /* Muted text color */
--accent: #e8919b;          /* Soft rose/pink accent */
--accent-soft: #fce7eb;     /* Lighter accent for chips/badges */
--border-subtle: #e8ddd4;   /* Subtle border color */
```

### Utility Classes Added

- `.light-surface` - Applies `--bg` background and `--text-main` color
- `.light-card` - Card styling with `--bg-elevated` background and `--border-subtle` border

## Components Updated

### Global Layout
- **`src/app/globals.css`** - Added CSS variables and utility classes
- **`src/app/layout.tsx`** - Body uses new CSS variables (no changes needed, inherits from globals.css)

### Layout Components
- **`src/components/layout/Shell.tsx`** - Footer border and text colors updated
- **`src/components/layout/Navbar.tsx`** - Background, borders, and text colors updated to light theme
- **`src/components/layout/Section.tsx`** - Text colors updated, added accent underline to headings

### Identity Components
- **`src/components/identity/LinkedInHero.tsx`** - Banner overlay, avatar border, text colors, and role chips updated
- **`src/components/identity/AboutStrip.tsx`** - Border and text colors updated

### Content Components
- **`src/components/photos/PhotoGrid.tsx`** - Card backgrounds, borders, and hover overlays updated
- **`src/components/writing/EditorialGrid.tsx`** - Card styling, category labels, and text colors updated
- **`src/components/writing/WritingList.tsx`** - Updated for consistency (though not currently used)
- **`src/components/experience/ExperienceTimeline.tsx`** - Timeline line, dots, cards, and text colors updated

### 3D Gallery Section
- **`src/components/three/ThreeGallerySection.tsx`** - Background changed to light gradient, overlay label updated
- **`src/components/three/GalleryScene.tsx`** - Fog color changed from black (#000000) to warm white (#fefcf7)

## Color Usage Patterns

### Backgrounds
- Main background: `var(--bg)` or `style={{ backgroundColor: "var(--bg)" }}`
- Card backgrounds: `var(--bg-elevated)`
- Section backgrounds: Light gradient (`from-rose-50 via-slate-50 to-sky-50`) for 3D gallery

### Text
- Main text: `var(--text-main)`
- Muted text: `var(--text-muted)`
- Accent text: `var(--accent)`

### Borders
- All borders: `var(--border-subtle)`

### Accents (Chips/Badges)
- Background: `var(--accent-soft)`
- Text: `var(--accent)`

## Manual Adjustment Points

### 1. 3D Gallery Background Gradient
**Location**: `src/components/three/ThreeGallerySection.tsx` (line ~106)
- Current: `bg-gradient-to-br from-rose-50 via-slate-50 to-sky-50`
- You can adjust the gradient colors here to match your preference
- Alternative suggestions:
  - `from-pink-50 via-rose-50 to-orange-50` (warmer)
  - `from-rose-50 via-amber-50 to-yellow-50` (softer)
  - `from-stone-50 via-rose-50 to-pink-50` (neutral-warm)

### 2. 3D Scene Fog Color
**Location**: `src/components/three/GalleryScene.tsx` (line ~75)
- Current: `#fefcf7` (matches --bg)
- Adjust the fog color for different atmospheric effects
- Should stay light but can be slightly warmer or cooler

### 3. CSS Variable Values
**Location**: `src/app/globals.css` (lines 7-13)
- All color values can be tweaked here
- Consider adjusting:
  - `--bg-elevated` for more/less pink in cards
  - `--accent` for different rose/pink tones
  - `--text-main` for warmer/cooler browns

### 4. Hero Banner Overlay
**Location**: `src/components/identity/LinkedInHero.tsx` (line ~73)
- Current: `bg-gradient-to-b from-white/30 via-white/10 to-white/50`
- Adjust opacity values or gradient stops for better image readability

## Notes

- All animations, scroll behaviors, and 3D interactions remain unchanged
- No domain/data models were modified
- Component structure and logic unchanged
- The old `IdentityHeader` component still exists with dark theme but is not used (we use `LinkedInHero` instead)

## Testing Recommendations

1. Check all sections on different screen sizes
2. Verify hover states work with light backgrounds
3. Test 3D gallery rotation with new light background
4. Ensure text contrast is readable on all backgrounds
5. Verify overlay labels are visible in 3D gallery section

