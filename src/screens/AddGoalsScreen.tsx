/**
 * Add Goals Screen - Add new goals to existing commitment
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { UserCommitment, Goal } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils';

export const AddGoalsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [commitment, setCommitment] = useState<UserCommitment | null>(null);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [locked, setLocked] = useState(true);
  const [customDays, setCustomDays] = useState<number | undefined>(undefined);
  const [showCustomDays, setShowCustomDays] = useState(false);

  useEffect(() => {
    loadCommitment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCommitment = async () => {
    try {
      const loaded = await storageService.loadCommitment();
      if (loaded) {
        setCommitment(loaded);
      } else {
        Alert.alert('Error', 'No commitment found. Please set up your commitment first.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to load commitment:', error);
      Alert.alert('Error', 'Failed to load commitment data.');
    }
  };

  const handlePickImage = () => {
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
          setImageUri(response.assets[0].uri || null);
        }
      });
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker. Please ensure the app has been rebuilt.');
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a goal title.');
      return;
    }

    if (!commitment) {
      Alert.alert('Error', 'Commitment not found.');
      return;
    }

    try {
      const newGoal: Goal = {
        id: generateId(),
        title: title.trim(),
        detail: detail.trim(),
        locked,
        imageUrl: imageUri || undefined,
        customDays,
      };

      const updatedGoals = [...commitment.goals, newGoal];
      const updatedCommitment: UserCommitment = {
        ...commitment,
        goalCount: updatedGoals.length,
        goals: updatedGoals,
      };

      await storageService.saveCommitment(updatedCommitment);
      
      Alert.alert('Success', 'Goal added successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Failed to save goal:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };

  const currentMainGoalsCount = commitment ? Math.min(commitment.goals.length, 6) : 0;
  const currentSupportingGoalsCount = commitment ? Math.max(0, commitment.goals.length - 6) : 0;
  const willBeSupporting = commitment && commitment.goals.length >= 6;

  if (!commitment) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Goals</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Goal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Goal Information</Text>

        {willBeSupporting && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              This goal will be added as a supporting goal. You currently have {currentMainGoalsCount} main goal{currentMainGoalsCount !== 1 ? 's' : ''} and {currentSupportingGoalsCount} supporting goal{currentSupportingGoalsCount !== 1 ? 's' : ''}.
            </Text>
          </View>
        )}

        <View style={styles.lockSection}>
          <View style={styles.lockHeader}>
            <View style={styles.lockToggleCompact}>
              <Text style={styles.lockToggleLabel}>
                {locked ? '🔒' : '🔓'}
              </Text>
              <Text style={styles.lockLabel}>Lock Goal</Text>
            </View>
            <TouchableOpacity
              style={[styles.switch, locked && styles.switchActive]}
              onPress={() => setLocked(!locked)}
            >
              <View style={[styles.switchThumb, locked && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.lockHint}>
            Locked goals remain hidden until countdown completion. This is recommended.
          </Text>
        </View>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Short descriptive text"
          placeholderTextColor="#666"
          autoFocus
        />

        <Text style={styles.label}>Detail</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={detail}
          onChangeText={setDetail}
          placeholder="Long-form explanation or intention"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Image (optional)</Text>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
            <Text style={styles.imagePickerText}>📷 Choose from Gallery</Text>
          </TouchableOpacity>
        )}

        <View style={styles.customDaysSection}>
          <View style={styles.customDaysHeader}>
            <Text style={styles.label}>Custom Duration (Optional)</Text>
            <TouchableOpacity
              style={[styles.switch, showCustomDays && styles.switchActive]}
              onPress={() => {
                setShowCustomDays(!showCustomDays);
                if (showCustomDays) {
                  setCustomDays(undefined);
                } else {
                  setCustomDays(365);
                }
              }}
            >
              <View style={[styles.switchThumb, showCustomDays && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
          {showCustomDays && (
            <TextInput
              style={styles.input}
              value={customDays?.toString() || ''}
              onChangeText={(value) => {
                const num = parseInt(value, 10);
                if (isNaN(num) || num <= 0) {
                  setCustomDays(undefined);
                } else {
                  setCustomDays(num);
                }
              }}
              placeholder="Days for this goal"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#e0e0e0',
    letterSpacing: 1,
  },
  placeholder: {
    width: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#b0b0b0',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 4,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  lockSection: {
    marginBottom: 24,
  },
  lockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lockToggleCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockToggleLabel: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  lockLabel: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  lockHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    lineHeight: 16,
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
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
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
  customDaysSection: {
    marginTop: 16,
  },
  customDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
  },
});
