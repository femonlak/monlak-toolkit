# Expo Configuration

Complete Expo setup with Expo Router and modern architecture.

## app.json

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "yourapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.yourapp"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

**Important customizations**:
- `slug`: Lowercase, no spaces, unique identifier
- `scheme`: For deep linking, match your app name
- `bundleIdentifier` (iOS) and `package` (Android): Use reverse domain format `com.company.app`

## eas.json (EAS Build Configuration)

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Expo Router Structure

```
app/
├── _layout.tsx         # Root layout (required)
├── index.tsx           # Home screen (/)
├── (tabs)/             # Tab navigation group (optional)
│   ├── _layout.tsx
│   ├── index.tsx
│   └── profile.tsx
└── [id].tsx            # Dynamic route (optional)
```

## Root Layout (app/_layout.tsx)

Minimal example:

```typescript
import { Stack } from 'expo-router'

export default function RootLayout() {
  return <Stack />
}
```

With providers (add after configuring state management):

```typescript
import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
}
```

With Tamagui (if using):

```typescript
import { Stack } from 'expo-router'
import { TamaguiProvider } from 'tamagui'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import config from '@/tamagui.config'

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

## Home Screen (app/index.tsx)

```typescript
import { View, Text, StyleSheet } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your App</Text>
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
  },
})
```

## TypeScript Config (tsconfig.json)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## Constants Setup

Create `constants/Colors.ts`:

```typescript
const tintColorLight = '#2f95dc'
const tintColorDark = '#fff'

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "type-check": "tsc --noEmit"
  }
}
```

## Metro Config (metro.config.js)

For Tamagui (if using):

```javascript
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Add Tamagui support
config.resolver.sourceExts.push('mjs')

module.exports = config
```

## ESLint Config (.eslintrc.js)

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
  },
}
```

## Assets Structure

Required assets (create placeholders if needed):

```
assets/
├── icon.png              # 1024x1024 app icon
├── splash.png            # Splash screen
├── adaptive-icon.png     # 1024x1024 Android adaptive icon
├── favicon.png           # 48x48 web favicon
└── notification-icon.png # Notification icon
```

**Quick placeholders**: Use solid color squares for initial setup.

## Testing

After setup, verify:

1. **Dev server**: `npm start` - Expo DevTools should open
2. **Run on platform**: 
   - iOS: `npm run ios` (requires Xcode)
   - Android: `npm run android` (requires Android Studio)
   - Web: `npm run web`
3. **Type checking**: `npm run type-check` - should pass
4. **Hot reload**: Edit index.tsx and see changes instantly
5. **Path aliases**: Import something using `@/` and verify it works

## EAS Build Setup

To configure EAS:

```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# This creates eas.json and updates app.json with projectId
```

## Next Steps

- If using Tamagui: Read `tamagui.md`
- If using NativeWind: Read `tailwind.md` (mobile version)
- If using Supabase: Read `supabase-client.md`
- Always read: `state-management.md`
