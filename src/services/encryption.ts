/**
 * Encryption service for import/export functionality
 * Uses simple AES-like encryption for data protection
 * Configured for React Native compatibility
 */

import CryptoJS from 'crypto-js';

// Override random number generation to use Math.random instead of native crypto
// This is required for React Native where native crypto modules aren't available
CryptoJS.lib.WordArray.random = function(nBytes: number) {
  const words: number[] = [];
  for (let i = 0; i < nBytes; i += 4) {
    words.push((Math.random() * 0x100000000) | 0);
  }
  return CryptoJS.lib.WordArray.create(words, nBytes);
};

const ENCRYPTION_KEY = 'project1356-secure-key-v1'; // In production, derive from device ID or user input

export interface ExportData {
  commitment: any;
  profile: any;
  settings: any;
  version: string;
  exportedAt: number;
}

class EncryptionService {
  /**
   * Encrypt data for export
   * Uses simple AES encryption with automatic IV handling
   */
  encrypt(data: ExportData): string {
    try {
      const jsonString = JSON.stringify(data);
      // Use simple encryption - CryptoJS handles IV automatically
      const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt imported data
   * Uses simple AES decryption
   */
  decrypt(encryptedData: string): ExportData {
    try {
      // Trim whitespace that might be added during copy/paste
      const trimmedData = encryptedData.trim();
      
      // Decrypt using the same key
      const decrypted = CryptoJS.AES.decrypt(trimmedData, ENCRYPTION_KEY);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!jsonString) {
        console.error('Decryption failed: empty result');
        console.error('Input length:', trimmedData.length);
        console.error('Input preview:', trimmedData.substring(0, 50));
        throw new Error('Invalid encrypted data - decryption returned empty result. Please ensure you copied the complete backup data.');
      }

      const data = JSON.parse(jsonString);
      
      // Validate that we got valid data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data structure after decryption');
      }
      
      return data;
    } catch (error: any) {
      console.error('Decryption error:', error);
      if (error.message && error.message.includes('Invalid encrypted data')) {
        throw error;
      }
      throw new Error('Failed to decrypt data. The file may be corrupted or from a different version. Please ensure you copied the complete backup data without any modifications.');
    }
  }

  /**
   * Generate export data structure
   */
  async generateExportData(): Promise<ExportData> {
    const { storageService } = await import('./storage');
    
    const [commitment, profile, settings] = await Promise.all([
      storageService.loadCommitment(),
      storageService.loadProfile(),
      storageService.loadNotificationSettings(),
    ]);

    return {
      commitment: commitment || null,
      profile: profile || null,
      settings: settings || null,
      version: '1.0.0',
      exportedAt: Date.now(),
    };
  }

  /**
   * Import and restore data
   */
  async importData(exportData: ExportData): Promise<void> {
    const { storageService } = await import('./storage');

    if (exportData.commitment) {
      await storageService.saveCommitment(exportData.commitment);
    }

    if (exportData.profile) {
      await storageService.saveProfile(exportData.profile);
    }

    if (exportData.settings) {
      await storageService.saveNotificationSettings(exportData.settings);
    }
  }
}

export const encryptionService = new EncryptionService();
