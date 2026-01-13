# Cross-Platform Strategy

## What to Share

### Always Share
```
├── Business logic
├── Data models / types
├── API calls / services
├── Validation rules
├── State management logic
└── Utility functions
```

### Never Share (Platform-Specific)
```
├── Navigation implementation
├── Native gestures / animations
├── Platform-specific UI patterns
├── Native module integrations
└── Platform-specific performance optimizations
```

---

## When to Diverge

### Diverge When
```
├── Platform conventions differ (iOS back vs Android back)
├── Native component is significantly better
├── Performance requires platform optimization
├── Feature only exists on one platform
└── User expectations differ by platform
```

### Don't Diverge Just Because
```
├── It's slightly easier to implement differently
├── Personal preference for one platform
└── "We'll unify later" (you won't)
```

---

## Abstraction Levels

### Level 1 - Shared Types + Logic
```
├── Types, interfaces, business rules
├── Platform implements UI independently
└── Max flexibility, more code
```

### Level 2 - Shared Hooks + Services
```
├── useFetch, useAuth, services
├── Platform uses with own components
└── Good balance
```

### Level 3 - Shared Components (Headless)
```
├── Logic + state, no UI
├── Platform wraps with own styling
└── Maximum reuse, some constraints
```

### Level 4 - Shared UI Components
```
├── Same component renders on all platforms
├── Use sparingly (simple elements only)
└── Risk of "lowest common denominator" UX
```

---

## Project Structure

### Monorepo
```
monorepo/
├── packages/
│   ├── shared/           # Types, utils, business logic
│   │   ├── types/
│   │   ├── utils/
│   │   ├── hooks/        # Platform-agnostic hooks
│   │   └── services/     # API, validation
│   ├── web/              # React (Next.js)
│   └── mobile/           # React Native (Expo)
└── apps/
    ├── web/
    └── mobile/
```

---

## Platform-Specific Files

### Convention Options

**1. File Extension**
```
Button.tsx        → shared
Button.web.tsx    → web only
Button.native.tsx → mobile only
```

**2. Folder Structure**
```
components/
├── shared/Button.tsx
├── web/Button.tsx
└── native/Button.tsx
```

**3. Platform Exports**
```
Button/
├── index.ts       → re-exports based on platform
├── Button.web.tsx
└── Button.native.tsx
```

---

## Decision Framework

For each feature/component, ask:

### 1. Is the UX identical on all platforms?
```
Yes → Consider shared component
No  → Platform-specific implementation
```

### 2. Are there platform-specific APIs involved?
```
Yes → Abstraction layer + platform implementations
No  → Can be fully shared
```

### 3. Does performance matter here?
```
Yes → Platform-optimized implementations
No  → Shared is fine
```

### 4. Will platform conventions affect user expectations?
```
Yes → Respect each platform's conventions
No  → Shared implementation OK
```

---

## Platform Differences to Respect

### Navigation
```
iOS:     "< Back" in nav bar, swipe from edge
Android: Hardware/gesture back button
Web:     Browser back, URL-based
```

### Interactions
```
iOS:     Haptics expected, long-press for context
Android: FAB common, material ripple effects
Web:     Hover states, keyboard shortcuts
```

### UI Patterns
```
iOS:     Bottom sheets, action sheets
Android: Bottom sheets, dialogs
Web:     Modals, dropdowns, tooltips
```

---

## Shared State Management

### Pattern
```tsx
// packages/shared/hooks/useProducts.ts
export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  })
}

// Both platforms use the same hook
// UI is platform-specific
```

### Optimistic Updates (Shared)
```tsx
// packages/shared/hooks/useCreateProduct.ts
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createProduct,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      const previous = queryClient.getQueryData(['products'])

      queryClient.setQueryData(['products'], (old) => [
        ...old,
        { ...newProduct, id: 'temp-' + Date.now() },
      ])

      return { previous }
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

---

## Anti-Patterns

```
❌ Same UI for all platforms ("write once, run everywhere")
❌ Platform checks scattered throughout codebase
❌ Duplicating business logic per platform
❌ Ignoring platform conventions for consistency
❌ Over-abstracting simple components
```
