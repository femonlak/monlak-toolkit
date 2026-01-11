# State Management Configuration

Setup TanStack Query (server state) + Zustand (client state).

## Installation

```bash
npm install @tanstack/react-query zustand
npm install -D @tanstack/react-query-devtools  # Web only, optional
```

## TanStack Query Setup

### Create QueryClient (lib/query-client.ts)

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache persists (formerly cacheTime)
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
})
```

**Configuration Notes**:
- `staleTime`: How long data is considered fresh (no background refetch)
- `gcTime`: How long unused data stays in cache
- `retry`: Number of retry attempts on failure
- `refetchOnWindowFocus`: Auto-refetch when user returns to tab

### Provider Setup (Web - Next.js)

In `src/app/layout.tsx`:

```typescript
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

Then use in layout:

```typescript
import Providers from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Provider Setup (Mobile - Expo)

In `app/_layout.tsx`:

```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
}
```

## Zustand Setup

### Create Store (stores/example-store.ts)

```typescript
import { create } from 'zustand'

interface ExampleState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### Using the Store

```typescript
import { useExampleStore } from '@/stores/example-store'

function Component() {
  const { count, increment, decrement } = useExampleStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

## State Management Philosophy

### TanStack Query (Server State)
**Use for**:
- API data fetching
- Database queries
- Server mutations
- Caching and synchronization
- Optimistic updates

**Example**:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetching
function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })
}

// Mutating with optimistic update
function useCreateItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createItem,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['items'] })
      const previous = queryClient.getQueryData(['items'])
      queryClient.setQueryData(['items'], (old) => [...old, newItem])
      return { previous }
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(['items'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
```

### Zustand (Client State)
**Use for**:
- UI state (modals, sidebars, theme)
- Form state (if not using React Hook Form)
- User preferences
- Local app state

**Example**:
```typescript
interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}))
```

## Critical Pattern: Optimistic Updates

**Every mutation should update UI instantly**:

```typescript
function useUpdateItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateItem,
    
    // Step 1: Optimistic update (instant UI change)
    onMutate: async (updatedItem) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['items', updatedItem.id] })
      
      // Snapshot the previous value
      const previousItem = queryClient.getQueryData(['items', updatedItem.id])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['items', updatedItem.id], updatedItem)
      
      // Return context object with snapshotted value
      return { previousItem, updatedItem }
    },
    
    // Step 2: On error, roll back to previous value
    onError: (err, updatedItem, context) => {
      queryClient.setQueryData(
        ['items', context.updatedItem.id],
        context.previousItem
      )
    },
    
    // Step 3: Always refetch after error or success
    onSettled: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['items', updatedItem?.id] })
    },
  })
}
```

## Query Keys Best Practices

Organize keys hierarchically:

```typescript
// Bad
queryKey: ['items']
queryKey: ['item-1']

// Good
queryKey: ['items'] // All items
queryKey: ['items', itemId] // Specific item
queryKey: ['items', 'active'] // Active items
queryKey: ['items', { status: 'active' }] // With filters
```

## Zustand Persistence (Optional)

For data that should survive app restart:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
)
```

## DevTools Usage (Web Only)

TanStack Query DevTools show:
- Active queries
- Cache contents
- Fetch status
- Query keys

Access via floating icon in dev mode.

## Testing State

Create simple components to verify:

```typescript
// Test TanStack Query
function TestQuery() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: async () => ({ message: 'Hello' }),
  })
  
  if (isLoading) return <div>Loading...</div>
  return <div>{data?.message}</div>
}

// Test Zustand
function TestStore() {
  const count = useExampleStore((state) => state.count)
  const increment = useExampleStore((state) => state.increment)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## Common Patterns

### Loading States
```typescript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
})

if (isLoading) return <Loading />
if (isError) return <Error error={error} />
return <ItemsList items={data} />
```

### Pagination
```typescript
const [page, setPage] = useState(1)
const { data } = useQuery({
  queryKey: ['items', page],
  queryFn: () => fetchItems(page),
  keepPreviousData: true, // Keep old data while fetching new
})
```

### Dependent Queries
```typescript
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
})

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: () => fetchUserPosts(user.id),
  enabled: !!user, // Only run if user exists
})
```

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
