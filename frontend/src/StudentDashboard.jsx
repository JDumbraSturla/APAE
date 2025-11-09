import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './contexts/ThemeContext';


const StudentDashboard = ({ user, onGoToLanding, onNavigate }) => {
  const { theme, isDark } = useTheme();
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const quickActions = [
    { id: 1, title: 'Minhas Atividades', icon: 'book', count: 0, action: () => onNavigate?.('activities') },
    { id: 2, title: 'Próximas Consultas', icon: 'calendar', count: 0, action: async () => {
        // open google calendar in external browser/app
        try {
          setLoadingCalendar(true);
          const url = 'https://calendar.google.com/calendar/r';
          const supported = await Linking.canOpenURL(url);
          if (supported) await Linking.openURL(url);
          else await Linking.openURL(url);
        } catch (e) {
          console.warn('Failed to open calendar', e);
        } finally {
          setLoadingCalendar(false);
        }
      } },
    { id: 3, title: 'Relatórios', icon: 'document-text', count: 0, action: () => onNavigate?.('reports') },
    { id: 4, title: 'Medicamentos', icon: 'medical', count: 0, action: () => onNavigate?.('medications') }
  ];

  const recentActivities = [];

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'success': return '#16a34a';
      case 'info': return '#3b82f6';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header com Logo */}
      <View style={[styles.topHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={[styles.logoSection, { backgroundColor: theme.colors.studentPrimary || theme.colors.primary }]} onPress={onGoToLanding}>
          <Text style={[styles.logo, { color: theme.colors.primaryText || '#fff' }]}>APAE Digital</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.greeting, { color: theme.colors.studentPrimary || theme.colors.primary }]}>Olá, {user?.firstName}! 👋</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Como você está se sentindo hoje?</Text>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={action.action} accessibilityLabel={action.title} accessibilityRole="button">
              <View style={[styles.quickActionIcon, { backgroundColor: (theme.colors.studentPrimary || theme.colors.primary) + '10' }]}>
                {action.id === 2 && loadingCalendar ? (
                  <ActivityIndicator size="small" color={theme.colors.studentPrimary || theme.colors.primary} />
                ) : (
                  <Ionicons name={action.icon} size={24} color={theme.colors.studentPrimary || theme.colors.primary} />
                )}
                {action.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{action.count}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Progresso Semanal - removido no início conforme solicitado */}

      {/* Atividades Recentes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Atividades Recentes</Text>
        {recentActivities.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="time-outline" size={48} color={theme.colors.border} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Nenhuma atividade recente</Text>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[
                  styles.activityDot,
                  { backgroundColor: getActivityTypeColor(activity.type) }
                ]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Próximos Eventos */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Próximos Eventos</Text>
        <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="calendar-outline" size={48} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Nenhum evento próximo</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  topHeader: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  logoSection: {
    backgroundColor: '#15803d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  logo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    position: 'relative',
    width: 48,
    height: 48,
    backgroundColor: '#dcfce7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActionTitle: {
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
  },
  progressCard: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: '500',
  },
  progressValue: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#15803d',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  activitiesList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#fef3c7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  progressCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default StudentDashboard;