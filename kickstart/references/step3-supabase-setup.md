# Step 3: Supabase Backend Setup

Complete Supabase project creation and configuration. **Only run this step if you chose Supabase in Step 1.**

---

## Overview

This step has **two paths** depending on MCP availability:

### Path A: With MCP (Automated) - 3-5 minutes
If Supabase MCP is connected, the agent can:
- ✅ Create or select projects automatically
- ✅ Execute SQL directly to create tables
- ✅ Generate TypeScript types automatically
- ✅ Configure RLS with SQL execution
- ⚠️ Still need to manually get credentials from dashboard

### Path B: Without MCP (Manual) - 5-10 minutes
Standard setup using Supabase dashboard and CLI:
- Manual project creation via web interface
- Manual credential copying
- Manual SQL execution or CLI commands
- Manual type generation via Supabase CLI

### What Both Paths Cover:
1. Create/select Supabase project
2. Get credentials (URL + Anon Key)
3. Update environment variables
4. Test connection
5. Generate TypeScript types
6. Configure Row Level Security basics

**Start with Step 3.0** to determine which path to follow.

---

## Prerequisites

From Step 2, you should have:
- [ ] Supabase client configured in `lib/supabase.ts`
- [ ] Environment variables structure ready (.env.example)
- [ ] Placeholder environment values

---

## Step 3.0: Check MCP Availability

### Verify Supabase MCP Connection

The Supabase MCP allows automated project management, SQL execution, and type generation.

**Check if connected**:
```bash
# If you see Supabase tools available in your MCP client, you're connected
# Tools to look for: list_projects, create_project, execute_sql, generate_typescript_types
```

### Decision Point

**If Supabase MCP is available** → Follow **Path A: With MCP (Automated)**

**If Supabase MCP is NOT available** → Follow **Path B: Without MCP (Manual)**

### Setup Supabase MCP (if needed)

If not connected, you can set it up:

**For Claude Code / Desktop**:

Add to your MCP configuration (`.claude.json` or Claude Desktop settings):

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

**For Cursor / Windsurf**:

Similar configuration in their respective settings.

**Authentication**:
- MCP will prompt for Supabase login
- Authenticate via browser
- Choose the organization for your projects

**Scoping to specific project** (optional, after project exists):
```
https://mcp.supabase.com/mcp?project_ref=your-project-id
```

**Security Note**: 
- Use with development projects only
- Never connect to production data
- Review all SQL before execution

---

## Path A: With MCP (Automated)

### Step 3.1: List Existing Projects (MCP)

## Path A: With MCP (Automated)

Use Supabase MCP tools to automate the entire setup process.

### Step 3.1A: List Existing Projects

First, check if you already have a Supabase project you want to use:

**Action**: Ask MCP to list your projects
```
"List my Supabase projects"
```

**MCP Tool Used**: `list_projects`

**Review**: 
- If you have a suitable project → Note the project ref and skip to Step 3.2A
- If you need a new project → Continue to create one

### Step 3.2A: Create New Project (Optional)

If you need a new project:

**Action**: Ask MCP to create a project
```
"Create a new Supabase project named [your-project-name] in region [us-east-1/eu-west-1/ap-southeast-1]"
```

**MCP Tools Used**: 
- `get_cost` - Shows estimated cost
- `confirm_cost` - Required confirmation
- `create_project` - Actually creates the project

**Important**: 
- Choose region closest to your users
- Free tier is fine for development
- Wait 2-3 minutes for provisioning

**Result**: You'll get the project ref (ID)

### Step 3.3A: Get Project Credentials

**Action**: Navigate to Supabase dashboard to get credentials
```
1. Go to https://supabase.com/dashboard/project/[your-project-ref]
2. Settings → API
3. Copy:
   - Project URL
   - Anon (public) key
```

**Note**: Credentials must be obtained from dashboard (not available via MCP for security)

### Step 3.4A: Update Environment Variables

Same as Path B - see Step 3.3B below for details.

### Step 3.5A: Create Test Table

**Action**: Ask MCP to create test table
```
"Execute SQL to create a test_connection table with columns: id (int8, primary key), message (text), created_at (timestamptz with default now())"
```

**MCP Tool Used**: `execute_sql`

**Example SQL** (MCP will generate similar):
```sql
CREATE TABLE test_connection (
  id BIGSERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3.6A: Test Connection

Use the same test code from Step 3.4B (see below).

### Step 3.7A: Generate TypeScript Types

**Action**: Ask MCP to generate types
```
"Generate TypeScript types for my database schema and save to types/supabase.ts"
```

**MCP Tool Used**: `generate_typescript_types`

**Result**: File created at `types/supabase.ts` with full type definitions

**Update Supabase Client**: See Step 3.5B for updating `lib/supabase.ts`

### Step 3.8A: Configure RLS

**Action**: Ask MCP to enable RLS and create policies
```
"Execute SQL to:
1. Enable RLS on test_connection table
2. Create policy for public read access
3. Create policy for authenticated users to insert"
```

**MCP Tool Used**: `execute_sql`

**Example SQL** (MCP will generate similar):
```sql
-- Enable RLS
ALTER TABLE test_connection ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read access"
ON test_connection FOR SELECT
USING (true);

-- Authenticated insert
CREATE POLICY "Authenticated insert"
ON test_connection FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### Step 3.9A: Update Documentation

Same as Path B - see Step 3.7B below.

### Path A Complete ✅

With MCP, you've automated:
- Project creation or selection
- Test table creation
- TypeScript type generation
- RLS configuration

**Next**: Proceed to final checklist and Step 4.

---

## Path B: Without MCP (Manual)

Follow these steps if Supabase MCP is not available.

### Step 3.1B: Create Supabase Project

#### Option A: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "bullet-app")
   - **Database Password**: Strong password (save in password manager!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### Option B: Supabase CLI (Advanced)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Initialize project
supabase init

# Link to remote project (after creating via dashboard)
supabase link --project-ref your-project-ref
```

**Recommendation**: Use dashboard for first project. CLI is better for automation/teams.

---

## Step 3.2B: Get Credentials

### From Dashboard

1. In your project, go to **Settings** → **API**
2. Find these values:

**Project URL**:
```
https://your-project-id.supabase.co
```

**Anon (public) key**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Copy both values

### Security Note

- **Anon key**: Safe to use in client (public)
- **Service role key**: NEVER use in client (server-only, can bypass RLS)
- Both are shown in Settings → API

---

## Step 3.3B: Update Environment Variables

### Web (Next.js)

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Update `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Mobile (Expo)

Update `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_APP_SCHEME=yourapp
```

Update `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_APP_SCHEME=yourapp
```

### Important

- Real keys go in `.env.local` / `.env` (git-ignored)
- Example/template goes in `.env.example` (committed)
- Never commit real keys to git

---

## Step 3.4B: Test Connection

### Create Test Table

In Supabase Dashboard:

1. Go to **Table Editor**
2. Click "Create a new table"
3. Name it `test_connection`
4. Add these columns:
   - `id` (int8, primary key, auto-increment)
   - `message` (text)
   - `created_at` (timestamptz, default now())
5. Click "Save"

### Test Query (Web)

Add to your homepage temporarily:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [status, setStatus] = useState<string>('Testing...')
  
  useEffect(() => {
    async function testConnection() {
      try {
        // Try to query the test table
        const { data, error } = await supabase
          .from('test_connection')
          .select('*')
          .limit(1)
        
        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✅ Connected to Supabase!')
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err}`)
      }
    }
    
    testConnection()
  }, [])
  
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Supabase Connection</h1>
        <p className="text-xl">{status}</p>
      </div>
    </main>
  )
}
```

### Test Query (Mobile)

Add to your home screen temporarily:

```typescript
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { supabase } from '@/lib/supabase'

export default function HomeScreen() {
  const [status, setStatus] = useState<string>('Testing...')
  
  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('test_connection')
          .select('*')
          .limit(1)
        
        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✅ Connected to Supabase!')
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err}`)
      }
    }
    
    testConnection()
  }, [])
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  status: {
    fontSize: 18,
  },
})
```

### Run Test

```bash
npm run dev
```

You should see: **✅ Connected to Supabase!**

### Clean Up Test

After confirming connection:
1. Remove test code from homepage
2. Delete `test_connection` table (or keep for later testing)

---

## Step 3.5B: Generate TypeScript Types (Optional)

If you already have a database schema, generate types for better TypeScript support.

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login

```bash
supabase login
```

### Generate Types

```bash
# Get your project ref from dashboard URL
# https://supabase.com/dashboard/project/[project-ref]

supabase gen types typescript --project-id your-project-ref > types/supabase.ts
```

### Update Supabase Client

In `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### Benefits

- Full TypeScript autocomplete for tables
- Compile-time type checking
- Prevents typos in column names
- Better IDE support

### Regenerate Types

Run this command whenever you change your database schema:

```bash
supabase gen types typescript --project-id your-project-ref > types/supabase.ts
```

**Tip**: Add to package.json scripts:

```json
{
  "scripts": {
    "types:supabase": "supabase gen types typescript --project-id your-project-ref > types/supabase.ts"
  }
}
```

---

## Step 3.6B: Row Level Security (RLS) Basics

### Why RLS?

Row Level Security protects your data by enforcing access rules at the database level. Without RLS, anyone with your anon key can read/write ALL data.

### Enable RLS on Tables

In Supabase Dashboard:

1. Go to **Table Editor**
2. Select your table
3. Click on table name → **Edit table**
4. Enable "Row Level Security"
5. Click "Save"

### Create Basic Policies

Example: Public read, authenticated write

```sql
-- Allow anyone to read
CREATE POLICY "Enable read access for all users"
ON your_table FOR SELECT
USING (true);

-- Allow authenticated users to insert their own data
CREATE POLICY "Enable insert for authenticated users"
ON your_table FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Enable update for users based on user_id"
ON your_table FOR UPDATE
USING (auth.uid() = user_id);
```

### Common RLS Patterns

**Public read-only**:
```sql
CREATE POLICY "Public read access"
ON public_content FOR SELECT
USING (true);
```

**User-specific data**:
```sql
CREATE POLICY "Users can only see their own data"
ON user_data FOR ALL
USING (auth.uid() = user_id);
```

**Admin-only**:
```sql
CREATE POLICY "Only admins can modify"
ON admin_table FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin'
);
```

### Testing RLS

After setting up policies, test with:

```typescript
// Should work
const { data } = await supabase
  .from('your_table')
  .select('*')

// Should only return user's data
const { data } = await supabase
  .from('user_data')
  .select('*')
```

### RLS Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Examples](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## Step 3.7B: Update Documentation

### Update docs/tech-stack.md

Add Supabase details:

```markdown
## Backend & Database

### Supabase
- **Project**: [Project Name]
- **Region**: [e.g., us-east-1]
- **Database**: PostgreSQL 15
- **Features Used**:
  - Database (PostgreSQL)
  - Authentication
  - Storage
  - Row Level Security

### Connection
- Client configured in `lib/supabase.ts`
- Environment variables in `.env.local` / `.env`
- TypeScript types generated from schema
```

### Update README.md

Add Supabase setup section:

```markdown
## Supabase Setup

1. Create project at https://supabase.com
2. Copy credentials from Settings → API
3. Update `.env.local` / `.env` with your credentials
4. Test connection: `npm run dev`
5. Generate types (optional): `npm run types:supabase`

See `docs/tech-stack.md` for details.
```

---

## Final Checklist

After completing Step 3 (either Path A or Path B):

**Path Selection:**
- [ ] Identified which path was used (MCP automated or Manual)

**Project Setup:**
- [ ] Supabase project created or selected
- [ ] Credentials obtained (URL + Anon Key)
- [ ] Environment variables updated (.env.local / .env)
- [ ] `.env.example` updated with templates

**Connection & Testing:**
- [ ] Connection tested successfully
- [ ] Test table created (test_connection)
- [ ] Test code removed from homepage

**Type Safety:**
- [ ] TypeScript types generated (automated via MCP or manual via CLI)
- [ ] `lib/supabase.ts` updated with Database type

**Security:**
- [ ] RLS enabled on tables
- [ ] Basic policies created and tested

**Documentation:**
- [ ] `docs/tech-stack.md` updated with Supabase details
- [ ] README.md updated with setup instructions

---

## Common Issues

### MCP-Specific Issues (Path A)

**"MCP server not connected"**
- Verify MCP configuration in settings
- Check authentication to Supabase organization
- Restart MCP client

**"Permission denied" when creating project**
- Ensure you're authenticated to correct organization
- Check organization permissions
- Try manual login at https://supabase.com

**"execute_sql failed"**
- Review SQL syntax
- Check project is fully provisioned
- Verify you have write permissions (not read-only mode)

### General Issues (Both Paths)

### "Invalid API key"
- Check that you copied the **Anon key**, not Service Role key
- Verify no extra spaces in .env file
- Check correct environment variable prefix (NEXT_PUBLIC_ / EXPO_PUBLIC_)

### "Could not connect to Supabase"
- Verify project URL is correct
- Check project is fully provisioned (dashboard shows green)
- Restart dev server after updating .env

### "Row Level Security: new row violates policy"
- RLS is enabled but no policies exist
- Create appropriate policies or disable RLS during development
- Check auth.uid() matches user_id in your data

### TypeScript errors after generating types
- Ensure Database type is imported in supabase.ts
- Check types/supabase.ts was created successfully
- Restart TypeScript server in IDE

---

## Next Steps

With Supabase configured, you can now:

✅ **Create database schema** - Design your tables
✅ **Set up authentication** - Add sign up/sign in
✅ **Configure storage** - For file uploads
✅ **Write queries** - Use with TanStack Query (from Step 2)

**Proceed to Step 4: Style Guide** to define your app's visual identity.

---

## Additional Resources

**Supabase General:**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Design Guide](https://supabase.com/docs/guides/database/design)
- [Auth Deep Dive](https://supabase.com/docs/guides/auth)

**Supabase MCP:**
- [MCP Server Overview](https://supabase.com/features/mcp-server)
- [MCP Setup Guide](https://supabase.com/docs/guides/getting-started/mcp)
- [MCP GitHub Repository](https://github.com/supabase-community/supabase-mcp)
- [MCP Security Best Practices](https://supabase.com/docs/guides/getting-started/mcp#security-risks)
