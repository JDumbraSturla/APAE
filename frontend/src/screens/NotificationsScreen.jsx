import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import EmptyState from '../components/ui/EmptyState';
import { designTokens } from '../theme/tokens';
import { animations } from '../theme/animations';
import { useTheme } from '../contexts/ThemeContext';

const NotificationsScreen = ({ user }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();

  useEffect(() => {
    animations.fadeIn(fadeAnim, 400).start();
  }, []);

  const getRoleColor = () => {
    switch (user?.role) {
  case 'teacher': return designTokens.colors.semantic.info;
      case 'guardian': return '#7c3aed';
      case 'admin': return '#6b7280';
      default: return designTokens.colors.primary[600];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: getRoleColor() }]}>Avisos</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Fique por dentro das novidades</Text>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <EmptyState
          icon="notifications-outline"
          title="Nenhum aviso por aqui"
          subtitle="Suas notificações e alertas importantes aparecerão nesta tela."
          iconContainerBackgroundColor={isDark ? theme.colors.border : designTokens.colors.neutral[100]} // Cor de fundo dinâmica para o ícone
          titleStyle={{ color: theme.colors.text }}
          subtitleStyle={{ color: theme.colors.textSecondary }}
          iconColor={theme.colors.textSecondary}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.lg,
  },
  title: {
    fontSize: designTokens.typography.fontSizes['2xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
  },
  content: {
    paddingHorizontal: designTokens.spacing.lg,
    flex: 1,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.base,
    marginTop: designTokens.spacing.xs,
  },
});

export default NotificationsScreen;