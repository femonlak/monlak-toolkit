# Authentication

## Table of Contents
- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [Sign Out](#sign-out)
- [Get Current User](#get-current-user)
- [Update User](#update-user)
- [Password Recovery](#password-recovery)
- [Session Management](#session-management)
- [Admin Operations](#admin-operations)

---

## Sign Up

### Standard Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
```

### Auto-confirm (Service Role)

```typescript
const serviceClient = getSupabaseServiceClient();

const { data, error } = await serviceClient.auth.admin.createUser({
  email: 'user@example.com',
  password: 'securepassword123',
  email_confirm: true,
  user_metadata: {
    first_name: 'John',
    last_name: 'Doe'
  }
});
```

---

## Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123'
});

// Extract tokens
const { access_token, refresh_token, user } = data.session;
```

---

## Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

---

## Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // User not authenticated
}
```

---

## Update User

### Update Metadata

```typescript
const { data, error } = await supabase.auth.updateUser({
  data: {
    first_name: 'Jane',
    avatar_url: 'https://example.com/avatar.jpg'
  }
});
```

### Update Email

```typescript
const { data, error } = await supabase.auth.updateUser({
  email: 'newemail@example.com'
});
```

### Update Password

```typescript
const { data, error } = await supabase.auth.updateUser({
  password: 'newsecurepassword123'
});
```

---

## Password Recovery

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password'
  }
);
```

---

## Session Management

### Token Lifespan
- Access token: 1 hour (default)
- Refresh token: 30 days (default)

### Web Apps (Next.js, React)

Use `@supabase/ssr` - manages tokens automatically.

### CLI/Scripts

```typescript
// Store tokens after login
const { data: { session } } = await supabase.auth.signInWithPassword({...});

// Use tokens in subsequent requests
const supabase = createClient(url, anonKey, {
  global: {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  }
});

// Refresh token before expiry
const { data, error } = await supabase.auth.refreshSession();
```

---

## Admin Operations

**Requires Service Role Key**

### List All Users

```typescript
const serviceClient = getSupabaseServiceClient();

const { data: { users }, error } = await serviceClient.auth.admin.listUsers();
```

### Get User by ID

```typescript
const { data: { user }, error } = await serviceClient.auth.admin.getUserById(userId);
```

### Update User (Admin)

```typescript
const { data: { user }, error } = await serviceClient.auth.admin.updateUserById(
  userId,
  {
    email: 'updated@example.com',
    user_metadata: { role: 'admin' }
  }
);
```

### Delete User

```typescript
const { error } = await serviceClient.auth.admin.deleteUser(userId);
```
