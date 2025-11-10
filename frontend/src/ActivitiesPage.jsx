import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from './theme/tokens';
import { useTheme } from './contexts/ThemeContext';


const ActivitiesPage = ({ user }) => {

  const { theme, isDark } = useTheme();
  
  const getRoleColor = () => {
    switch (user?.role) {
  case 'teacher': return designTokens.colors.semantic.info; // azul para professor
      default: return designTokens.colors.primary[600]; // Tom de verde para aluno
    }
  };

  const activities = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'pending': return '#f59e0b';
      case 'upcoming': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'upcoming': return 'Próxima';
      default: return 'Indefinido';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'homework': return 'book';
      case 'therapy': return 'medical';
      case 'creative': return 'color-palette';
      default: return 'document';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: getRoleColor() }]}>Atividades</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Acompanhe suas atividades e tarefas</Text>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Nenhuma atividade</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            Suas atividades aparecerão aqui quando forem criadas
          </Text>
        </View>
      ) : (
        <View style={styles.activitiesList}>
          {activities.map((activity) => (
            <TouchableOpacity key={activity.id} style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.activityHeader}>
                <View style={styles.activityIcon}>
                  <Ionicons 
                    name={getTypeIcon(activity.type)} 
                    size={24} 
                    color={getRoleColor()} 
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(activity.status)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.addButton, { backgroundColor: getRoleColor() }]}>
        <Ionicons name="add" size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Nova Atividade</Text>
      </TouchableOpacity>
    </ScrollView>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: designTokens.spacing.xl,
    marginTop: designTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
  },
  emptyDescription: {
    fontSize: designTokens.typography.fontSizes.base,
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeights.relaxed,
  },
  activitiesList: {
    padding: 16,
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ActivitiesPage;