# Step 4: Style Guide

Define and implement your app's visual identity using theme generators and style documentation.

---

## Overview

This step creates a complete style guide by:

1. **Identifying UI framework** (from Step 1)
2. **Generating theme** using appropriate tool
3. **Implementing theme** in your project
4. **Documenting style guide** for consistency
5. **Creating example components** for reference

**Time**: 10-15 minutes

---

## Prerequisites

From previous steps:
- [ ] UI framework configured (Step 2)
- [ ] Base styling system working
- [ ] Development server running

---

## Step 4.0: Identify UI Framework

Your UI framework determines which theme generator to use.

### Check Step 1 Output

Review what was chosen:

**Web Projects**:
- Shadcn + Tailwind → Use Tweak.cn
- Other Tailwind-based → Use Tweak.cn (adaptable)
- Other CSS frameworks → Search for specific generator or adapt Tweak.cn

**Mobile Projects**:
- Tamagui → Use Tamagui Theme Studio
- NativeWind (Tailwind for RN) → Adapt Tweak.cn
- React Native Paper → Search for Material Design generator or manual setup

### Decision Matrix

| Framework | Theme Generator | URL |
|-----------|----------------|-----|
| Shadcn + Tailwind | Tweak.cn | https://tweakcn.com/editor/theme |
| Tamagui | Tamagui Theme Studio | https://tamagui.dev/theme |
| Other Tailwind | Tweak.cn (adapt) | https://tweakcn.com/editor/theme |
| Other frameworks | Search or adapt | See Step 4.1C |

---

## Step 4.1: Generate Theme

### Path A: Shadcn + Tailwind (Web)

**Approach**: Use structured CSS variables system with comprehensive theming

Shadcn uses CSS variables for theming with light/dark mode support.

**Skip Tweak.cn** - Use this proven structure directly in `globals.css`:

#### 4.1A.1: Add Theme to globals.css

Replace content in `src/app/globals.css` (or `src/styles/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Background & Foreground */
    --background: #faf9f5;
    --foreground: #3d3929;
    
    /* Card */
    --card: #faf9f5;
    --card-foreground: #1a1a19;
    
    /* Popover */
    --popover: #ffffff;
    --popover-foreground: #28261b;
    
    /* Primary - CUSTOMIZE THIS */
    --primary: #c41ca5;
    --primary-foreground: #ffffff;
    
    /* Secondary */
    --secondary: #e9e6dc;
    --secondary-foreground: #535146;
    
    /* Muted */
    --muted: #ede9de;
    --muted-foreground: #83827d;
    
    /* Accent */
    --accent: #e9e6dc;
    --accent-foreground: #28261b;
    
    /* Destructive */
    --destructive: #1a1a19;
    --destructive-foreground: #ffffff;
    
    /* Border & Input */
    --border: #dad9d4;
    --input: #b4b2a7;
    --ring: #1f4e7a;
    
    /* Chart Colors */
    --chart-1: #1f4e7a;
    --chart-2: #368ad9;
    --chart-3: #ded8c4;
    --chart-4: #dbd3f0;
    --chart-5: #b4552d;
    
    /* Sidebar */
    --sidebar: #f5f4ee;
    --sidebar-foreground: #3d3d3a;
    --sidebar-primary: #c96442;
    --sidebar-primary-foreground: #fbfbfb;
    --sidebar-accent: #e9e6dc;
    --sidebar-accent-foreground: #343434;
    --sidebar-border: #ebebeb;
    --sidebar-ring: #b5b5b5;
    
    /* Typography */
    --font-sans: Albert Sans, ui-sans-serif, sans-serif, system-ui;
    --font-serif: Adamina, ui-serif, serif;
    --font-mono: Cousine, ui-monospace, monospace;
    
    /* Radius */
    --radius: 0.4rem;
    
    /* Shadows */
    --shadow-x: 0;
    --shadow-y: 0px;
    --shadow-blur: 0px;
    --shadow-spread: 0px;
    --shadow-opacity: 0.1;
    --shadow-color: oklch(0 0 0);
    --shadow-2xs: 0 0px 0px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 0px 0px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow-md: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
    --shadow-lg: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
    --shadow-xl: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
    --shadow-2xl: 0 0px 0px 0px hsl(0 0% 0% / 0.25);
    
    /* Spacing & Tracking */
    --tracking-normal: 0em;
    --spacing: 0.3rem;
  }

  .dark {
    /* Background & Foreground */
    --background: #262624;
    --foreground: #c3c0b6;
    
    /* Card */
    --card: #262624;
    --card-foreground: #faf9f5;
    
    /* Popover */
    --popover: #30302e;
    --popover-foreground: #e5e5e2;
    
    /* Primary - CUSTOMIZE THIS */
    --primary: #c60ca3;
    --primary-foreground: #ffffff;
    
    /* Secondary */
    --secondary: #faf9f5;
    --secondary-foreground: #30302e;
    
    /* Muted */
    --muted: #1b1b19;
    --muted-foreground: #b7b5a9;
    
    /* Accent */
    --accent: #1c1b17;
    --accent-foreground: #f5f4ee;
    
    /* Destructive */
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    
    /* Border & Input */
    --border: #3e3e38;
    --input: #52514a;
    --ring: #327abd;
    
    /* Chart Colors */
    --chart-1: #327abd;
    --chart-2: #9c87f5;
    --chart-3: #1c1b17;
    --chart-4: #2f2b48;
    --chart-5: #b4552d;
    
    /* Sidebar */
    --sidebar: #1f1e1d;
    --sidebar-foreground: #c3c0b6;
    --sidebar-primary: #343434;
    --sidebar-primary-foreground: #fbfbfb;
    --sidebar-accent: #1a1a19;
    --sidebar-accent-foreground: #c3c0b6;
    --sidebar-border: #ebebeb;
    --sidebar-ring: #b5b5b5;
    
    /* Typography */
    --font-sans: Albert Sans, ui-sans-serif, sans-serif, system-ui;
    --font-serif: Adamina, ui-serif, serif;
    --font-mono: Cousine, ui-monospace, monospace;
    
    /* Radius */
    --radius: 0.4rem;
    
    /* Shadows (same structure as light) */
    --shadow-x: 0;
    --shadow-y: 0px;
    --shadow-blur: 0px;
    --shadow-spread: 0px;
    --shadow-opacity: 0.1;
    --shadow-color: oklch(0 0 0);
    --shadow-2xs: 0 0px 0px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 0px 0px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow-md: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
    --shadow-lg: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
    --shadow-xl: 0 0px 0px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
    --shadow-2xl: 0 0px 0px 0px hsl(0 0% 0% / 0.25);
  }
}

@theme inline {
  /* Color aliases for Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Font aliases */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  /* Radius aliases */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Shadow aliases */
  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
```

#### 4.1A.2: Customize Brand Colors

**What to change**:

1. **Primary color** (your brand):
   ```css
   /* Light mode */
   --primary: #c41ca5;  /* Replace with your brand color */
   
   /* Dark mode */
   .dark {
     --primary: #c60ca3;  /* Slightly adjusted for dark background */
   }
   ```

2. **Ring color** (focus states):
   ```css
   --ring: #1f4e7a;  /* Match or complement primary */
   ```

3. **Chart colors** (if using charts):
   - `--chart-1` through `--chart-5`
   - Keep distinct and accessible
   - Example: Different shades of your brand color

4. **Sidebar colors** (if using sidebar):
   - `--sidebar-primary`: Sidebar brand color
   - `--sidebar-accent`: Sidebar highlights
   - Match main theme

5. **Fonts** (optional):
   ```css
   --font-sans: Your Font, ui-sans-serif, sans-serif, system-ui;
   --font-serif: Your Serif, ui-serif, serif;
   --font-mono: Your Mono, ui-monospace, monospace;
   ```

6. **Radius** (optional):
   ```css
   --radius: 0.4rem;  /* 0 = sharp, 0.75rem = very rounded */
   ```

**What NOT to change**:
- Variable naming structure
- :root and .dark structure
- @theme inline section (needed for Tailwind)
- Shadow system structure
- Semantic color relationships (foreground colors)

#### 4.1A.3: Example Customization

**For a blue brand**:

```css
:root {
  /* Primary becomes blue */
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  
  /* Ring matches (for focus states) */
  --ring: #3b82f6;
  
  /* Charts use blue palette */
  --chart-1: #1e40af;
  --chart-2: #3b82f6;
  --chart-3: #60a5fa;
  --chart-4: #93c5fd;
  --chart-5: #dbeafe;
  
  /* Sidebar matches */
  --sidebar-primary: #3b82f6;
  
  /* Rest stays the same */
  --background: #faf9f5;
  --foreground: #3d3929;
  --card: #faf9f5;
  /* ... */
}

.dark {
  /* Primary blue for dark mode */
  --primary: #60a5fa;  /* Lighter blue for dark background */
  --primary-foreground: #ffffff;
  
  /* Ring matches */
  --ring: #60a5fa;
  
  /* Charts adjusted for dark */
  --chart-1: #60a5fa;
  --chart-2: #3b82f6;
  --chart-3: #1e40af;
  --chart-4: #1e3a8a;
  --chart-5: #172554;
  
  /* Sidebar adjusted */
  --sidebar-primary: #60a5fa;
  
  /* Rest stays the same */
  --background: #262624;
  --foreground: #c3c0b6;
  /* ... */
}
```

#### 4.1A.4: Update tailwind.config.ts

Ensure Tailwind configuration references these CSS variables.

Create or update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
    },
  },
  plugins: [],
}

export default config
```

**Key Points**:
- `darkMode: ['class']` enables class-based dark mode
- All colors reference CSS variables from globals.css
- Chart colors accessible as `chart-1` through `chart-5`
- Sidebar colors included for sidebar components
- Radius, fonts, shadows also from variables



### Path B: Tamagui (Mobile)

**Approach**: Use structured theme system with separate themes file

Tamagui uses a builder-based approach with 12-shade palettes and semantic themes.

**Structure**: Two-file setup (themes.ts + tamagui.config.ts)

#### 4.1B.1: Create Theme File

Create `themes.ts` in project root:

```typescript
// themes.ts
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

// Define your color palettes (12 shades each)
// Customize these colors while keeping the structure
const darkPalette = [
  'hsla(0, 15%, 1%, 1)',
  'hsla(0, 15%, 6%, 1)',
  'hsla(0, 15%, 12%, 1)',
  'hsla(0, 15%, 17%, 1)',
  'hsla(0, 15%, 23%, 1)',
  'hsla(0, 15%, 28%, 1)',
  'hsla(0, 15%, 34%, 1)',
  'hsla(0, 15%, 39%, 1)',
  'hsla(0, 15%, 45%, 1)',
  'hsla(0, 15%, 50%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 99%, 1)',
]

const lightPalette = [
  'hsla(0, 15%, 99%, 1)',
  'hsla(0, 15%, 94%, 1)',
  'hsla(0, 15%, 88%, 1)',
  'hsla(0, 15%, 83%, 1)',
  'hsla(0, 15%, 77%, 1)',
  'hsla(0, 15%, 72%, 1)',
  'hsla(0, 15%, 66%, 1)',
  'hsla(0, 15%, 61%, 1)',
  'hsla(0, 15%, 55%, 1)',
  'hsla(0, 15%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 1%, 1)',
]

// Shadow definitions
const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// Create themes with structured approach
const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  // Base theme (neutral)
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },
    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  // Accent theme (primary brand color)
  // CUSTOMIZE THESE COLORS
  accent: {
    palette: {
      dark: [
        'hsla(340, 100%, 63%, 1)',
        'hsla(340, 100%, 62%, 1)',
        'hsla(340, 100%, 62%, 1)',
        'hsla(340, 100%, 62%, 1)',
        'hsla(340, 100%, 61%, 1)',
        'hsla(340, 100%, 61%, 1)',
        'hsla(340, 100%, 61%, 1)',
        'hsla(340, 100%, 61%, 1)',
        'hsla(340, 100%, 60%, 1)',
        'hsla(340, 100%, 60%, 1)',
        'hsla(250, 50%, 90%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
      light: [
        'hsla(340, 100%, 38%, 1)',
        'hsla(340, 100%, 41%, 1)',
        'hsla(340, 100%, 44%, 1)',
        'hsla(340, 100%, 47%, 1)',
        'hsla(340, 100%, 50%, 1)',
        'hsla(340, 100%, 53%, 1)',
        'hsla(340, 100%, 56%, 1)',
        'hsla(340, 100%, 59%, 1)',
        'hsla(340, 100%, 62%, 1)',
        'hsla(340, 100%, 65%, 1)',
        'hsla(250, 50%, 95%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
    },
  },

  // Sub-themes for semantic colors
  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },
    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },
    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // Optionally add more sub-themes if needed
  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// Client-side optimization: saves bundle size by leaving out themes JS
// Tamagui automatically hydrates themes from CSS back into JS
// This conditional is optional but recommended for production
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
```

#### 4.1B.2: Create Config File

Create `tamagui.config.ts` in project root:

```typescript
// tamagui.config.ts
import { createTamagui } from '@tamagui/core'
import { defaultConfig } from '@tamagui/config/v4'
import { themes } from './themes'

export const config = createTamagui({
  ...defaultConfig,
  themes,
})

export default config

export type Conf = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
```

**Key Points**:
- Themes are in separate file (`themes.ts`)
- Config imports themes and merges with `defaultConfig`
- Uses `@tamagui/config/v4` for latest defaults
- TypeScript module declaration for type safety

#### 4.1B.3: Customize Brand Colors

**What to change in `themes.ts`**:

1. **Base palette** (darkPalette & lightPalette):
   - Change hue (first number in `hsla()`)
   - Keep saturation and lightness progression
   - Example: Blue = `hsla(220, ...)` instead of `hsla(0, ...)`

2. **Accent palette**:
   - Your primary brand color
   - Example provided: Pink (`hsla(340, 100%, ...)`)
   - Replace with your brand color
   - Keep the shade progression structure

3. **Shadows** (optional):
   - Adjust opacity values if needed
   - Keep the 6-level system

**What NOT to change**:
- Number of shades (must be 12)
- Structure (base, accent, childrenThemes)
- Component themes (use defaultComponentThemes)
- Semantic colors (warning, error, success)
- Client-side optimization logic
- Export structure

#### 4.1B.4: Example Customization

**For a blue brand**, update `themes.ts`:

```typescript
const darkPalette = [
  'hsla(220, 15%, 1%, 1)',   // Changed hue to 220 (blue)
  'hsla(220, 15%, 6%, 1)',
  'hsla(220, 15%, 12%, 1)',
  'hsla(220, 15%, 17%, 1)',
  'hsla(220, 15%, 23%, 1)',
  'hsla(220, 15%, 28%, 1)',
  'hsla(220, 15%, 34%, 1)',
  'hsla(220, 15%, 39%, 1)',
  'hsla(220, 15%, 45%, 1)',
  'hsla(220, 15%, 50%, 1)',
  'hsla(220, 15%, 93%, 1)',
  'hsla(220, 15%, 99%, 1)',
]

const lightPalette = [
  'hsla(220, 15%, 99%, 1)',
  'hsla(220, 15%, 94%, 1)',
  'hsla(220, 15%, 88%, 1)',
  'hsla(220, 15%, 83%, 1)',
  'hsla(220, 15%, 77%, 1)',
  'hsla(220, 15%, 72%, 1)',
  'hsla(220, 15%, 66%, 1)',
  'hsla(220, 15%, 61%, 1)',
  'hsla(220, 15%, 55%, 1)',
  'hsla(220, 15%, 50%, 1)',
  'hsla(220, 15%, 15%, 1)',
  'hsla(220, 15%, 1%, 1)',
]

// Accent becomes blue
accent: {
  palette: {
    dark: [
      'hsla(220, 85%, 65%, 1)',  // Blue in dark mode
      'hsla(220, 85%, 64%, 1)',
      'hsla(220, 85%, 63%, 1)',
      'hsla(220, 85%, 62%, 1)',
      'hsla(220, 85%, 61%, 1)',
      'hsla(220, 85%, 60%, 1)',
      'hsla(220, 85%, 59%, 1)',
      'hsla(220, 85%, 58%, 1)',
      'hsla(220, 85%, 57%, 1)',
      'hsla(220, 85%, 56%, 1)',
      'hsla(220, 50%, 90%, 1)',
      'hsla(220, 50%, 95%, 1)',
    ],
    light: [
      'hsla(220, 85%, 40%, 1)',  // Blue in light mode
      'hsla(220, 85%, 43%, 1)',
      'hsla(220, 85%, 46%, 1)',
      'hsla(220, 85%, 49%, 1)',
      'hsla(220, 85%, 52%, 1)',
      'hsla(220, 85%, 55%, 1)',
      'hsla(220, 85%, 58%, 1)',
      'hsla(220, 85%, 61%, 1)',
      'hsla(220, 85%, 64%, 1)',
      'hsla(220, 85%, 67%, 1)',
      'hsla(220, 50%, 95%, 1)',
      'hsla(220, 50%, 95%, 1)',
    ],
  },
}
```

### Path C: Other Frameworks

#### 4.1C.1: Search for Specific Generator

Try searching:
```
"[framework name] theme generator"
"[framework name] color palette generator"
```

**Examples**:
- Material UI: Has built-in theme creator
- Mantine: Has color generator tool
- Chakra UI: Has theme tools

#### 4.1C.2: Adapt Existing Generator

If no specific tool exists:

**Option 1: Use Tweak.cn, extract colors**
1. Generate theme on Tweak.cn
2. Extract hex colors from CSS
3. Manually adapt to your framework

**Option 2: Use Tamagui, extract colors**
1. Generate theme on Tamagui
2. Extract color values
3. Convert to your framework's format

#### 4.1C.3: Manual Definition

Define at minimum:
- Primary color + shades
- Background colors (light/dark)
- Text colors (light/dark)
- Success, Warning, Error colors
- Border radius values

---

## Step 4.2: Implement Theme

### For Shadcn + Tailwind

Theme CSS already created in Step 4.1A. Now verify and test implementation.

#### Verify Files Exist

Check that both files are configured:

1. **globals.css** with CSS variables:
```bash
# Check file exists
cat src/app/globals.css
# or
cat src/styles/globals.css
```

Should contain `:root`, `.dark`, and `@theme inline` sections.

2. **tailwind.config.ts** with variable references:
```bash
cat tailwind.config.ts
```

Should have `theme.extend.colors` pointing to CSS variables.

#### Test Dark Mode Toggle

Add dark mode toggle to test:

```typescript
// components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
    >
      Toggle to {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

#### Test Theme Components

Create test component to verify all theme colors:

```typescript
// components/ThemeTest.tsx
import { ThemeToggle } from './ThemeToggle'

export function ThemeTest() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theme Test</h1>
        <ThemeToggle />
      </div>

      {/* Background & Foreground */}
      <div className="p-4 bg-background text-foreground border border-border rounded-lg">
        Background & Foreground
      </div>

      {/* Card */}
      <div className="p-4 bg-card text-card-foreground border border-border rounded-lg">
        Card
      </div>

      {/* Primary */}
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
        Primary Button
      </button>

      {/* Secondary */}
      <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
        Secondary Button
      </button>

      {/* Muted */}
      <div className="p-4 bg-muted text-muted-foreground rounded-lg">
        Muted Section
      </div>

      {/* Accent */}
      <div className="p-4 bg-accent text-accent-foreground rounded-lg">
        Accent Section
      </div>

      {/* Destructive */}
      <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">
        Destructive Button
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Input field"
        className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
      />

      {/* Chart colors */}
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-chart-1 rounded-lg" />
        <div className="w-16 h-16 bg-chart-2 rounded-lg" />
        <div className="w-16 h-16 bg-chart-3 rounded-lg" />
        <div className="w-16 h-16 bg-chart-4 rounded-lg" />
        <div className="w-16 h-16 bg-chart-5 rounded-lg" />
      </div>

      {/* Shadows */}
      <div className="flex gap-4">
        <div className="w-24 h-24 shadow-sm bg-card rounded-lg" />
        <div className="w-24 h-24 shadow-md bg-card rounded-lg" />
        <div className="w-24 h-24 shadow-lg bg-card rounded-lg" />
        <div className="w-24 h-24 shadow-xl bg-card rounded-lg" />
      </div>
    </div>
  )
}
```

Use in your app to verify all theme elements.

#### Verify Implementation Checklist

- ✅ **CSS variables**: All defined in globals.css
- ✅ **Dark mode**: .dark class toggles correctly
- ✅ **Tailwind config**: References CSS variables
- ✅ **Primary color**: Your brand color applied
- ✅ **Secondary colors**: All semantic colors work
- ✅ **Chart colors**: 5 distinct colors for data viz
- ✅ **Sidebar colors**: If using sidebar components
- ✅ **Fonts**: Custom fonts loading (if changed)
- ✅ **Radius**: Border radius applied consistently
- ✅ **Shadows**: Shadow levels working
- ✅ **Inputs**: Focus ring appears correctly
- ✅ **No TypeScript errors**: Config types correct
- ✅ **Hot reload**: Changes reflect in dev server

Restart dev server and check:
- Colors applied correctly
- Dark mode works (if implemented)
- All components use new theme

### For Tamagui

Configuration already created in Step 4.1B with two files:
- `themes.ts` - Theme definitions
- `tamagui.config.ts` - Config that imports themes

Now integrate with app.

#### Verify Files Exist

Check that both files are in project root:
```bash
ls themes.ts tamagui.config.ts
```

Should show both files.

#### Apply to App Root

**For Expo (app/_layout.tsx)**:
```typescript
import { TamaguiProvider } from 'tamagui'
import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'

export default function RootLayout() {
  const [loaded] = useFonts({
    // your fonts
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      {/* Your app content */}
    </TamaguiProvider>
  )
}
```

**For React Native (App.tsx)**:
```typescript
import { TamaguiProvider } from 'tamagui'
import { config } from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={config}>
      {/* Your app content */}
    </TamaguiProvider>
  )
}
```

#### Test Theme Implementation

Create test component to verify:

```typescript
// components/ThemeTest.tsx
import { Button, H1, YStack } from 'tamagui'

export function ThemeTest() {
  return (
    <YStack padding="$4" space="$4">
      <H1>Theme Test</H1>
      
      {/* Base theme */}
      <Button>Base Button</Button>
      
      {/* Accent theme */}
      <Button theme="accent">Accent Button</Button>
      
      {/* Semantic themes */}
      <Button theme="success">Success</Button>
      <Button theme="warning">Warning</Button>
      <Button theme="error">Error</Button>
    </YStack>
  )
}
```

Use in your app to verify all themes work correctly.

#### Test Theme Switching (Dark/Light)

```typescript
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { config } from './tamagui.config'

export default function App() {
  const colorScheme = useColorScheme() // 'light' or 'dark'

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme}
    >
      {/* Your app */}
    </TamaguiProvider>
  )
}
```

Verify:
- ✅ Light mode uses light palette
- ✅ Dark mode uses dark palette
- ✅ Switching between modes works
- ✅ All semantic themes (success, warning, error) render correctly
- ✅ Shadows appear properly
- ✅ No TypeScript errors
- ✅ Client-side optimization active in production build

### For Other Frameworks

Implement according to framework documentation:
- Update theme configuration file
- Apply to components
- Test theme application

---

## Step 4.3: Document Style Guide

### Create docs/style-guide.md

Document your visual identity for future reference and team members.

**Template**:

```markdown
# Style Guide - [Project Name]

## Brand Colors

### Primary
- **Light Mode**: #3B82F6 (Blue)
- **Dark Mode**: #60A5FA (Light Blue)
- **Usage**: Primary actions, links, focus states

### Secondary
- **Light Mode**: #6B7280 (Gray)
- **Dark Mode**: #9CA3AF (Light Gray)
- **Usage**: Secondary actions, less prominent elements

### Accent
- **Color**: #8B5CF6 (Purple)
- **Usage**: Highlights, special features, badges

### Semantic Colors

**Success**: #10B981 (Green)
- Confirmations, success states, positive feedback

**Warning**: #F59E0B (Orange)
- Warnings, caution, important notices

**Error**: #EF4444 (Red)
- Errors, destructive actions, validation failures

**Info**: #3B82F6 (Blue)
- Informational messages, tips, hints

## Typography

### Font Family
- **Primary**: System font stack (Inter, SF Pro, Roboto)
- **Monospace**: Consolas, Monaco, Courier New

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

Uses 4px base unit:
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)

## Border Radius

- **Default**: 0.5rem (8px)
- **Small**: 0.25rem (4px)
- **Large**: 0.75rem (12px)
- **Full**: 9999px (pill shape)

## Shadows

- **Small**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Medium**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Large**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **XL**: 0 20px 25px rgba(0, 0, 0, 0.15)

## Component Guidelines

### Buttons

**Primary**:
- Background: Primary color
- Text: White
- Hover: Primary color darkened 10%
- Padding: 0.5rem 1rem

**Secondary**:
- Background: Secondary color
- Text: Primary foreground
- Hover: Secondary color darkened 10%
- Padding: 0.5rem 1rem

**Sizes**:
- Small: py-1 px-3, text-sm
- Medium: py-2 px-4, text-base (default)
- Large: py-3 px-6, text-lg

### Cards

- Background: Card background color
- Border: 1px solid border color
- Radius: Default radius
- Padding: 1.5rem
- Shadow: Small shadow

### Forms

**Inputs**:
- Border: 1px solid input border
- Radius: Default radius
- Padding: 0.5rem 0.75rem
- Focus: Ring color, 2px offset

**Labels**:
- Font size: sm
- Font weight: medium
- Margin bottom: 0.5rem

## Dark Mode

All colors have light and dark variants. Dark mode is implemented via:
- Web: `class="dark"` on root element
- Mobile: Theme switching in Tamagui

## Accessibility

- **Minimum contrast ratio**: 4.5:1 for text
- **Focus indicators**: Visible on all interactive elements
- **Color alone**: Never used as sole indicator
- **Touch targets**: Minimum 44x44px for mobile

## Usage Examples

See `components/examples/` for reference implementations.
```

### Create Example Components

Create `components/examples/` with sample implementations:

**Button examples** (`components/examples/ButtonExamples.tsx`):
```typescript
export function ButtonExamples() {
  return (
    <div className="space-y-4">
      <h2>Buttons</h2>
      
      <div className="space-x-2">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          Primary
        </button>
        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md">
          Secondary
        </button>
        <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md">
          Destructive
        </button>
      </div>
      
      <div className="space-x-2">
        <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
          Small
        </button>
        <button className="px-4 py-2 text-base rounded-md bg-primary text-primary-foreground">
          Medium
        </button>
        <button className="px-6 py-3 text-lg rounded-md bg-primary text-primary-foreground">
          Large
        </button>
      </div>
    </div>
  )
}
```

**Card examples**, **Form examples**, etc.

---

## Step 4.4: Update Documentation

### Update docs/tech-stack.md

Add style section:

```markdown
## Styling & Theme

### Design System
- Colors: See `docs/style-guide.md`
- Theme generated using: [Tweak.cn / Tamagui Studio]
- Dark mode: [Enabled / Not implemented]

### Implementation
- CSS Variables (Tailwind) / Theme tokens (Tamagui)
- Location: `globals.css` / `tamagui.config.ts`
- Example components: `components/examples/`
```

### Update README.md

```markdown
## Style Guide

Our design system is documented in `docs/style-guide.md`.

Key features:
- Custom theme generated with [tool name]
- Dark mode support
- Accessible color contrast
- Example components in `components/examples/`
```

---

## Final Checklist

After Step 4:

**Theme Generation:**
- [ ] Theme generator selected (Tweak.cn, Tamagui, or other)
- [ ] Brand colors defined
- [ ] Semantic colors configured (success, warning, error)
- [ ] Border radius decided
- [ ] Dark mode configured (if needed)

**Implementation:**
- [ ] Theme applied to project (CSS variables or config file)
- [ ] Dev server restarted and changes verified
- [ ] All components use theme colors
- [ ] Dark mode working (if implemented)

**Documentation:**
- [ ] `docs/style-guide.md` created
- [ ] Brand colors documented
- [ ] Typography guidelines documented
- [ ] Component guidelines documented
- [ ] Example components created
- [ ] `docs/tech-stack.md` updated
- [ ] README.md updated

**Testing:**
- [ ] Theme looks good in light mode
- [ ] Theme looks good in dark mode (if applicable)
- [ ] All interactive elements accessible
- [ ] No visual glitches or broken styling

---

## Common Issues

### Colors not applying

**Web (Tailwind)**:
- Verify CSS variables in globals.css
- Check @layer base is present
- Restart dev server
- Clear browser cache

**Mobile (Tamagui)**:
- Verify tamagui.config.ts is correct
- Check TamaguiProvider wraps app
- Restart Expo dev server
- Check theme is imported

### Dark mode not working

**Web**:
- Check `<html class="dark">` or theme toggle implementation
- Verify dark CSS variables defined
- Check dark mode classes on components

**Mobile**:
- Verify dark theme is defined in config
- Check theme switching logic
- Verify components use theme tokens, not hardcoded colors

### Colors look wrong

- Compare with theme generator preview
- Check HSL values copied correctly
- Verify no typos in color names
- Test in different browsers

---

## Next Steps

With style guide complete:

✅ **Consistent design** across all screens
✅ **Clear guidelines** for new components
✅ **Dark mode** (if implemented)
✅ **Accessible colors** meeting contrast requirements

**Proceed to Step 5: GitHub** to initialize version control and remote repository.

---

## Additional Resources

**Theme Generators**:
- [Tweak.cn Theme Editor](https://tweakcn.com/editor/theme)
- [Tamagui Theme Studio](https://tamagui.dev/theme)
- [Tailwind Color Generator](https://uicolors.app/create)
- [Material Design Color Tool](https://material.io/resources/color/)

**Design Systems**:
- [Radix Colors](https://www.radix-ui.com/colors)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Tamagui Design Tokens](https://tamagui.dev/docs/core/theme)

**Accessibility**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
