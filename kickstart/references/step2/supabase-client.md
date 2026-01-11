# Supabase Client Configuration

Setup Supabase client for web and mobile projects. **Note**: Actual Supabase project creation happens in Step 3. This just sets up the client structure.

## Installation

```bash
npm install @supabase/supabase-js
```

## Environment Variables

Already covered in overview.md, but confirm you have:

**Web (Next.js)**:
```env
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

**Mobile (Expo)**:
```env
EXPO_PUBLIC_SUPABASE_URL=placeholder
EXPO_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

## Client Setup (Web)

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Client Setup (Mobile)

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## TypeScript Types (Optional but Recommended)

Create `types/supabase.ts` placeholder:

```typescript
// Database types will be generated in Step 3
// For now, just export a placeholder

export type Database = {}
```

With types (after Step 3):

```typescript
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

## Auth Helper Setup (If Using Auth)

Create `lib/supabase-auth.ts`:

```typescript
import { supabase } from './supabase'

export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  
  getUser: async () => {
    return await supabase.auth.getUser()
  },
}
```

## React Query Integration

Create `lib/supabase-queries.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'

// Example: Fetch data
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
      
      if (error) throw error
      return data
    },
  })
}

// Example: Create item with optimistic update
export function useCreateItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newItem: any) => {
      const { data, error } = await supabase
        .from('items')
        .insert(newItem)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['items'] })
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['items'])
      
      // Optimistically update
      queryClient.setQueryData(['items'], (old: any[]) => [...old, newItem])
      
      return { previous }
    },
    onError: (err, newItem, context) => {
      // Revert on error
      queryClient.setQueryData(['items'], context?.previous)
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
```

## Realtime Subscriptions (If Needed)

Example with React Hook:

```typescript
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRealtimeItems() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          // Invalidate queries on any change
          queryClient.invalidateQueries({ queryKey: ['items'] })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

## File Upload Helper (If Using Storage)

Create `lib/supabase-storage.ts`:

```typescript
import { supabase } from './supabase'

export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },
  
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },
  
  delete: async (bucket: string, paths: string[]) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths)
    
    if (error) throw error
    return data
  },
}
```

## Testing Connection

Create a simple test to verify setup:

```typescript
// Add this to your home page temporarily
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    supabase.from('_test').select('*').then(() => {
      setConnected(true)
    })
  }, [])
  
  return <div>{connected ? 'Connected' : 'Not connected yet'}</div>
}
```

**Note**: This will fail until Step 3 is complete (when actual Supabase project exists).

## Important Notes

1. **Client-side only**: This setup is for client-side Supabase access
2. **Keys are placeholder**: Real keys come from Step 3
3. **RLS required**: Always enable Row Level Security in production
4. **No server actions**: For server-side in Next.js, use different setup

## Next Steps

- Complete Step 3 to create actual Supabase project
- Replace placeholder environment variables with real keys
- Test connection
- Generate TypeScript types from database schema
