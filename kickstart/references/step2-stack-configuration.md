# Step 2: Stack Configuration (Index)

Complete configuration of installed tech stack. This step is **modular** - read only the files relevant to your tech stack choices from Step 1.

## How to Use This Step

1. **Start here** - Read this index to understand the process
2. **Read overview** - Always read `step2/overview.md` first for universal setup
3. **Identify your needs** - Use the decision matrix below
4. **Read specific files** - Only read configuration files for technologies you chose
5. **Implement in order** - Follow the sequence in each file
6. **Test everything** - Verify all configurations before Step 3

---

## Quick Navigation

### Universal (Read First)
- **[overview.md](step2/overview.md)** - Folder structure, TypeScript, Git, Environment variables, Documentation

### Framework-Specific (Choose One)
- **[nextjs.md](step2/nextjs.md)** - Next.js 15 with App Router
- **[expo.md](step2/expo.md)** - Expo with Expo Router

### UI System (Choose One)
- **[tailwind.md](step2/tailwind.md)** - Tailwind CSS + Shadcn (web)
- **[tamagui.md](step2/tamagui.md)** - Tamagui (mobile)

### Backend (If Using)
- **[supabase-client.md](step2/supabase-client.md)** - Supabase client setup

### State Management (Always Read)
- **[state-management.md](step2/state-management.md)** - TanStack Query + Zustand

---

## Decision Matrix

Based on Step 1 tech stack, read these files in order:

### Example 1: Next.js + Shadcn + Supabase

1. `overview.md` (universal setup)
2. `nextjs.md` (framework)
3. `tailwind.md` (UI system)
4. `supabase-client.md` (backend)
5. `state-management.md` (state)

### Example 2: Expo + Tamagui + Supabase

1. `overview.md` (universal setup)
2. `expo.md` (framework)
3. `tamagui.md` (UI system)
4. `supabase-client.md` (backend)
5. `state-management.md` (state)

### Example 3: Next.js + No Backend

1. `overview.md` (universal setup)
2. `nextjs.md` (framework)
3. `tailwind.md` (UI system)
4. `state-management.md` (state only - no Supabase)

---

## What This Step Covers

### Universal Configuration (overview.md)
- Folder structure (web vs mobile differences)
- TypeScript configuration
- Git setup (.gitignore)
- Environment variables structure
- Documentation files (tech-stack.md, README.md)
- Universal testing checklist

### Framework Configuration
- Framework-specific config files
- Routing setup
- Layout structure
- Scripts and tooling
- Development server setup

### UI System Configuration
- Styling system setup
- Component library integration
- Theme configuration
- Dark mode support
- Utility functions

### Backend Configuration
- Client library setup
- Environment variable structure
- Helper functions (auth, storage, queries)
- React Query integration patterns
- Realtime subscriptions (if needed)

### State Management Configuration
- QueryClient setup with optimal defaults
- Provider configuration
- Store creation patterns
- Optimistic update strategies
- Best practices for server vs client state

---

## What This Step Does NOT Cover

- **Creating Supabase project** - That's Step 3
- **Actual component development** - That's post-setup
- **Database schema** - That's Step 3
- **Deployment setup** - That's Step 6/7
- **Adding Shadcn components** - Just the base config, components added during dev

---

## Implementation Order

Follow this sequence:

1. **Universal Setup** (overview.md)
   - Create folder structure
   - Configure TypeScript
   - Setup Git
   - Create environment files
   - Create documentation

2. **Framework Setup** (nextjs.md / expo.md)
   - Framework configuration files
   - Root layout
   - Basic routing structure
   - Development scripts

3. **UI System Setup** (tailwind.md / tamagui.md)
   - Styling configuration
   - Theme setup
   - Utility functions
   - Component structure

4. **Backend Client Setup** (supabase-client.md)
   - Client library configuration
   - Helper functions
   - Query patterns
   - Environment structure

5. **State Management Setup** (state-management.md)
   - QueryClient configuration
   - Provider setup
   - Store examples
   - Optimistic update patterns

6. **Testing & Verification**
   - Run dev server
   - Test hot reload
   - Verify TypeScript
   - Check imports
   - Test basic functionality

---

## Critical Principles

1. **Progressive Implementation**: Implement one layer at a time, test before moving on
2. **No Premature Optimization**: Start with defaults, optimize later if needed
3. **Instant UX**: Configure optimistic updates from the start (state-management.md)
4. **Documentation First**: Create docs/ files before writing code
5. **Test Everything**: Each section has testing guidelines - follow them

---

## Common Questions

**Q: Do I need to read all files?**
A: No. Only read files for technologies you chose in Step 1.

**Q: What if I'm not using Supabase?**
A: Skip `supabase-client.md`. State management still applies.

**Q: Can I use different UI libraries?**
A: These guides cover the most common choices. For others, adapt the patterns.

**Q: What about Vite instead of Next.js?**
A: Currently only Next.js and Expo are covered. Vite guide coming soon.

**Q: When do I add actual components?**
A: After Step 2 is complete and tested. This step is just configuration.

---

## After Step 2

Once all configurations are complete and tested:

✓ Folder structure created  
✓ TypeScript configured  
✓ Framework configured  
✓ UI system configured  
✓ Client libraries configured  
✓ State management configured  
✓ Documentation created  
✓ Dev server running  
✓ Hot reload working  

→ **Proceed to Step 3: Backend Setup** (create actual Supabase project, add real keys)

---

## Troubleshooting

**Dev server won't start**:
- Check package.json scripts
- Verify all dependencies installed
- Check for TypeScript errors

**Imports not resolving**:
- Check tsconfig.json path aliases
- Verify folder structure matches configuration
- Restart dev server

**TypeScript errors**:
- Run `npm run type-check`
- Check tsconfig.json configuration
- Verify all required types are installed

**Styling not working**:
- Check CSS import in root layout
- Verify Tailwind/Tamagui configuration
- Check PostCSS config (if web)

---

## Need Help?

- Review the specific configuration file for your technology
- Check the testing section in each file
- Verify you followed the implementation order
- Ensure previous steps are complete
