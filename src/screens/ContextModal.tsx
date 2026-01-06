/**
 * Context Modal - Non-skippable explanation of Project 1356 philosophy
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ContextModalProps {
  onContinue: () => void;
}

export const ContextModal: React.FC<ContextModalProps> = ({ onContinue }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Project 1356</Text>
        
        <View style={styles.section}>
          <Text style={styles.heading}>Origin</Text>
          <Text style={styles.text}>
            Project 1356 is inspired by ArminMehdiz and the philosophy of shared deadlines and hidden goals.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Philosophy</Text>
          <Text style={styles.text}>
            Every user operates under a countdown, not a checklist. The deadline is finite and visible, while goals remain private and hidden. Pressure comes from time scarcity, not social comparison.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Commitment</Text>
          <Text style={styles.text}>
            Every remaining day carries weight. This is not a task manager or habit tracker. This is a long-horizon commitment system anchored in irreversible time.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 2,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#333',
    padding: 18,
    margin: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});

