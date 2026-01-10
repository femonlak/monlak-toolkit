# Motion & Animation

## Why Animate

Animation is not decoration. It serves specific purposes:

```
Purpose                      Example
─────────────────────────────────────────
Feedback         → Button press, toggle state
Continuity       → Page transitions, expanding cards
Orientation      → Where did this come from? Where did it go?
Focus            → Draw attention to important change
Delight          → Celebrate achievements (sparingly)
```

---

## When NOT to Animate

```
❌ User is trying to complete a task quickly
❌ Animation would delay critical feedback
❌ Repeated actions (don't animate every list item delete)
❌ User has reduced-motion preference
❌ Animation serves no purpose beyond "looking cool"
```

---

## Timing Principles

### Duration by Distance/Importance
```
Micro (50-100ms)   → Button states, toggles
Short (150-200ms)  → Small movements, fades
Medium (250-300ms) → Cards, modals appearing
Long (400-500ms)   → Page transitions, complex sequences
```

**Rule: If user notices the animation is slow, it's too slow.**

---

## Easing

```
ease-out    → Elements entering (fast start, gentle stop)
ease-in     → Elements leaving (gentle start, fast exit)
ease-in-out → Elements moving within view
linear      → Only for continuous (progress, spinners)

Spring physics → Natural feel for interactive elements
```

---

## Micro-interactions

### Common Patterns
```
Button press      → Scale down slightly (0.97), release springs back
Toggle            → Smooth state transition, color + position
Checkbox          → Check mark draws in, not just appears
Input focus       → Border/label animates smoothly
Success           → Subtle bounce or checkmark animation
Error             → Gentle shake (not aggressive)
```

### Button with Animation (React Native)
```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

function Button({ onPress, children }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
    haptics.light()
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    <Animated.Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      {children}
    </Animated.Pressable>
  )
}
```

---

## Loading States

```
Skeleton          → Shimmer effect suggests loading
Spinner           → Only for indeterminate short waits
Progress bar      → When you know the percentage
Staggered fade-in → Content appearing section by section

Never:
├── Freeze the UI without feedback
├── Show spinner for < 200ms
└── Animate skeleton forever (timeout + error state)
```

---

## Performance Rules

### Only Animate
```
├── transform (translate, scale, rotate)
├── opacity
└── These don't trigger layout/paint
```

### Never Animate
```
├── width/height (use scale)
├── top/left (use transform)
├── margin/padding
└── Anything that causes reflow
```

### Native Thread (React Native)
```
Use native driver for transforms/opacity:
├── Keeps animation at 60fps
├── Doesn't block JS thread
├── Required for gesture-driven animations
```

---

## Accessibility

### Respect prefers-reduced-motion
```
├── Disable non-essential animations
├── Keep functional feedback (instant state changes)
├── Reduce or eliminate parallax
└── No auto-playing videos/animations

// Web
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// React Native
import { AccessibilityInfo } from 'react-native'

const [reduceMotion, setReduceMotion] = useState(false)

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion)
}, [])
```

---

## Transitions

### Page Transitions
```
Push (forward)  → New page slides in from right
Pop (back)      → Current page slides out to right
Modal           → Slides up from bottom
Fade            → Cross-dissolve for tab switches
```

### Shared Element Transitions
```
├── Element morphs between screens
├── Creates visual continuity
├── Use for hero images, cards expanding
└── Don't overuse - subtle is better
```

---

## Anti-Patterns

```
❌ Animating everything
❌ Slow animations (>500ms)
❌ Bouncy animations for UI elements
❌ Animating layout properties
❌ Ignoring reduced-motion
❌ Animation without purpose
```
