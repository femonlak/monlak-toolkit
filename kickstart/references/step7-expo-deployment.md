# Step 7: Expo / EAS Deployment

Configure Expo Application Services (EAS) for building and distributing mobile apps.

**Note**: This step is **only for mobile projects** (Expo/React Native). Skip if web-only.

---

## Overview

This step covers:

1. **Install EAS CLI**
2. **Login to Expo account**
3. **Configure EAS Build** (already in Step 2, verify)
4. **Create development build**
5. **Test on device**
6. **Create production build** (optional)
7. **Submit to app stores** (optional, guidance only)

**Time**: 15-20 minutes (first build takes longer)

---

## Prerequisites

From previous steps:
- [ ] Expo project configured (Step 2)
- [ ] `eas.json` exists (created in Step 2)
- [ ] GitHub repository created (Step 5)
- [ ] Code pushed to GitHub
- [ ] App builds locally (`npm start`)

---

## Step 7.0: Verify Project is Mobile-Based

### Check Framework

From Step 1, verify this is a mobile project:
- ✅ Expo + React Native
- ✅ Expo Router
- ❌ Next.js / Vite (skip to Step 8)

If mobile project, continue. If web-only, skip to Step 8.

---

## Step 7.1: Install EAS CLI

### Install Globally

```bash
npm install -g eas-cli
```

### Verify Installation

```bash
eas --version
```

Should show: `eas-cli/X.X.X` or similar.

---

## Step 7.2: Login to Expo

### Create Account (if needed)

If you don't have an Expo account:

1. Go to https://expo.dev/signup
2. Create account
3. Verify email

### Login via CLI

```bash
eas login
```

**Prompts**:
- Email: your-expo-email@example.com
- Password: your-password
- Two-factor code (if enabled)

**Alternative** (login via browser):
```bash
eas login --web
```

### Verify Login

```bash
eas whoami
```

Should show your username.

---

## Step 7.3: Configure EAS Project

### Link Project

```bash
eas init
```

**Prompts**:
- Would you like to create a project? **Yes**
- Project name: (auto-filled from app.json)

**Result**: 
- Creates project on Expo servers
- Adds `projectId` to `app.json`
- Links local project to Expo project

### Verify Configuration

Check `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    }
  }
}
```

### Verify eas.json

Should exist from Step 2:

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

If missing, create it with this content.

---

## Step 7.4: Configure Environment Variables

### Add to EAS

Environment variables for builds:

```bash
# Add Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your-supabase-url"

# Add Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"

# Add any other variables
eas secret:create --scope project --name EXPO_PUBLIC_APP_SCHEME --value "yourapp"
```

### Verify Secrets

```bash
eas secret:list
```

Shows all configured secrets.

### Alternative: .env in eas.json

In `eas.json`, you can reference .env file:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "$EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "$EXPO_PUBLIC_SUPABASE_ANON_KEY"
      }
    }
  }
}
```

Then set via CLI as shown above.

---

## Step 7.5: Create Development Build

Development build allows testing with Expo DevTools.

### iOS Simulator Build (macOS only)

```bash
eas build --profile development --platform ios
```

**Prompts**:
- Generate a new Apple Distribution Certificate? **Yes** (first time)
- Generate a new Apple Provisioning Profile? **Yes** (first time)

**Wait**: 10-20 minutes for first build.

**Result**: 
- iOS .app file
- Download link
- Can install on iOS Simulator

### Android Development Build

```bash
eas build --profile development --platform android
```

**Wait**: 10-20 minutes for first build.

**Result**:
- Android .apk file
- Download link
- Can install on Android device/emulator

### Both Platforms

```bash
eas build --profile development --platform all
```

Builds for both iOS and Android.

---

## Step 7.6: Install Development Build

### iOS (Simulator)

1. Download .app file from build completion message
2. Drag to iOS Simulator
3. Or use command:
```bash
# Get build URL
eas build:list

# Download and install (build ID from list)
eas build:run --profile development --latest
```

### Android (Device)

1. Download .apk from build link
2. Transfer to Android device
3. Enable "Install from unknown sources"
4. Open .apk and install

**Or scan QR code** from build completion:
- Open camera on Android device
- Scan QR code
- Download and install

### Android (Emulator)

```bash
# Start emulator first
# Then drag .apk to emulator window
# Or use adb:
adb install path/to/your-app.apk
```

---

## Step 7.7: Test Development Build

### Start Development Server

```bash
npm start
```

Or with specific configuration:
```bash
npx expo start --dev-client
```

### Connect Device/Simulator

**On Device**:
1. Open development build app
2. Scan QR code from terminal
3. App loads with hot reload

**On Simulator/Emulator**:
1. Press `i` for iOS simulator
2. Press `a` for Android emulator
3. App loads automatically

### Verify Features

Test:
- [ ] App loads correctly
- [ ] Hot reload works
- [ ] Supabase connection works
- [ ] Theme applied (from Step 4)
- [ ] Navigation works
- [ ] All features functional

---

## Step 7.8: Create Preview Build (Optional)

Preview builds are for internal testing (TestFlight, Play Internal Testing).

### iOS Preview

```bash
eas build --profile preview --platform ios
```

**Requirements**:
- Apple Developer account ($99/year)
- Bundle identifier configured in app.json
- Signing certificates

### Android Preview

```bash
eas build --profile preview --platform android
```

**Result**: 
- .aab file (Android App Bundle)
- Can upload to Play Console for internal testing

---

## Step 7.9: Create Production Build (Optional)

Production builds are for app store distribution.

### iOS Production

```bash
eas build --profile production --platform ios
```

**Requirements**:
- Apple Developer account
- App Store Connect app created
- All required assets (icons, screenshots)
- Privacy policy, terms of service

### Android Production

```bash
eas build --profile production --platform android
```

**Requirements**:
- Google Play Console account ($25 one-time)
- Play Console app created
- All required assets

---

## Step 7.10: Submit to App Stores (Optional, Guidance Only)

### iOS - App Store

**Prerequisites**:
1. Create app in App Store Connect
2. Fill all required information
3. Upload screenshots (use Figma or similar)
4. Set pricing and availability

**Submit**:
```bash
eas submit --platform ios
```

**Or manual**:
1. Download .ipa from EAS build
2. Upload via Transporter app or Xcode

**Review process**: 1-2 days typically

### Android - Play Store

**Prerequisites**:
1. Create app in Play Console
2. Fill store listing
3. Upload screenshots
4. Set pricing and availability
5. Complete content rating questionnaire

**Submit**:
```bash
eas submit --platform android
```

**Or manual**:
1. Download .aab from EAS build
2. Upload to Play Console → Production track

**Review process**: Few hours to 1 day typically

---

## Step 7.11: Update Documentation

### Update docs/tech-stack.md

Add deployment section:

```markdown
## Deployment

### Platform
- **Expo Application Services (EAS)**
- **iOS**: [App Store link] (when published)
- **Android**: [Play Store link] (when published)

### Build Profiles
- **Development**: For testing with dev client
- **Preview**: Internal testing (TestFlight/Internal Testing)
- **Production**: App store distribution

### Build Process
- Managed by EAS Build
- Builds on Expo's servers
- Download artifacts or submit directly

### Environment Variables
- Configured as EAS secrets
- List: `eas secret:list`
```

### Update README.md

Add mobile deployment info:

```markdown
## Mobile App Development

### Development Build

Install development build:

\```bash
# Build
eas build --profile development --platform [ios/android]

# Run on device
npm start
\```

### Testing

Development builds support:
- Hot reload
- DevTools
- Full Expo SDK
- Custom native code

### Production

Production builds managed by EAS:
- iOS: App Store
- Android: Google Play Store

See `docs/tech-stack.md` for full deployment process.
```

---

## Final Checklist

After Step 7:

**EAS Setup**:
- [ ] EAS CLI installed
- [ ] Logged in to Expo account
- [ ] Project initialized (`eas init`)
- [ ] `projectId` in app.json
- [ ] `eas.json` configured

**Environment**:
- [ ] All secrets added to EAS
- [ ] Secrets verified (`eas secret:list`)
- [ ] Variables match production Supabase

**Development Build**:
- [ ] Development build created
- [ ] Build completed successfully
- [ ] Build installed on device/simulator
- [ ] Development server works
- [ ] Hot reload functional

**Testing**:
- [ ] App loads and runs
- [ ] All features working
- [ ] Theme applied correctly
- [ ] Database connection working
- [ ] Navigation functional

**Documentation**:
- [ ] `docs/tech-stack.md` updated
- [ ] README.md updated with build instructions
- [ ] EAS project documented

**Optional (Production)**:
- [ ] Preview builds tested
- [ ] Production builds created
- [ ] App Store / Play Store configured
- [ ] Apps submitted (if ready)

---

## Common Issues

### "Expo account not configured"

**Cause**: Not logged in

**Solution**:
```bash
eas logout
eas login
```

### Build fails with credentials error

**Cause**: Missing Apple/Google credentials

**Solution**:
```bash
# Generate new credentials
eas credentials
```

Follow prompts to configure.

### "Simulator build failed"

**Cause**: Only works on macOS

**Solution**: Use Android or physical iOS device instead.

### Environment variables not working in build

**Cause**: Not set as EAS secrets

**Solution**:
```bash
eas secret:create --scope project --name VAR_NAME --value "value"
```

Then rebuild.

### Build takes too long

**Normal**: First build takes 15-30 minutes
- Subsequent builds are faster (5-15 minutes)
- Cached dependencies speed up process

**If excessive (>1 hour)**:
- Check build logs for issues
- Verify dependencies are correct
- Check for build script errors

### Can't install on device

**iOS**:
- Device must be registered in Apple Developer
- Or use TestFlight for easier distribution

**Android**:
- Enable "Install from unknown sources"
- Or use Play Internal Testing

---

## Next Steps

With Expo/EAS configured:

✅ **Development builds** for testing
✅ **Build infrastructure** set up
✅ **Ready for production** builds
✅ **App store submission** process understood

**Next**:
- Proceed to Step 8: Tools Validation

---

## Additional Resources

**EAS Documentation**:
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [EAS Secrets](https://docs.expo.dev/build-reference/variables/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

**App Store Guides**:
- [iOS App Distribution](https://docs.expo.dev/submit/ios/)
- [Android App Distribution](https://docs.expo.dev/submit/android/)
- [App Store Connect](https://developer.apple.com/app-store-connect/)
- [Google Play Console](https://play.google.com/console/)

**Credentials**:
- [iOS Credentials](https://docs.expo.dev/app-signing/app-credentials/)
- [Android Credentials](https://docs.expo.dev/app-signing/android-credentials/)

**Troubleshooting**:
- [Build Errors](https://docs.expo.dev/build-reference/troubleshooting/)
- [Common Issues](https://docs.expo.dev/build-reference/common-errors/)
