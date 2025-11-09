import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { designTokens } from '../../theme/tokens';
import { useTheme } from '../../contexts/ThemeContext';

// Single, minimal and robust Button implementation
export default function Button({ children, onPress, variant = 'primary', size = 'md', loading = false, disabled = false, style, ...props }) {
  // Guarded theme access
  const themeContext = (() => { try { return useTheme(); } catch (e) { return null; } })();
  const theme = themeContext ? themeContext.theme : null;

  const resolvedPrimary = theme ? theme.colors.primary : designTokens.colors.primary[500];
  const resolvedSecondary = theme ? (theme.colors.secondary || designTokens.colors.secondary[500]) : designTokens.colors.secondary[500];
  const resolvedText = theme ? theme.colors.text : '#ffffff';

  const variantStyles = (() => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: resolvedSecondary, color: theme ? theme.colors.text : designTokens.colors.neutral[900], borderWidth: 0 };
      case 'outline':
        return { backgroundColor: 'transparent', color: resolvedPrimary, borderWidth: 1, borderColor: resolvedPrimary };
      case 'ghost':
        return { backgroundColor: 'transparent', color: resolvedPrimary, borderWidth: 0 };
      default:
        return { backgroundColor: resolvedPrimary, color: resolvedText, borderWidth: 0 };
    }
  })();

  const sizeStyles = (() => {
    switch (size) {
      case 'sm':
        return { paddingVertical: designTokens.spacing.sm, paddingHorizontal: designTokens.spacing.md, fontSize: designTokens.typography.fontSizes.sm };
      case 'lg':
        return { paddingVertical: designTokens.spacing.lg, paddingHorizontal: designTokens.spacing.xl, fontSize: designTokens.typography.fontSizes.lg };
      default:
        return { paddingVertical: designTokens.spacing.md, paddingHorizontal: designTokens.spacing.lg, fontSize: designTokens.typography.fontSizes.base };
    }
  })();

  const backgroundColor = variantStyles.backgroundColor;
  const textColor = variantStyles.color;
  const borderWidth = variantStyles.borderWidth || 0;
  const borderColor = variantStyles.borderColor || (borderWidth ? resolvedPrimary : 'transparent');

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor, borderWidth, borderColor, paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize: sizeStyles.fontSize }]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.sm,
  },
  text: {
    fontWeight: designTokens.typography.fontWeights.semibold,
  },
  disabled: {
    opacity: 0.6,
  },
});