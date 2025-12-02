# 3D Gallery Refinement Summary

## Layout Strategy: Single Ring

Implemented **Option 1: Single Ring** layout for maximum symmetry and organization.

- All cards share the same Y position (`y = 0`) - no vertical scatter
- Cards are evenly distributed around a perfect circle in the XZ-plane
- Angular spacing: `angle = (index / total) * 2π`
- Position calculation: `x = radius * cos(angle)`, `z = radius * sin(angle)`
- All cards face the center consistently with uniform rotations

## Scroll Influence

Scroll now only influences the **rotation angle** of the entire gallery ring:

- **Base rotation**: Constant slow auto-rotation at `BASE_ROTATION_SPEED`
- **Scroll offset**: Maps scroll progress (0-1) to a rotation offset
- **Smooth interpolation**: Uses lerp-like interpolation (factor 0.03) for calm, composed movement
- **No vertical movement**: Cards stay at fixed positions, only the ring rotates

The scroll influence is subtle and controlled - it gently guides the rotation but doesn't cause chaotic jumping or position changes.

## Constants (Adjustable)

All constants are defined at the top of `GalleryScene.tsx`:

```typescript
const RADIUS = 6;                      // Distance from center (default: 6)
const BASE_ROTATION_SPEED = 0.08;     // Auto-rotation speed (default: 0.08)
const SCROLL_ROTATION_RANGE = 1.5;    // Scroll influence range in radians (default: 1.5)
```

**Interpolation factor**: `0.03` in the rotation interpolation (line ~65)

### Suggested Tweaks:

- **RADIUS**: Increase (e.g., 7-8) to spread cards wider, decrease (e.g., 5) to bring them closer
- **BASE_ROTATION_SPEED**: Lower (e.g., 0.05) for slower rotation, higher (e.g., 0.12) for faster
- **SCROLL_ROTATION_RANGE**: Lower (e.g., 1.0) for less scroll influence, higher (e.g., 2.0) for more
- **Interpolation factor** (0.03): Lower (e.g., 0.02) for smoother but slower response, higher (e.g., 0.05) for snappier response

## Camera Framing

- **Position**: `[0, 0, 11]` - slightly pulled back from previous (was 10)
- **FOV**: `55` - slightly wider angle for better ring visibility (was 50)
- Camera is fixed and looks at the center, ensuring the full ring stays in view

## Hover Behavior

Refined to be more restrained:

- **Scale**: Reduced from 1.1x to **1.05x** - subtle emphasis without chaos
- **Brightness**: Reduced emissive intensity from 0.2 to **0.15** - gentle glow
- **Position/Rotation**: Unchanged on hover - cards don't move or push into each other
- DOM overlay label remains stable at top center

## Improvements Made

1. ✅ Removed irregular Y positioning (`(index % 3 - 1) * 0.8` → `y = 0`)
2. ✅ Fixed all cards to same height for perfect symmetry
3. ✅ Consistent rotation calculations - all cards face center uniformly
4. ✅ Smooth, controlled auto-rotation with interpolation
5. ✅ Scroll only affects rotation angle, not position
6. ✅ Tamed hover effects (1.05x scale, 0.15 emissive)
7. ✅ Better camera positioning for full ring visibility
8. ✅ No random wobbling or oscillation

## Files Modified

- `src/components/three/GalleryScene.tsx` - Complete refactor for organized layout
- `src/components/three/GalleryCard.tsx` - Reduced hover scale and brightness
- `src/components/three/ThreeGalleryCanvas.tsx` - Adjusted camera position and FOV

All animations, interactions, and 3D functionality remain intact - only layout and motion have been refined for organization and symmetry.

