# Writing Carousel - Complete Rebuild Summary

## New Files Created

### 1. `/src/lib/useCarousel.ts`
- Custom hook for carousel logic and state management
- Handles snap-to-center behavior
- Manages scroll detection with debouncing
- Provides track and card refs management
- Exposes navigation methods (goToNext, goToPrevious)

### 2. `/src/components/writing/CarouselCard.tsx`
- Isolated card component for each writing item
- Uses GSAP for smooth 3D transforms
- Calculates transforms based on distance from active card
- Includes floor shadow with dynamic opacity
- Ambient occlusion effect at base
- Responsive (no 3D tilt on mobile)

### 3. `/src/components/writing/Carousel.tsx`
- Main carousel container component
- Integrates useCarousel hook
- Handles environmental gradients and floor shadows
- 3D perspective container
- Horizontal scroll with snap behavior

## Files Modified

### `/src/app/page.tsx`
- Replaced `WritingBillboardSection` import with `Carousel`
- Updated Writing section to use `<Carousel writings={writings} />`

## Key Features

### 3D Billboard Effect
- **Active Card (Center)**:
  - Biggest (scale: 1)
  - Brightest (opacity: 1)
  - Straight (rotateY: 0)
  - Full opacity
  - Sharp shadow (strength: 1)

- **Neighbor Cards (±1)**:
  - Tilted (rotateY: ±12°)
  - Scaled down (0.85)
  - Shifted back (translateZ: -80px)
  - Faded (opacity: 0.7)
  - Soft shadow (strength: 0.3)

- **Farther Cards (±2+)**:
  - More tilted
  - Smaller (0.7)
  - Further back (translateZ: -140px+)
  - More faded (opacity: 0.4)
  - Softer shadow

### Transform Calculations
```typescript
const distance = index - activeIndex;
const rotateY = distance * 12;              // ±12° per step
const scale = 1 - Math.abs(distance) * 0.15; // 0.85 → 0.7
const translateZ = -80 * Math.abs(distance); // -80px → -140px
const opacity = 1 - Math.abs(distance) * 0.3; // 0.6 → 0.4
const shadowStrength = isActive ? 1 : 0.3;
```

### Animation
- **Library**: GSAP (already in project)
- **Duration**: 0.45s
- **Easing**: power2.inOut
- **Properties**: rotateY, scale, translateZ, opacity, shadow

### Snap-to-Center Behavior
- Horizontal scroll with snap detection
- Debounced scroll handler (100ms)
- Automatically centers nearest card
- Smooth programmatic scrolling
- Prevents infinite scroll loops

### Visual Effects
- **Floor Shadow**: Dynamic shadow below each card
- **Ambient Occlusion**: Gradient at card base
- **Environmental Gradient**: Soft background gradient
- **Depth Sorting**: Proper z-index based on translateZ

### Mobile Fallback
- No 3D tilt on screens < 768px
- Still snap-to-center
- Simpler transforms (no rotateY, no translateZ)

## Architecture

```
Carousel (main component)
├── useCarousel hook (state + logic)
├── Environmental gradients
├── Scroll container with perspective
└── CarouselCard (individual cards)
    ├── GSAP transforms
    ├── Floor shadow
    └── Content (image + metadata)
```

## Usage

Simply import and use:

```tsx
import Carousel from "@/components/writing/Carousel";

<Carousel writings={writings} />
```

The carousel automatically adapts to the number of writings - just add more to the array and everything adjusts.

## Behavior Logic

1. **Scroll**: User scrolls horizontally
2. **Detect**: Debounced handler finds nearest card to center
3. **Snap**: Sets that card as active
4. **Center**: Smoothly scrolls to center it
5. **Transform**: GSAP animates all cards simultaneously with new transforms
6. **Click**: Clicking any card immediately centers it

## Constants (Tweakable)

In `CarouselCard.tsx`:
- Card spacing: `260px`
- Rotation per step: `12°`
- Scale reduction: `0.15` per step
- Z-shift: `80px` per step
- Opacity reduction: `0.3` per step

Animation settings:
- Duration: `0.45s`
- Easing: `power2.inOut`

## Notes

- Fully typed with TypeScript
- Uses existing GSAP library
- Responsive design with mobile fallback
- Clean, organized file structure
- No external dependencies added
- Maintains existing light theme consistency

