# Service Layer Pattern

## Table of Contents
- [Structure](#structure)
- [Service Pattern](#service-pattern)
- [Error Handling](#error-handling)
- [Next.js Integration](#nextjs-integration)

---

## Structure

### Recommended File Organization

```
src/
  services/
    userService.ts
    postService.ts
    orderService.ts
  lib/
    supabase.ts
    errors.ts
```

One file per domain. Keep it simple - no complex class hierarchies.

---

## Service Pattern

### Simple Service (Recommended)

```typescript
// services/userService.ts
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase';

export const userService = {
  // Standard operations (with RLS)
  async getUser(userId: string) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Error fetching user: ${error.message}`);
    return data;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Error updating user: ${error.message}`);
    return data;
  },

  // Admin operations (with Service Role)
  async getAllUsers() {
    const supabase = getSupabaseServiceClient();

    console.log('[Service Role] Fetching all users');

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw new Error(`Error fetching users: ${error.message}`);
    return data;
  },

  async deleteUser(userId: string) {
    const supabase = getSupabaseServiceClient();

    console.log('[Service Role] Deleting user:', userId);

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw new Error(`Error deleting user: ${error.message}`);
  }
};
```

### Service with Optimistic UI

```typescript
// services/taskService.ts
import { getSupabaseClient } from '@/lib/supabase';

const generateClientTxId = () =>
  `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const taskService = {
  async createTask(input: CreateTaskInput) {
    const supabase = getSupabaseClient();
    const client_tx_id = generateClientTxId();

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, client_tx_id })
      .select()
      .single();

    if (error) throw new Error(`Error creating task: ${error.message}`);
    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>, expectedVersion: number) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('version', expectedVersion)  // Optimistic locking
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Version conflict - please refresh');
      }
      throw new Error(`Error updating task: ${error.message}`);
    }

    return data;
  }
};
```

---

## Error Handling

### Simple Error Helper

```typescript
// lib/errors.ts
export function handleSupabaseError(error: any, context?: string): never {
  const message = context
    ? `${context}: ${error.message}`
    : error.message;

  console.error('[Supabase Error]', message, error);
  throw new Error(message);
}
```

### Service with Error Handling

```typescript
// services/postService.ts
import { handleSupabaseError } from '@/lib/errors';

export const postService = {
  async getPost(postId: string) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(name, avatar_url),
        comments(count)
      `)
      .eq('id', postId)
      .single();

    if (error) handleSupabaseError(error, 'Fetching post');
    return data;
  }
};
```

---

## Next.js Integration

### Server Actions

```typescript
// app/actions/userActions.ts
'use server';

import { userService } from '@/services/userService';
import { revalidatePath } from 'next/cache';

export async function getUserProfile(userId: string) {
  try {
    const user = await userService.getUser(userId);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const updates = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
    };

    const user = await userService.updateUser(userId, updates);

    revalidatePath(`/profile/${userId}`);

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Server Component

```typescript
// app/profile/[id]/page.tsx
import { userService } from '@/services/userService';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await userService.getUser(params.id);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

### Client Component with TanStack Query

```typescript
// components/UserProfile.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export function UserProfile({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId)
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<User>) =>
      userService.updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
        Update
      </button>
    </div>
  );
}
```
