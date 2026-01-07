/**
 * Main Countdown Screen
 * Displays global countdown and goals grid
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserCommitment, Goal, UserProfile } from '../types';
import { countdownService } from '../services/countdown';
import { storageService } from '../services/storage';
import { GoalCard } from '../components/GoalCard';
import { Sidebar } from '../components/Sidebar';
import { GoalDetailModal } from '../components/GoalDetailModal';

export const CountdownScreen: React.FC = () => {
  const [commitment, setCommitment] = useState<UserCommitment | null>(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [goalDetailVisible, setGoalDetailVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigation = useNavigation<any>();

  const loadData = useCallback(async () => {
    const [loadedCommitment, loadedProfile] = await Promise.all([
      storageService.loadCommitment(),
      storageService.loadProfile(),
    ]);
    
    if (loadedCommitment) {
      setCommitment(loadedCommitment);
      setRemainingDays(countdownService.getRemainingDays(loadedCommitment.countdown));
    }
    
    if (loadedProfile) {
      setProfile(loadedProfile);
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when screen comes into focus (e.g., after adding a goal)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (!commitment) return;

    // Update countdown every minute
    const interval = setInterval(() => {
      const days = countdownService.getRemainingDays(commitment.countdown);
      setRemainingDays(days);
    }, 60000);

    return () => clearInterval(interval);
  }, [commitment]);

  if (!commitment) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isComplete = countdownService.isComplete(commitment.countdown);
  const endDate = new Date(commitment.countdown.endDate);
  const endDateFormatted = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleGoalPress = (goal: Goal) => {
    if (goal.locked) {
      Alert.alert(
        'Locked Goal',
        `This goal is locked until the timer ends.\n\nEnd Date: ${endDateFormatted}\nTime: ${endDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedGoal(goal);
    setGoalDetailVisible(true);
  };

  const handleEditGoal = () => {
    setGoalDetailVisible(false);
    if (selectedGoal) {
      navigation.navigate('EditGoal', { goalId: selectedGoal.id });
    }
  };

  const handleToggleLock = async (locked: boolean) => {
    if (!selectedGoal || !commitment) return;
    const updatedGoals = commitment.goals.map((g) =>
      g.id === selectedGoal.id ? { ...g, locked } : g
    );
    const updatedCommitment: UserCommitment = {
      ...commitment,
      goals: updatedGoals,
    };
    setCommitment(updatedCommitment);
    setSelectedGoal({ ...selectedGoal, locked });
    await storageService.saveCommitment(updatedCommitment);
  };

  return (
    <View style={styles.container}>
      {/* Header with Burger Menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.burgerButton}>
          <Text style={styles.burgerIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Global Countdown Display */}
        <View style={styles.countdownSection}>
          <Text style={styles.countdownLabel}>Remaining Days</Text>
          <Text style={styles.countdownValue}>
            {isComplete ? '0' : remainingDays.toLocaleString()}
          </Text>
          {isComplete && (
            <Text style={styles.completeText}>Countdown Complete</Text>
          )}
          <TouchableOpacity onPress={() => setEndDateModalVisible(true)}>
            <Text style={styles.endDateText}>Ends: {endDateFormatted}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Goals Grid */}
        <View style={styles.goalsSection}>
          <Text style={styles.goalsTitle}>Main Goals</Text>
          <View style={styles.goalsGrid}>
            {commitment.goals.slice(0, 6).map((goal, index) => (
              <View
                key={goal.id}
                style={styles.goalCardWrapper}
              >
                <TouchableOpacity
                  onPress={() => handleGoalPress(goal)}
                  disabled={goal.locked}
                  activeOpacity={goal.locked ? 1 : 0.7}
                >
                  <GoalCard goal={goal} index={index} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Supporting Goals Grid */}
        {commitment.goals.length > 6 && (
          <View style={styles.goalsSection}>
            <Text style={styles.goalsTitle}>Supporting Goals</Text>
            <View style={styles.goalsGrid}>
              {commitment.goals.slice(6).map((goal, index) => (
                <View
                  key={goal.id}
                  style={styles.goalCardWrapper}
                >
                  <TouchableOpacity
                    onPress={() => handleGoalPress(goal)}
                    disabled={goal.locked}
                    activeOpacity={goal.locked ? 1 : 0.7}
                  >
                    <GoalCard goal={goal} index={index + 6} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        profile={profile || undefined}
        onClose={() => setSidebarVisible(false)}
        onProfilePress={() => {
          setSidebarVisible(false);
          navigation.navigate('Profile');
        }}
        onAddGoalsPress={() => {
          setSidebarVisible(false);
          navigation.navigate('AddGoals');
        }}
        onSettingsPress={() => {
          setSidebarVisible(false);
          navigation.navigate('Settings');
        }}
        onAboutPress={() => {
          setSidebarVisible(false);
          navigation.navigate('About');
        }}
        onExportPress={() => {
          setSidebarVisible(false);
          navigation.navigate('Export');
        }}
        onImportPress={() => {
          setSidebarVisible(false);
          navigation.navigate('Import');
        }}
      />

      {/* Goal Detail Modal */}
      <GoalDetailModal
        visible={goalDetailVisible}
        goal={selectedGoal}
        onClose={() => setGoalDetailVisible(false)}
        onEdit={handleEditGoal}
        onToggleLock={handleToggleLock}
      />

      {/* End Date Modal */}
      <Modal
        visible={endDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEndDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Countdown End Date</Text>
            <Text style={styles.modalDate}>{endDateFormatted}</Text>
            <Text style={styles.modalTime}>
              {endDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setEndDateModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#1a1a1a',
  },
  burgerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  burgerIcon: {
    color: '#e0e0e0',
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  countdownSection: {
    alignItems: 'center',
    paddingVertical: 48,
    marginBottom: 32,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
    letterSpacing: 2,
  },
  countdownValue: {
    fontSize: 72,
    fontWeight: '200',
    color: '#e0e0e0',
    letterSpacing: 4,
  },
  completeText: {
    fontSize: 18,
    color: '#4a9',
    marginTop: 16,
  },
  endDateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  goalsSection: {
    marginTop: 32,
  },
  goalsTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#b0b0b0',
    marginBottom: 24,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  goalCardWrapper: {
    width: '50%',
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 20,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 8,
  },
  modalTime: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});
