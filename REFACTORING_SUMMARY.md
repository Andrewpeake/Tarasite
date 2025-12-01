# Identity Archive Refactoring Summary

## Overview
Refactored the Identity Archive site to blend Tara's two visual worlds: photo diary/Instagram aesthetic and editorial/professional writer portfolio. The site now features a LinkedIn-style hero, film-inspired photo grid, editorial article cards, and an experience timeline.

## Files Created

### Components
- **`src/components/identity/LinkedInHero.tsx`** - LinkedIn-style hero with banner image, circular avatar, name, tagline, and role chips
- **`src/components/writing/EditorialGrid.tsx`** - Editorial-style article cards with thumbnails, categories, and metadata
- **`src/components/experience/ExperienceTimeline.tsx`** - Vertical timeline component for work experience

### Domain Models
- **`src/domain/experience.ts`** - Experience interface for work history

### Data Files
- **`src/data/experience.ts`** - Sample experience data (Western Gazette, Reya Health, NTU)

## Files Modified

### Components
- **`src/components/identity/IdentityHeader.tsx`** - Kept for backwards compatibility but not used in homepage
- **`src/components/identity/AboutStrip.tsx`** - Updated with new identity archive messaging
- **`src/components/photos/PhotoGrid.tsx`** - Enhanced with film aesthetic, hover captions, and grain overlay
- **`src/components/layout/Navbar.tsx`** - Added "Experience" link and fixed TypeScript errors

### Domain Models
- **`src/domain/identity.ts`** - Added optional `roles` array field
- **`src/domain/writing.ts`** - Extended with `category`, `thumbnailUrl`, `readTime` fields; added "culture" to WritingType

### Data Files
- **`src/data/identity.ts`** - Updated with Tara's roles: "Senior Culture Editor", "Business Dev Intern", "Research Assistant"
- **`src/data/photos.ts`** - Updated with film-style photo descriptions (Tokyo crosswalk, Beach 2023, etc.)
- **`src/data/writings.ts`** - Replaced with editorial-style articles with thumbnails, categories, and read times

### Configuration
- **`tailwind.config.ts`** - Added serif font family configuration
- **`src/app/page.tsx`** - Completely restructured with new sections:
  1. LinkedInHero (replaces IdentityHeader)
  2. AboutStrip
  3. Photo Diary section
  4. Writing & Editing section (with EditorialGrid)
  5. Experience section (with ExperienceTimeline)

## Design & Styling Decisions

### Colors
- Background: Deep charcoal/black (`bg-neutral-950`, `bg-black`)
- Text: Neutral greys (`text-neutral-100`, `text-neutral-300`, `text-neutral-400`)
- Borders: Subtle neutral borders (`border-neutral-800`, `border-neutral-900`)
- Editorial cards: Light backgrounds on dark page (`bg-neutral-50` with dark mode variant)

### Typography
- **Serif fonts** for headlines (Hero name, article titles) - using `font-serif` (Georgia/Times)
- **Sans-serif** for body text and UI elements
- Added serif configuration to Tailwind config

### Film Aesthetic
- Photo grid uses rounded corners, subtle borders, darker backgrounds
- Hover effects: zoom, dim overlay, caption slide-up
- Grain overlay effect on hover (via SVG pattern)
- Photo descriptions styled like Instagram captions

### Editorial Style
- Article cards with light backgrounds (magazine-like)
- Uppercase category labels (CULTURE, ARTICLE, etc.)
- Large serif headlines
- Thumbnails with 16:9 aspect ratio
- Metadata: date + read time

## Animations

All animations use existing GSAP/ScrollTrigger infrastructure:
- **Hero**: Fade/slide-in on load for name, tagline, and role chips
- **Photo Grid**: Staggered fade-up on scroll into view
- **Editorial Grid**: Staggered fade-up for article cards
- **Experience Timeline**: Fade-in from left for timeline items
- **Parallax**: Banner image uses ParallaxBlock component

## Where to Add Real Content

### Images
Place images in `public/sample-photos/`:

1. **Hero banner**: `/public/sample-photos/banner.jpg`
   - Should be a city building/urban film shot
   - Recommended size: 1920x500px or similar wide format

2. **Avatar**: `/public/sample-photos/avatar.jpg`
   - Circular headshot
   - Recommended size: 400x400px (will be cropped to circle)

3. **Photo diary**: Update URLs in `src/data/photos.ts`
   - Current placeholder: `/sample-photos/study.jpg`
   - Replace with actual film photos
   - Keep the titles and tags as reference for styling

4. **Article thumbnails**: Update URLs in `src/data/writings.ts`
   - Current placeholders: `/sample-photos/article1.jpg`, etc.
   - Should be 16:9 aspect ratio for best results

### Content Updates

1. **Experience data**: Edit `src/data/experience.ts`
   - Update dates, roles, summaries to match actual experience
   - Add/remove entries as needed

2. **Writings**: Edit `src/data/writings.ts`
   - Replace with actual articles from Western Gazette
   - Add real URLs to article links
   - Update thumbnails to actual article images
   - Add more entries as needed

3. **Photos**: Edit `src/data/photos.ts`
   - Add more photo entries
   - Update titles, tags, and categories to match your photos
   - Categories: "portrait" | "travel" | "everyday" | "experimental"

4. **Identity profile**: Edit `src/data/identity.ts`
   - Adjust tagline if needed
   - Update bio
   - Modify roles array as your positions change

## Assumptions Made

1. **Fonts**: Using system serif fonts (Georgia/Times) - no external font loading required
2. **Colors**: Warm, human aesthetic with dark backgrounds - can be easily adjusted in Tailwind classes
3. **Image aspect ratios**: Hero banner optimized for wide format; photos are square; article thumbnails are 16:9
4. **LinkedIn style**: Banner overlaps with content below, circular avatar, role chips - similar to LinkedIn header but with film aesthetic

## Next Steps

1. Add real images to `public/sample-photos/` directory
2. Update all data files with actual content
3. Test responsive behavior on mobile/tablet
4. Adjust colors/spacing if needed (all in Tailwind classes)
5. Consider adding more photo categories or writing types if needed

## Technical Notes

- All animations degrade gracefully if JavaScript is disabled
- TypeScript strict mode enforced - all types are defined
- Components are modular and reusable
- Animation logic is separated into dedicated components
- No breaking changes to existing architecture - only extensions

