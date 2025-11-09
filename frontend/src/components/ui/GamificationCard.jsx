import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { designTokens } from '../../theme/tokens';
import { useTheme } from '../../contexts/ThemeContext';
import ProgressRing from './ProgressRing';
import { gamificationService } from '../../services/gamificationService';

const GamificationCard = ({ user }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    progress: 0
  });
  const [showDetails, setShowDetails] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const points = await gamificationService.getPoints();
    const level = gamificationService.calculateLevel(points);
    const progress = gamificationService.getProgressToNextLevel(points);
    const streakData = await gamificationService.getStreak();
    const badges = await gamificationService.getBadges();

    setStats({
      points,
      level,
      streak: streakData.current,
      badges,
      progress: progress.percentage
    });
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setShowDetails(!showDetails);
  };

  const completeActivity = async () => {
    const result = await gamificationService.completeActivity('general');
    await loadStats();
    
    if (result.levelUp) {
      // Show level up animation/notification
      console.log('Level Up!', result.newLevel);
    }
    
    if (result.newAchievements.length > 0) {
      // Show achievement notifications
      console.log('New Achievements!', result.newAchievements);
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient
          colors={[designTokens.colors.primary[500], designTokens.colors.primary[600]]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.levelSection}>
              <ProgressRing
                size={60}
                progress={stats.progress}
                color="#ffffff"
                backgroundColor="rgba(255,255,255,0.3)"
              >
                <Text style={styles.levelText}>Nv.{stats.level}</Text>
              </ProgressRing>
            </View>
            
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.statValue}>{stats.points}</Text>
                <Text style={styles.statLabel}>Pontos</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="flame" size={16} color="#f97316" />
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Sequência</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#fbbf24" />
                <Text style={styles.statValue}>{stats.badges.length}</Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
            </View>
          </View>
          
          {showDetails && (
            <View style={styles.details}>
              <TouchableOpacity style={styles.actionButton} onPress={completeActivity}>
                <Ionicons name="add-circle" size={20} color={designTokens.colors.primary[500]} />
                <Text style={styles.actionText}>Completar Atividade (+10 XP)</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    overflow: 'hidden',
    ...designTokens.shadows.md,
  },
  gradient: {
    padding: designTokens.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelSection: {
    marginRight: designTokens.spacing.lg,
  },
  levelText: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.bold,
    color: '#ffffff',
  },
  statsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.bold,
    color: '#ffffff',
    marginTop: designTokens.spacing.xs,
  },
  statLabel: {
    fontSize: designTokens.typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  details: {
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
  },
  actionText: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.primary[500],
    marginLeft: designTokens.spacing.sm,
  },
});

export default GamificationCard;