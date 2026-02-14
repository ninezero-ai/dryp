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
  type: 'restroom' | 'water' | 'shower' | 'maintenance';
  rating: number;
  distance?: string;
  address: string;
  accessibility: boolean;
  hours: string;
  maintenanceStatus?: 'operational' | 'maintenance_required' | 'under_maintenance';
  lastMaintenance?: string;
}

type ViewMode = 'map' | 'list';

export type MarkerAction = 'navigate' | 'view' | 'maintenance';
