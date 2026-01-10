# Database Migrations

## Table of Contents
- [Standard Fields](#standard-fields)
- [Migration Template](#migration-template)
- [Constraints & Validation](#constraints--validation)
- [Indexes](#indexes)
- [Checklist for New Tables](#checklist-for-new-tables)

---

## Standard Fields

Every table MUST have these fields:

```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()

-- Tables with optimistic UI MUST have
version integer NOT NULL DEFAULT 1      -- For conflict resolution
client_tx_id text                       -- For echo prevention (optional)
```

### Version Field Guidelines
- Use `integer` for most tables (sufficient for conflict resolution)
- Use `bigint` only for high-frequency update tables

### Hard Delete Only
- **Never use soft delete** (no deleted_at columns)
- Use `ON DELETE CASCADE` for related data

---

## Migration Template

### File Naming Convention
```
/supabase/migrations/YYYYMMDDHHMMSS_description.sql
```

Examples:
- `20250919000001_create_users_table.sql`
- `20250920000001_add_status_column.sql`

### Complete Migration Template

```sql
-- Migration: [Brief description]
-- Date: YYYY-MM-DD
-- Purpose: [Detailed purpose]

-- ============================================================================
-- CREATE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.{table_name} (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- ... domain-specific columns with constraints ...
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Critical for RLS query performance
CREATE INDEX IF NOT EXISTS {table_name}_user_id_idx
ON public.{table_name} USING btree (user_id);

-- Optimize ordering for UI display
CREATE INDEX IF NOT EXISTS {table_name}_created_at_idx
ON public.{table_name} USING btree (created_at DESC);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_{table_name}_version_and_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_{table_name}_updated_at ON public.{table_name};
CREATE TRIGGER update_{table_name}_updated_at
  BEFORE UPDATE ON public.{table_name}
  FOR EACH ROW
  EXECUTE FUNCTION public.update_{table_name}_version_and_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own {table_name}" ON public.{table_name};
DROP POLICY IF EXISTS "Users can create their own {table_name}" ON public.{table_name};
DROP POLICY IF EXISTS "Users can update their own {table_name}" ON public.{table_name};
DROP POLICY IF EXISTS "Users can delete their own {table_name}" ON public.{table_name};

CREATE POLICY "Users can view their own {table_name}"
ON public.{table_name} FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own {table_name}"
ON public.{table_name} FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own {table_name}"
ON public.{table_name} FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own {table_name}"
ON public.{table_name} FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.{table_name} TO authenticated;

-- ============================================================================
-- REALTIME BROADCAST TRIGGER (recommended pattern)
-- ============================================================================

-- Create broadcast function for this table
CREATE OR REPLACE FUNCTION public.broadcast_{table_name}_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    '{table_name}:' || COALESCE(NEW.user_id, OLD.user_id)::text,
    TG_OP,
    CASE
      WHEN TG_OP = 'INSERT' THEN '{table_name}_created'
      WHEN TG_OP = 'UPDATE' THEN '{table_name}_updated'
      WHEN TG_OP = 'DELETE' THEN '{table_name}_deleted'
    END,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER {table_name}_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.{table_name}
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_{table_name}_changes();

-- RLS for private channels (required)
CREATE POLICY "{table_name}_broadcast_read" ON realtime.messages
FOR SELECT TO authenticated
USING (
  topic LIKE '{table_name}:%' AND
  SPLIT_PART(topic, ':', 2)::uuid = (SELECT auth.uid())
);
```

### Migration Best Practices
- Keep migrations minimal and incremental
- Include RLS policies in migration files
- Enable realtime in migrations when needed
- Use `IF NOT EXISTS` and `IF EXISTS` for idempotency
- One logical change per migration file

---

## Constraints & Validation

### CHECK Constraints

```sql
-- String length limits
CHECK (char_length(name) <= 100 AND char_length(name) > 0)
CHECK (char_length(trim(title)) > 0)

-- Enum values
CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))
CHECK (priority IN ('low', 'medium', 'high'))

-- Prevent whitespace-only values
CHECK (trim(name) != '')

-- Optional fields with validation
CHECK (description IS NULL OR trim(description) != '')
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

-- Numeric constraints
CHECK (quantity >= 0)
CHECK (price > 0)
CHECK (percentage BETWEEN 0 AND 100)
```

### Named Constraints

```sql
ALTER TABLE public.{table_name}
ADD CONSTRAINT {table_name}_name_not_empty
CHECK (trim(name) != '');

ALTER TABLE public.{table_name}
ADD CONSTRAINT {table_name}_valid_status
CHECK (status IN ('pending', 'active', 'completed'));
```

### Foreign Keys

```sql
-- User ownership with cascade delete
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE

-- Optional relationship (child can exist without parent)
parent_id uuid REFERENCES parent_table(id) ON DELETE SET NULL

-- Required relationship with cascade
category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE

-- Restrict delete (prevent if children exist)
organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT
```

---

## Indexes

### Required Indexes

```sql
-- ALWAYS create user_id index (critical for RLS performance)
CREATE INDEX IF NOT EXISTS {table_name}_user_id_idx
ON public.{table_name}(user_id);

-- ALWAYS create created_at index for ordering
CREATE INDEX IF NOT EXISTS {table_name}_created_at_idx
ON public.{table_name}(created_at DESC);
```

### Composite Indexes

```sql
-- For common filter + sort combinations
CREATE INDEX IF NOT EXISTS {table_name}_user_status_idx
ON public.{table_name}(user_id, status);

CREATE INDEX IF NOT EXISTS {table_name}_user_created_idx
ON public.{table_name}(user_id, created_at DESC);

-- For multi-column filters
CREATE INDEX IF NOT EXISTS {table_name}_category_status_idx
ON public.{table_name}(category_id, status) WHERE status != 'deleted';
```

### Index Guidelines
- Create indexes only when needed for performance
- Composite indexes for frequently filtered combinations
- Use BTREE (default) for equality and range queries
- Use GIN for array and JSONB columns
- Consider partial indexes for filtered queries
- Monitor with `pg_stat_user_indexes`

---

## Checklist for New Tables

### Before Creating
- [ ] Define all required standard fields (id, user_id, created_at, updated_at)
- [ ] Determine if optimistic UI needed (add version, client_tx_id)
- [ ] Plan CHECK constraints for validation
- [ ] Plan indexes for query patterns
- [ ] Design foreign key relationships

### In Migration
- [ ] CREATE TABLE with all constraints
- [ ] CREATE required indexes (user_id, created_at)
- [ ] CREATE version trigger function
- [ ] ENABLE ROW LEVEL SECURITY
- [ ] CREATE all 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] GRANT permissions to authenticated
- [ ] ADD TO supabase_realtime publication (if needed)

### After Migration
- [ ] Generate/update TypeScript types
- [ ] Create data access hooks (TanStack Query)
- [ ] Implement realtime subscription (if needed)
- [ ] Test RLS policies with different users
