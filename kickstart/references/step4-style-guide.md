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

**Tool**: [Tweak.cn Theme Editor](https://tweakcn.com/editor/theme)

#### 4.1A.1: Open Theme Editor

1. Navigate to https://tweakcn.com/editor/theme
2. You'll see a visual editor with color pickers

#### 4.1A.2: Define Brand Colors

**Primary Color**:
- Choose your main brand color
- This becomes your primary buttons, links, accents
- Examples: Blue (#3B82F6), Purple (#8B5CF6), Green (#10B981)

**Radius**:
- Border radius for components
- Options: 0 (sharp), 0.3rem (slightly rounded), 0.5rem (rounded), 0.75rem (very rounded)
- Recommendation: 0.5rem for modern look

**Background & Text**:
- Usually keep defaults
- Background: Light (#FFFFFF) / Dark (#09090B)
- Foreground (text): Dark (#09090B) / Light (#FAFAFA)

**Additional Colors**:
- Secondary (muted interactions)
- Accent (highlights)
- Destructive (errors, delete actions)
- Muted (less prominent elements)

#### 4.1A.3: Test Theme

Use the preview components on the right:
- Buttons
- Cards
- Input fields
- Check light and dark modes

#### 4.1A.4: Export Theme

1. Click "Export" or "Copy Code"
2. You'll get CSS variables for `globals.css`
3. Copy the entire output

**Example Output**:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables ... */
  }
}
```

### Path B: Tamagui (Mobile)

**Tool**: [Tamagui Theme Studio](https://tamagui.dev/theme)

#### 4.1B.1: Open Theme Studio

1. Navigate to https://tamagui.dev/theme
2. You'll see Tamagui's theme builder interface

#### 4.1B.2: Choose Base Theme

**Options**:
- Light
- Dark
- Base (neutral starting point)

**Recommendation**: Start with Base, customize from there

#### 4.1B.3: Define Colors

**Brand Colors**:
- Primary accent color
- Background colors
- Text colors

**Semantic Colors**:
- Success (green)
- Warning (yellow)
- Error (red)
- Info (blue)

**Shades**:
- Tamagui uses numbered shades (1-12)
- Lighter → Darker progression
- More granular than Tailwind

#### 4.1B.4: Configure Tokens

**Spacing**:
- Size tokens ($1, $2, $4, etc.)
- Space tokens for padding/margin

**Typography**:
- Font sizes
- Line heights
- Font weights

**Radius**:
- Border radius values
- Multiple options for different components

#### 4.1B.5: Export Theme

1. Click "Export" or "Copy Theme"
2. You'll get TypeScript/JavaScript config
3. Copy the theme object

**Example Output**:
```typescript
export const customTheme = {
  light: {
    background: '#ffffff',
    color: '#000000',
    primary: '#3B82F6',
    // ... more tokens ...
  },
  dark: {
    background: '#000000',
    color: '#ffffff',
    primary: '#60A5FA',
    // ... more tokens ...
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

#### Update globals.css

Replace the CSS variables section in `src/app/globals.css` (or `src/styles/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Paste exported CSS variables from Tweak.cn here */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    /* Paste dark mode variables here */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### Test Implementation

Restart dev server and check:
- Colors applied correctly
- Dark mode works (if implemented)
- All components use new theme

### For Tamagui

#### Update tamagui.config.ts

Replace or extend theme in your config:

```typescript
import { createTamagui, createTokens } from 'tamagui'
import { config as defaultConfig } from '@tamagui/config/v3'

// Paste exported theme from Tamagui Studio
const customTheme = {
  light: {
    background: '#ffffff',
    color: '#000000',
    primary: '#3B82F6',
    secondary: '#6B7280',
    // ... your custom colors
  },
  dark: {
    background: '#000000',
    color: '#ffffff',
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    // ... your custom dark colors
  },
}

const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    ...customTheme.light,
  },
})

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens,
  themes: {
    light: customTheme.light,
    dark: customTheme.dark,
  },
})

export default tamaguiConfig
```

#### Test Implementation

Restart and verify:
- Colors applied to components
- Theme switching works
- No TypeScript errors

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
