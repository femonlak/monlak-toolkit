# Design System

## What Makes a Design System
```
Design System = Design Tokens + Components + Patterns + Guidelines

├── Design tokens  → Source of truth for values
├── Components     → Reusable building blocks
├── Patterns       → How to combine components
├── Guidelines     → When and why to use each
└── Documentation  → Living, not static
```

---

## Token Architecture

### Three Levels
```
Primitive tokens (raw values):
├── color-green-500: #10AB53
├── spacing-4: 16px
└── font-size-14: 14px

Semantic tokens (meaning):
├── color-success: var(--color-green-500)
├── spacing-md: var(--spacing-4)
└── font-size-body: var(--font-size-14)

Component tokens (specific):
├── button-bg: var(--color-success)
├── button-padding: var(--spacing-md)
└── button-font-size: var(--font-size-body)

Change primitive → semantic adapts → components follow
```

### Spacing Scale
```
xs: 4px   → Icon gaps, tight spacing
sm: 8px   → Small elements, inline spacing
md: 16px  → Default spacing, padding
lg: 24px  → Group spacing
xl: 32px  → Section spacing
2xl: 48px → Major sections
3xl: 64px → Page-level divisions
```

### Typography Scale
```
Font sizes:
├── xs: 12px  → Captions, labels
├── sm: 14px  → Secondary text
├── md: 16px  → Body text (base)
├── lg: 18px  → Emphasized text
├── xl: 20px  → Subheadings
├── 2xl: 24px → Section headings
├── 3xl: 30px → Page headings
└── 4xl: 36px → Hero text

Font weights:
├── normal: 400
├── medium: 500
├── semibold: 600
└── bold: 700
```

### Color System
```
Semantic (use for states):
├── success  → Completed, valid, positive
├── error    → Errors, failures, destructive
├── warning  → Warnings, attention needed
└── info     → Informational, neutral

Brand (use for identity):
├── primary    → Main brand, CTAs
├── secondary  → Supporting elements
└── neutral    → Text, borders, backgrounds

Each color should have a scale (50-900)
with accessible contrast ratios.
```

---

## Component API Design

### Good API Principles
```
├── Props have sensible defaults
├── Common use cases require minimal props
├── Variants over boolean props
├── Composition over configuration
└── Consistent naming across system

✅ <Button variant="primary" size="md">
❌ <Button isPrimary isLarge>
```

### Standard Variants
```
Size:      xs | sm | md | lg | xl
Intent:    default | primary | success | warning | danger
State:     default | hover | focus | active | disabled | loading

Keep variants minimal. If you need 12 variants,
you probably need 2 different components.
```

---

## Composition Patterns

### Compound Components
```tsx
// Flexible composition, shared state via context
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">First</Tabs.Tab>
    <Tabs.Tab value="tab2">Second</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>
```

### Slot-Based vs Prop-Based
```tsx
// Slot-based (complex content)
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

// Prop-based (simpler cases)
<Card
  header="Title"
  footer={<Button>Save</Button>}
>
  Content
</Card>

Prefer slots when:
├── Content can be complex
├── Order might vary
├── Some parts are optional
└── Need maximum flexibility
```

### Render Props / Headless
```tsx
// Headless: provides logic, user provides UI
<Combobox
  items={items}
  renderItem={(item, { isSelected, isHighlighted }) => (
    <div className={isHighlighted ? 'highlighted' : ''}>
      {item.label}
      {isSelected && <CheckIcon />}
    </div>
  )}
/>
```

---

## Component Structure

```
src/components/
├── ui/          # Primitives (Button, Input, Card, Modal)
├── features/    # Feature-specific (UserCard, ProductList)
├── layouts/     # Page layouts (AppShell, Sidebar)
└── providers/   # Context providers (Auth, Theme)
```

### Component Decision Tree
```
Is it a basic UI primitive?
├── Yes → Place in ui/ folder
└── No → Continue

Is it specific to a feature?
├── Yes → Place in features/{feature}/ folder
└── No → Continue

Is it a page layout?
├── Yes → Place in layouts/ folder
└── No → Place in shared/components/
```
