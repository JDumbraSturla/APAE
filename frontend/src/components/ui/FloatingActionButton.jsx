import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/tokens';
import { useTheme } from '../../contexts/ThemeContext';

const FloatingActionButton = ({ actions = [], onPress, icon = 'add' }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(animation, {
        toValue,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsOpen(!isOpen);
  };

  const handleActionPress = (action) => {
    toggleMenu();
    action.onPress();
  };

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const renderActionButton = (action, index) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -(60 * (index + 1))],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Animated.View
        key={action.label}
        style={[
          styles.actionButton,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.actionContainer}>
          <View style={[styles.labelContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {action.label}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.actionButtonCircle,
              { backgroundColor: action.color || designTokens.colors.primary[500] },
            ]}
            onPress={() => handleActionPress(action)}
          >
            <Ionicons name={action.icon} size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {actions.map((action, index) => renderActionButton(action, index))}
      
      {/* Main FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: designTokens.colors.primary[500] },
        ]}
        onPress={actions.length > 0 ? toggleMenu : onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name={icon} size={24} color="#ffffff" />
        </Animated.View>
      </TouchableOpacity>
      
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.shadows.lg,
    elevation: 8,
  },
  actionButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
    marginRight: designTokens.spacing.md,
    ...designTokens.shadows.sm,
  },
  label: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  actionButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.shadows.md,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -100,
    bottom: -100,
    backgroundColor: 'transparent',
  },
});

export default FloatingActionButton;