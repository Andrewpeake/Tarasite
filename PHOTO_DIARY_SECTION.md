# Photo Diary Section Implementation Summary

## New Component Created

**`src/components/photos/PhotoDiarySection.tsx`**
- Client component with auto-scrolling sidebar
- Two-column layout: left sidebar + right main image area
- Auto-scroll can be paused by user interaction (hover/scroll/click)

## Integration

**Updated `src/app/page.tsx`:**
- Replaced `PhotoGrid` import with `PhotoDiarySection`
- Removed `Section` wrapper (PhotoDiarySection includes its own section wrapper)
- Changed from:
  ```tsx
  <Section id="photos" title="Photo Diary" eyebrow="Fragments">
    <PhotoGrid photos={photoLibrary.all()} />
  </Section>
  ```
- To:
  ```tsx
  <PhotoDiarySection photos={photoLibrary.all()} />
  ```

## Key Features

### Left Sidebar
- Auto-scrolling vertical list of photo thumbnails
- Loops continuously (jumps to top when reaching bottom)
- Pauses on hover/scroll
- Click to select photo
- Active photo highlighted with brightness/scale

### Right Main Area
- Large main image showing selected photo
- Next photo appears as blurred background layer
- Glassmorphism card effect with translucent background
- Photo metadata (title, date, tags)

## Constants & Hooks You Can Tweak

Located at the top of `PhotoDiarySection.tsx`:

```typescript
const AUTO_SCROLL_SPEED = 0.1;      // Pixels per frame (default: 0.1)
const RESUME_DELAY = 1500;          // Milliseconds before resuming auto-scroll after pause (default: 1500)
```

**Layout constants:**
- Sidebar height: `h-[70vh]` (70% viewport height)
- Grid ratio: `md:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)]` (30% sidebar, 70% main)
- Thumbnail aspect: `aspect-[3/4]` (3:4 portrait ratio)
- Main card max width: `max-w-md`

### Suggested Tweaks:

- **AUTO_SCROLL_SPEED**: 
  - Lower (0.05-0.08) for slower, more subtle scrolling
  - Higher (0.15-0.2) for faster, more noticeable scrolling
  
- **RESUME_DELAY**: 
  - Lower (1000ms) for quicker resume after user interaction
  - Higher (2000-3000ms) for longer pause after user interaction

- **Sidebar height**: Adjust `h-[70vh]` to `h-[60vh]` or `h-[80vh]` for different proportions

- **Grid ratio**: Modify `md:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)]` to change sidebar/main width split

## Behavior Details

1. **Auto-scroll**: Uses `requestAnimationFrame` for smooth, frame-rate independent scrolling
2. **Pause on interaction**: Automatically pauses when user hovers, scrolls manually, or clicks
3. **Resume logic**: Waits 1.5 seconds after last interaction before resuming
4. **Click handling**: Clicking a thumbnail updates the main image and scrolls that thumbnail into view
5. **Loop**: When scrolling reaches the bottom, it smoothly jumps back to the top

## Styling

- Uses existing CSS variables from light theme
- Matches the soft, feminine palette
- Glassmorphism effects on main card
- Smooth transitions (300-500ms) for state changes
- Rounded corners, subtle shadows, soft borders

## Files Modified

1. `src/components/photos/PhotoDiarySection.tsx` - **NEW** component
2. `src/app/page.tsx` - Updated to use PhotoDiarySection
3. `src/app/globals.css` - Added `.scrollbar-none` utility class

## Notes

- Component is fully typed with TypeScript
- Uses Next.js Image component for optimization
- Responsive design (single column on mobile, two columns on desktop)
- No external dependencies beyond existing project dependencies

