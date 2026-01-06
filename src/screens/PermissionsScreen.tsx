/**
 * Permissions Screen - Request notification and photo access
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { notificationService } from '../services/notifications';

interface PermissionsScreenProps {
  onComplete: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onComplete }) => {
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const handleRequestNotifications = async () => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        setNotificationsGranted(true);
        notificationService.initialize();
      } else {
        Alert.alert(
          'Notifications Required',
          'Project 1356 relies on notifications to remind you of your countdown. Without them, reminders and countdown awareness will be degraded.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to request notifications:', error);
    }
  };

  const handleContinue = () => {
    if (!notificationsGranted) {
      Alert.alert(
        'Warning',
        'You have not granted notification permissions. Your countdown experience will be limited.',
        [
          { text: 'Go Back', style: 'cancel' },
          { text: 'Continue Anyway', onPress: onComplete },
        ]
      );
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Push Notifications</Text>
        <Text style={styles.description}>
          Required to receive daily countdown reminders and milestone alerts.
        </Text>
        {!notificationsGranted && (
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestNotifications}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        )}
        {notificationsGranted && (
          <Text style={styles.grantedText}>✓ Granted</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Photo Access</Text>
        <Text style={styles.description}>
          Optional. Reserved for future use.
        </Text>
        <Text style={styles.optionalText}>Optional</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '500',
  },
  grantedText: {
    color: '#4a9',
    fontSize: 14,
    marginTop: 8,
  },
  optionalText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});

