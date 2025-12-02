# 3D Gallery Multi-Ring Refactoring Summary

## Layout Strategy: Multiple Rings Stacked Vertically

Implemented a **cylindrical layout** with multiple rings, each containing up to 4 cards:

- Artifacts are chunked into groups of 4
- Each group forms a ring at a different vertical level
- Rings are evenly spaced vertically and centered
- All cards in a ring are positioned at 90° increments (4 positions max)

## Files Changed

### Core Components

1. **`src/components/three/GalleryScene.tsx`**
   - Added `chunkIntoGroupsOfFour()` helper function
   - Implemented multi-ring cylindrical layout calculation
   - Added central "TY" object (canvas texture-based)
   - Integrated drag rotation into rotation system
   - Updated useFrame to handle base + scroll + drag rotations

2. **`src/components/three/ThreeGalleryCanvas.tsx`**
   - Added drag control logic with pointer event handlers
   - Implemented inertia/momentum system for smooth drag release
   - Added drag state management (isDragging, dragRotation)
   - Added cursor styles (grab/grabbing)

## Key Constants (Adjustable)

All constants are at the top of `GalleryScene.tsx`:

```typescript
const RADIUS = 7;                    // Distance from center (default: 7)
const VERTICAL_SPACING = 3.5;        // Vertical distance between rings (default: 3.5)
const BASE_ROTATION_SPEED = 0.06;    // Auto-rotation speed (default: 0.06)
const SCROLL_ROTATION_RANGE = 1.2;   // Scroll influence range in radians (default: 1.2)
```

In `ThreeGalleryCanvas.tsx`:

```typescript
const DRAG_SENSITIVITY = 0.005;      // Drag movement sensitivity (default: 0.005)
const INERTIA_DAMPING = 0.92;        // Drag inertia damping (default: 0.92)
```

**Interpolation factor**: `0.03` in GalleryScene useFrame (line ~138)

### Suggested Tweaks:

- **RADIUS**: Increase (8-9) for wider rings, decrease (5-6) for tighter
- **VERTICAL_SPACING**: Increase (4-5) for more separation, decrease (2.5-3) for compact
- **BASE_ROTATION_SPEED**: Lower (0.03-0.04) for slower, higher (0.08-0.1) for faster
- **DRAG_SENSITIVITY**: Lower (0.003) for less responsive, higher (0.008) for more responsive
- **INERTIA_DAMPING**: Lower (0.88-0.9) for longer spin, higher (0.94-0.96) for quicker stop

## Drag Logic

### How It Works

The drag control is implemented in **`ThreeGalleryCanvas.tsx`**:

1. **Pointer Events**: Attached to the canvas container div
   - `pointerdown`: Starts dragging, captures pointer
   - `pointermove`: Updates rotation based on horizontal mouse movement
   - `pointerup` / `pointerleave`: Stops dragging, releases pointer

2. **Drag Calculation**:
   - Tracks `deltaX` (horizontal mouse movement)
   - Converts to rotation offset: `rotationDelta = -deltaX * DRAG_SENSITIVITY`
   - Accumulates in `dragRotation` state

3. **Inertia System**:
   - When drag ends, velocity is stored
   - `requestAnimationFrame` loop applies inertia
   - Velocity decays using `INERTIA_DAMPING` factor
   - Stops when velocity falls below threshold

4. **Rotation Combination**:
   - In `GalleryScene.tsx` useFrame:
   - Combines: `baseRotation + scrollOffset + dragRotation`
   - Smoothly interpolates to target using lerp factor 0.03

### Location

- **Drag handlers**: `ThreeGalleryCanvas.tsx` (lines ~35-75)
- **Inertia loop**: `ThreeGalleryCanvas.tsx` (lines ~77-102)
- **Rotation integration**: `GalleryScene.tsx` (lines ~120-138)

## Central "TY" Object

Created using a canvas texture:
- **Location**: `GalleryScene.tsx` (lines ~30-56, rendered at ~152-162)
- **Styling**: Soft gradient background with accent color (#e8919b) text
- **Size**: 1.5x1.5 units (centered at origin)
- **Appearance**: Subtle emissive glow to match light theme

## Layout Details

- **Chunking**: Groups of 4 artifacts per ring
- **Ring positioning**: Evenly spaced vertically, centered around y=0
- **Card positioning**: 90° increments (0°, 90°, 180°, 270°)
- **Card orientation**: All face center with uniform -0.1 rad tilt
- **Vertical centering**: Rings centered using `(ringIndex - (numRings - 1) / 2) * VERTICAL_SPACING`

## Interaction Behavior

- **Idle**: Slow auto-rotation continues
- **Dragging**: User can spin left/right, auto-rotation pauses
- **Release**: Inertia continues rotation, then settles back to auto-rotation
- **Hover**: Cards still scale/brighten on hover (works during drag)
- **Scroll**: Still influences rotation (adds to base + drag)

## What Stayed the Same

- All animations and scroll behavior
- Hover effects on cards
- DOM overlay labels
- 3D rendering and lighting
- Component structure and props

