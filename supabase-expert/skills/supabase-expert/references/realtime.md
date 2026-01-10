# Realtime (Broadcast Pattern)

> **CRITICAL: Use `broadcast` instead of `postgres_changes`**
>
> `postgres_changes` is single-threaded and doesn't scale.
> Use `broadcast` with database triggers for all database change notifications.

## Table of Contents
- [Core Principles](#core-principles)
- [Naming Conventions](#naming-conventions)
- [Setup Pattern](#setup-pattern)
- [Database Triggers](#database-triggers)
- [RLS for Private Channels](#rls-for-private-channels)
- [Presence Tracking](#presence-tracking)
- [Framework Patterns](#framework-patterns)
- [Performance & Scaling](#performance--scaling)
- [Migration from postgres_changes](#migration-from-postgres_changes)
- [When to Use Realtime vs Polling](#when-to-use-realtime-vs-polling)

---

## Core Principles

1. **ALWAYS use `broadcast`** instead of `postgres_changes`
2. **Use dedicated topics** - never global topics
3. **Private channels by default** - `private: true` for all database-triggered channels
4. **Call setAuth() before subscribe** - required for private channels

---

## Naming Conventions

### Topics: `scope:entity:id`

```
✅ room:123:messages
✅ user:456:notifications
✅ org:789:alerts
❌ global-messages
❌ all-notifications
```

### Events: `entity_action` (snake_case)

```
✅ message_created
✅ user_joined
✅ status_updated
❌ MessageCreated
❌ userJoin
```

---

## Setup Pattern

```typescript
const supabase = getSupabaseClient();

// 1. Create channel with proper config
const channel = supabase.channel('room:123:messages', {
  config: {
    broadcast: {
      self: true,   // Receive own broadcasts
      ack: true     // Delivery confirmation
    },
    private: true   // Required for RLS
  }
});

// 2. Setup auth BEFORE subscribe
await supabase.realtime.setAuth();

// 3. Register handlers
channel
  .on('broadcast', { event: 'message_created' }, (payload) => {
    console.log('New message:', payload);
  })
  .on('broadcast', { event: 'message_updated' }, (payload) => {
    console.log('Updated message:', payload);
  })
  .on('broadcast', { event: 'message_deleted' }, (payload) => {
    console.log('Deleted message:', payload);
  })
  .subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      console.log('Connected to channel');
    }
    if (status === 'CHANNEL_ERROR') {
      console.error('Channel error:', err);
    }
  });

// 4. Cleanup (required)
supabase.removeChannel(channel);
```

---

## Database Triggers

### Generic Broadcast Trigger

```sql
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

CREATE TRIGGER posts_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION notify_table_changes();
```

### Scoped Broadcast (Room/User)

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
CREATE OR REPLACE FUNCTION notify_significant_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only broadcast if status changed
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

### Manual Broadcast (Custom Events)

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
  '{"start": "2024-01-01T00:00:00Z"}'::jsonb
);
```

---

## RLS for Private Channels

**Required for `private: true` to work:**

```sql
-- Policy for reading broadcasts
CREATE POLICY "room_members_can_read_broadcasts" ON realtime.messages
FOR SELECT TO authenticated
USING (
  topic LIKE 'room:%:messages' AND
  EXISTS (
    SELECT 1 FROM room_members
    WHERE user_id = auth.uid()
    AND room_id = SPLIT_PART(topic, ':', 2)::uuid
  )
);

-- Index (required for performance)
CREATE INDEX idx_room_members_user_room ON room_members(user_id, room_id);
```

### Personal Notifications Pattern

```sql
CREATE POLICY "users_read_own_notifications" ON realtime.messages
FOR SELECT TO authenticated
USING (
  topic LIKE 'user:%:notifications' AND
  SPLIT_PART(topic, ':', 2)::uuid = auth.uid()
);
```

---

## Presence Tracking

```typescript
const channel = supabase.channel('room:123:presence', {
  config: { private: true }
});

// Track presence
await channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      user_id: userId,
      username: 'Alice',
      status: 'online',
      last_seen: new Date().toISOString()
    });
  }
});

// Listen to presence changes
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  console.log('Online users:', Object.values(state));
});

channel.on('presence', { event: 'join' }, ({ newPresences }) => {
  console.log('User joined:', newPresences);
});

channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
  console.log('User left:', leftPresences);
});

// Untrack
await channel.untrack();
```

---

## Framework Patterns

### React Hook

```typescript
import { useEffect, useRef } from 'react';

function useRealtimeChannel(topic: string, handlers: Record<string, Function>) {
  const channelRef = useRef<any>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (channelRef.current?.state === 'subscribed') return;

    const channel = supabase.channel(topic, {
      config: { private: true, broadcast: { self: true, ack: true } }
    });
    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      Object.entries(handlers).forEach(([event, handler]) => {
        channel.on('broadcast', { event }, handler);
      });

      channel.subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') console.error('Error:', err);
      });
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [topic]);

  return channelRef.current;
}

// Usage
function ChatRoom({ roomId }: { roomId: string }) {
  const channel = useRealtimeChannel(`room:${roomId}:messages`, {
    message_created: (payload) => console.log('New:', payload),
    message_updated: (payload) => console.log('Updated:', payload),
  });

  return <div>...</div>;
}
```

### Next.js App Router Provider

```typescript
'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

const RealtimeContext = createContext<any>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const channelRef = useRef<any>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const setup = async () => {
      if (channelRef.current?.state === 'subscribed') return;

      const channel = supabase.channel(`room:${params.id}`, {
        config: { private: true }
      });
      channelRef.current = channel;

      await supabase.realtime.setAuth();
      await channel.subscribe();
    };

    setup();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [params.id]);

  return (
    <RealtimeContext.Provider value={channelRef.current}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtimeChannel = () => useContext(RealtimeContext);
```

---

## Performance & Scaling

### Topic Sharding

```typescript
// Shard by user ID
const shardId = userId % 10;
const channel = supabase.channel(`notifications:shard:${shardId}`);

// Shard by region
const channel = supabase.channel(`events:region:${region}`);
```

### Optimize Payloads

```typescript
// ❌ Avoid: entire objects
payload: entireUserObject  // 10KB

// ✅ Prefer: only changes
payload: { id: userId, changes: { status: 'online' } }  // 100 bytes
```

### Debounce High-Frequency Updates

```typescript
import { debounce } from 'lodash';

const sendTypingStatus = debounce((isTyping) => {
  channel.send({
    type: 'broadcast',
    event: 'typing_status',
    payload: { userId, isTyping }
  });
}, 300);
```

### Batching

```typescript
class MessageQueue {
  private queue: any[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private channel: any,
    private maxBatchSize = 10,
    private flushInterval = 100
  ) {}

  send(event: string, payload: any) {
    this.queue.push({ event, payload });

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.queue.length === 0) return;

    this.channel.send({
      type: 'broadcast',
      event: 'batch_update',
      payload: this.queue
    });

    this.queue = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
```

---

## Migration from postgres_changes

### Before (DON'T USE)

```typescript
// ❌ Old pattern - single-threaded, doesn't scale
const channel = supabase.channel('db-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages',
    filter: `room_id=eq.${roomId}`
  }, handler)
  .subscribe();
```

### After (USE THIS)

**1. Create database trigger:**

```sql
CREATE OR REPLACE FUNCTION broadcast_messages_changes()
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

CREATE TRIGGER messages_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION broadcast_messages_changes();
```

**2. Create RLS policies:**

```sql
CREATE POLICY "can_read_room_broadcasts" ON realtime.messages
FOR SELECT TO authenticated
USING (
  topic LIKE 'room:%:messages' AND
  auth.uid() IN (
    SELECT user_id FROM room_members
    WHERE room_id = SPLIT_PART(topic, ':', 2)::uuid
  )
);

CREATE INDEX idx_room_members_lookup ON room_members(user_id, room_id);
```

**3. Update client code:**

```typescript
// ✅ New pattern - multi-threaded, scalable
const channel = supabase.channel(`room:${roomId}:messages`, {
  config: { private: true }
})
  .on('broadcast', { event: 'message_created' }, (payload) => {
    console.log('New message:', payload.new);
  })
  .on('broadcast', { event: 'message_updated' }, (payload) => {
    console.log('Updated message:', payload.new);
  })
  .on('broadcast', { event: 'message_deleted' }, (payload) => {
    console.log('Deleted message:', payload.old);
  })
  .subscribe();
```

---

## When to Use Realtime vs Polling

### Use Realtime (broadcast)

```
✅ Critical real-time updates (chat, notifications)
✅ Multiple clients need to sync
✅ Presence tracking needed
✅ Bidirectional interactions (client ↔ client)
```

### Use Polling (REST)

```
✅ Updates can have delay (30s+ acceptable)
✅ Simpler implementation
✅ Few simultaneous clients
✅ Rarely changing data
```

### Polling Example

```typescript
let lastTimestamp = new Date().toISOString();

setInterval(async () => {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .gt('updated_at', lastTimestamp)
    .order('updated_at', { ascending: true });

  if (data?.length) {
    console.log('New changes:', data);
    lastTimestamp = data[data.length - 1].updated_at;
  }
}, 30000);
```

---

## Implementation Checklist

```
✅ Use broadcast (not postgres_changes)
✅ Dedicated topics per room/user/entity
✅ Configure private: true
✅ Create database triggers
✅ Implement RLS policies
✅ Create indexes for policies
✅ Implement cleanup/unsubscribe
✅ Check state before subscribe
✅ Follow naming conventions
✅ Configure auth with setAuth()
```
