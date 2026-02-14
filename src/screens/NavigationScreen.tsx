import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { colors } from '../theme/colors';
import { Location } from '../types';

// Note: In production, use environment variables for this
Mapbox.setAccessToken('pk.eyJ1IjoiZHJ5cC1kZW1vIiwiYSI6ImNsczB1NHBxdzAxZzAyaW1uY3FqbW9wZnEifQ.demo_token');

interface NavigationScreenProps {
  destination: Location;
  userLocation: { latitude: number; longitude: number } | null;
  onClose: () => void;
}

interface Route {
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

export default function NavigationScreen({ destination, userLocation, onClose }: NavigationScreenProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [instruction, setInstruction] = useState('Calculating route...');

  useEffect(() => {
    if (userLocation) {
      fetchRoute();
    }
  }, [userLocation]);

  const fetchRoute = async () => {
    if (!userLocation) return;

    try {
      // Mapbox Directions API
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${destination.longitude},${destination.latitude}?access_token=pk.eyJ1IjoiZHJ5cC1kZW1vIiwiYSI6ImNsczB1NHBxdzAxZzAyaW1uY3FqbW9wZnEifQ.demo_token&geometries=geojson&overview=full`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0]);
        setInstruction(`Head to ${destination.name}`);
      } else {
        setInstruction('No route found');
      }
    } catch (error) {
      console.error('Route fetch error:', error);
      setInstruction('Error calculating route');
      Alert.alert('Error', 'Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // For Android Auto integration, we would use:
  // - Mapbox Navigation SDK for Android
  // - Android Auto Desktop Head Unit (DHU) for testing
  // - Google Assistant for voice commands
  const startAndroidAutoNavigation = () => {
    Alert.alert(
      'Android Auto Navigation',
      'Starting turn-by-turn navigation...\n\n' +
      'This would integrate with:\n' +
      '• Mapbox Navigation SDK\n' +
      '• Android Auto Car App\n' +
      '• Voice-guided directions\n' +
      '• Lane guidance & speed limits',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Navigation', 
          onPress: () => {
            Alert.alert(
              'Navigation Started',
              `Navigating to ${destination.name}\n\nDistance: ${route ? formatDistance(route.distance) : '...'}\nDuration: ${route ? formatDuration(route.duration) : '...'}`
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navigation</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.instructionBar}>
        <Text style={styles.instructionText}>{instruction}</Text>
        {route && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeDistance}>{formatDistance(route.distance)}</Text>
            <Text style={styles.routeDuration}>{formatDuration(route.duration)}</Text>
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
            <Text style={styles.loadingText}>Calculating optimal route...</Text>
          </View>
        ) : (
          <Mapbox.MapView style={styles.map}>
            <Mapbox.Camera
              zoomLevel={14}
              centerCoordinate={[
                userLocation?.longitude || destination.longitude,
                userLocation?.latitude || destination.latitude,
              ]}
            />
            
            {userLocation && (
              <Mapbox.PointAnnotation
                id="userLocation"
                coordinate={[userLocation.longitude, userLocation.latitude]}
              >
                <View style={styles.userLocationMarker} />
              </Mapbox.PointAnnotation>
            )}

            <Mapbox.PointAnnotation
              id="destination"
              coordinate={[destination.longitude, destination.latitude]}
            >
              <View style={styles.destinationMarker}>
                <Text style={styles.destinationMarkerText}>🚻</Text>
              </View>
            </Mapbox.PointAnnotation>

            {route && (
              <Mapbox.ShapeSource
                id="routeSource"
                shape={{
                  type: 'Feature',
                  geometry: route.geometry,
                  properties: {},
                }}
              >
                <Mapbox.LineLayer
                  id="routeLine"
                  style={{
                    lineColor: colors.primary[600],
                    lineWidth: 6,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </Mapbox.ShapeSource>
            )}
          </Mapbox.MapView>
        )}
      </View>

      <View style={styles.androidAutoBanner}>
        <Text style={styles.androidAutoIcon}>🚗</Text>
        <View style={styles.androidAutoTextContainer}>
          <Text style={styles.androidAutoTitle}>Android Auto Ready</Text>
          <Text style={styles.androidAutoSubtitle}>Connect to your car for turn-by-turn navigation</Text>
        </View>
        <TouchableOpacity style={styles.androidAutoButton} onPress={startAndroidAutoNavigation}>
          <Text style={styles.androidAutoButtonText}>Start</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>End Navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 60,
  },
  instructionBar: {
    backgroundColor: colors.primary[800],
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  routeInfo: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  routeDistance: {
    fontSize: 16,
    color: colors.primary[200],
  },
  routeDuration: {
    fontSize: 16,
    color: colors.primary[200],
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[600],
    borderWidth: 3,
    borderColor: '#fff',
  },
  destinationMarker: {
    backgroundColor: colors.primary[600],
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  destinationMarkerText: {
    fontSize: 20,
  },
  androidAutoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  androidAutoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  androidAutoTextContainer: {
    flex: 1,
  },
  androidAutoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  androidAutoSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  androidAutoButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  androidAutoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
