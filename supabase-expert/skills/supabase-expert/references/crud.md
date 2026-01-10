# CRUD Operations

## Table of Contents
- [Select](#select)
- [Insert](#insert)
- [Update](#update)
- [Delete](#delete)
- [Filters](#filters)
- [Joins](#joins)
- [Ordering & Pagination](#ordering--pagination)
- [RPC Functions](#rpc-functions)

---

## Select

```typescript
// All records
const { data, error } = await supabase
  .from('users')
  .select('*');

// Specific columns
const { data, error } = await supabase
  .from('users')
  .select('id, name, email')
  .eq('id', userId)
  .single();
```

---

## Insert

```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    name: 'John Doe',
    email: 'john@example.com'
  })
  .select()
  .single();

// Bulk insert
const { data, error } = await supabase
  .from('users')
  .insert([
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ])
  .select();
```

---

## Update

```typescript
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane Doe' })
  .eq('id', userId)
  .select()
  .single();
```

---

## Delete

```typescript
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

---

## Filters

```typescript
// Equality
.eq('status', 'active')
.neq('status', 'deleted')

// Comparison
.gt('age', 18)
.gte('age', 18)
.lt('age', 65)
.lte('age', 65)

// Pattern matching
.like('name', '%John%')
.ilike('email', '%@gmail.com')  // case insensitive

// Array
.in('status', ['active', 'pending'])

// Null checks
.is('deleted_at', null)
.not('deleted_at', 'is', null)

// OR conditions
.or('status.eq.active,status.eq.pending')
```

---

## Joins

```typescript
// Simple join (1-2 tables)
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(name, email),
    comments(count)
  `)
  .eq('status', 'published');

// Nested joins
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(name, email),
    tags:post_tags(tag:tags(id, name))
  `);
```

---

## Ordering & Pagination

```typescript
// Ordering
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// Pagination with range
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .range(0, 9);  // First 10 records

// With count
const { data, error, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range(0, 9);
```

---

## RPC Functions

### When to Use RPC

```
✅ Query involves 3+ tables
✅ Need conditional logic in DB
✅ Critical performance (avoid multiple roundtrips)
✅ Complex atomic operations

❌ Avoid for simple queries (1-2 tables)
❌ Avoid when logic can stay in app
```

### Create RPC Function

```sql
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param UUID)
RETURNS TABLE (
  post_count INT,
  comment_count INT,
  total_likes INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INT FROM posts WHERE author_id = user_id_param),
    (SELECT COUNT(*)::INT FROM comments WHERE user_id = user_id_param),
    (SELECT COALESCE(SUM(likes), 0)::INT FROM posts WHERE author_id = user_id_param);
END;
$$ LANGUAGE plpgsql;
```

### Call RPC Function

```typescript
const { data, error } = await supabase
  .rpc('get_user_stats', { user_id_param: userId });
```

### RPC with Complex Return

```sql
CREATE OR REPLACE FUNCTION search_posts(
  search_term TEXT,
  category_filter UUID DEFAULT NULL
)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM posts p
  WHERE
    (p.title ILIKE '%' || search_term || '%' OR p.content ILIKE '%' || search_term || '%')
    AND (category_filter IS NULL OR p.category_id = category_filter)
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```
