/**
 * Categorization Summary Screen
 * Shows user their commitment mode and philosophical meaning
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CategorizationResult } from '../services/ruleEngine';
import { ruleEngine } from '../services/ruleEngine';

interface CategorizationSummaryProps {
  categorization: CategorizationResult;
  goalCount: number;
  durationDays: number;
  onContinue: () => void;
}

export const CategorizationSummary: React.FC<CategorizationSummaryProps> = ({
  categorization,
  goalCount,
  durationDays,
  onContinue,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Commitment</Text>
      
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Mode</Text>
        <Text style={styles.summaryValue}>
          {ruleEngine.getModeDisplayName(categorization.mode)}
        </Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Configuration</Text>
        <Text style={styles.summaryText}>{goalCount} goals</Text>
        <Text style={styles.summaryText}>{durationDays} days</Text>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionTitle}>Meaning</Text>
        <Text style={styles.descriptionText}>{categorization.description}</Text>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          All commitment modes are valid and equal in system access. No category is locked, gated, or monetized.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Begin Countdown</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 32,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '300',
    color: '#e0e0e0',
  },
  summaryText: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 4,
  },
  descriptionBox: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  noteBox: {
    backgroundColor: '#1a2a1a',
    padding: 16,
    borderRadius: 4,
    marginBottom: 32,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  noteText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});

