# Row Level Security (RLS)

## Table of Contents
- [Fundamental Rules](#fundamental-rules)
- [Policy Syntax](#policy-syntax)
- [Supabase Roles](#supabase-roles)
- [Helper Functions](#helper-functions)
- [Standard Policy Pattern](#standard-policy-pattern)
- [Advanced Patterns](#advanced-patterns)
- [Policy Types](#policy-types)
- [Performance Optimization](#performance-optimization)
- [Service Role Security](#service-role-security)

---

## Fundamental Rules

1. **All tables MUST have RLS enabled**
2. **All policies MUST be scoped by `auth.uid()`**
3. **Never expose service-role key to client**
4. **Grant permissions explicitly**
5. **NEVER use `FOR ALL`** - create separate policies per operation

---

## Policy Syntax

### Structure

```sql
CREATE POLICY "Policy description" ON table_name
FOR operation
TO role
USING (condition)
WITH CHECK (condition);
```

### Operations and Conditions

| Operation | USING | WITH CHECK |
|-----------|-------|------------|
| SELECT | Yes | No |
| INSERT | No | Yes |
| UPDATE | Yes | Yes |
| DELETE | Yes | No |

### Correct Order

```sql
-- ✅ CORRECT: TO comes AFTER FOR
CREATE POLICY "policy name" ON profiles
FOR SELECT
TO authenticated
USING (true);

-- ❌ WRONG: TO before FOR
CREATE POLICY "policy name" ON profiles
TO authenticated
FOR SELECT
USING (true);
```

---

## Supabase Roles

```sql
-- Unauthenticated users
TO anon

-- Authenticated users
TO authenticated

-- Both
TO anon, authenticated
```

---

## Helper Functions

### auth.uid()

Returns the authenticated user's ID.

```sql
USING ((SELECT auth.uid()) = user_id)
```

### auth.jwt()

Returns JWT with metadata:

```sql
-- raw_user_meta_data: Updatable by user, NOT secure for authorization
-- raw_app_meta_data: Not updatable by user, USE for authorization

-- Check team membership via app_metadata (SECURE)
CREATE POLICY "User is in team" ON my_table
FOR SELECT TO authenticated
USING (
  team_id IN (
    SELECT jsonb_array_elements_text(
      auth.jwt() -> 'app_metadata' -> 'teams'
    )::uuid
  )
);
```

### MFA Verification

```sql
CREATE POLICY "Require MFA for updates" ON sensitive_table
AS RESTRICTIVE
FOR UPDATE TO authenticated
USING ((SELECT auth.jwt()->>'aal') = 'aal2');
```

---

## Standard Policy Pattern

```sql
-- Enable RLS
ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;

-- SELECT: View own records only
CREATE POLICY "Users can view their own {table}"
ON public.{table} FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- INSERT: Create records assigned to self
CREATE POLICY "Users can create their own {table}"
ON public.{table} FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE: Modify own records only (needs both USING and WITH CHECK)
CREATE POLICY "Users can update their own {table}"
ON public.{table} FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- DELETE: Remove own records only
CREATE POLICY "Users can delete their own {table}"
ON public.{table} FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{table} TO authenticated;
```

### Idempotent Creation

```sql
DROP POLICY IF EXISTS "policy_name" ON public.{table};
CREATE POLICY "policy_name" ON public.{table} ...
```

---

## Advanced Patterns

### Public Read, Authenticated Write

```sql
CREATE POLICY "Anyone can view"
ON public.{table} FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated can create"
ON public.{table} FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);
```

### Role-Based Access

```sql
CREATE POLICY "Admins can view all"
ON public.{table} FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = (SELECT auth.uid()) AND role = 'admin'
  )
);
```

### Organization/Team Access

```sql
CREATE POLICY "Org members can view"
ON public.{table} FOR SELECT TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = (SELECT auth.uid())
  )
);
```

### Conditional by Status

```sql
CREATE POLICY "View published or own"
ON public.{table} FOR SELECT TO authenticated
USING (
  status = 'published'
  OR (SELECT auth.uid()) = user_id
);
```

---

## Policy Types

### PERMISSIVE (Default - Recommended)

Policies combined with OR - if any policy allows, access is granted.

**Always prefer PERMISSIVE** except for additional security requirements.

### RESTRICTIVE (Use with Caution)

All RESTRICTIVE policies must pass (AND logic). Use only for extra layers like MFA.

```sql
-- Example: Require MFA for sensitive operations
CREATE POLICY "Require MFA" ON sensitive_table
AS RESTRICTIVE
FOR UPDATE TO authenticated
USING ((SELECT auth.jwt()->>'aal') = 'aal2');
```

**Why avoid RESTRICTIVE:**
- More complex to reason about
- Can accidentally block users
- Difficult to debug

---

## Performance Optimization

### 1. Add Indexes on Policy Columns

```sql
CREATE INDEX idx_userid ON test_table USING btree (user_id);
```

### 2. Wrap Functions in SELECT (Critical)

```sql
-- ✅ OPTIMIZED - uses initPlan caching (called once)
CREATE POLICY "policy" ON test_table
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ❌ SLOW - calls function for each row
CREATE POLICY "policy" ON test_table
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
```

### 3. Minimize Joins - Use Sets

```sql
-- ❌ SLOW - join on each row
CREATE POLICY "Team access" ON test_table
FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) IN (
    SELECT user_id FROM team_user
    WHERE team_user.team_id = team_id  -- JOIN here
  )
);

-- ✅ FAST - no join
CREATE POLICY "Team access" ON test_table
FOR SELECT TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_user
    WHERE user_id = (SELECT auth.uid())  -- no join
  )
);
```

### 4. Always Specify Role with TO

```sql
-- ✅ OPTIMIZED
CREATE POLICY "policy" ON rls_test
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);
```

---

## Service Role Security

### When to Use

```
✅ Administrative operations (user management)
✅ Background jobs (cron, imports)
✅ Specific internal APIs

⚠️ Service Role bypasses RLS - ALWAYS add explicit checks
```

### Safe Pattern

```typescript
// ✅ CORRECT - explicit check
const { data, error } = await serviceClient
  .from('posts')
  .select('*')
  .eq('author_id', userId)  // Explicit check required
  .single();

// ❌ DANGEROUS - no check
const { data, error } = await serviceClient
  .from('posts')
  .select('*')
  .single();
```

---

## String Handling

Always use double quotes for SQL strings with apostrophes:

```sql
-- ✅ CORRECT
WHERE name = 'Night''s watch'

-- ❌ WRONG
WHERE name = 'Night\'s watch'
```

---

## Multiple Operations

Create separate policies - PostgreSQL doesn't support multiple operations:

```sql
-- ❌ WRONG - doesn't work
CREATE POLICY "policy" ON profiles
FOR INSERT, DELETE  -- NOT SUPPORTED
...

-- ✅ CORRECT
CREATE POLICY "Can create" ON profiles FOR INSERT ...
CREATE POLICY "Can delete" ON profiles FOR DELETE ...
```
