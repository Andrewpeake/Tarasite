# Identity Archive

A personal identity hub / portfolio with smooth scroll animations, inspired by the choreographed feel of creativewebmanual.com.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **GSAP + ScrollTrigger** for scroll timelines and pinning
- **Lenis** for smooth scrolling

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SmoothScrollProvider
│   ├── page.tsx            # Homepage composition
│   └── globals.css         # Global styles
├── components/
│   ├── animations/
│   │   ├── SmoothScrollProvider.tsx  # Lenis wrapper for app
│   │   ├── PinnedChapter.tsx         # Pinned section component
│   │   ├── SplitTextReveal.tsx       # Staggered text reveal
│   │   └── ParallaxBlock.tsx         # Parallax scroll effect
│   ├── identity/
│   │   ├── IdentityHeader.tsx        # Hero section with profile
│   │   └── AboutStrip.tsx            # About section
│   ├── layout/
│   │   ├── Shell.tsx                 # App shell wrapper
│   │   ├── Navbar.tsx                # Sticky navigation
│   │   └── Section.tsx               # Reusable section wrapper
│   ├── photos/
│   │   └── PhotoGrid.tsx             # Responsive photo grid
│   └── writing/
│       └── WritingList.tsx           # Writing cards list
├── data/
│   ├── identity.ts                   # Identity profile data
│   ├── photos.ts                     # Photo library data
│   └── writings.ts                   # Writing entries data
├── domain/
│   ├── identity.ts                   # IdentityProfile interface
│   ├── photo.ts                      # Photo interface & PhotoLibrary class
│   └── writing.ts                    # Writing interface
└── lib/
    └── scroll/
        ├── gsapClient.ts             # GSAP + ScrollTrigger setup
        └── lenisClient.ts            # Lenis instance management
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Add sample photos to `public/sample-photos/`:
   - The app expects photos at `/sample-photos/study.jpg` (or update the photo URLs in `src/data/photos.ts`)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Key Features

### Smooth Scrolling
Lenis provides smooth, eased scrolling throughout the site. ScrollTrigger is integrated to work seamlessly with Lenis.

### Scroll Animations
- **PinnedChapter**: Sections that pin while scrolling
- **SplitTextReveal**: Text that reveals word-by-word with stagger
- **ParallaxBlock**: Elements that move at different speeds during scroll

### Domain Layer
The project uses a clean domain layer with TypeScript interfaces and classes:
- `IdentityProfile`: Personal profile information
- `PhotoLibrary`: Photo collection with filtering methods
- `Writing`: Writing entries with types (article, blog, note)

## Customization

### Update Identity
Edit `src/data/identity.ts` to update name, tagline, bio, location, and links.

### Add Photos
1. Add photos to `public/sample-photos/`
2. Update `src/data/photos.ts` with new photo entries
3. Photos are organized by category: portrait, travel, everyday, experimental

### Add Writings
Edit `src/data/writings.ts` to add new writing entries.

## Styling

The site uses Tailwind CSS with a dark theme:
- Background: `bg-black`
- Text: `text-neutral-100`
- Borders: `border-neutral-800/900`

All styles are utility-based, no CSS modules.

