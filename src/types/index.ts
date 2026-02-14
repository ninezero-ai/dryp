export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: 'restroom' | 'water' | 'shower';
  rating: number;
  distance?: string;
}

export type ViewMode = 'map' | 'list';
