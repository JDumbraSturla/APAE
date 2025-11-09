import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/tokens';

const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: designTokens.spacing.sm,
          paddingHorizontal: designTokens.spacing.md,
          fontSize: designTokens.typography.fontSizes.sm,
        };
      case 'lg':
        return {
          paddingVertical: designTokens.spacing.lg,
          paddingHorizontal: designTokens.spacing.xl,
          fontSize: designTokens.typography.fontSizes.lg,
        };
      default:
        return {
          paddingVertical: designTokens.spacing.md,
          paddingHorizontal: designTokens.spacing.lg,
          fontSize: designTokens.typography.fontSizes.base,
        };
    }
  };

  const getBorderColor = () => {
    if (error) return designTokens.colors.semantic.error;
    if (isFocused) return designTokens.colors.primary[500];
    return designTokens.colors.neutral[200];
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        }
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={designTokens.colors.neutral[400]} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { fontSize: sizeStyles.fontSize },
            leftIcon && { paddingLeft: designTokens.spacing.sm },
            rightIcon && { paddingRight: designTokens.spacing.sm },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={designTokens.colors.neutral[400]}
          {...props}
        />
        
        {rightIcon && (
          <Ionicons 
            name={rightIcon} 
            size={20} 
            color={designTokens.colors.neutral[400]} 
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
  },
  label: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.neutral[700],
    marginBottom: designTokens.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.neutral[50],
  },
  input: {
    flex: 1,
    color: designTokens.colors.neutral[900],
  },
  leftIcon: {
    marginRight: designTokens.spacing.sm,
  },
  rightIcon: {
    marginLeft: designTokens.spacing.sm,
  },
  error: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: designTokens.colors.semantic.error,
    marginTop: designTokens.spacing.xs,
  },
});

export default Input;