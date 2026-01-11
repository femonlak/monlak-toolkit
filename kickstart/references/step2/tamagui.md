# Tamagui Configuration

Setup for Expo mobile apps with Tamagui UI system.

## Installation

```bash
npm install tamagui @tamagui/config
npm install @tamagui/babel-plugin
```

## tamagui.config.ts

Create in project root:

```typescript
import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui(config)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
```

## babel.config.js

Update to include Tamagui plugin:

```javascript
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
        },
      ],
    ],
  }
}
```

## metro.config.js

Update to support Tamagui:

```javascript
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Tamagui requires mjs support
config.resolver.sourceExts.push('mjs')

module.exports = config
```

## Provider Setup (app/_layout.tsx)

```typescript
import { Stack } from 'expo-router'
import { TamaguiProvider } from 'tamagui'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import config from '../tamagui.config'

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Stack />
      </QueryClientProvider>
    </TamaguiProvider>
  )
}
```

## Theme Setup

Tamagui comes with built-in themes. To customize:

```typescript
import { config as defaultConfig } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui'

// Custom tokens (optional)
const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    primary: '#your-color',
    secondary: '#your-color',
  },
})

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens,
})

export default tamaguiConfig
```

## Example Components

Test with these:

```typescript
import { YStack, Text, Button } from 'tamagui'

export default function HomeScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Text fontSize="$8" fontWeight="bold">
        Welcome to Your App
      </Text>
      <Button marginTop="$4">Get Started</Button>
    </YStack>
  )
}
```

## Common Tamagui Components

- **Layout**: `YStack`, `XStack`, `ZStack`
- **Text**: `Text`, `Heading`, `Paragraph`
- **Input**: `Input`, `TextArea`
- **Button**: `Button`
- **Card**: `Card`
- **Sheet**: `Sheet` (bottom drawer)
- **Dialog**: `Dialog`

## Spacing & Sizing

Tamagui uses design tokens:

- Spacing: `$1`, `$2`, `$4`, `$8`, etc.
- Sizes: `$sm`, `$md`, `$lg`, etc.
- Colors: `$primary`, `$secondary`, etc.

## TypeScript Support

Tamagui has excellent TypeScript support. All props are fully typed.

## Testing

After setup:

1. **Import test**: Try importing Tamagui components
2. **Render test**: Create a simple component with Tamagui
3. **Theme test**: Verify theme tokens work
4. **Hot reload**: Edit components and see updates

## Performance Notes

Tamagui is highly optimized:
- Compile-time optimization
- Tree-shakeable
- Zero runtime in many cases
- Native driver animations

## Resources

- [Tamagui Docs](https://tamagui.dev)
- [Component Examples](https://tamagui.dev/docs/components/stacks)
- [Theme Builder](https://tamagui.dev/theme-builder)
