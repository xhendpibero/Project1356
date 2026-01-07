import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EditGoalScreenProps {
  route: { params: { goalId: string } };
}

export const EditGoalScreen: React.FC<EditGoalScreenProps> = ({ route }) => {
  const { goalId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Goal</Text>
      <Text style={styles.text}>Goal ID: {goalId}</Text>
      <Text style={styles.text}>Editing UI can be added here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#e0e0e0',
    marginBottom: 12,
  },
  text: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
});

