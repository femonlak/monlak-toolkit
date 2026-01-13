# React Web Best Practices

## Component Structure

```tsx
// Order within component:

1. Type definitions (if not separate file)
2. Component function
3. Hooks (useState, useEffect, custom hooks)
4. Derived state / computed values
5. Event handlers
6. Effects
7. Early returns (loading, error, empty)
8. Main render

// Keep components under 200 lines. Split if larger.
```

---

## Hooks

### Rules
```
├── Call at top level (not in conditions/loops)
├── Only call in React functions
├── Custom hooks start with "use"
└── Keep hooks focused (single responsibility)
```

### Common Mistakes
```
❌ useEffect for derived state     → Use useMemo
❌ useEffect to sync props to state → Just use props
❌ Missing dependencies in useEffect
❌ Over-using useCallback/useMemo
```

---

## State Management

### By Type
```
Local state (useState):
├── Form inputs
├── Toggle states
├── UI-only state

Server state (TanStack Query, SWR):
├── API data
├── Cached responses
├── Loading/error states

URL state (router):
├── Page, filters, search
├── Anything shareable/bookmarkable

Global state (Context, Zustand):
├── User session
├── Theme
├── Feature flags
└── Cross-cutting concerns only
```

### State Colocation
```
Keep state as close as possible to where it's used:

❌ Global state for modal open/close
✅ Local state in the component that owns the modal

❌ Global state for form values
✅ Form state in the form component

❌ Prop drilling through 5+ components
✅ Context for widely shared state
```

### Decision Tree
```
Is it from a server/API?
├── Yes → Use server state management
└── No → Continue

Is it needed across many components?
├── Yes → Use context or global store
└── No → Continue

Is it URL-dependent (should be shareable)?
├── Yes → Use URL/router state
└── No → Continue

Is it form data?
├── Yes → Use form state management
└── No → Use local component state
```

---

## Performance Patterns

### Memoization (Use Sparingly)
```
useMemo     → Expensive calculations
useCallback → Functions passed to memoized children
React.memo  → Components that receive same props often

Don't memoize:
├── Everything by default
├── Primitive values
├── Functions used only in same component
└── Simple calculations

Profile first, optimize second.
```

### Code Splitting
```tsx
// Route-level (automatic in Next.js)
const Dashboard = lazy(() => import('./Dashboard'))

// Component-level (heavy components)
const HeavyChart = lazy(() => import('./HeavyChart'))

// Preload on hover/focus
const preloadDashboard = () => import('./Dashboard')
<Link onMouseEnter={preloadDashboard}>Dashboard</Link>
```

---

## Event Handling

### Naming
```
Props:    onAction (onClick, onSubmit, onChange)
Handlers: handleAction (handleClick, handleSubmit)
```

### Patterns
```
├── Inline for simple: onClick={() => setOpen(true)}
├── Handler for complex: onClick={handleSubmit}
├── Debounce search/resize: useDebouncedCallback
├── Prevent default at handler start
└── stopPropagation only when necessary
```

---

## Forms

### Controlled vs Uncontrolled
```
Controlled   → When you need value in real-time
Uncontrolled → When you only need value on submit
```

### Form Libraries
```
React Hook Form → Performance-focused
Formik          → Feature-rich
Mantine Form    → Mantine ecosystem
```

### Validation Strategy
```
Client-side:
├── Immediate feedback for UX
├── Prevent invalid submissions
└── NOT a security measure

Server-side:
├── Always validate on server
├── Return field-specific errors
└── Source of truth for validity

Show errors on blur, not keystroke.
```

### Form UX
```
├── Labels above inputs (better scanability)
├── Show errors inline near the field
├── Mark required fields clearly
├── Group related fields
├── One primary action (clear submit)
├── Preserve state on error
```

---

## Server Components (Next.js 13+)

### Server Components (default)
```
├── Fetch data directly
├── Access backend resources
├── Keep secrets on server
├── Zero JS sent to client
```

### Client Components ('use client')
```
├── Interactivity (onClick, onChange)
├── Browser APIs (localStorage, window)
├── Hooks (useState, useEffect)
├── Effects and lifecycle
```

**Rule: Start with Server, add 'use client' only when needed.**

---

## Error Handling

### Error Categories
```
Expected (handle gracefully):
├── Validation errors → Show inline messages
├── Not found → Show 404 page
├── Unauthorized → Redirect to login
├── Rate limited → Show retry message

Unexpected (recover or fail gracefully):
├── Network errors → Retry with backoff
├── Server errors → Show generic error + retry
├── Rendering errors → Error boundary
```

### User-Friendly Messages
```
❌ "Error: ECONNREFUSED 127.0.0.1:5432"
✅ "Unable to connect. Please try again."

❌ "400 Bad Request"
✅ "Please check your input and try again."

Always:
├── Use plain language
├── Explain what happened
├── Suggest what to do next
├── Provide a way to retry
```
