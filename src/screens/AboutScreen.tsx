/**
 * About Screen - Information about Project 1356
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Project 1356</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Philosophy</Text>
          <Text style={styles.text}>
            Project 1356 reframes self-development as a finite, shared countdown tied to identity rather than output. Every user operates under a countdown, not a checklist.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Principles</Text>
          <Text style={styles.text}>
            • About time, not output{'\n'}
            • About commitment, not motivation{'\n'}
            • About identity formation, not optimization
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The System</Text>
          <Text style={styles.text}>
            The deadline is finite and visible, while goals remain private and hidden. Pressure comes from time scarcity, not social comparison. This is not a task manager or habit tracker. This is a long-horizon commitment system anchored in irreversible time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Origin</Text>
          <Text style={styles.text}>
            Inspired by ArminMehdiz and the philosophy of shared deadlines and hidden goals.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 0.0.1</Text>
          <Text style={styles.footerText}>Free and open source</Text>
        </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#b0b0b0',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  footer: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
