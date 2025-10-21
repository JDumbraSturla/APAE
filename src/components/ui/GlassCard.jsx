import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { designTokens } from '../../theme/tokens';

const GlassCard = ({ children, style, intensity = 0.1 }) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[
          `rgba(255, 255, 255, ${intensity + 0.1})`,
          `rgba(255, 255, 255, ${intensity})`,
        ]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: designTokens.borderRadius.xl,
    overflow: 'hidden',
    ...designTokens.shadows.md,
  },
  gradient: {
    flex: 1,
    borderRadius: designTokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
});

export default GlassCard;