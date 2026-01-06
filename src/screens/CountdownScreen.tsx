/**
 * Main Countdown Screen
 * Displays global countdown and goals grid
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { UserCommitment } from '../types';
import { countdownService } from '../services/countdown';
import { storageService } from '../services/storage';
import { GoalCard } from '../components/GoalCard';

export const CountdownScreen: React.FC = () => {
  const [commitment, setCommitment] = useState<UserCommitment | null>(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const columns = isLandscape ? 3 : 2;

  useEffect(() => {
    // Load commitment from storage
    const loadCommitment = async () => {
      const loaded = await storageService.loadCommitment();
      if (loaded) {
        setCommitment(loaded);
        setRemainingDays(countdownService.getRemainingDays(loaded.countdown));
      }
    };
    loadCommitment();
  }, []);

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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isComplete = countdownService.isComplete(commitment.countdown);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Global Countdown Display */}
      <View style={styles.countdownSection}>
        <Text style={styles.countdownLabel}>Remaining Days</Text>
        <Text style={styles.countdownValue}>
          {isComplete ? '0' : remainingDays.toLocaleString()}
        </Text>
        {isComplete && (
          <Text style={styles.completeText}>Countdown Complete</Text>
        )}
      </View>

      {/* Goals Grid */}
      <View style={styles.goalsSection}>
        <Text style={styles.goalsTitle}>Your Goals</Text>
        <View style={[styles.goalsGrid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {commitment.goals.map((goal, index) => (
            <View
              key={goal.id}
              style={[
                styles.goalCardWrapper,
                { width: `${100 / columns}%` },
              ]}
            >
              <GoalCard goal={goal} index={index} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
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
    gap: 16,
  },
  goalCardWrapper: {
    padding: 8,
  },
});

