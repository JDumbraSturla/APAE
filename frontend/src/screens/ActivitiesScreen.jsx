import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { designTokens } from '../theme/tokens';
import { animations } from '../theme/animations';
import { useTheme } from '../contexts/ThemeContext';

const ActivitiesScreen = ({ user }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();

  useEffect(() => {
    animations.fadeIn(fadeAnim, 400).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Atividades</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Acompanhe seu progresso</Text>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <EmptyState
          icon="library-outline"
          title="Nenhuma atividade ainda"
          subtitle="Suas atividades e exercícios aparecerão aqui quando forem atribuídos."
          actionText="Explorar Atividades"
          iconContainerBackgroundColor={isDark ? theme.colors.border : designTokens.colors.neutral[100]} // Cor de fundo dinâmica para o ícone
          titleStyle={{ color: theme.colors.text }}
          subtitleStyle={{ color: theme.colors.textSecondary }}
          iconColor={theme.colors.textSecondary}
          onAction={() => console.log('Explorar atividades')}
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
  subtitle: {
    fontSize: designTokens.typography.fontSizes.base,
    marginTop: designTokens.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.lg,
  },
  cardTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
    marginBottom: designTokens.spacing.sm,
  },
  cardText: {
    fontSize: designTokens.typography.fontSizes.base,
    color: designTokens.colors.neutral[600],
  },
});

export default ActivitiesScreen;