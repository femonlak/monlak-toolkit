# Next.js Configuration

Complete Next.js 15 setup with App Router.

## next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Package optimization
  experimental: {
    optimizePackageImports: [
      '@/components/ui',
      'lucide-react', // or '@tabler/icons-react'
    ],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Supabase Storage (if using)
      },
    ],
  },
}

export default nextConfig
```

## App Router Structure

```
src/app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Homepage (/)
├── loading.tsx         # Loading UI (optional)
├── error.tsx           # Error boundary (optional)
├── not-found.tsx       # 404 page (optional)
├── global.css          # Global styles
└── api/                # API routes (optional)
    └── route.ts
```

## Root Layout (src/app/layout.tsx)

Minimal example:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
```

With providers (add after configuring state management):

```typescript
import type { Metadata } from 'next'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

## Homepage (src/app/page.tsx)

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Your App</h1>
    </main>
  )
}
```

## Global Styles (src/app/globals.css)

Base setup for Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* Add more CSS variables as needed */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* Dark mode variables */
  }
}
```

## TypeScript Config (tsconfig.json)

Next.js-specific:

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
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## ESLint Config (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Testing

After setup, verify:

1. **Dev server**: `npm run dev` - should start on http://localhost:3000
2. **Hot reload**: Edit page.tsx and see changes instantly
3. **Type checking**: `npm run type-check` - should pass
4. **Linting**: `npm run lint` - should pass
5. **Path aliases**: Import something using `@/` and verify it works

## Agentation (AI Feedback Tool)

Agentation is a visual feedback tool that helps AI coding agents find exact code locations. **Install in all web projects** for better AI-assisted development.

### Installation

```bash
npm install agentation -D
```

### Setup

Add to your root layout (development only):

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

// Only import in development
const Agentation = process.env.NODE_ENV === 'development'
  ? require('agentation').Agentation
  : () => null

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Agentation />
      </body>
    </html>
  )
}
```

### Alternative: Separate Component

Create `src/components/dev-tools.tsx`:

```typescript
'use client'

import dynamic from 'next/dynamic'

const Agentation = dynamic(
  () => import('agentation').then((mod) => mod.Agentation),
  { ssr: false }
)

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') return null
  return <Agentation />
}
```

Then add to layout:

```typescript
import { DevTools } from '@/components/dev-tools'

// In body:
{children}
<DevTools />
```

### How It Helps

When working with Claude Code or other AI agents:
1. Click any element to capture its CSS selector
2. Add notes about what you want changed
3. Copy structured output with selectors, positions, and context
4. AI agent can grep for exact code locations

### Verification

After setup:
1. Run `npm run dev`
2. Look for Agentation toolbar in bottom-right corner
3. Click to activate, then click any element
4. Verify annotation appears with selector info

---

## Next Steps

- If using Tailwind: Read `tailwind.md`
- If using Supabase: Read `supabase-client.md`
- Always read: `state-management.md`
