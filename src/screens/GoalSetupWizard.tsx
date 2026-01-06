/**
 * Goal Setup Wizard - 3-step process for setting up commitment
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Goal } from '../types';
import { generateId } from '../utils';

interface GoalSetupWizardProps {
  onComplete: (goalCount: number, durationDays: number, goals: Goal[]) => void;
}

export const GoalSetupWizard: React.FC<GoalSetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [goalCount, setGoalCount] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const handleStep1Next = () => {
    const count = parseInt(goalCount, 10);
    if (isNaN(count) || count < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid number of goals (at least 1).');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    const duration = parseInt(durationDays, 10);
    if (isNaN(duration) || duration < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid number of days (at least 1).');
      return;
    }
    
    // Initialize goals array
    const count = parseInt(goalCount, 10);
    const initialGoals: Goal[] = Array.from({ length: count }, () => ({
      id: generateId(),
      title: '',
      detail: '',
      locked: true, // Default to locked
    }));
    setGoals(initialGoals);
    setStep(3);
  };

  const handleGoalChange = (field: 'title' | 'detail' | 'locked', value: string | boolean) => {
    const updatedGoals = [...goals];
    updatedGoals[currentGoalIndex] = {
      ...updatedGoals[currentGoalIndex],
      [field]: value,
    };
    setGoals(updatedGoals);
  };

  const handleNextGoal = () => {
    if (currentGoalIndex < goals.length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      // Validate all goals have titles
      const incompleteGoals = goals.filter(g => !g.title.trim());
      if (incompleteGoals.length > 0) {
        Alert.alert('Incomplete Goals', 'Please provide a title for all goals.');
        return;
      }
      
      // Complete setup
      onComplete(parseInt(goalCount, 10), parseInt(durationDays, 10), goals);
    }
  };

  const handlePreviousGoal = () => {
    if (currentGoalIndex > 0) {
      setCurrentGoalIndex(currentGoalIndex - 1);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Number of Goals</Text>
      <Text style={styles.stepDescription}>
        How many life goals do you wish to commit to?
      </Text>
      <TextInput
        style={styles.input}
        value={goalCount}
        onChangeText={setGoalCount}
        placeholder="Enter number of goals"
        placeholderTextColor="#666"
        keyboardType="number-pad"
        autoFocus
      />
      <TouchableOpacity style={styles.button} onPress={handleStep1Next}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 2: Countdown Duration</Text>
      <Text style={styles.stepDescription}>
        How many days will your countdown last?
      </Text>
      <TextInput
        style={styles.input}
        value={durationDays}
        onChangeText={setDurationDays}
        placeholder="Enter number of days"
        placeholderTextColor="#666"
        keyboardType="number-pad"
        autoFocus
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => setStep(1)}>
          <Text style={styles.buttonTextSecondary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStep2Next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => {
    const currentGoal = goals[currentGoalIndex];
    const isUnlocked = !currentGoal.locked;

    return (
      <ScrollView style={styles.stepContainer}>
        <Text style={styles.stepTitle}>
          Step 3: Goal {currentGoalIndex + 1} of {goals.length}
        </Text>
        
        <View style={styles.lockWarning}>
          <Text style={styles.lockWarningText}>
            Locked goals remain hidden until countdown completion. This is recommended.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.lockToggle, !currentGoal.locked && styles.lockToggleUnlocked]}
          onPress={() => handleGoalChange('locked', !currentGoal.locked)}
        >
          <Text style={styles.lockToggleText}>
            {currentGoal.locked ? '🔒 Locked (Recommended)' : '🔓 Unlocked'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={currentGoal.title}
          onChangeText={(value) => handleGoalChange('title', value)}
          placeholder="Short descriptive text"
          placeholderTextColor="#666"
          autoFocus
        />

        <Text style={styles.label}>Detail</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={currentGoal.detail}
          onChangeText={(value) => handleGoalChange('detail', value)}
          placeholder="Long-form explanation or intention"
          placeholderTextColor="#666"
          multiline
          numberOfLines={6}
        />

        <View style={styles.buttonRow}>
          {currentGoalIndex > 0 && (
            <TouchableOpacity style={styles.buttonSecondary} onPress={handlePreviousGoal}>
              <Text style={styles.buttonTextSecondary}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleNextGoal}>
            <Text style={styles.buttonText}>
              {currentGoalIndex < goals.length - 1 ? 'Next Goal' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    padding: 16,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  lockWarning: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  lockWarningText: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  lockToggle: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  lockToggleUnlocked: {
    borderColor: '#666',
    backgroundColor: '#2a2a1a',
  },
  lockToggleText: {
    color: '#e0e0e0',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
    flex: 1,
    marginRight: 8,
  },
  buttonTextSecondary: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
});

