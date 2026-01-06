/**
 * Custom hook to manage app state and determine initial route
 */

import { useState, useEffect } from 'react';
import { AppState } from '../types';
import { storageService } from '../services/storage';
import { countdownService } from '../services/countdown';

export const useAppState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [initialRoute, setInitialRoute] = useState<'Splash' | 'Countdown'>('Splash');

  useEffect(() => {
    const loadAppState = async () => {
      try {
        // Load app state
        const state = await storageService.loadAppState();
        
        if (state?.isOnboarded && state.commitment) {
          // Validate countdown integrity
          const isValid = countdownService.validateIntegrity(state.commitment.countdown);
          
          if (isValid) {
            setAppState(state);
            setInitialRoute('Countdown');
          } else {
            // Countdown integrity check failed - reset onboarding
            console.warn('Countdown integrity check failed');
            await storageService.clearAll();
          }
        } else {
          // First time user
          setInitialRoute('Splash');
        }
      } catch (error) {
        console.error('Failed to load app state:', error);
        setInitialRoute('Splash');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppState();
  }, []);

  return {
    isLoading,
    appState,
    initialRoute,
  };
};

