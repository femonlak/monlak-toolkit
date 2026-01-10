# Setup & Client Configuration

## Table of Contents
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Client Configuration](#client-configuration)
- [When to Use Each Client](#when-to-use-each-client)

---

## Environment Variables

```bash
# Required
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Server-side only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## Installation

```bash
npm install @supabase/supabase-js

# For Next.js/SSR
npm install @supabase/ssr
```

---

## Client Configuration

### Client Helper

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client padrão (respeita RLS)
export function getSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Client admin (bypassa RLS) - usar com cuidado
export function getSupabaseServiceClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
```

### Browser Client (with Realtime)

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### Server Client (Next.js App Router)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

---

## When to Use Each Client

### getSupabaseClient() - Default (99% of cases)

```
✅ User operations
✅ CRUD with RLS active
✅ Secure queries
✅ Realtime subscriptions
```

### getSupabaseServiceClient() - Admin Only

```
✅ Administrative operations (user management)
✅ Background jobs (cron, imports)
✅ Specific internal APIs
✅ Bypassing RLS when necessary

⚠️ ALWAYS add explicit checks when using Service Role
```

### Service Role Safety Pattern

```typescript
async function withServiceRole<T>(
  operation: (client: SupabaseClient) => Promise<T>,
  context?: string
): Promise<T> {
  const client = getSupabaseServiceClient();
  console.log(`[Service Role] ${context || 'Operation'}`);

  try {
    return await operation(client);
  } catch (error) {
    console.error(`[Service Role Error] ${context}:`, error);
    throw error;
  }
}

// Usage - ALWAYS add explicit checks
const userData = await withServiceRole(
  async (client) => {
    return await client
      .from('users')
      .select('*')
      .eq('id', userId)  // Explicit check required
      .single();
  },
  'Fetching user data'
);
```
