# Step 1: Define and Implement Tech Stack

Complete workflow for defining and implementing the project's technology stack based on business requirements and default preferences.

## Workflow

1. **Gather Requirements** (business questions)
2. **Recommend Stack** (based on preferences + requirements)
3. **Confirm with User**
4. **Implement Stack** (install and configure everything)

---

## Default Preferences

### Web Projects

- **Language**: TypeScript
- **Runtime**: React
- **Framework**: Next.js (App Router)
- **UI**: Shadcn + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Storage)
- **State**: TanStack Query + Zustand
- **Deployment**: Vercel
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner or react-hot-toast

### Mobile Projects

- **Language**: TypeScript  
- **Runtime**: React Native
- **Framework**: Expo
- **UI**: Tamagui (preferred)
  - Alternatives: NativeWind, React Native Paper
- **Backend**: Supabase (Database + Auth + Storage)
- **State**: TanStack Query + Zustand
- **Navigation**: Expo Router (file-based)
- **Notifications**: Expo Notifications (always include)
- **Deployment**: EAS Build
- **Forms**: React Hook Form + Zod
- **Date utils**: Day.js

### Web + Mobile (Monorepo)

- **Tool**: Turborepo or nx (decide based on sharing needs)

---

## Requirements Questions

Ask questions in **business language**, NOT technical jargon.

### PRD Inference

**If PRD exists:** Infer answers from PRD and confirm each one with user (saves cognitive load). Only ask directly if insufficient information to infer confidently.

### 5 Core Questions

**1. Platform**
Where will users use this? 
- Web browser/desktop
- Mobile app
- Both

**2. Authentication**
Does each person need their own account? (signup/login)
- Yes
- No

**3. Offline Support**
Does the app need to work without internet?
- No
- Yes - just save locally and sync when connected
- Yes - multiple people can edit same thing (needs conflict resolution)

**4. Realtime Shared Updates**
Do multiple people need to see the same data updating instantly at the same time?

Examples: Google Docs (see others typing), chat (messages appear immediately)

**CRITICAL**: Regardless of answer, EVERYTHING must feel instant via optimistic updates. This question only determines if websockets/subscriptions are needed for cross-user realtime sync.

**5. SEO**
Does the website need to appear in Google search results?
- Important for: landing pages, blogs, public content
- Not needed for: internal tools, apps behind login

### Conditional Questions

**6. If mobile: Visual Style**
What visual style do you prefer?
- Material Design (Google/Android style)
- iOS native look
- Completely custom design

**7. If web + mobile: Code Sharing**
Would you like to share code between web and mobile?
- Yes: More efficient but complex setup (monorepo)
- No: Simpler but potentially duplicate work (separate repos)

---

## Decision Logic

### Platform (Q1)
- **Web only** → Next.js + Vercel
- **Mobile only** → Expo + EAS Build  
- **Both** → Next.js + Expo + (ask Q7 about monorepo)

### Auth (Q2)
- **Yes** → Supabase Auth (signup, login, password reset)
- **No** → Skip auth setup

### Offline (Q3)
- **No** → Standard Supabase queries
- **Yes (simple)** → TanStack Query with persistence
- **Yes (complex conflicts)** → May need specialized sync solution beyond Supabase

### Realtime Shared (Q4)
- **Yes** → Supabase Realtime subscriptions + TanStack Query
- **No** → TanStack Query only (but with optimistic updates for instant feel)

### SEO (Q5)
- **Yes** → Next.js with SSR/SSG (server-side rendering)
- **No** → Next.js client-side or Vite (if web-only app)

### Mobile Visual (Q6)
- **Material Design** → React Native Paper
- **iOS native** → Tamagui  
- **Custom design** → Tamagui or NativeWind

### Code Sharing (Q7)
- **Yes** → Turborepo monorepo
- **No** → Separate repositories

---

## Implementation Checklist

After confirming stack, implement in this order:

### Base Setup
- [ ] Initialize project directory (if empty)
- [ ] Initialize git repository
- [ ] Create package.json with correct package manager (npm/yarn)
- [ ] Install TypeScript + configure tsconfig.json

### Framework Setup
- [ ] Install and configure Next.js (if web)
- [ ] Install and configure Expo (if mobile)
- [ ] Set up folder structure (app/, components/, lib/, etc)

### UI Setup
- [ ] Install UI dependencies (Shadcn, Tailwind, or Tamagui)
- [ ] Configure styling system (tailwind.config, postcss.config)
- [ ] Set up component library structure
- [ ] Configure icons library

### Backend Setup
- [ ] Install Supabase client library
- [ ] Create .env.local with placeholder keys
- [ ] Set up Supabase client configuration
- [ ] Set up auth configuration (if needed)

### State Management
- [ ] Install TanStack Query
- [ ] Configure QueryClient with proper defaults
- [ ] Install Zustand (if needed)
- [ ] Set up providers structure

### Forms & Validation
- [ ] Install React Hook Form + Zod
- [ ] Set up form utilities/helpers

### Development Tools
- [ ] Configure ESLint
- [ ] Configure Prettier (optional)
- [ ] Set up dev scripts (dev, build, start, lint)

### Additional (Mobile)
- [ ] Install Expo Notifications
- [ ] Configure Expo Router
- [ ] Set up app.json with proper config
- [ ] Install Day.js

### Additional (Web)
- [ ] Configure next.config
- [ ] Set up metadata and SEO structure (if needed)
- [ ] Configure Vercel settings

### Testing
- [ ] Run dev server and verify it starts
- [ ] Test hot reload works
- [ ] Verify TypeScript compilation
- [ ] Check all imports resolve correctly

---

## Critical: Instant User Experience

**Every interaction must FEEL instant**, regardless of realtime setup.

### For Personal Data (Workaut-style)
User only sees their own data:

1. User action → UI updates immediately (optimistic)
2. Background: TanStack Query sends to server
3. On success: Keep optimistic update
4. On failure: Revert + show error

### For Shared Realtime Data (Google Docs-style)
Multiple users edit same thing:

1. User action → UI updates immediately (optimistic)
2. Background: Send to server + Supabase Realtime broadcasts to others
3. Others see update via subscription
4. Conflict resolution if needed

### Implementation Pattern

```typescript
// TanStack Query mutation with optimistic update
const mutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['items'] })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['items'])
    
    // Optimistically update to new value
    queryClient.setQueryData(['items'], (old) => [...old, newData])
    
    return { previous }
  },
  onError: (err, newData, context) => {
    // Revert on error
    queryClient.setQueryData(['items'], context.previous)
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['items'] })
  },
})
```

**Requirements:**
- Use TanStack Query mutations with `onMutate` for optimistic updates
- Use `onError` to revert on failure
- Add Supabase Realtime subscriptions only if Q4 answer is "yes"
- Implement cache invalidation strategy for consistency

---

## Example Tech Stack Outputs

### Example 1: Solo Fitness App (Workaut)

**Requirements:**
- Mobile only
- Personal accounts (each user sees only their data)
- Offline support (save workouts, sync when connected)
- No realtime sharing (users don't see each other's data)
- No SEO needed

**Recommended Stack:**
- Expo + React Native + TypeScript
- Tamagui (custom design preference)
- Supabase (auth + database)
- TanStack Query (with persistence) + Zustand
- Expo Router + Expo Notifications
- Day.js
- React Hook Form + Zod
- EAS Build

### Example 2: Task Management Web App (BOLTR)

**Requirements:**
- Web only
- Personal accounts
- Must work online only
- Real-time updates (team sees tasks update live)
- No SEO needed (internal tool)

**Recommended Stack:**
- Next.js + React + TypeScript
- Shadcn + Tailwind CSS
- Supabase (auth + database + realtime)
- TanStack Query + Supabase Realtime + Zustand
- React Hook Form + Zod
- Lucide icons + Sonner
- Vercel

### Example 3: SaaS Landing + App (Web + Mobile)

**Requirements:**
- Both web and mobile
- Personal accounts
- Online only
- No realtime sharing needed
- SEO important (landing page)
- Shared business logic between platforms

**Recommended Stack:**
- Turborepo monorepo
- Apps: Next.js (web) + Expo (mobile)
- Shared: TypeScript packages (utils, types, API client)
- UI: Shadcn + Tailwind (web), Tamagui (mobile)
- Supabase (auth + database)
- TanStack Query + Zustand
- React Hook Form + Zod
- Deployments: Vercel (web) + EAS Build (mobile)

---

## Common Mistakes to Avoid

1. **Over-engineering**: Don't add technologies not needed for actual requirements
2. **Under-specifying optimistic updates**: Every mutation needs optimistic UI updates configured
3. **Forgetting Expo Notifications**: Always include in mobile projects
4. **Mixing UI systems**: Don't combine Mantine with Shadcn, or multiple UI systems
5. **Skipping TypeScript**: Always use TypeScript unless explicitly requested otherwise
6. **Not testing after setup**: Always verify dev server starts and hot reload works
7. **Asking technical questions**: Questions must be in business language
8. **Ignoring PRD**: If PRD exists, infer answers first before asking
