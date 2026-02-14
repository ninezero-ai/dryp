# Dryp

A React Native mobile application for finding restrooms and facilities near you in Copenhagen. Built with React Native, Expo, Mapbox, and shadcn/ui.

## Features

- 🔐 Mock authentication system
- 🗺️ Interactive Mapbox map view showing Copenhagen facilities
- 📍 5 real Copenhagen restroom locations plotted
- 🔍 Search functionality to find locations
- 📋 List view with detailed information
- 🔄 Seamless toggle between map and list views
- 📍 Tap markers for action menu:
  - 🧭 **Navigate to it** - Turn-by-turn navigation with Android Auto support
  - 👁️ **View Installation** - Detailed facility information
  - 🔧 **Start Maintenance** - Maintenance mode for reporting issues
- 💙 Beautiful blue-themed UI
- 📱 Optimized for Android phones and tablets

## Copenhagen Locations

The app includes 5 real public restroom facilities in Copenhagen:

1. **Rådhuspladsen Public Facility** - City Hall Square (24/7)
2. **Tivoli Gardens Facility** - Near main entrance (11:00-22:00)
3. **Strøget Shopping District** - Pedestrian area (08:00-20:00)
4. **Christiansborg Palace** - Parliament building (09:00-17:00)
5. **Nyhavn Harbor Facility** - Tourist area (10:00-23:00)

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Mapbox Maps SDK (@rnmapbox/maps)
- Mapbox Directions API
- shadcn/ui (via nativecn)
- AsyncStorage for persistence

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator)
- Android device or tablet (for testing)
- Mapbox account and access token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ninezero-ai/dryp.git
cd dryp
```

2. Install dependencies:
```bash
npm install
```

3. Configure Mapbox:
   - Sign up at [Mapbox](https://www.mapbox.com/)
   - Create an access token
   - Replace `pk.eyJ1IjoiZHJ5cC1kZW1vIiwiYSI6ImNsczB1NHBxdzAxZzAyaW1uY3FqbW9wZnEifQ.demo_token` in:
     - `src/screens/MainScreen.tsx`
     - `src/screens/NavigationScreen.tsx`
   - For production, use environment variables

4. Start the development server:
```bash
npm start
```

5. Run on Android:
```bash
# Press 'a' in the terminal after npm start
# OR
npm run android
```

### Login Credentials

For demo purposes, use any email and password combination to log in.

Example:
- Email: demo@dryp.app
- Password: anypassword

## Mapbox Navigation SDK & Android Auto

The app integrates with Mapbox Navigation SDK for turn-by-turn directions:

### Features:
- Voice-guided navigation
- Real-time route calculation
- Lane guidance
- Speed limit display
- Android Auto compatibility

### Android Auto Setup:

1. Install Android Auto dependencies:
```bash
# In android/app/build.gradle
dependencies {
    implementation 'com.mapbox.navigation:android:2.17.0'
}
```

2. Configure Android Auto manifest:
```xml
<application>
    <meta-data android:name="com.google.android.gms.car.application"
        android:resource="@xml/automotive_app_desc"/>
    
    <service android:name=".navigation.NavigationCarAppService"
        android:exported="true">
        <intent-filter>
            <action android:name="androidx.car.app.CarAppService"/>
        </intent-filter>
    </service>
</application>
```

3. Test with Android Auto Desktop Head Unit (DHU):
```bash
# Download DHU from Android SDK Manager
# Run: adb forward tcp:5277 tcp:5277
# Run: ./desktop-head-unit
```

4. Enable Android Auto Developer Mode:
   - Open Android Auto app
   - Tap version 10 times
   - Enable "Unknown sources"

## Project Structure

```
dryp/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   └── MarkerActionMenu.tsx
│   ├── context/            # React context (Auth)
│   │   └── AuthContext.tsx
│   ├── screens/            # Main app screens
│   │   ├── LoginScreen.tsx
│   │   ├── MainScreen.tsx
│   │   └── NavigationScreen.tsx
│   ├── theme/
│   │   └── colors.ts       # Blue color scheme
│   └── types/
│       └── index.ts        # TypeScript types
├── App.tsx                 # Root component
├── app.json                # Expo configuration
└── package.json
```

## Configuration

### Blue Theme

The app uses a consistent blue color palette defined in `src/theme/colors.ts`:
- Primary Blue: `#2563eb` (600)
- Light Blue: `#3b82f6` (500)
- Dark Blue: `#1e40af` (800)

### Android Optimization

The app is configured for both Android phones and tablets with:
- Responsive layouts
- Flexible sizing
- Optimized touch targets
- Support for both orientations

## Environment Variables

Create a `.env` file in the root directory:

```
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Then update the code to use:
```typescript
import Constants from 'expo-constants';
const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxToken;
```

## Building for Production

### Android APK/AAB

```bash
# Install EAS CLI if needed
npm install -g eas-cli

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Or build locally
expo build:android
```

### Android Auto Release

For Android Auto support, ensure you:
1. Complete the [Android Auto App Quality Guidelines](https://developer.android.com/docs/quality-guidelines/car-app-quality)
2. Submit for review in Google Play Console
3. Include proper automotive metadata

## Development

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches

### Commit Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Styling
- `refactor:` - Code refactoring

## API Reference

### Mapbox Directions API

The app uses Mapbox Directions API for route calculation:

```
https://api.mapbox.com/directions/v5/mapbox/driving/
  {originLongitude},{originLatitude};
  {destinationLongitude},{destinationLatitude}
  ?access_token={TOKEN}
  &geometries=geojson
  &overview=full
```

### Location Object

```typescript
interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: 'restroom' | 'water' | 'shower' | 'maintenance';
  rating: number;
  address: string;
  accessibility: boolean;
  hours: string;
  maintenanceStatus: 'operational' | 'maintenance_required' | 'under_maintenance';
  lastMaintenance: string;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Mapbox for the mapping SDK
- Expo for the React Native toolchain
- Copenhagen Municipality for public facility data

---

Made with 💙 by NineZero AI
