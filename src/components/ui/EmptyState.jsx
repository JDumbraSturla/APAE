import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/tokens';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';

const EmptyState = ({ 
  icon = 'document-outline',
  title = 'Nada por aqui',
  subtitle = 'Quando houver conteúdo, ele aparecerá aqui.',
  actionText,
  onAction,
  style,
  iconColor,
  titleStyle,
  subtitleStyle,
  iconContainerBackgroundColor // Nova prop para a cor de fundo do container do ícone
}) => {
  const themeContext = (() => {
    try { return useTheme(); } catch (e) { return null; }
  })();

  const bg = iconContainerBackgroundColor || (themeContext ? themeContext.theme.colors.surface : designTokens.colors.neutral[50]);
  // Icon should contrast with icon container; prefer primary or border colors
  const iconCol = iconColor || (themeContext ? themeContext.theme.colors.primary : designTokens.colors.neutral[300]);
  const titleCol = titleStyle?.color || (themeContext ? themeContext.theme.colors.text : '#111827');
  const subtitleCol = subtitleStyle?.color || (themeContext ? themeContext.theme.colors.textSecondary : designTokens.colors.neutral[500]);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}> 
        <Ionicons name={icon} size={64} color={iconCol} />
      </View>

      <Text style={[styles.title, titleStyle, { color: titleCol }]}>{title}</Text>
      <Text style={[styles.subtitle, subtitleStyle, { color: subtitleCol }]}>{subtitle}</Text>

      {actionText && onAction && (
        <Button variant="outline" onPress={onAction} style={styles.actionButton}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing['2xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // A cor de fundo será definida pela prop iconContainerBackgroundColor ou pelo default
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
  },
  title: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: designTokens.typography.fontWeights.semibold,
    // A cor será definida pela prop titleStyle
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.base,
    // A cor será definida pela prop subtitleStyle
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.base,
    marginBottom: designTokens.spacing.xl,
  },
  actionButton: {
    marginTop: designTokens.spacing.md,
  },
});

export default EmptyState;