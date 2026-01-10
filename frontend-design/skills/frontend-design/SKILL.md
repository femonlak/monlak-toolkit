---
name: frontend-design
description: |
  Create production-grade frontend applications with exceptional UX/UI quality for web (React) and mobile (React Native/Expo). Use PROACTIVELY when: (1) Building UI components or pages, (2) Implementing interactions, animations, or micro-interactions, (3) Working with React or React Native, (4) Designing component APIs or design systems, (5) Implementing mobile-specific patterns (gestures, haptics, bottom sheets), (6) Making cross-platform architecture decisions, (7) Creating distinctive visual designs that avoid generic AI aesthetics, (8) Any frontend task where UX quality matters.
---

# Frontend Design

Build interfaces with the quality of top tech companies. Minimalist, purposeful, accessible.

## Core Philosophy: "Less Ink"

Every element must earn its place. Before adding anything, ask:
1. Does it serve a clear purpose?
2. Can I remove it and still communicate?
3. Is it self-explanatory without help text?
4. Would a user miss it if gone?

## Quick Decisions

### Platform Detection
```
Web project (React, Next.js, etc.)     → Load web-react.md
Mobile project (React Native, Expo)     → Load mobile-rn.md + mobile-ux.md
Both platforms (cross-platform)         → Load cross-platform.md first
```

### Task Detection
```
Working on animations/transitions       → Load motion.md
Creating component library/tokens       → Load design-system.md
Need UX/design principles               → Load principles.md
Implementing mobile interactions        → Load mobile-ux.md
Building new UI from scratch            → Load creative-design.md
Need distinctive/memorable visuals      → Load creative-design.md
```

## Reference Files

Load the appropriate reference based on task:

| Reference | When to Load |
|-----------|--------------|
| [principles.md](references/principles.md) | Design philosophy, minimalism, visual hierarchy, accessibility |
| [creative-design.md](references/creative-design.md) | Distinctive visuals, avoiding AI slop, typography, color, atmosphere |
| [design-system.md](references/design-system.md) | Tokens, component APIs, variants, composition patterns |
| [web-react.md](references/web-react.md) | React patterns, hooks, state, Server Components, forms |
| [mobile-rn.md](references/mobile-rn.md) | React Native/Expo setup, navigation, native modules, performance |
| [mobile-ux.md](references/mobile-ux.md) | Touch, gestures, bottom sheets, haptics, thumb zone |
| [motion.md](references/motion.md) | Animation principles, timing, easing, micro-interactions |
| [cross-platform.md](references/cross-platform.md) | Shared code strategy, when to diverge, monorepo structure |

## Universal Rules

### States - Every Component Needs These
```
Interactive: default → hover → focus → active → disabled
Data-driven: loading → empty → error → partial → success
```

### Spacing Scale (Use Consistently)
```
xs: 4px   sm: 8px   md: 16px   lg: 24px   xl: 32px
```

### Color Usage
```
Neutral: 90% of UI (backgrounds, text, borders)
Accent: Primary actions, focus states
Semantic: success/error/warning only for states
```

### Typography
```
One typeface. 3-4 sizes max. 2 weights (regular + semibold).
```

### Accessibility Baseline
```
Touch targets: 44x44pt minimum
Contrast: 4.5:1 for text, 3:1 for UI
Keyboard: All interactive elements focusable
Screen readers: Semantic HTML, ARIA when needed
```

## Anti-Patterns (Never Do)

```
Hardcoded values         → Use design tokens
Decoration without purpose → Remove it
Help text for bad design  → Redesign instead
Animating width/height    → Use transform/opacity
Everything emphasized     → Only 3 hierarchy levels
```
