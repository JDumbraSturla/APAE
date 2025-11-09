import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from './theme/tokens';
import { useTheme } from './contexts/ThemeContext';

const TeacherDashboard = ({ user, onNavigate }) => {
  // Use theme for colors so header/titles respect dark mode
  const { theme } = useTheme();
  // Move styles inside the component to avoid issues with undefined designTokens
  // on module load, which can happen with circular dependencies.
  const styles = getStyles(designTokens, theme);
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Dashboard do Professor</Text>
        <Text style={[styles.welcome, { color: theme.colors.textSecondary }]}>Bem-vindo(a), {user?.firstName || user?.name}!</Text>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={() => onNavigate?.('teacher_students')}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="people" size={24} color={theme.colors.teacherPrimary || theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Meus alunos</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>0 alunos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={() => onNavigate?.('activities')}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="book" size={24} color={theme.colors.teacherPrimary || theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Atividades</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>0 ativas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={() => onNavigate?.('teacher_reports')}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="document-text" size={24} color={theme.colors.teacherPrimary || theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Relatórios</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>0 pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={() => onNavigate?.('teacher_calendar')}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="calendar" size={24} color={theme.colors.teacherPrimary || theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Agenda</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>0 eventos hoje</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Turmas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minhas turmas</Text>
        <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="school-outline" size={48} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Nenhuma turma atribuída</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>Suas turmas aparecerão aqui quando forem atribuídas</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// removed older getStyles; single implementation below handles theme-aware colors

function getStyles(designTokens, theme) {
  const colors = (theme && theme.colors) || {
    background: designTokens.colors.neutral?.[0] || '#f9fafb',
    text: designTokens.colors.neutral?.[900] || '#111827',
    textSecondary: designTokens.colors.neutral?.[500] || '#6b7280',
    surface: '#ffffff',
    border: designTokens.colors.neutral?.[200] || '#e5e7eb',
    primary: designTokens.colors.primary?.[500] || '#2563eb',
  };

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    title: {
      fontSize: designTokens.typography.fontSizes['2xl'],
      fontWeight: designTokens.typography.fontWeights.bold,
      marginBottom: designTokens.spacing.sm,
      color: colors.text,
    },
    welcome: {
      fontSize: designTokens.typography.fontSizes.lg,
      marginBottom: designTokens.spacing.sm,
      color: colors.text,
    },
    subtitle: { marginBottom: 10, color: colors.textSecondary },
    section: { margin: 16 },
    sectionTitle: { fontSize: designTokens.typography.fontSizes.lg, fontWeight: designTokens.typography.fontWeights.semibold, color: colors.text, marginBottom: 12 },
    quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    quickActionCard: {
      width: '48%',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 12,
      elevation: 2,
      shadowOffset: { width: 0, height: 2 },
    },
    quickActionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickActionTitle: { fontSize: designTokens.typography.fontSizes.sm, fontWeight: designTokens.typography.fontWeights.medium, color: colors.text, textAlign: 'center', marginBottom: 4 },
    quickActionSubtitle: { fontSize: designTokens.typography.fontSizes.xs, color: colors.textSecondary, textAlign: 'center' },
    emptyState: { borderRadius: 12, padding: 40, alignItems: 'center', elevation: 2, shadowOffset: { width: 0, height: 2 } },
    emptyTitle: { fontSize: designTokens.typography.fontSizes.base, fontWeight: designTokens.typography.fontWeights.semibold, color: colors.text, marginTop: 12, marginBottom: 8 },
    emptyDescription: { fontSize: designTokens.typography.fontSizes.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, backgroundColor: colors.surface, borderBottomColor: colors.border },
  });
}

export default TeacherDashboard;