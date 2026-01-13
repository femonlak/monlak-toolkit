# React Native & Expo

## Platform Mindset

Mobile is not "small web". Different constraints, different expectations:

```
Web                          Mobile
─────────────────────────────────────────
Hover states                 Touch targets (44pt min)
Mouse precision              Finger imprecision
Keyboard shortcuts           Gestures
Scroll is cheap              Scroll reveals intent
Window resize                Fixed viewport
URLs                         Deep links
```

---

## Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth group
│   ├── (tabs)/            # Tab navigation
│   └── _layout.tsx        # Root layout
├── components/
│   ├── ui/                # Reusable UI
│   └── features/          # Feature-specific
├── hooks/                 # Custom hooks
├── services/              # API and native services
├── stores/                # State management
├── utils/                 # Utilities
└── types/                 # TypeScript types
```

---

## Navigation (Expo Router)

### Basic Setup
```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
```

### Tab Navigation
```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
```

### Programmatic Navigation
```tsx
import { router } from 'expo-router'

router.push('/profile/123')
router.replace('/login')
router.back()

// With params
router.push({
  pathname: '/product/[id]',
  params: { id: '123' },
})
```

### Navigation Patterns
```
Stack       → Drill-down flows (details, forms)
Tabs        → Top-level sections (max 5)
Drawer      → Settings, secondary navigation
Modal       → Focused tasks, confirmations

Rules:
├── User must always know where they are
├── Back action must be predictable
├── Preserve state when switching tabs
└── Deep links should work from cold start
```

---

## Authentication Flow

```tsx
// providers/AuthProvider.tsx
import { useRouter, useSegments } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const segments = useSegments()
  const router = useRouter()

  // Protect routes
  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      router.replace('/login')
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [user, segments, isLoading])

  async function signIn(credentials) {
    const { token, user } = await api.login(credentials)
    await SecureStore.setItemAsync('authToken', token)
    setUser(user)
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## Offline-First (React Query)

```tsx
import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

// Sync online status
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5,    // 5 minutes
      networkMode: 'offlineFirst',
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
```

### Offline Mindset
```
├── Cache aggressively
├── Queue mutations when offline
├── Show stale data immediately
├── Sync when connection returns
├── Indicate online/offline state subtly
└── Never lose user input
```

---

## Native Modules

### Haptics
```tsx
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

export const haptics = {
  light: () => Platform.OS !== 'web' &&
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Platform.OS !== 'web' &&
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => Platform.OS !== 'web' &&
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Platform.OS !== 'web' &&
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
}
```

### Biometrics
```tsx
import * as LocalAuthentication from 'expo-local-authentication'

async function authenticateWithBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) return false

  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) return false

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    fallbackLabel: 'Use passcode',
  })

  return result.success
}
```

---

## Performance

### 60 FPS Baseline
```
├── Never block JS thread during animations
├── Use native driver for transforms/opacity
├── Virtualize lists (FlatList, not ScrollView + map)
├── Memoize list items
├── Lazy load off-screen content
└── Profile before optimizing
```

### List Performance (FlashList)
```tsx
import { FlashList } from '@shopify/flash-list'

const ProductItem = memo(({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <FastImage source={{ uri: item.image }} />
    <Text>{item.name}</Text>
  </Pressable>
))

export function ProductList({ products, onProductPress }) {
  return (
    <FlashList
      data={products}
      renderItem={({ item }) => (
        <ProductItem item={item} onPress={onProductPress} />
      )}
      estimatedItemSize={100}
      removeClippedSubviews={true}
    />
  )
}
```

---

## EAS Build & Deploy

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

```bash
# Build
eas build --platform ios --profile development
eas build --platform all --profile production

# Submit
eas submit --platform ios
eas submit --platform android

# OTA updates
eas update --branch production --message "Bug fixes"
```

---

## Platform Differences

```
iOS                          Android
─────────────────────────────────────────
"< Back" in nav bar          Hardware/gesture back
Pull-to-refresh anywhere     Pull from top only
Swipe from edge to go back   Back button/gesture
Bottom sheets native feel    Material bottom sheets
SF Symbols                   Material Icons
Haptics expected             Haptics optional
```
