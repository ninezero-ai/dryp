declare module '@badatgil/expo-mapbox-navigation' {
  export interface NavigationOptions {
    origin: [number, number]; // [longitude, latitude]
    destination: [number, number]; // [longitude, latitude]
    profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling';
    voiceInstructions?: boolean;
    bannerInstructions?: boolean;
    simulationMode?: boolean;
  }

  export function startNavigation(options: NavigationOptions): Promise<void>;
  export function endNavigation(): Promise<void>;
}
