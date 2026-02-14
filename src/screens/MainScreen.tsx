import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { Location, ViewMode, MarkerAction } from '../types';
import SearchBar from '../components/SearchBar';
import MarkerActionMenu from '../components/MarkerActionMenu';
import NavigationScreen from './NavigationScreen';

// Mapbox configuration - In production, use environment variables
Mapbox.setAccessToken('pk.eyJ1IjoiZHJ5cC1kZW1vIiwiYSI6ImNsczB1NHBxdzAxZzAyaW1uY3FqbW9wZnEifQ.demo_token');

// 5 Real Copenhagen Public Restroom Locations
const copenhagenLocations: Location[] = [
  {
    id: '1',
    name: 'Rådhuspladsen Public Facility',
    description: 'Modern public restroom with accessible facilities',
    latitude: 55.676098,
    longitude: 12.568337,
    type: 'restroom',
    rating: 4.5,
    distance: '0.1 km',
    address: 'Rådhuspladsen 1, 1550 København',
    accessibility: true,
    hours: '24/7',
    maintenanceStatus: 'operational',
    lastMaintenance: '2026-02-10',
  },
  {
    id: '2',
    name: 'Tivoli Gardens Facility',
    description: 'Clean facilities near the main entrance',
    latitude: 55.673664,
    longitude: 12.568100,
    type: 'restroom',
    rating: 4.8,
    distance: '0.3 km',
    address: 'Vesterbrogade 3, 1630 København',
    accessibility: true,
    hours: '11:00 - 22:00',
    maintenanceStatus: 'operational',
    lastMaintenance: '2026-02-13',
  },
  {
    id: '3',
    name: 'Strøget Shopping District',
    description: 'Public restroom in the pedestrian shopping area',
    latitude: 55.678635,
    longitude: 12.576088,
    type: 'restroom',
    rating: 4.2,
    distance: '0.5 km',
    address: 'Østergade 52, 1100 København',
    accessibility: true,
    hours: '08:00 - 20:00',
    maintenanceStatus: 'maintenance_required',
    lastMaintenance: '2026-02-01',
  },
  {
    id: '4',
    name: 'Christiansborg Palace',
    description: 'Visitor facilities at the parliament building',
    latitude: 55.676505,
    longitude: 12.580918,
    type: 'restroom',
    rating: 4.6,
    distance: '0.7 km',
    address: 'Prins Jørgens Gård 1, 1218 København',
    accessibility: true,
    hours: '09:00 - 17:00',
    maintenanceStatus: 'operational',
    lastMaintenance: '2026-02-12',
  },
  {
    id: '5',
    name: 'Nyhavn Harbor Facility',
    description: 'Harbor-side restroom for tourists and visitors',
    latitude: 55.679915,
    longitude: 12.590807,
    type: 'restroom',
    rating: 4.0,
    distance: '1.0 km',
    address: 'Nyhavn 1F, 1051 København',
    accessibility: false,
    hours: '10:00 - 23:00',
    maintenanceStatus: 'under_maintenance',
    lastMaintenance: '2026-02-14',
  },
];

export default function MainScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>({
    latitude: 55.676098,
    longitude: 12.568337, // Copenhagen center
  });
  const { logout } = useAuth();

  // Filter locations based on search
  const filteredLocations = copenhagenLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    setMenuVisible(true);
  };

  const handleAction = (action: MarkerAction) => {
    if (!selectedLocation) return;

    switch (action) {
      case 'navigate':
        setNavigatingTo(selectedLocation);
        break;
      case 'view':
        Alert.alert(
          selectedLocation.name,
          `📍 ${selectedLocation.address}\n\n` +
          `📝 ${selectedLocation.description}\n\n` +
          `♿ Accessible: ${selectedLocation.accessibility ? 'Yes' : 'No'}\n` +
          `⏰ Hours: ${selectedLocation.hours}\n` +
          `⭐ Rating: ${selectedLocation.rating}/5\n` +
          `🔧 Status: ${selectedLocation.maintenanceStatus}\n` +
          `📅 Last Maintenance: ${selectedLocation.lastMaintenance}`
        );
        break;
      case 'maintenance':
        Alert.alert(
          'Maintenance Mode',
          'Select maintenance action:',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Report Issue', 
              onPress: () => Alert.alert('Issue Reported', `Maintenance team notified for ${selectedLocation.name}`)
            },
            { 
              text: 'Schedule Service', 
              onPress: () => Alert.alert('Service Scheduled', `Maintenance scheduled for ${selectedLocation.name}`)
            },
          ]
        );
        break;
    }
    setMenuVisible(false);
  };

  const openExternalNavigation = (location: Location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open navigation app');
    });
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationCard}
      activeOpacity={0.7}
      onPress={() => handleMarkerPress(item)}
    >
      <View style={styles.locationHeader}>
        <Text style={styles.locationName}>{item.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>
      <Text style={styles.locationDescription}>{item.description}</Text>
      <Text style={styles.locationAddress}>{item.address}</Text>
      <View style={styles.locationFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.distance}>{item.distance}</Text>
          {item.accessibility && <Text style={styles.accessibility}>♿</Text>}
        </View>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => {
            setSelectedLocation(item);
            handleAction('navigate');
          }}
        >
          <Text style={styles.directionsText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Navigation mode
  if (navigatingTo) {
    return (
      <NavigationScreen
        destination={navigatingTo}
        userLocation={userLocation}
        onClose={() => setNavigatingTo(null)}
      />
    );
  }

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

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search Copenhagen locations..."
      />

      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'map' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
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
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'map' ? (
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={14}
            centerCoordinate={[12.568337, 55.676098]} // Copenhagen center
          />

          {filteredLocations.map((location) => (
            <Mapbox.PointAnnotation
              key={location.id}
              id={location.id}
              coordinate={[location.longitude, location.latitude]}
              onSelected={() => handleMarkerPress(location)}
            >
              <View style={[
                styles.marker,
                location.maintenanceStatus === 'maintenance_required' && styles.markerWarning,
                location.maintenanceStatus === 'under_maintenance' && styles.markerMaintenance,
              ]}>
                <Text style={styles.markerText}>
                  {location.maintenanceStatus === 'under_maintenance' ? '🔧' : '🚻'}
                </Text>
              </View>
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Results Count */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {filteredLocations.length} of {copenhagenLocations.length} locations
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </Text>
      </View>

      {/* Marker Action Menu */}
      <MarkerActionMenu
        visible={menuVisible}
        location={selectedLocation}
        onClose={() => setMenuVisible(false)}
        onAction={handleAction}
      />
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
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerWarning: {
    backgroundColor: colors.warning,
  },
  markerMaintenance: {
    backgroundColor: colors.error,
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
    marginBottom: 4,
    lineHeight: 20,
  },
  locationAddress: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 12,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    fontSize: 14,
    color: colors.text.muted,
    fontWeight: '500',
  },
  accessibility: {
    fontSize: 14,
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
