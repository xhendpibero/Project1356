/**
 * Export Screen - Export encrypted backup of user data
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Clipboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { encryptionService } from '../services/encryption';

export const ExportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isExporting, setIsExporting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Generate export data
      const exportData = await encryptionService.generateExportData();
      
      // Encrypt the data
      const encrypted = encryptionService.encrypt(exportData);
      setEncryptedData(encrypted);
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `project1356-backup-${timestamp}.p1356`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      
      // Write file (optional - for sharing)
      let fileWritten = false;
      try {
        await RNFS.writeFile(filePath, encrypted, 'utf8');
        fileWritten = true;
        
        // Try to share the file (optional - don't fail if this doesn't work)
        try {
          const shareOptions: any = {
            title: 'Export Project 1356 Backup',
            message: 'Project 1356 encrypted backup file',
            url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
            type: 'text/plain',
          };
          
          // Only add filename for iOS
          if (Platform.OS === 'ios') {
            shareOptions.filename = filename;
          }
          
          await Share.open(shareOptions);
        } catch (shareError) {
          // Sharing failed, but that's okay - data is already displayed
          console.log('File sharing failed (optional):', shareError);
        }
      } catch (fileError) {
        // File writing failed, but that's okay - data is already displayed
        console.log('File writing failed (optional):', fileError);
      } finally {
        // Clean up file if it was written
        if (fileWritten) {
          await RNFS.unlink(filePath).catch(() => {});
        }
      }
    } catch (error: any) {
      console.error('Export error:', error);
      // Only show error if encryption failed (data not displayed)
      if (!encryptedData) {
        Alert.alert('Export Failed', error.message || 'Failed to export backup. Please try again.');
      }
      // If encryption succeeded but sharing failed, data is already displayed, so no error needed
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Backup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>📦 Backup Your Data</Text>
          <Text style={styles.guideText}>
            Export your commitment, goals, profile, and settings as an encrypted backup file.
          </Text>
          <Text style={styles.guideText}>
            This backup can be imported back into Project 1356 on any device. Your data is encrypted for security.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideWarning}>⚠️ Important:</Text> Some phones may delete app storage/cache when the app is not used for a long time. Regular backups help protect your commitment data.
          </Text>
        </View>

        {encryptedData ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>✅ Backup Generated</Text>
            <Text style={styles.resultText}>
              Your backup data is ready. Copy the encrypted data below to save it manually, or use the copy button:
            </Text>
            <TextInput
              style={styles.backupDataInput}
              value={encryptedData}
              multiline
              editable={false}
              selectTextOnFocus
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.copyButton}
              onPress={async () => {
                if (encryptedData) {
                  await Clipboard.setString(encryptedData);
                  Alert.alert('Copied', 'Backup data copied to clipboard. You can paste it in the Import screen.');
                }
              }}
            >
              <Text style={styles.copyButtonText}>📋 Copy Backup Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newExportButton}
              onPress={() => {
                setEncryptedData(null);
              }}
            >
              <Text style={styles.newExportButtonText}>Create New Backup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#e0e0e0" />
                <Text style={styles.exportButtonText}>Exporting...</Text>
              </View>
            ) : (
              <Text style={styles.exportButtonText}>📤 Export Backup</Text>
            )}
          </TouchableOpacity>
        )}
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
  exportButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultBox: {
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a9',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  backupDataInput: {
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    padding: 16,
    borderRadius: 4,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 150,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  newExportButton: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  newExportButtonText: {
    color: '#888',
    fontSize: 14,
  },
});

