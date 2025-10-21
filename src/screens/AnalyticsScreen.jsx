import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import { designTokens } from '../theme/tokens';
import { useTheme } from '../contexts/ThemeContext';
import { gamificationService } from '../services/gamificationService';

const { width: screenWidth } = Dimensions.get('window');

const AnalyticsScreen = ({ user }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    monthlyActivities: [0, 0, 0, 0],
    activityTypes: [
      { name: 'Exercícios', population: 30, color: '#22c55e', legendFontColor: theme.colors.text },
      { name: 'Terapias', population: 25, color: '#3b82f6', legendFontColor: theme.colors.text },
      { name: 'Educação', population: 35, color: '#f59e0b', legendFontColor: theme.colors.text },
      { name: 'Social', population: 10, color: '#ef4444', legendFontColor: theme.colors.text },
    ]
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const points = await gamificationService.getPoints();
    const level = gamificationService.calculateLevel(points);
    const streakData = await gamificationService.getStreak();
    const badges = await gamificationService.getBadges();

    // Simulate weekly progress data
    const weeklyProgress = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10);
    
    // Simulate monthly activities
    const monthlyActivities = Array.from({ length: 4 }, () => Math.floor(Math.random() * 30) + 5);

    setStats({
      points,
      level,
      streak: streakData.current,
      badges,
      weeklyProgress,
      monthlyActivities,
      activityTypes: [
        { name: 'Exercícios', population: 30, color: '#22c55e', legendFontColor: theme.colors.text },
        { name: 'Terapias', population: 25, color: '#3b82f6', legendFontColor: theme.colors.text },
        { name: 'Educação', population: 35, color: '#f59e0b', legendFontColor: theme.colors.text },
        { name: 'Social', population: 10, color: '#ef4444', legendFontColor: theme.colors.text },
      ]
    });
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(21, 128, 61, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: designTokens.borderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: designTokens.colors.primary[500],
    },
  };

  const weeklyData = {
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    datasets: [
      {
        data: stats.weeklyProgress,
        color: (opacity = 1) => `rgba(21, 128, 61, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const monthlyData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        data: stats.monthlyActivities,
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Acompanhe seu progresso
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statIcon}>
            <Ionicons name="star" size={24} color={designTokens.colors.secondary[500]} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.points}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Pontos</Text>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statIcon}>
            <Ionicons name="trending-up" size={24} color={designTokens.colors.primary[500]} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>Nv.{stats.level}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Nível</Text>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statIcon}>
            <Ionicons name="flame" size={24} color={designTokens.colors.semantic.warning} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.streak}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Sequência</Text>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statIcon}>
            <Ionicons name="trophy" size={24} color={designTokens.colors.secondary[500]} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.badges.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Conquistas</Text>
        </Card>
      </View>

      {/* Simple Progress Bars */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          Progresso Semanal
        </Text>
        <View style={styles.progressBars}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <View key={day} style={styles.dayProgress}>
              <Text style={[styles.dayLabel, { color: theme.colors.textSecondary }]}>{day}</Text>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(stats.weeklyProgress[index] / 50) * 100}%`,
                      backgroundColor: designTokens.colors.primary[500]
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                {stats.weeklyProgress[index]}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Activity Types */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          Tipos de Atividades
        </Text>
        <View style={styles.activityTypes}>
          {stats.activityTypes.map((activity, index) => (
            <View key={activity.name} style={styles.activityItem}>
              <View style={[styles.activityColor, { backgroundColor: activity.color }]} />
              <Text style={[styles.activityName, { color: theme.colors.text }]}>
                {activity.name}
              </Text>
              <Text style={[styles.activityPercent, { color: theme.colors.textSecondary }]}>
                {activity.population}%
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.bottomSpacing} />
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: designTokens.spacing.lg,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designTokens.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  statValue: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: designTokens.typography.fontWeights.bold,
    marginBottom: designTokens.spacing.xs,
  },
  statLabel: {
    fontSize: designTokens.typography.fontSizes.sm,
  },
  chartCard: {
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    padding: designTokens.spacing.lg,
  },
  chartTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
    marginBottom: designTokens.spacing.lg,
  },
  progressBars: {
    gap: designTokens.spacing.md,
  },
  dayProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  dayLabel: {
    fontSize: designTokens.typography.fontSizes.sm,
    width: 30,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    width: 30,
    textAlign: 'right',
  },
  activityTypes: {
    gap: designTokens.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  activityColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activityName: {
    flex: 1,
    fontSize: designTokens.typography.fontSizes.base,
  },
  activityPercent: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  bottomSpacing: {
    height: designTokens.spacing.xl,
  },
});

export default AnalyticsScreen;