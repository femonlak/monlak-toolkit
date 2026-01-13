# Mobile UX Patterns

## Touch & Gestures

### Gesture Types
```
Tap         → Primary action (buttons, links)
Long press  → Secondary actions (context menu)
Swipe       → Quick actions, navigation, dismiss
Pan         → Drag, reorder, sliders
Pinch       → Zoom (maps, images)
```

### UX Requirements
```
├── Touch targets: 44x44pt minimum
├── Visual feedback within 100ms
├── Haptic feedback for meaningful actions
├── Cancellable gestures (drag away to cancel)
└── Gesture conflicts: vertical scroll vs horizontal swipe
```

---

## Bottom Sheets

### When to Use
```
├── Actions on selected item
├── Filters/sort options
├── Quick forms (1-3 fields)
├── Contextual information
└── Anything that doesn't need full screen
```

### Behavior
```
├── Snap points (collapsed, half, full)
├── Swipe down to dismiss
├── Backdrop dims content behind
├── Keyboard pushes sheet up
└── Don't trap user - always easy to dismiss
```

---

## Swipe Actions

### Common Patterns
```
Swipe left  → Destructive (delete, archive)
Swipe right → Positive (complete, favorite)

Reveal distance indicates action weight
Color reinforces intent (red = danger)
```

### Rules
```
├── Max 2-3 actions per side
├── Icons + short labels
├── Confirm destructive actions
├── Allow undo for quick actions
└── Don't hide primary actions behind swipe
```

---

## Pull-to-Refresh

### When to Use
```
├── Lists with fresh data (feeds, messages)
├── Manual sync trigger
└── NOT for static content
```

### UX Requirements
```
├── Visual indicator (spinner, animation)
├── Haptic at trigger threshold
├── Minimum visible duration (300ms)
├── Don't jump to top after refresh
└── Show "Updated just now" feedback
```

---

## Haptic Feedback

### When to Use
```
├── Selection (picker wheels, segments)
├── Success (action completed)
├── Warning (destructive action about to happen)
├── Impact (elements snapping into place)
└── Toggles and switches
```

### Intensity
```
Light   → Subtle selections
Medium  → Confirmations
Heavy   → Significant actions

Never spam haptics. User will disable them.
```

---

## Lists & Scrolling

### Infinite Scroll
```
├── Load more before user reaches end
├── Show loading indicator at bottom
├── Handle errors gracefully
├── Maintain scroll position on data refresh
```

### Scroll Behavior
```
├── Hide toolbar on scroll down (more content space)
├── Show toolbar on scroll up
├── Snap to meaningful positions
├── Remember scroll position between navigations
```

---

## Empty States

### Mobile-Specific
```
├── Illustration should be small (not half screen)
├── Single clear action button
├── Consider thumb zone for CTA placement
├── Offline empty state ≠ no data empty state
└── First-time vs returning user context
```

---

## Keyboard Handling

### When Keyboard Opens
```
├── Push content up (not cover it)
├── Scroll focused input into view
├── Show relevant keyboard type (email, numeric)
├── Provide "Done" button for dismissing
├── Handle hardware keyboard on tablets
```

### Input Accessories
```
├── Prev/Next navigation between fields
├── Quick actions above keyboard
├── Dismiss keyboard on tap outside
└── Submit from keyboard when possible
```

---

## Safe Areas & Layout

### Always Respect
```
├── Status bar (top)
├── Home indicator (bottom)
├── Notch/Dynamic Island
├── Keyboard
└── Tab bar
```

### Content Must Never Be
```
├── Cut off by device features
├── Unreachable behind keyboard
└── Too close to edges (padding: 16pt minimum)
```

---

## Thumb Zone Design

```
┌─────────────────┐
│     Hard to     │  ← Secondary actions, navigation
│     reach       │
├─────────────────┤
│    Natural      │  ← Content, reading
│     reach       │
├─────────────────┤
│   Easy reach    │  ← Primary actions, FAB, tabs
└─────────────────┘

Primary actions belong at the bottom.
```

---

## Loading States

### Patterns
```
Skeleton          → Shimmer effect suggests loading
Spinner           → Only for indeterminate short waits
Progress bar      → When you know the percentage
Staggered fade-in → Content appearing section by section
```

### Rules
```
├── Never freeze UI without feedback
├── Don't show spinner for < 200ms
├── Animate skeleton (timeout + error state)
└── Avoid layout shift when data loads
```

---

## Data States (Every Screen Needs These)

### Empty
```
├── Icon or illustration
├── Clear message explaining why empty
├── Primary action to create/add
└── Never leave user wondering "what now?"
```

### Loading
```
├── Skeleton matching content shape
├── Avoid layout shift
├── Show cached data if available
```

### Error
```
├── User-friendly message (not technical)
├── Action to retry or resolve
├── Graceful degradation when possible
└── Log technical details for debugging
```

### Partial
```
├── Handle partial data gracefully
├── Show available data while loading more
├── Indicate what's still loading
```
