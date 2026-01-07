/**
 * Goal Setup Wizard - 3-step process for setting up commitment
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Goal } from '../types';
import { generateId } from '../utils';

interface GoalSetupWizardProps {
  onComplete: (goalCount: number, durationDays: number, goals: Goal[]) => void;
}

export const GoalSetupWizard: React.FC<GoalSetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [goalCount, setGoalCount] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [showLockTooltip, setShowLockTooltip] = useState(false);

  const goalSuggestions = [1, 3, 6, 10];
  const durationSuggestions = [100, 365, 1000, 1356];

  const handleStep0Next = () => {
    if (!name.trim()) {
      Alert.alert('Profile Required', 'Please enter your name to continue.');
      return;
    }
    setStep(1);
  };

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
    const mainGoalsCount = Math.min(count, 6);
    const supportingGoalsCount = Math.max(0, count - 6);
    
    // Main goals (first 6) - user will fill these
    const mainGoals: Goal[] = Array.from({ length: mainGoalsCount }, () => ({
      id: generateId(),
      title: '',
      detail: '',
      locked: true, // Default to locked
      imageUrl: '',
    }));
    
    // Supporting goals (7+) - auto-generated
    const supportingGoals: Goal[] = Array.from({ length: supportingGoalsCount }, (_, i) => ({
      id: generateId(),
      title: `Goal ${7 + i}`,
      detail: '',
      locked: true,
      imageUrl: '',
    }));
    
    setGoals([...mainGoals, ...supportingGoals]);
    setStep(3);
  };

  const handleGoalChange = (field: 'title' | 'detail' | 'locked' | 'customDays' | 'imageUrl', value: string | boolean | number | undefined) => {
    const updatedGoals = [...goals];
    updatedGoals[currentGoalIndex] = {
      ...updatedGoals[currentGoalIndex],
      [field]: value,
    };
    setGoals(updatedGoals);
  };

  const handleNextGoal = () => {
    const mainGoalsCount = Math.min(goals.length, 6);
    
    // Only validate main goals (first 6)
    if (currentGoalIndex < mainGoalsCount - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      // Validate main goals have titles
      const mainGoals = goals.slice(0, mainGoalsCount);
      const incompleteGoals = mainGoals.filter(g => !g.title.trim());
      if (incompleteGoals.length > 0) {
        Alert.alert('Incomplete Goals', 'Please provide a title for all main goals.');
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

  const renderStep0 = () => (
    <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent}>
      <Text style={styles.stepTitle}>Profile</Text>
      <Text style={styles.stepDescription}>
        Please provide your basic profile information.
      </Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor="#666"
        autoFocus
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Age (optional)"
        placeholderTextColor="#666"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
        placeholder="Country (optional)"
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.button} onPress={handleStep0Next}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent}>
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
      
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Quick select:</Text>
        <View style={styles.suggestionsRow}>
          {goalSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={[
                styles.suggestionButton,
                goalCount === suggestion.toString() && styles.suggestionButtonActive,
              ]}
              onPress={() => setGoalCount(suggestion.toString())}
            >
              <Text style={[
                styles.suggestionButtonText,
                goalCount === suggestion.toString() && styles.suggestionButtonTextActive,
              ]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStep1Next}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent}>
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
      
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Quick select:</Text>
        <View style={styles.suggestionsRow}>
          {durationSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={[
                styles.suggestionButton,
                durationDays === suggestion.toString() && styles.suggestionButtonActive,
              ]}
              onPress={() => setDurationDays(suggestion.toString())}
            >
              <Text style={[
                styles.suggestionButtonText,
                durationDays === suggestion.toString() && styles.suggestionButtonTextActive,
              ]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => setStep(1)}>
          <Text style={styles.buttonTextSecondary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStep2Next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => {
    const mainGoalsCount = Math.min(goals.length, 6);
    const supportingGoalsCount = Math.max(0, goals.length - 6);
    const currentGoal = goals[currentGoalIndex];

    return (
      <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent}>
        <View style={styles.stepHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.stepTitle}>
              Main Goal {currentGoalIndex + 1} of {mainGoalsCount}
            </Text>
          </View>
          <View style={styles.lockHeader}>
            <View style={styles.lockToggleCompact}>
              <Text style={styles.lockToggleLabel}>
                {currentGoal.locked ? '🔒' : '🔓'}
              </Text>
              <TouchableOpacity
                style={styles.tooltipButton}
                onPress={() => setShowLockTooltip(!showLockTooltip)}
              >
                <Text style={styles.tooltipIcon}>?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.switch, currentGoal.locked && styles.switchActive]}
              onPress={() => handleGoalChange('locked', !currentGoal.locked)}
            >
              <View style={[styles.switchThumb, currentGoal.locked && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {showLockTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              Locked goals remain hidden until countdown completion. This is recommended to maintain commitment focus.
            </Text>
          </View>
        )}

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
          numberOfLines={4}
        />

        <Text style={styles.label}>Image (optional)</Text>
        {currentGoal.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: currentGoal.imageUrl }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => handleGoalChange('imageUrl', '')}
            >
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => {
              try {
                if (!launchImageLibrary) {
                  Alert.alert('Error', 'Image picker is not available. Please rebuild the app.');
                  return;
                }

                const options = {
                  mediaType: 'photo' as MediaType,
                  quality: 0.8 as const,
                  maxWidth: 1024,
                  maxHeight: 1024,
                };

                launchImageLibrary(options, (response: ImagePickerResponse) => {
                  if (response.didCancel) {
                    return;
                  }
                  if (response.errorMessage) {
                    Alert.alert('Error', response.errorMessage);
                    return;
                  }
                  if (response.assets && response.assets[0]) {
                    handleGoalChange('imageUrl', response.assets[0].uri || '');
                  }
                });
              } catch (error) {
                console.error('Image picker error:', error);
                Alert.alert('Error', 'Failed to open image picker. Please ensure the app has been rebuilt.');
              }
            }}
          >
            <Text style={styles.imagePickerText}>📷 Choose from Gallery</Text>
          </TouchableOpacity>
        )}

        <View style={styles.customDaysSection}>
          <View style={styles.customDaysHeader}>
            <Text style={styles.label}>Custom Duration (Optional)</Text>
            <TouchableOpacity
              style={[styles.switch, currentGoal.customDays !== undefined && styles.switchActive]}
              onPress={() => {
                if (currentGoal.customDays !== undefined) {
                  const updatedGoals = [...goals];
                  updatedGoals[currentGoalIndex] = {
                    ...updatedGoals[currentGoalIndex],
                    customDays: undefined,
                  };
                  setGoals(updatedGoals);
                } else {
                  handleGoalChange('customDays', 365);
                }
              }}
            >
              <View style={[styles.switchThumb, currentGoal.customDays !== undefined && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
          {currentGoal.customDays !== undefined && (
            <TextInput
              style={styles.input}
              value={currentGoal.customDays?.toString() || ''}
              onChangeText={(value) => {
                const num = parseInt(value, 10);
                if (isNaN(num) || num <= 0) {
                  const updatedGoals = [...goals];
                  updatedGoals[currentGoalIndex] = {
                    ...updatedGoals[currentGoalIndex],
                    customDays: undefined,
                  };
                  setGoals(updatedGoals);
                } else {
                  handleGoalChange('customDays', num);
                }
              }}
              placeholder="Days for this goal"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          )}
        </View>

        {supportingGoalsCount > 0 && currentGoalIndex === mainGoalsCount - 1 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {supportingGoalsCount} supporting goal{supportingGoalsCount > 1 ? 's' : ''} will be auto-generated as "Goal 7", "Goal 8", etc.
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          {currentGoalIndex > 0 && (
            <TouchableOpacity style={styles.buttonSecondary} onPress={handlePreviousGoal}>
              <Text style={styles.buttonTextSecondary}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleNextGoal}>
            <Text style={styles.buttonText}>
              {currentGoalIndex < mainGoalsCount - 1 ? 'Next Goal' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {step === 0 && renderStep0()}
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
  },
  stepContent: {
    padding: 24,
    paddingTop: 48,
  },
  stepDescription: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    lineHeight: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#e0e0e0',
  },
  lockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lockToggleCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockToggleLabel: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  tooltipButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipIcon: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tooltip: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  tooltipText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#4a9',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
  },
  switchThumbActive: {
    backgroundColor: '#fff',
    marginLeft: 'auto',
  },
  suggestionsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  suggestionButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionButtonActive: {
    backgroundColor: '#333',
    borderColor: '#4a9',
  },
  suggestionButtonText: {
    color: '#b0b0b0',
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionButtonTextActive: {
    color: '#e0e0e0',
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
    padding: 14,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  customDaysSection: {
    marginTop: 16,
  },
  customDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginTop: 24,
  },
  buttonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
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
  infoBox: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  infoText: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  imagePickerButton: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: '#b0b0b0',
    fontSize: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  removeImageText: {
    color: '#888',
    fontSize: 14,
  },
});
