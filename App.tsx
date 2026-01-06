/**
 * Project 1356 - Countdown-driven life commitment system
 * 
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppState } from './src/hooks/useAppState';
import { notificationService } from './src/services/notifications';

function App() {
  const { isLoading, initialRoute } = useAppState();

  useEffect(() => {
    // Initialize notification service on app start
    notificationService.initialize();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#888" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <AppNavigator initialRoute={initialRoute} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
