/**
 * Settings Screen - Notification frequency and preferences
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NotificationSettings } from '../types';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSettings>({
    frequency: 'daily',
    enabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loaded = await storageService.loadNotificationSettings();
      if (loaded) {
        setSettings(loaded);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await storageService.saveNotificationSettings(settings);
      Alert.alert('Success', 'Settings saved successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const toggleEnabled = () => {
    setSettings({ ...settings, enabled: !settings.enabled });
  };

  const setFrequency = (frequency: 'daily' | 'weekly' | 'custom') => {
    setSettings({ ...settings, frequency });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive daily countdown reminders and milestone alerts
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.switch, settings.enabled && styles.switchActive]}
            onPress={toggleEnabled}
          >
            <View style={[styles.switchThumb, settings.enabled && styles.switchThumbActive]} />
          </TouchableOpacity>
        </View>

        {settings.enabled && (
          <>
            <Text style={styles.label}>Notification Frequency</Text>
            <View style={styles.frequencyOptions}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  settings.frequency === 'daily' && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency('daily')}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    settings.frequency === 'daily' && styles.frequencyButtonTextActive,
                  ]}
                >
                  Daily
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  settings.frequency === 'weekly' && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency('weekly')}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    settings.frequency === 'weekly' && styles.frequencyButtonTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  settings.frequency === 'custom' && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency('custom')}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    settings.frequency === 'custom' && styles.frequencyButtonTextActive,
                  ]}
                >
                  Custom
                </Text>
              </TouchableOpacity>
            </View>

            {settings.frequency === 'custom' && (
              <View style={styles.customDaysContainer}>
                <Text style={styles.label}>Custom Days (comma-separated)</Text>
                <Text style={styles.hintText}>
                  Enter day numbers when you want to receive notifications (e.g., 1, 7, 30, 100)
                </Text>
                <TextInput
                  style={styles.customDaysInput}
                  value={settings.customDays?.join(', ') || ''}
                  onChangeText={(text) => {
                    const days = text
                      .split(',')
                      .map((d) => parseInt(d.trim(), 10))
                      .filter((d) => !isNaN(d) && d > 0);
                    setSettings({
                      ...settings,
                      customDays: days.length > 0 ? days : undefined,
                    });
                  }}
                  placeholder="e.g., 1, 7, 30, 100"
                  placeholderTextColor="#666"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#e0e0e0',
    letterSpacing: 1,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#b0b0b0',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#4a9',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
  },
  switchThumbActive: {
    backgroundColor: '#fff',
    marginLeft: 'auto',
  },
  label: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 24,
    marginBottom: 12,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#333',
    borderColor: '#4a9',
  },
  frequencyButtonText: {
    color: '#b0b0b0',
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  customDaysContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 16,
  },
  customDaysInput: {
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    padding: 16,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
});
