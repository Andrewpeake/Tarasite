# Writing Billboard Section Implementation Summary

## New Component Created

**`src/components/writing/WritingBillboardSection.tsx`**
- Client component with horizontal scrolling billboard cards
- 2.5D CSS transforms (no React Three Fiber)
- Tall vertical billboard design with editorial poster style
- Floor shadow effects for depth illusion

## Integration

**Updated `src/app/page.tsx`:**
- Replaced `EditorialGrid` import with `WritingBillboardSection`
- Removed `Section` wrapper (WritingBillboardSection includes its own section wrapper)
- Changed from:
  ```tsx
  <Section
    id="writing"
    title="Writing & Editing"
    eyebrow="Culture, internet, brain stuff"
  >
    <EditorialGrid writings={writings} />
  </Section>
  ```
- To:
  ```tsx
  <WritingBillboardSection writings={writings} />
  ```

## Key Features

### Billboard Cards
- Tall vertical panels (420px-500px height)
- Strong drop shadows (`shadow-[0_24px_70px_rgba(0,0,0,0.35)]`)
- Hover effects: lift up (`-translate-y-3`), brightness increase, enhanced shadow
- Image at top with gradient overlay
- Bottom info strip with category, date, title, and read time
- Left spine edge effect on hover (simulates book/billboard edge)

### Horizontal Scroll Rail
- Snap-to-center scrolling (`snap-x snap-mandatory`)
- Smooth horizontal scrolling with hidden scrollbar
- Perspective container for 3D depth effect
- Floor gradient background
- Ground shadow gradient for stacking illusion

## Styling & CSS

### Utility Classes Added

**In `src/app/globals.css`:**
- `.hide-scrollbar` - Hides scrollbar on horizontal scroll container
  ```css
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  ```

### CSS Properties Used

**Billboard Cards:**
- `transform-gpu` - GPU acceleration for smooth transforms
- `transform-style: preserve-3d` - 3D transform context
- `transform-origin: center bottom` - Transform from bottom center
- Strong box shadows for depth
- Responsive sizing: `w-[220px] md:w-[260px] lg:w-[300px]`

**Scroll Container:**
- `perspective: 1200px` - 3D perspective for depth
- `snap-x snap-mandatory` - Snap scrolling
- Hidden scrollbar via `.hide-scrollbar` utility

**Floor Effects:**
- Gradient background from `--bg-elevated` to subtle dark
- Ground shadow gradient with blur (`blur-2xl`)

## Component Structure

```
WritingBillboardSection
├── Section wrapper (id="writing")
├── Header (title + eyebrow)
└── Billboard Rail
    ├── Floor background gradient
    ├── Ground shadow gradient
    └── Scrollable container
        └── Billboard cards (WritingBillboard)
            ├── Image section
            ├── Info strip
            ├── Left spine edge (hover)
            └── Link overlay
```

## Responsive Behavior

- **Mobile (< md)**: 220px width, 420px height
- **Tablet (md)**: 260px width, 460px height  
- **Desktop (lg)**: 300px width, 500px height
- Horizontal scrolling works on all screen sizes
- Snap-to-center ensures one card is mostly visible at a time

## Interaction Details

- **Hover**: Card lifts up, brightness increases, shadow enhances
- **Click**: Navigates to article URL (opens in new tab)
- **Scroll**: Snap-to-center ensures cards align nicely
- **Spine Edge**: Appears on hover to simulate book/billboard depth

## Files Modified

1. `src/components/writing/WritingBillboardSection.tsx` - **NEW** component
2. `src/app/page.tsx` - Updated to use WritingBillboardSection
3. `src/app/globals.css` - Added `.hide-scrollbar` utility class

## Notes

- Component is fully typed with TypeScript
- Uses Next.js Image component for optimization
- Links open in new tab with proper security attributes
- Accessible with ARIA labels
- No external 3D libraries (pure CSS transforms)
- Maintains light theme consistency (dark billboards are intentional contrast)

