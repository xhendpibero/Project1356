/**
 * Sidebar Menu Component
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { UserProfile } from '../types';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  profile?: UserProfile;
  onProfilePress: () => void;
  onAddGoalsPress: () => void;
  onSettingsPress: () => void;
  onAboutPress: () => void;
  onExportPress: () => void;
  onImportPress: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  profile,
  onProfilePress,
  onAddGoalsPress,
  onSettingsPress,
  onAboutPress,
  onExportPress,
  onImportPress,
}) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.appName}>Project 1356</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileLabel}>Profile</Text>
            {profile ? (
              <View style={styles.profileInfo}>
                <Text style={styles.profileText}>{profile.name}</Text>
                {profile.age && <Text style={styles.profileText}>Age: {profile.age}</Text>}
                {profile.country && <Text style={styles.profileText}>{profile.country}</Text>}
              </View>
            ) : (
              <Text style={styles.profilePlaceholder}>Not set</Text>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={onProfilePress}>
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={onAddGoalsPress}>
              <Text style={styles.menuItemText}>Add Goals</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onSettingsPress}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onAboutPress}>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>

            <View style={styles.backupSection}>
              <View style={styles.guideBox}>
                <Text style={styles.guideText}>
                  💾 Backup your data regularly. Some phones may delete app storage when unused.
                </Text>
              </View>
              <TouchableOpacity style={styles.menuItem} onPress={onExportPress}>
                <Text style={styles.menuItemText}>📤 Export Backup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={onImportPress}>
                <Text style={styles.menuItemText}>📥 Import Backup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRightWidth: 1,
    borderRightColor: '#333',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  appName: {
    fontSize: 20,
    fontWeight: '300',
    color: '#e0e0e0',
    letterSpacing: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 24,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  profileInfo: {
    marginBottom: 12,
  },
  profileText: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 4,
  },
  profilePlaceholder: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  menuItemText: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  backupSection: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
  },
  guideBox: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  guideText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
});

