import React from 'react';
import { View, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/tokens';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ children, variant = 'default', padding = 'md', style, ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return designTokens.shadows.lg;
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: designTokens.colors.neutral[200],
          ...designTokens.shadows.sm,
        };
      default:
        return designTokens.shadows.md;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return designTokens.spacing.md;
      case 'lg':
        return designTokens.spacing.xl;
      case 'none':
        return 0;
      default:
        return designTokens.spacing.lg;
    }
  };

  const themeContext = (() => {
    try {
      return useTheme();
    } catch (e) {
      return null;
    }
  })();

  const bg = themeContext ? (themeContext.theme.colors.card || themeContext.theme.colors.surface) : styles.card.backgroundColor;

  return (
    <View
      style={[
        { backgroundColor: bg },
        styles.card,
        getVariantStyles(),
        { padding: getPaddingStyles() },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: designTokens.borderRadius.xl,
  },
});

export default Card;