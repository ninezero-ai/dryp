# Dryp

A React Native mobile application for finding restrooms and facilities near you. Built with React Native, Expo, and shadcn/ui.

## Features

- 🔐 Mock authentication system
- 🗺️ Interactive map view showing nearby facilities
- 📋 List view with detailed information
- 🔄 Seamless toggle between map and list views
- 💙 Beautiful blue-themed UI
- 📱 Optimized for Android phones and tablets

## Screenshots

| Login Screen | Map View | List View |
|-------------|----------|-----------|
| ![Login](screenshots/login.png) | ![Map](screenshots/map.png) | ![List](screenshots/list.png) |

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- React Native Maps
- shadcn/ui (via nativecn)
- AsyncStorage for persistence

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator)
- Android device or tablet (for testing)

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

3. Start the development server:
```bash
npm start
```

4. Run on Android:
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

## Project Structure

```
dryp/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context (Auth)
│   ├── screens/            # Main app screens
│   │   ├── LoginScreen.tsx
│   │   └── MainScreen.tsx
│   ├── theme/
│   │   └── colors.ts      # Blue color scheme
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

Made with 💙 by NineZero AI
