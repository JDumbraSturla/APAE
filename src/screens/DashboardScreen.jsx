import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/ui/Card';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import GamificationCard from '../components/ui/GamificationCard';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import { designTokens } from '../theme/tokens';
import { useTheme } from '../contexts/ThemeContext';
import { gamificationService } from '../services/gamificationService';

const DashboardScreen = ({ user }) => {
  const { theme, isDark } = useTheme();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'teacher':
        return 'Professor(a)';
      default:
        return 'Usuário';
    }
  };

  const quickActions = [
    { icon: 'calendar', title: 'Agenda', color: designTokens.colors.primary[500] },
    { icon: 'document-text', title: 'Relatórios', color: designTokens.colors.secondary[500] },
    { icon: 'people', title: 'Comunidade', color: designTokens.colors.semantic.info },
    { icon: 'medical', title: 'Saúde', color: designTokens.colors.semantic.success },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, designTokens.colors.primary[600]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>{getGreeting()},</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userRole, { color: theme.colors.textSecondary }]}>{getRoleTitle(user?.role)}</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gamification Card */}
        <GamificationCard user={user} />
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <Card key={index} style={styles.actionCard} padding="md">
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{action.title}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Resumo de Hoje</Text>
          <GlassCard intensity={0.15} style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={20} color={designTokens.colors.semantic.success} />
              <Text style={[styles.summaryText, { color: theme.colors.text } ]}>3 atividades concluídas</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="time" size={20} color={designTokens.colors.secondary[500]} />
              <Text style={styles.summaryText}>2 lembretes pendentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="mail" size={20} color={designTokens.colors.semantic.info} />
              <Text style={styles.summaryText}>1 nova mensagem</Text>
            </View>
          </GlassCard>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Atividade Recente</Text>
          <Card>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="document" size={16} color={designTokens.colors.primary[500]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.text }]}>Relatório mensal enviado</Text>
                <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>Há 2 horas</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="people" size={16} color={designTokens.colors.secondary[500]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.text }]}>Reunião agendada</Text>
                <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>Ontem</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        actions={[
          {
            label: 'Nova Atividade',
            icon: 'add-circle',
            color: designTokens.colors.semantic.success,
            onPress: async () => {
              const result = await gamificationService.completeActivity('general');
              console.log('Activity completed:', result);
            },
          },
          {
            label: 'Exercício',
            icon: 'fitness',
            color: designTokens.colors.semantic.info,
            onPress: async () => {
              const result = await gamificationService.completeActivity('exercise');
              console.log('Exercise completed:', result);
            },
          },
          {
            label: 'Terapia',
            icon: 'medical',
            color: designTokens.colors.semantic.warning,
            onPress: async () => {
              const result = await gamificationService.completeActivity('therapy');
              console.log('Therapy completed:', result);
            },
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[50],
  },
  header: {
    paddingTop: 50,
    paddingBottom: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: designTokens.typography.fontSizes.base,
    color: designTokens.colors.primary[100],
  },
  userName: {
    fontSize: designTokens.typography.fontSizes['2xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
    color: '#ffffff',
    marginTop: designTokens.spacing.xs,
  },
  userRole: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: designTokens.colors.primary[200],
    marginTop: designTokens.spacing.xs,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.lg,
  },
  section: {
    marginTop: designTokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
    color: designTokens.colors.neutral[800],
    marginBottom: designTokens.spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  actionTitle: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.neutral[700],
    textAlign: 'center',
  },
  summaryCard: {
    paddingVertical: designTokens.spacing.lg,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  summaryText: {
    fontSize: designTokens.typography.fontSizes.base,
    color: designTokens.colors.neutral[700],
    marginLeft: designTokens.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.neutral[100],
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: designTokens.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.neutral[800],
  },
  activityTime: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: designTokens.colors.neutral[500],
    marginTop: designTokens.spacing.xs,
  },
  bottomSpacing: {
    height: designTokens.spacing.xl,
  },
});

export default DashboardScreen;