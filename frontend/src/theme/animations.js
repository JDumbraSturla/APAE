import { Animated, Easing } from 'react-native';

export const animations = {
  // Fade animations
  fadeIn: (animatedValue, duration = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });
  },

  fadeOut: (animatedValue, duration = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  },

  // Scale animations
  scaleIn: (animatedValue, duration = 200) => {
    return Animated.spring(animatedValue, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    });
  },

  scaleOut: (animatedValue, duration = 200) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  },

  // Slide animations
  slideInFromRight: (animatedValue, duration = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  },

  slideInFromLeft: (animatedValue, duration = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  },

  // Bounce animation
  bounce: (animatedValue) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);
  },

  // Pulse animation
  pulse: (animatedValue) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
  },
};