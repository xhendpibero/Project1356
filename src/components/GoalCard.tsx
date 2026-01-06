/**
 * Goal Card Component
 * Displays individual goal with lock status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  index: number;
}

const GOAL_ICONS = ['🎯', '🌟', '💎', '🔥', '⚡', '🌱', '🚀', '💫', '🎨', '🔮'];

export const GoalCard: React.FC<GoalCardProps> = ({ goal, index }) => {
  const icon = goal.icon || GOAL_ICONS[index % GOAL_ICONS.length];
  const displayTitle = goal.locked ? 'Locked Goal' : goal.title;
  const maskedTitle = goal.locked
    ? goal.title
        .split('')
        .map((char, i) => (i % 3 === 0 ? char : '•'))
        .join('')
    : goal.title;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
        {goal.locked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockBadgeText}>🔒</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {goal.locked ? maskedTitle : displayTitle}
      </Text>
      
      {!goal.locked && goal.detail && (
        <Text style={styles.detail} numberOfLines={3}>
          {goal.detail}
        </Text>
      )}
      
      {goal.locked && (
        <Text style={styles.lockedHint}>
          Unlocks when countdown completes
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  icon: {
    fontSize: 32,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadgeText: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e0e0e0',
    marginBottom: 8,
    textAlign: 'center',
  },
  detail: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
    marginTop: 4,
  },
  lockedHint: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

