# Design Principles

## "Less Ink" Philosophy

The interface should show only the essential.

1. **Every pixel must have a clear purpose.** No decorative or unnecessary elements.
2. **Visual hierarchy highlights only what needs immediate attention.** Don't compete for focus.
3. **Empty states must never feel lost.** Always indicate the next action clearly.
4. **Progression should be natural.** Users shouldn't need to think "what now?".
5. **Everything must be self-explanatory.** If you need help text, redesign instead.

### Questions Before Adding UI Elements
- Does this element serve a clear purpose?
- Will removing it negatively impact the user experience?
- Is this information actionable right now?
- Can the user understand this without explanation?

---

## Minimalist Design

### Core Philosophy
```
"Perfection is achieved not when there is nothing more to add,
but when there is nothing left to take away." — Antoine de Saint-Exupéry
```

### Visual Hierarchy (3 Levels Only)
```
Primary   → One thing per screen (action or content)
Secondary → Supporting information
Tertiary  → Metadata, less important

If everything is bold, nothing is bold.
```

### Whitespace as Design Element
```
Whitespace is not empty — it's active:
├── Groups related content
├── Separates distinct sections
├── Creates breathing room
├── Guides the eye
└── Increases perceived quality

More whitespace = more premium feel
```

### Color Restraint
```
Neutral base (90% of UI)
├── Background: 1-2 neutrals
├── Text: 2-3 shades (primary, secondary, muted)

Accent (single color):
└── Primary actions, focus states

Semantic (states only):
└── success, error, warning
```

### Typography Restraint
```
One typeface (two max, with clear purpose)
3-4 size variations only
2 weights (regular + semibold/bold)
Consistent line heights

Bad:  12px, 13px, 14px, 15px, 16px, 18px, 20px...
Good: 14px (body), 16px (emphasis), 20px (heading), 28px (title)
```

### Removing Decoration
```
Remove:
├── Borders that don't separate
├── Shadows that don't elevate
├── Icons that don't inform
├── Colors that don't communicate
├── Animations that don't guide
└── Text that doesn't matter
```

---

## Accessibility

### Keyboard Navigation
```
Tab         → Move to next focusable element
Shift+Tab   → Move to previous element
Enter/Space → Activate buttons and links
Escape      → Close modals/dropdowns
Arrow keys  → Navigate within components

Requirements:
├── Logical tab order (follow visual flow)
├── Visible focus indicators (never hide)
├── Skip links (skip to main content)
├── Focus trapping (keep focus in modals)
└── Focus restoration (return focus after modal closes)
```

### ARIA Guidelines
```
Use semantic HTML first:
├── <button> not <div onclick>
├── <nav> not <div class="nav">
├── <main> not <div class="content">
└── <h1>-<h6> for headings

Add ARIA only when needed:
├── aria-label → When visible text insufficient
├── aria-describedby → Additional descriptions
├── aria-expanded → Collapsible elements
├── aria-hidden → Decorative elements
├── aria-live → Dynamic content announcements
```

### Color and Contrast
```
Minimum contrast ratios (WCAG AA):
├── Normal text: 4.5:1
├── Large text (18px+): 3:1
├── UI components: 3:1

Never convey information by color alone:
├── Add icons for status
├── Add patterns for charts
├── Add text labels
```

### Accessibility Checklist
```
□ Can navigate with keyboard only
□ Focus is visible at all times
□ Focus order is logical
□ Interactive elements are focusable
□ Modals trap focus
□ Escape closes modals
□ Images have alt text
□ Form inputs have labels
□ Errors are announced
□ Color is not only indicator
□ Text has sufficient contrast
□ Content is zoomable to 200%
```
