/**
 * Main App Navigator
 * Handles navigation between onboarding and main app screens
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { ContextModal } from '../screens/ContextModal';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { GoalSetupWizard } from '../screens/GoalSetupWizard';
import { CategorizationSummary } from '../screens/CategorizationSummary';
import { CountdownScreen } from '../screens/CountdownScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AddGoalsScreen } from '../screens/AddGoalsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { EditGoalScreen } from '../screens/EditGoalScreen';
import { ExportScreen } from '../screens/ExportScreen';
import { ImportScreen } from '../screens/ImportScreen';
import { UserCommitment, Goal } from '../types';
import { ruleEngine } from '../services/ruleEngine';
import { countdownService } from '../services/countdown';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

export type RootStackParamList = {
  Splash: undefined;
  Context: undefined;
  Permissions: undefined;
  GoalSetup: undefined;
  Categorization: {
    goalCount: number;
    durationDays: number;
    goals: Goal[];
  };
  Countdown: undefined;
  Profile: undefined;
  AddGoals: undefined;
  Settings: undefined;
  About: undefined;
  EditGoal: { goalId: string };
  Export: undefined;
  Import: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  initialRoute: keyof RootStackParamList;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ initialRoute }) => {
  const handleSetupComplete = async (
    goalCount: number,
    durationDays: number,
    goals: Goal[]
  ) => {
    // Categorize commitment
    const categorization = ruleEngine.categorize(goalCount, durationDays);

    // Create countdown
    const countdown = countdownService.createCountdown(durationDays);

    // Create commitment
    const commitment: UserCommitment = {
      mode: categorization.mode,
      goalCount,
      durationDays,
      goals,
      countdown,
      createdAt: Date.now(),
    };

    // Save commitment
    await storageService.saveCommitment(commitment);

    // Update app state
    await storageService.saveAppState({
      isOnboarded: true,
      commitment,
    });

    // Schedule notifications
    notificationService.initialize();
    notificationService.scheduleDailyReminder(countdown);
    notificationService.scheduleMilestones(countdown);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a1a' },
        }}
      >
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen
              {...props}
              onComplete={() => props.navigation.navigate('Context')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Context">
          {(props) => (
            <ContextModal
              {...props}
              onContinue={() => props.navigation.navigate('Permissions')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Permissions">
          {(props) => (
            <PermissionsScreen
              {...props}
              onComplete={() => props.navigation.navigate('GoalSetup')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="GoalSetup">
          {(props) => (
            <GoalSetupWizard
              {...props}
              onComplete={(goalCount, durationDays, goals) => {
                props.navigation.navigate('Categorization', {
                  goalCount,
                  durationDays,
                  goals,
                });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Categorization">
          {(props) => {
            const { goalCount, durationDays, goals } = props.route.params;
            const categorization = ruleEngine.categorize(goalCount, durationDays);

            return (
              <CategorizationSummary
                {...props}
                categorization={categorization}
                goalCount={goalCount}
                durationDays={durationDays}
                onContinue={async () => {
                  await handleSetupComplete(goalCount, durationDays, goals);
                  props.navigation.replace('Countdown');
                }}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="Countdown">
          {() => <CountdownScreen />}
        </Stack.Screen>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AddGoals" component={AddGoalsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="EditGoal" component={EditGoalScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
        <Stack.Screen name="Import" component={ImportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

