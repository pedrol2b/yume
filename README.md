# yume

<div align="right">
<img align="right" src="https://github.com/user-attachments/assets/8eafc0fa-fec8-4b7a-aee7-a9d4d079d90d" width="320" target="_blank">
</div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

📦 The app serves as a comprehensive mental health tool combining evidence-based breathing techniques with grounding exercises, designed specifically for anxiety management and panic attack situations.

The idea is to provide users with a simple, intuitive interface to help them manage anxiety and panic attacks through guided breathing exercises and grounding techniques.

I came up with the idea after a dearest friend of mine suffered a panic attack and I wanted to help her.

## Core Functionality

**Guided Breathing Exercises**

- 4-7-8 breathing technique with visual circle animation
- Customizable timing for inhale (4s), hold (7s), and exhale (8s) phases
- Visual breathing circle that expands/contracts with breath phases
- Static circle during hold phases for proper guidance
- Audio-free, visual-only guidance suitable for any environment


**5-4-3-2-1 Grounding Exercise**

- Interactive grounding technique for anxiety management
- Step-by-step prompts: 5 things to see, 4 to touch, 3 to hear, 2 to smell, 1 to taste
- Contextual icons for each sense (Eye, Hand, Ear, Flower, Coffee)
- Progress tracking through each step with completion screen

## 🚀 Technical Stack & Architecture

Yume is built as a **Progressive Web App (PWA)** that can be deployed both as a web application and as a native Android APK. This hybrid approach ensures maximum accessibility across platforms while maintaining native app performance.

### **Core Technologies**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS 4.1 with custom animations
- **UI Components**: Radix UI primitives with custom styling
- **TypeScript**: Full type safety throughout the application
- **PWA**: Service Workers with offline support via Workbox
- **Mobile**: Capacitor for native Android APK generation

### **PWA Features**
- 📱 **Installable**: Add to home screen on mobile devices
- 🔄 **Offline Support**: Works without internet after first load
- ⚡ **Fast Loading**: Service worker caching for instant startup
- 🎨 **Native Feel**: Standalone app experience with custom splash screen
- 🔔 **App Manifest**: Proper PWA metadata and shortcuts

### **Android APK Generation**
- **Capacitor**: Ionic's native runtime for web apps
- **Gradle Build System**: Android's official build tools
- **Signed APKs**: Debug keystore for installable applications
- **Custom Icons**: Multi-density icon support (mdpi to xxxhdpi)
- **Java 17**: Modern development environment compatibility

## 🛠️ Development Setup

### **Prerequisites**
```bash
# Required tools
- Node.js 18+
- pnpm (package manager)
- Java JDK 17
- Android SDK (for APK builds)
- ImageMagick (for icon processing)
```

### **Installation**
```bash
# Clone the repository
git clone https://github.com/pedrol2b/yume.git
cd yume

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📱 Building for Android

### **Quick Build (Recommended)**
```bash
# Build PWA + Android APK in one command
npm run deploy:android
```

This will:
1. Build the Next.js application with PWA features
2. Generate service workers for offline support
3. Create Android icons in all required densities
4. Build and sign the Android APK
5. Output `yume-release.apk` ready for installation

### **Step-by-Step Build Process**

#### **1. Initial Setup**
```bash
# Set up Android platform and generate signing keystore
npm run apk:setup
```

#### **2. Build PWA**
```bash
# Build Next.js app with PWA features
npm run pwa:build
```

#### **3. Generate Icons**
```bash
# Create Android icons from your icon-512.png
npm run icons:generate
```

#### **4. Build APK**
```bash
# Build release APK
npm run apk:build

# Or build debug APK
npm run apk:build-debug

# Or build both
npm run apk:full-build
```

### **Available Build Scripts**

| Script | Description |
|--------|-------------|
| `npm run deploy:android` | Complete build pipeline (PWA + APK) |
| `npm run pwa:build` | Build PWA with service workers |
| `npm run apk:build` | Build signed release APK |
| `npm run apk:build-debug` | Build debug APK for testing |
| `npm run icons:generate` | Generate Android icons from icon-512.png |
| `npm run android:clean` | Clean build cache |
| `npm run android:run` | Build and run on Android device |

## 📦 PWA Configuration

### **Service Worker Features**
- **Precaching**: All static assets cached on first visit
- **Runtime Caching**: Dynamic content caching strategies
- **Offline Fallbacks**: App works without internet connection
- **Cache Strategies**: Network-first for API, cache-first for assets

### **Manifest Configuration**
```json
{
  "name": "Yume - Dream",
  "short_name": "Yume",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

## 🔧 Build Configuration

### **Next.js PWA Setup**
```javascript
// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});
```

### **Capacitor Configuration**
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.pedrol2b.yume',
  appName: 'Yume',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};
```

## 📲 Installation & Distribution

### **Web PWA**
1. Visit the web app in any modern browser
2. Look for "Add to Home Screen" prompt
3. Install as PWA for native app experience

### **Android APK**
1. Download `yume-release.apk` from releases
2. Enable "Unknown Sources" in Android settings
3. Install the APK file
4. App appears in your app drawer as "Yume"

### **Development Testing**
```bash
# Run on Android emulator
npm run android:run

# Build and copy APK to device
npm run apk:build
# Transfer yume-release.apk to device and install
```

## 🏗️ Architecture Decisions

### **Why PWA + Capacitor?**
- **Universal Compatibility**: One codebase for web and mobile
- **Offline-First**: Essential for anxiety relief tool availability
- **Fast Development**: Leverage web technologies for mobile
- **Easy Updates**: Web-based updates without app store delays

### **Why Next.js?**
- **Static Export**: Perfect for PWA deployment
- **Performance**: Built-in optimizations for mobile
- **TypeScript**: Type safety for reliable anxiety management tools
- **Modern DX**: Great developer experience for rapid iteration

[contributors-shield]: https://img.shields.io/github/contributors/pedrol2b/yume.svg?style=for-the-badge
[contributors-url]: https://github.com/pedrol2b/yume/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/pedrol2b/yume.svg?style=for-the-badge
[forks-url]: https://github.com/pedrol2b/yume/network/members
[stars-shield]: https://img.shields.io/github/stars/pedrol2b/yume.svg?style=for-the-badge
[stars-url]: https://github.com/pedrol2b/yume/stargazers
[issues-shield]: https://img.shields.io/github/issues/pedrol2b/yume.svg?style=for-the-badge
[issues-url]: https://github.com/pedrol2b/yume/issues
[license-shield]: https://img.shields.io/github/license/pedrol2b/yume.svg?style=for-the-badge
[license-url]: https://github.com/pedrol2b/yume/blob/main/LICENSE
