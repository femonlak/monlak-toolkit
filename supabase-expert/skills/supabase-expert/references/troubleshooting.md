# Troubleshooting

## Table of Contents
- [RLS Issues](#rls-issues)
- [Performance Issues](#performance-issues)
- [Authentication Issues](#authentication-issues)
- [Realtime Issues](#realtime-issues)
- [Common Error Codes](#common-error-codes)

---

## RLS Issues

### Error 42501 - Permission Denied

**Symptoms:** Query returns error "permission denied" or empty results

**Solutions:**

1. **Check RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

2. **Check policies exist:**
```sql
SELECT * FROM pg_policies
WHERE tablename = 'your_table';
```

3. **Test policy manually:**
```sql
-- Set test user context
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-uuid-here"}';

-- Run test query
SELECT * FROM your_table;

-- Reset
RESET ROLE;
RESET request.jwt.claims;
```

4. **Verify auth.uid() returns value:**
```sql
SELECT auth.uid();  -- Should return user ID, not null
```

### Policy Not Working

**Common causes:**

```sql
-- ❌ Wrong: TO before FOR
CREATE POLICY "policy" ON table TO authenticated FOR SELECT ...

-- ✅ Correct: FOR before TO
CREATE POLICY "policy" ON table FOR SELECT TO authenticated ...

-- ❌ Wrong: Using auth.uid() without SELECT
USING (auth.uid() = user_id)

-- ✅ Correct: Wrapped in SELECT
USING ((SELECT auth.uid()) = user_id)
```

---

## Performance Issues

### Slow Queries with RLS

**Diagnose:**
```sql
EXPLAIN ANALYZE SELECT * FROM your_table;
```

**Solutions:**

1. **Add indexes on policy columns:**
```sql
CREATE INDEX idx_table_user_id ON your_table(user_id);
```

2. **Wrap functions in SELECT:**
```sql
-- Slow
USING (auth.uid() = user_id)

-- Fast
USING ((SELECT auth.uid()) = user_id)
```

3. **Use sets instead of joins:**
```sql
-- Slow: join on each row
USING (
  (SELECT auth.uid()) IN (
    SELECT user_id FROM team_members
    WHERE team_members.team_id = team_id
  )
)

-- Fast: no join
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = (SELECT auth.uid())
  )
)
```

### N+1 Queries

**Problem:** Multiple queries when one would suffice

**Solution:** Use joins
```typescript
// ❌ N+1
for (const post of posts) {
  const author = await supabase.from('users').select().eq('id', post.author_id);
}

// ✅ Single query
const { data } = await supabase
  .from('posts')
  .select('*, author:users(name, email)');
```

---

## Authentication Issues

### Tokens Expiring

**Token lifespan:**
- Access token: 1 hour
- Refresh token: 30 days

**Solutions:**

1. **Auto-refresh (web apps):**
```typescript
const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
```

2. **Manual refresh (CLI/scripts):**
```typescript
const { data, error } = await supabase.auth.refreshSession();
```

3. **Check token expiry:**
```typescript
const { data: { session } } = await supabase.auth.getSession();
const expiresAt = new Date(session.expires_at * 1000);
const isExpired = expiresAt < new Date();
```

### Session Not Persisting

**Check configuration:**
```typescript
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,  // Must be true
    storage: localStorage   // Or custom storage
  }
});
```

---

## Realtime Issues

### Events Not Arriving

**Checklist:**

1. **Using broadcast (not postgres_changes)?**
```typescript
// ❌ Old pattern
.on('postgres_changes', ...)

// ✅ New pattern
.on('broadcast', { event: 'message_created' }, ...)
```

2. **Private channel configured?**
```typescript
const channel = supabase.channel('topic', {
  config: { private: true }  // Required for RLS
});
```

3. **Auth set before subscribe?**
```typescript
await supabase.realtime.setAuth();  // Required
channel.subscribe();
```

4. **RLS policy exists?**
```sql
CREATE POLICY "can_read_broadcasts" ON realtime.messages
FOR SELECT TO authenticated
USING (...);
```

5. **Trigger created?**
```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname LIKE '%broadcast%';
```

### Broadcasts Empty

**Check trigger returns data:**
```sql
-- Trigger must return COALESCE(NEW, OLD)
CREATE OR REPLACE FUNCTION broadcast_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(...);
  RETURN COALESCE(NEW, OLD);  -- Required!
END;
$$ LANGUAGE plpgsql;
```

### Channel Stuck in "joining"

**Solutions:**

1. **Check channel state before subscribing:**
```typescript
if (channelRef.current?.state === 'subscribed') return;
```

2. **Verify auth token is valid:**
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Re-authenticate
}
```

3. **Check RLS policies allow access**

### Connection Limits

**Solutions:**

1. **Cleanup channels properly:**
```typescript
useEffect(() => {
  const channel = supabase.channel('topic');
  // ...subscribe

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

2. **Reuse channels instead of creating new ones**

3. **Implement reconnection with backoff:**
```typescript
let retryCount = 0;

channel.subscribe((status, err) => {
  if (status === 'CHANNEL_ERROR') {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
    setTimeout(() => {
      retryCount++;
      channel.subscribe();
    }, delay);
  }
});
```

---

## Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 23505 | Unique violation | Record already exists - show user message |
| 23503 | Foreign key violation | Referenced record doesn't exist |
| 42501 | Permission denied | Check RLS policies |
| PGRST116 | No rows found | Handle empty state |
| 22P02 | Invalid input syntax | Validate input before query |
| 42P01 | Table doesn't exist | Check table name spelling |
| 28P01 | Invalid password | Wrong credentials |

### Error Handling Pattern

```typescript
const { data, error } = await supabase.from('table').select();

if (error) {
  switch (error.code) {
    case '42501':
      throw new Error('You do not have permission to access this data');
    case 'PGRST116':
      return null;  // No data found
    case '23505':
      throw new Error('This record already exists');
    default:
      console.error('Database error:', error);
      throw error;
  }
}
```

---

## Debug Checklist

### Before Asking for Help

```
□ RLS enabled on table?
□ Policies exist for operation (SELECT/INSERT/UPDATE/DELETE)?
□ Using (SELECT auth.uid()) not auth.uid()?
□ Indexes on policy columns?
□ For Realtime: using broadcast not postgres_changes?
□ For Realtime: private: true and setAuth() called?
□ Trigger exists and returns COALESCE(NEW, OLD)?
□ Check browser console for errors
□ Check Supabase Dashboard logs
```
