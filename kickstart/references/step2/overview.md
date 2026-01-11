# Step 2 Overview: Stack Configuration

Universal configuration guide that adapts based on tech stack choices from Step 1.

## How This Works

1. Read this overview for universal setup (folders, TypeScript, Git)
2. Based on Step 1 choices, read specific configuration files:
   - **Framework**: nextjs.md OR vite.md OR expo.md
   - **UI System**: tailwind.md OR tamagui.md
   - **Backend**: supabase-client.md (if using Supabase)
   - **State**: state-management.md (TanStack Query + Zustand)

3. Implement all configurations in order
4. Test everything before proceeding to Step 3

---

## Decision Matrix

Based on Step 1 tech stack, read these files:

### Web Projects
| Choice | Files to Read |
|--------|---------------|
| Next.js + Shadcn/Tailwind + Supabase | overview.md → nextjs.md → tailwind.md → supabase-client.md → state-management.md |
| Next.js + other UI + Supabase | overview.md → nextjs.md → [ui-system].md → supabase-client.md → state-management.md |
| Vite + Shadcn/Tailwind + Supabase | overview.md → vite.md → tailwind.md → supabase-client.md → state-management.md |

### Mobile Projects
| Choice | Files to Read |
|--------|---------------|
| Expo + Tamagui + Supabase | overview.md → expo.md → tamagui.md → supabase-client.md → state-management.md |
| Expo + NativeWind + Supabase | overview.md → expo.md → tailwind.md → supabase-client.md → state-management.md |
| Expo + React Native Paper + Supabase | overview.md → expo.md → supabase-client.md → state-management.md |

### Monorepo (Web + Mobile)
Read both web and mobile files as needed, plus additional monorepo setup.

---

## Universal Folder Structure

### Always Create These Folders

```
project-name/
├── .claude/             # Claude Code settings
│   └── settings.json    # Project-specific permissions (usually empty)
├── docs/                # Project documentation
│   └── tech-stack.md    # Complete tech stack description
├── prd/                 # Product requirements documents
├── .env.example         # Environment template
└── .gitignore
```

### Web-Specific Base Structure

```
project-name/
├── src/                 # All source code
│   ├── app/            # Routing (Next.js) or pages/routes (Vite)
│   ├── components/     # Reusable components
│   │   ├── ui/        # Base UI components
│   │   ├── layout/    # Header, Footer, Sidebar
│   │   └── features/  # Feature-specific components
│   ├── lib/           # Third-party configs
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   ├── stores/        # State stores (if Zustand)
│   ├── utils/         # Helper functions
│   └── styles/        # Global styles
├── public/            # Static assets
├── docs/
├── prd/
```

### Mobile-Specific Base Structure

```
project-name/
├── app/               # Expo Router (no src/ folder)
│   ├── _layout.tsx
│   └── index.tsx
├── components/
│   ├── ui/
│   └── features/
├── lib/              # Configs
├── hooks/
├── types/
├── stores/
├── utils/
├── constants/        # Mobile-specific (colors, sizes, texts)
├── assets/           # Images, fonts, icons
├── docs/
├── prd/
```

### Key Differences

| Aspect | Web (Next.js/Vite) | Mobile (Expo) |
|--------|-------------------|---------------|
| Root folder | Uses `src/` | No `src/`, app at root |
| Static assets | `public/` | `assets/` |
| Constants | Optional | Always create `constants/` |
| Layout components | `components/layout/` | Not needed (use app layouts) |

---

## Claude Code Settings Configuration

### Settings Hierarchy

Claude Code uses 3 levels of settings (highest precedence first):

1. `.claude/settings.local.json` - Project, personal, git-ignored
2. `.claude/settings.json` - Project, shared, committed to git
3. `~/.claude/settings.json` - Global, all your projects

### Strategy

**Global settings** (`~/.claude/settings.json`):
- Universal permissions you want in ALL projects
- Personal configuration
- Step 2 ensures this exists with standard permissions

**Project settings** (`.claude/settings.json`):
- Only create if project needs SPECIFIC permissions
- Example: Project uses Docker → add `Bash(docker:*)`
- Example: Project uses Python → add `Bash(python:*)`
- Committed to git, team uses same permissions

### Standard Permissions (Global)

These permissions are added to `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(mkdir:*)",
      "Bash(go:*)",
      "Write(*)",
      "Bash(ls:*)",
      "Bash(git:*)",
      "Update(*:*)",
      "Bash(mv:*)",
      "Bash(echo:*)",
      "Bash(sed:*)",
      "Bash(source:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(pkill:*)",
      "Bash(touch:*)",
      "Bash(grep:*)",
      "Bash(deadcode:*)",
      "Bash(sqlite3:*)",
      "Bash(curl:*)",
      "Bash(rg:*)",
      "Bash(chmod:*)",
      "Bash(lsof:*)",
      "Bash(make:*)",
      "Bash(PORT=:*)",
      "Bash(find:*)",
      "Bash(docker:*)",
      "Bash(poetry:*)",
      "Bash(python:*)",
      "Bash(python3:*)",
      "Update(*)"
    ],
    "deny": []
  }
}
```

### Implementation Logic

**If `~/.claude/settings.json` does NOT exist**:
1. Create directory: `mkdir -p ~/.claude`
2. Write file with complete standard permissions above

**If `~/.claude/settings.json` EXISTS**:
1. Read current file
2. Extract existing `permissions.allow` array
3. Identify missing permissions from standard list
4. Add only missing permissions to the array
5. Preserve all existing permissions (merge, don't replace)
6. Write updated file

**For project settings** (`.claude/settings.json`):
- Create with minimal structure
- Usually starts empty (inherits from global)
- Add project-specific permissions only when needed
- Committed to git

**Initial project `.claude/settings.json`**:
```json
{
  "permissions": {
    "allow": [],
    "deny": []
  }
}
```

Or with deny rules if needed:
```json
{
  "permissions": {
    "allow": [],
    "deny": [
      "Read(.env*)",
      "Write(.env*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

### Example Merge Behavior

**Current global file**:
```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Write(*)",
      "Bash(custom-tool:*)"
    ]
  }
}
```

**After merge**:
```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Write(*)",
      "Bash(custom-tool:*)",
      "Bash(mkdir:*)",
      "Bash(npm:*)",
      ...all other standard permissions...
    ]
  }
}
```

Note: `Bash(custom-tool:*)` was preserved.

### Testing

After configuration:
- [ ] `~/.claude/settings.json` exists
- [ ] All standard permissions present
- [ ] Existing custom permissions preserved (if file existed)
- [ ] Project `.claude/settings.json` created (minimal or empty)
- [ ] `.gitignore` excludes `.claude/settings.local.json`

---

## Universal TypeScript Configuration

### Base tsconfig.json (Web)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Base tsconfig.json (Mobile)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Important**: Path aliases differ - web uses `./src/*`, mobile uses `./*`

---

## Universal Git Configuration

### .gitignore (Complete)

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Vite
dist/

# Expo
.expo/
dist/
web-build/

# Production
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Claude Code
.claude/settings.local.json

# Misc
*.pem
```

---

## Universal Environment Variables

### Structure

All projects need:
- `.env.local` (or `.env` for mobile) - actual values (git-ignored)
- `.env.example` - template with dummy values (committed)

### Prefixes by Framework

- **Next.js**: `NEXT_PUBLIC_` for client-side variables
- **Vite**: `VITE_` for client-side variables
- **Expo**: `EXPO_PUBLIC_` for client-side variables

### Example .env.example (Supabase)

**Web (Next.js)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Web (Vite)**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

**Mobile (Expo)**:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_SCHEME=yourapp
```

---

## Universal Documentation

### docs/tech-stack.md Template

Create comprehensive documentation with:

```markdown
# Tech Stack - [Project Name]

## Framework & Runtime
- [Next.js 15 / Vite / Expo]
- React [version]
- TypeScript [version]

## UI & Styling
- [Shadcn + Tailwind / Tamagui / etc]
- Icons: [Lucide / Tabler / etc]

## Backend & Database
- Supabase (Database, Auth, Storage)
- [any other services]

## State Management
- TanStack Query (server state)
- Zustand (client state)

## Forms & Validation
- React Hook Form
- Zod

## Deployment
- [Vercel / Netlify / EAS Build]

## Key Dependencies
List all major dependencies with purpose

## Configuration Notes
Any important setup decisions made
```

### README.md Template

```markdown
# [Project Name]

[Brief description]

## Tech Stack

See `docs/tech-stack.md` for complete documentation.

## Getting Started

1. Install dependencies: `[npm/yarn] install`
2. Copy `.env.example` to `.env.local` (or `.env`)
3. Add environment variables (see Step 3)
4. Run dev server: `[npm/yarn] run dev`

## Claude Code Settings

Global settings are in `~/.claude/settings.json` (your personal config).

Project-specific permissions in `.claude/settings.json`:
- Currently empty (inherits from global)
- Add project-specific tools here if needed (Docker, Python, etc)
- Example: `"Bash(docker:*)"` for Docker commands

Project Structure

- `[src/app or app]/` - Routes and pages
- `components/` - Reusable components
- `lib/` - Configuration and utilities
- `docs/` - Documentation
- `prd/` - Product requirements

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `lint` - Run linter
- `type-check` - Check TypeScript types
```

---

## Universal Testing Checklist

After completing all configurations:

**Folder Structure:**
- [ ] All required directories created
- [ ] `docs/` and `prd/` folders exist
- [ ] Correct structure for platform (src/ for web, app/ at root for mobile)

**TypeScript:**
- [ ] tsconfig.json configured
- [ ] Path aliases working (test an import)
- [ ] `npm run type-check` passes

**Environment:**
- [ ] `.env.example` created with all variables
- [ ] `.env.local` / `.env` created
- [ ] Correct prefixes used for framework

**Git:**
- [ ] `.gitignore` complete
- [ ] `.env` files ignored
- [ ] `.claude/settings.local.json` ignored
- [ ] Git initialized (if new project)

**Claude Code Settings:**
- [ ] `~/.claude/settings.json` exists with standard permissions
- [ ] Existing custom permissions preserved (if file existed before)
- [ ] Project `.claude/settings.json` created (empty or minimal)
- [ ] Standard permissions verified in global file

**Documentation:**
- [ ] `docs/tech-stack.md` created
- [ ] README.md updated
- [ ] All setup steps documented

**Development Server:**
- [ ] `npm run dev` starts successfully
- [ ] Hot reload works
- [ ] No TypeScript errors
- [ ] Imports resolve correctly

---

## Next Files to Read

Based on your tech stack from Step 1, now read the specific configuration files you need. Refer to the Decision Matrix at the top of this document.

After implementing all configurations, proceed to **Step 3: Backend Setup**.
