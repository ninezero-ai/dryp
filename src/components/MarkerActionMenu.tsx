import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { Location, MarkerAction } from '../types';

interface MarkerActionMenuProps {
  visible: boolean;
  location: Location | null;
  onClose: () => void;
  onAction: (action: MarkerAction) => void;
}

const { height } = Dimensions.get('window');

export default function MarkerActionMenu({ visible, location, onClose, onAction }: MarkerActionMenuProps) {
  if (!location) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.menuContainer}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.address}>{location.address}</Text>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              location.maintenanceStatus === 'operational' ? styles.statusOperational :
              location.maintenanceStatus === 'maintenance_required' ? styles.statusWarning :
              styles.statusMaintenance
            ]}>
              <Text style={styles.statusText}>
                {location.maintenanceStatus === 'operational' ? '● Operational' :
                 location.maintenanceStatus === 'maintenance_required' ? '⚠ Maintenance Required' :
                 '🔧 Under Maintenance'}
              </Text>
            </View>
            {location.accessibility && (
              <View style={styles.accessibilityBadge}>
                <Text style={styles.accessibilityText}>♿ Accessible</Text>
              </View>
            )}
          </View>

          <View style={styles.hoursContainer}>
            <Text style={styles.hoursLabel}>Hours: </Text>
            <Text style={styles.hoursText}>{location.hours}</Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.navigateButton]}
              onPress={() => onAction('navigate')}
            >
              <Text style={styles.actionIcon}>🧭</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Navigate to it</Text>
                <Text style={styles.actionSubtitle}>Android Auto compatible</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => onAction('view')}
            >
              <Text style={styles.actionIcon}>👁</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>View Installation</Text>
                <Text style={styles.actionSubtitle}>Details & facilities</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.maintenanceButton]}
              onPress={() => onAction('maintenance')}
            >
              <Text style={styles.actionIcon}>🔧</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Start Maintenance</Text>
                <Text style={styles.actionSubtitle}>Report or schedule service</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: height * 0.75,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  address: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusOperational: {
    backgroundColor: '#dcfce7',
  },
  statusWarning: {
    backgroundColor: '#fef3c7',
  },
  statusMaintenance: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  accessibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
  },
  accessibilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[700],
  },
  hoursContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  hoursLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  hoursText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  navigateButton: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  viewButton: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  maintenanceButton: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});
