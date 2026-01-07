/**
 * Import Screen - Import encrypted backup file
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { encryptionService } from '../services/encryption';

export const ImportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isImporting, setIsImporting] = useState(false);
  const [encryptedData, setEncryptedData] = useState('');

  const handleImport = async () => {
    if (!encryptedData.trim()) {
      Alert.alert('Error', 'Please paste your backup data.');
      return;
    }

    setIsImporting(true);
    try {
      // Decrypt and import
      const exportData = encryptionService.decrypt(encryptedData.trim());
      await encryptionService.importData(exportData);
      
      Alert.alert(
        'Success',
        'Backup imported successfully! Your data has been restored.',
        [
          {
            text: 'OK',
            onPress: () => {
              setEncryptedData('');
              navigation.navigate('Countdown' as never);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Import error:', error);
      Alert.alert('Import Failed', error.message || 'Failed to import backup. Please ensure the data is a valid Project 1356 backup.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import Backup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>📥 Restore Your Data</Text>
          <Text style={styles.guideText}>
            Paste your encrypted backup data below to restore your commitment, goals, profile, and settings.
          </Text>
          <Text style={styles.guideText}>
            To get your backup data: Export a backup from Project 1356, then open the shared file and copy its contents.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideWarning}>⚠️ Warning:</Text> Importing will overwrite your current data. Only import data you exported from Project 1356.
          </Text>
        </View>

        <Text style={styles.label}>Backup Data *</Text>
        <TextInput
          style={styles.textInput}
          value={encryptedData}
          onChangeText={setEncryptedData}
          placeholder="Paste your encrypted backup data here..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.importButton, (isImporting || !encryptedData.trim()) && styles.importButtonDisabled]}
          onPress={handleImport}
          disabled={isImporting || !encryptedData.trim()}
        >
          {isImporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#e0e0e0" />
              <Text style={styles.importButtonText}>Importing...</Text>
            </View>
          ) : (
            <Text style={styles.importButtonText}>📥 Import Backup</Text>
          )}
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
  guideBox: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e0e0e0',
    marginBottom: 12,
  },
  guideText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    marginBottom: 12,
  },
  guideWarning: {
    color: '#ffa500',
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 8,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    padding: 16,
    borderRadius: 4,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 200,
    fontFamily: 'monospace',
  },
  importButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
