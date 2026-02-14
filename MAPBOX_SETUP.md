# Dryp - Mapbox Integration Setup

## Mapbox Access Token Setup

This app uses Mapbox Maps SDK and Mapbox Navigation SDK. You need to obtain a Mapbox access token to use these features.

### 1. Get Your Mapbox Access Token

1. Go to [Mapbox Studio](https://studio.mapbox.com/)
2. Sign up or log in to your account
3. Navigate to **Tokens** in the left sidebar
4. Click **Create token**
5. Give your token a name (e.g., "Dryp App")
6. Select the scopes you need:
   - **Public scopes**: `STYLES:READ`, `FONTS:READ`, `DATASETS:READ`
   - **Secret scopes**: `DOWNLOADS:READ` (for SDK downloads)
7. Click **Create token**
8. Copy your **Public access token** (starts with `pk.`)

### 2. Configure the Token in Your App

You have several options to configure the token:

#### Option A: Environment Variables (Recommended)

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Add your Mapbox access token:
```
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
```

3. Install expo-env:
```bash
npx expo install expo-env
```

#### Option B: Direct Configuration in app.json

Replace `YOUR_MAPBOX_ACCESS_TOKEN` in `app.json` with your actual token:

```json
{
  "expo": {
    "ios": {
      "config": {
        "mapboxAccessToken": "pk.your_mapbox_token_here"
      }
    },
    "android": {
      "config": {
        "mapboxAccessToken": "pk.your_mapbox_token_here"
      }
    }
  }
}
```

#### Option C: Hardcode in MainScreen.tsx (Development Only)

Replace the token in `src/screens/MainScreen.tsx`:

```typescript
const MAPBOX_ACCESS_TOKEN = 'pk.your_mapbox_token_here';
```

### 3. Get Mapbox Secret Token (For SDK Downloads)

For building the app, you also need a secret token:

1. In Mapbox Studio, go to **Tokens**
2. Create a new **Secret token** (or use an existing one)
3. Enable the `DOWNLOADS:READ` scope
4. Copy the secret token (starts with `sk.`)
5. Add it to `app.json` under `plugins[0][1].RNMapboxMapsDownloadToken`

### 4. Android Auto Compatibility

The Mapbox Navigation SDK is compatible with Android Auto. To enable Android Auto:

1. Add the following to your `AndroidManifest.xml`:
```xml
<uses-feature android:name="android.hardware.type.automotive" android:required="false" />
<uses-feature android:name="android.software.car.templates" android:required="false" />
```

2. Ensure your app has the necessary permissions in `app.json`:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION`
- `FOREGROUND_SERVICE`

3. For Android Auto navigation, the app uses the `@badatgil/expo-mapbox-navigation` package which provides turn-by-turn navigation capabilities.

### 5. Prebuild and Run

After configuring the tokens, prebuild and run the app:

```bash
# Clean prebuild folder
rm -rf ios android

# Prebuild with Expo
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## Features

### 1. Mapbox Maps Integration
- Interactive map with Copenhagen as the default center
- 5 real public restroom/facility locations plotted
- Custom markers with maintenance status indicators
- User location tracking with LocationPuck

### 2. Search Functionality
- Search by name, description, or address
- Real-time filtering of locations
- Works in both map and list views

### 3. Bottom Sheet Menu
Clicking a marker opens a bottom sheet with three options:
- **Navigate**: Opens turn-by-turn navigation using Mapbox Navigation SDK
- **View Installation**: Shows detailed facility information
- **Start Maintenance**: Opens maintenance workflow menu

### 4. Real Copenhagen Locations
1. **Tivoli Gardens Public Restroom** - Vesterbrogade 3
2. **Københavns Hovedbanegård** - Central Station
3. **Rådhuspladsen Public Facility** - City Hall Square
4. **Strøget Shopping District** - Østergade 52
5. **Nyhavn Harbor Facilities** - Nyhavn 1F

## Troubleshooting

### Map shows blank/gray
- Verify your Mapbox access token is correct
- Check that you have internet connectivity
- Ensure the token has the correct scopes

### Navigation not working
- Make sure you have the secret token configured for SDK downloads
- Check that location permissions are granted
- For Android, ensure Google Play Services are up to date

### Build errors
- Clean the project: `rm -rf ios android node_modules && npm install`
- Re-run prebuild: `npx expo prebuild`
- Make sure you have the required native dependencies

## Security Note

**Never commit your Mapbox tokens to version control!**

- Use environment variables for tokens
- Add `.env` to your `.gitignore`
- Use Expo's environment variable system for production builds

## Support

For Mapbox SDK issues:
- [Mapbox React Native Maps Documentation](https://github.com/rnmapbox/maps)
- [Mapbox Navigation SDK Documentation](https://docs.mapbox.com/android/navigation/)
