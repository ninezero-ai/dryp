import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { Location } from '../types';

// Mock data for locations
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Central Station Restroom',
    description: 'Public restroom - Clean and accessible',
    latitude: 37.7749,
    longitude: -122.4194,
    type: 'restroom',
    rating: 4.5,
    distance: '0.2 mi',
  },
  {
    id: '2',
    name: 'City Library',
    description: 'Free public access - Open 9AM-8PM',
    latitude: 37.776,
    longitude: -122.418,
    type: 'restroom',
    rating: 4.8,
    distance: '0.4 mi',
  },
  {
    id: '3',
    name: 'Starbucks Downtown',
    description: 'Customer access - Purchase required',
    latitude: 37.7755,
    longitude: -122.42,
    type: 'restroom',
    rating: 4.2,
    distance: '0.3 mi',
  },
  {
    id: '4',
    name: 'Public Park Facility',
    description: 'Free outdoor restroom',
    latitude: 37.774,
    longitude: -122.417,
    type: 'restroom',
    rating: 3.8,
    distance: '0.5 mi',
  },
  {
    id: '5',
    name: 'Shopping Mall',
    description: 'Multiple locations - Clean facilities',
    latitude: 37.777,
    longitude: -122.421,
    type: 'restroom',
    rating: 4.6,
    distance: '0.7 mi',
  },
];

type ViewMode = 'map' | 'list';

export default function MainScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const { logout } = useAuth();

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity style={styles.locationCard} activeOpacity={0.7}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationName}>{item.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>
      <Text style={styles.locationDescription}>{item.description}</Text>
      <View style={styles.locationFooter}>
        <Text style={styles.distance}>{item.distance}</Text>
        <TouchableOpacity style={styles.directionsButton}>
          <Text style={styles.directionsText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.smallLogo}>
            <Text style={styles.smallLogoText}>D</Text>
          </View>
          <Text style={styles.headerTitle}>Dryp</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'map' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('map')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'list' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('list')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {mockLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.name}
              description={location.description}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>🚻</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={mockLocations}
          keyExtractor={(item) => item.id}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Bottom Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {mockLocations.length} locations nearby
        </Text>
      </View>
    </SafeAreaView>
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
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[600],
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: '#fff',
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: colors.primary[600],
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 18,
  },
  listContainer: {
    padding: 16,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: colors.primary[700],
    fontWeight: 'bold',
    fontSize: 13,
  },
  locationDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: colors.text.muted,
    fontWeight: '500',
  },
  directionsButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  directionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsBar: {
    backgroundColor: colors.primary[700],
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
