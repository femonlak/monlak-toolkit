# Query Patterns & Type Safety

## Table of Contents
- [Query Best Practices](#query-best-practices)
- [Pagination Patterns](#pagination-patterns)
- [Cache Key Patterns](#cache-key-patterns)
- [Type Safety](#type-safety)
- [Error Handling](#error-handling)
- [Direct Supabase vs API Layer](#direct-supabase-vs-api-layer)

---

## Query Best Practices

### Avoid N+1 Queries

```typescript
// ❌ N+1 - one query per post
for (const post of posts) {
  const author = await supabase
    .from('users')
    .select('*')
    .eq('id', post.author_id)
    .single();
}

// ✅ Single query with join
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(name, email),
    tags:post_tags(tag:tags(id, name))
  `)
  .eq('status', 'published');
```

### Query with Count

```typescript
const { data, error, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .eq('status', 'published');
```

### Count Only (No Data)

```typescript
const { count } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true });
```

---

## Pagination Patterns

### Offset-Based (Simple)

```typescript
const pageSize = 10;
const page = 1;
const offset = (page - 1) * pageSize;

const { data, error, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range(offset, offset + pageSize - 1)
  .order('created_at', { ascending: false });

const totalPages = Math.ceil(count / pageSize);
```

### Cursor-Based (Scalable)

Better for large datasets:

```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .lt('created_at', cursor)  // cursor = last item's created_at
  .order('created_at', { ascending: false })
  .limit(pageSize);

// Next cursor
const nextCursor = data?.[data.length - 1]?.created_at;
```

---

## Cache Key Patterns

### TanStack Query Pattern

```typescript
const queryKeys = {
  all: ['posts'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Filters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

// Usage
const { data } = useQuery({
  queryKey: queryKeys.list({ status: 'published' }),
  queryFn: () => fetchPosts({ status: 'published' })
});

// Invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
```

---

## Type Safety

### Generate Types from Database

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

### Type Definitions

```typescript
import { Database } from './database';

// Extract table types
type Tables = Database['public']['Tables'];
type PostRow = Tables['posts']['Row'];
type PostInsert = Tables['posts']['Insert'];
type PostUpdate = Tables['posts']['Update'];

// Extended types for UI
interface Post extends PostRow {
  author_name?: string;  // joined data
  pending?: boolean;     // UI state
}
```

### Typed Client

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabase = createClient<Database>(url, key);

// Now queries are typed
const { data } = await supabase
  .from('posts')  // autocomplete
  .select('id, title, content');  // typed columns
```

---

## Error Handling

### Standard Pattern

```typescript
async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  if (error) {
    console.error('Database error:', error.message, error.code);

    // Handle specific errors
    if (error.code === '42501') {
      throw new Error('Permission denied');
    }

    throw error;
  }

  return data;
}
```

### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 23505 | Unique violation | Show "already exists" message |
| 23503 | Foreign key violation | Check related records exist |
| 42501 | Permission denied (RLS) | Check user authentication/policy |
| PGRST116 | No rows found | Handle empty state |
| 22P02 | Invalid input syntax | Validate input before query |

### Error Helper

```typescript
export function handleSupabaseError(error: any, context?: string): never {
  const message = context
    ? `${context}: ${error.message}`
    : error.message;

  console.error('[Supabase Error]', message, error);
  throw new Error(message);
}

// Usage
const { data, error } = await supabase.from('posts').select();
if (error) handleSupabaseError(error, 'Fetching posts');
```

---

## Direct Supabase vs API Layer

### Use Direct Supabase (Default)

```
✅ Simple CRUD operations
✅ RLS handles authorization
✅ No external services needed
✅ Realtime subscriptions
✅ Client-side filtering acceptable
```

### Create API Layer (Edge Functions) When

```
✅ External services required (Stripe, email, LLMs)
✅ Complex multi-table transactions
✅ Rate limiting needed
✅ Custom business logic beyond RLS
✅ Webhooks and callbacks
✅ Background jobs / scheduled tasks
✅ Schema abstraction required
```

### Edge Function Example

```typescript
// supabase/functions/create-order/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { items, userId } = await req.json();

  // Complex transaction
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, status: 'pending' })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Add items, calculate totals, etc.

  return new Response(JSON.stringify({ order }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});
```
