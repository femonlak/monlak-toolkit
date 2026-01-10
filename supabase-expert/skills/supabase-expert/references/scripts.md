# SQL Scripts & CLI Reference

## Table of Contents
- [Database Triggers](#database-triggers)
- [Debug & Monitoring](#debug--monitoring)
- [Migration Helpers](#migration-helpers)
- [CLI/Bash Reference](#clibash-reference)

---

## Database Triggers

### Generic Broadcast Trigger

```sql
-- Reusable function for any table
CREATE OR REPLACE FUNCTION notify_table_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    TG_TABLE_NAME || ':' || COALESCE(NEW.id, OLD.id)::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to table
CREATE TRIGGER posts_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION notify_table_changes();
```

### Scoped Broadcast (Room-based)

```sql
CREATE OR REPLACE FUNCTION room_messages_broadcast()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'room:' || COALESCE(NEW.room_id, OLD.room_id)::text || ':messages',
    TG_OP,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'message_created'
      WHEN TG_OP = 'UPDATE' THEN 'message_updated'
      WHEN TG_OP = 'DELETE' THEN 'message_deleted'
    END,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER messages_room_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION room_messages_broadcast();
```

### Conditional Broadcast

```sql
-- Only broadcast significant changes
CREATE OR REPLACE FUNCTION notify_significant_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM realtime.broadcast_changes(
      'entity:' || NEW.id::text || ':status',
      TG_OP,
      'status_changed',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Version + Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_version_and_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_version
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_version_and_timestamp();
```

### Custom Event Broadcast

```sql
CREATE OR REPLACE FUNCTION notify_custom_event(
  topic text,
  event text,
  payload jsonb
)
RETURNS void AS $$
BEGIN
  PERFORM realtime.send(topic, event, payload, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage
SELECT notify_custom_event(
  'system:alerts',
  'maintenance_scheduled',
  '{"start": "2024-01-01T00:00:00Z", "duration": "2h"}'::jsonb
);
```

---

## Debug & Monitoring

### Check Active Connections

```sql
SELECT count(*) FROM pg_stat_activity
WHERE application_name LIKE '%realtime%';
```

### Find Slow RLS Queries

```sql
SELECT
  query,
  total_time,
  mean_time,
  calls
FROM pg_stat_statements
WHERE query LIKE '%realtime.messages%'
ORDER BY mean_time DESC
LIMIT 10;
```

### Analyze Policy Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM realtime.messages
WHERE topic = 'room:123:messages'
AND EXISTS (
  SELECT 1 FROM room_members
  WHERE user_id = auth.uid()
  AND room_id = '123'
);
```

### Check Existing Indexes

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('room_members', 'posts', 'users');
```

### Table Size and Row Count

```sql
SELECT
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### Unused Indexes

```sql
SELECT
  indexrelname AS index_name,
  relname AS table_name,
  idx_scan AS times_used
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Migration Helpers

### Safe Feature Flag for Broadcast Rollout

```sql
-- Trigger with feature flag for gradual rollout
CREATE OR REPLACE FUNCTION safe_broadcast()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('app.enable_broadcast', true) = 'true' THEN
    PERFORM realtime.broadcast_changes(
      TG_TABLE_NAME || ':' || COALESCE(NEW.id, OLD.id)::text,
      TG_OP,
      TG_OP,
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable/disable
SET app.enable_broadcast = 'true';   -- Enable
SET app.enable_broadcast = 'false';  -- Disable
```

### Add Missing Indexes

```sql
-- Add index if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_posts_user_id'
  ) THEN
    CREATE INDEX idx_posts_user_id ON posts(user_id);
  END IF;
END $$;
```

### Batch Update with Progress

```sql
DO $$
DECLARE
  batch_size INT := 1000;
  total_rows INT;
  processed INT := 0;
BEGIN
  SELECT COUNT(*) INTO total_rows FROM posts WHERE migrated = false;

  WHILE processed < total_rows LOOP
    UPDATE posts
    SET migrated = true, updated_at = now()
    WHERE id IN (
      SELECT id FROM posts
      WHERE migrated = false
      LIMIT batch_size
    );

    processed := processed + batch_size;
    RAISE NOTICE 'Processed % of % rows', processed, total_rows;
    COMMIT;
  END LOOP;
END $$;
```

---

## CLI/Bash Reference

### Environment Setup

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-anon-or-service-key"
```

### REST API Helpers

```bash
# GET request
supabase_get() {
  curl -s -X GET \
    "${SUPABASE_URL}${1}" \
    -H "apikey: ${SUPABASE_KEY}"
}

# POST request
supabase_post() {
  curl -s -X POST \
    "${SUPABASE_URL}${1}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -d "${2}"
}
```

### Common Operations

```bash
# List all posts
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/posts?select=*" \
  -H "apikey: ${SUPABASE_KEY}"

# Filter by status
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/posts?status=eq.published&select=*" \
  -H "apikey: ${SUPABASE_KEY}"

# Insert record
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/posts" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Post", "content": "Content here"}'
```

### Authentication

```bash
# Login
response=$(curl -s -X POST \
  "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

# Extract token
access_token=$(echo "$response" | jq -r '.access_token')

# Authenticated request
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/posts?select=*" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${access_token}"
```

### WebSocket (Realtime) Debug

```bash
# Install websocat
brew install websocat  # macOS

# Connect to Realtime
WS_URL=$(echo "$SUPABASE_URL" | sed 's/https:/wss:/')

websocat "${WS_URL}/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0"
```

### Generate Types

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/types/database.ts
```
