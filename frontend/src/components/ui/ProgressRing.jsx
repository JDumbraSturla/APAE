import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { designTokens } from '../../theme/tokens';

// Fallback for SVG if not available
let AnimatedCircle;
try {
  AnimatedCircle = Animated.createAnimatedComponent(Circle);
} catch (error) {
  AnimatedCircle = View;
}

const ProgressRing = ({ 
  size = 80, 
  strokeWidth = 8, 
  progress = 0, 
  color = designTokens.colors.primary[500],
  backgroundColor = designTokens.colors.neutral[200],
  children 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Simplified circular progress */}
      <View 
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.progressCircle,
            {
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
              borderWidth: strokeWidth / 2,
              borderColor: color,
              opacity: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: [0.3, 1],
              }),
            }
          ]}
        />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressRing;