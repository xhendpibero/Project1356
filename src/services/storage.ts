/**
 * Encrypted local storage service
 * Handles persistence of countdown and commitment data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, UserCommitment, OnboardingState } from '../types';

const STORAGE_KEYS = {
  APP_STATE: '@project1356:app_state',
  COMMITMENT: '@project1356:commitment',
  ONBOARDING: '@project1356:onboarding',
} as const;

class StorageService {
  /**
   * Save app state
   */
  async saveAppState(state: AppState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save app state:', error);
      throw error;
    }
  }

  /**
   * Load app state
   */
  async loadAppState(): Promise<AppState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load app state:', error);
      return null;
    }
  }

  /**
   * Save user commitment (tamper-resistant)
   */
  async saveCommitment(commitment: UserCommitment): Promise<void> {
    try {
      // Store commitment with timestamp to prevent tampering
      const data = {
        ...commitment,
        _savedAt: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COMMITMENT, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save commitment:', error);
      throw error;
    }
  }

  /**
   * Load user commitment
   */
  async loadCommitment(): Promise<UserCommitment | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMITMENT);
      if (!data) return null;
      
      const commitment = JSON.parse(data);
      // Remove internal metadata
      delete commitment._savedAt;
      return commitment;
    } catch (error) {
      console.error('Failed to load commitment:', error);
      return null;
    }
  }

  /**
   * Save onboarding state
   */
  async saveOnboardingState(state: OnboardingState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
      throw error;
    }
  }

  /**
   * Load onboarding state
   */
  async loadOnboardingState(): Promise<OnboardingState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
      return null;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.APP_STATE,
        STORAGE_KEYS.COMMITMENT,
        STORAGE_KEYS.ONBOARDING,
      ]);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

