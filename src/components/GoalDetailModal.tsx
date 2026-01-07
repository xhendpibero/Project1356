/**
 * Goal Detail Modal Component
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Goal } from '../types';

interface GoalDetailModalProps {
  visible: boolean;
  goal: Goal | null;
  onClose: () => void;
  onEdit: () => void;
  onToggleLock: (locked: boolean) => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  visible,
  goal,
  onClose,
  onEdit,
  onToggleLock,
}) => {
  if (!goal) return null;

  const GOAL_ICONS = ['🎯', '🌟', '💎', '🔥', '⚡', '🌱', '🚀', '💫', '🎨', '🔮'];
  const icon = goal.icon || GOAL_ICONS[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Goal Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
              {goal.locked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>🔒</Text>
                </View>
              )}
            </View>

            <Text style={styles.goalTitle}>{goal.title}</Text>

            {goal.detail && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailText}>{goal.detail}</Text>
              </View>
            )}

            {goal.customDays && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Custom Duration</Text>
                <Text style={styles.detailText}>{goal.customDays} days</Text>
              </View>
            )}

            {goal.locked && (
              <View style={styles.lockedNotice}>
                <Text style={styles.lockedText}>
                  This goal is locked and will unlock when the countdown completes.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onToggleLock(!goal.locked)}
            >
              <Text style={styles.editButtonText}>
                {goal.locked ? 'Unlock Goal' : 'Lock Goal'}
              </Text>
            </TouchableOpacity>
            {!goal.locked && (
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editButtonText}>Edit Goal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 24,
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  icon: {
    fontSize: 48,
  },
  lockBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadgeText: {
    fontSize: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#b0b0b0',
    lineHeight: 24,
  },
  lockedNotice: {
    backgroundColor: '#1a2a1a',
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  lockedText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  editButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});

