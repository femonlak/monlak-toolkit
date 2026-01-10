---
name: supabase-expert
description: Supabase database specialist for all backend tasks. Use PROACTIVELY when working with database schema design, migrations, RLS policies, realtime subscriptions, optimistic UI, queries, Edge Functions, or any backend/database task. This skill provides patterns, templates, and best practices for Supabase development.
---

# Supabase Expert

Comprehensive skill for Supabase backend development covering setup, authentication, CRUD, migrations, RLS, realtime (broadcast pattern), queries, and troubleshooting.

## MCP Management (CRITICAL)

**BEFORE any Supabase operation:**
```bash
claude mcp enable supabase
```

**AFTER completing Supabase work:**
```bash
claude mcp disable supabase
```

This prevents unnecessary context usage when the MCP is not needed.

## Reference Guide

### 1. Setup & Configuration
Read [references/setup.md](references/setup.md) for:
- Environment variables
- Client configuration (standard vs service role)
- When to use each client type

### 2. Authentication
Read [references/auth.md](references/auth.md) for:
- Sign up/in/out patterns
- Session management
- Password recovery
- Admin operations

### 3. CRUD Operations
Read [references/crud.md](references/crud.md) for:
- Select, Insert, Update, Delete
- Filters and joins
- RPC functions

### 4. Migrations & Schema
Read [references/migrations.md](references/migrations.md) for:
- Standard fields template
- Complete migration template
- Constraints and indexes
- New table checklist

### 5. Security (RLS)
Read [references/rls-security.md](references/rls-security.md) for:
- Policy syntax and patterns
- Performance optimization
- auth.uid() and auth.jwt()
- Service role security

### 6. Realtime (Broadcast Pattern)
Read [references/realtime.md](references/realtime.md) for:
- **CRITICAL: Use broadcast, NOT postgres_changes**
- Database triggers for broadcast
- Private channels and RLS
- Framework patterns (React, Next.js)
- Migration guide

### 7. Queries & Types
Read [references/queries.md](references/queries.md) for:
- Pagination patterns
- Type safety
- Error handling
- When to use Edge Functions

### 8. Service Layer
Read [references/service-layer.md](references/service-layer.md) for:
- Service pattern structure
- Next.js integration
- TanStack Query integration

### 9. SQL Scripts
Read [references/scripts.md](references/scripts.md) for:
- Database triggers
- Debug queries
- CLI/Bash reference

### 10. Troubleshooting
Read [references/troubleshooting.md](references/troubleshooting.md) for:
- RLS issues
- Performance issues
- Realtime issues
- Common error codes

## Essential Patterns

### Standard Table Fields
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()
version integer NOT NULL DEFAULT 1  -- For optimistic UI
```

### RLS Quick Pattern
```sql
ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own" ON public.{table}
FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users create own" ON public.{table}
FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users update own" ON public.{table}
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users delete own" ON public.{table}
FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.{table} TO authenticated;
```

### Broadcast Trigger Pattern
```sql
CREATE OR REPLACE FUNCTION broadcast_{table}_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    '{table}:' || COALESCE(NEW.user_id, OLD.user_id)::text,
    TG_OP,
    CASE WHEN TG_OP = 'INSERT' THEN '{table}_created'
         WHEN TG_OP = 'UPDATE' THEN '{table}_updated'
         WHEN TG_OP = 'DELETE' THEN '{table}_deleted' END,
    TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER {table}_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON public.{table}
  FOR EACH ROW EXECUTE FUNCTION broadcast_{table}_changes();
```

### Client Subscription Pattern
```typescript
const channel = supabase.channel('room:123:messages', {
  config: { private: true, broadcast: { self: true, ack: true } }
});

await supabase.realtime.setAuth();

channel
  .on('broadcast', { event: 'message_created' }, handler)
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

## Core Rules

1. **All tables MUST have RLS enabled and scoped by auth.uid()**
2. **Never expose service-role key to client**
3. **Hard delete only** - no soft delete patterns
4. **Use (SELECT auth.uid())** for RLS performance
5. **Use broadcast pattern** - NOT postgres_changes
6. **Always create user_id and created_at indexes**
7. **Service Role requires explicit checks**
