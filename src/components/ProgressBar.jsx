import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              index < currentStep ? styles.stepCompleted : 
              index === currentStep - 1 ? styles.stepActive : styles.stepInactive
            ]}>
              <Text style={[
                styles.stepNumber,
                index < currentStep ? styles.stepCompletedText :
                index === currentStep - 1 ? styles.stepActiveText : styles.stepInactiveText
              ]}>
                {index + 1}
              </Text>
            </View>
            <Text style={styles.stepTitle}>{stepTitles[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#15803d',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#15803d',
  },
  stepActive: {
    backgroundColor: '#fbbf24',
  },
  stepInactive: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepCompletedText: {
    color: '#ffffff',
  },
  stepActiveText: {
    color: '#15803d',
  },
  stepInactiveText: {
    color: '#9ca3af',
  },
  stepTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 80,
  },
});

export default ProgressBar;