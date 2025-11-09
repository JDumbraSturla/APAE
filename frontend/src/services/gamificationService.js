import AsyncStorage from '@react-native-async-storage/async-storage';

class GamificationService {
  constructor() {
    this.POINTS_KEY = 'user_points';
    this.BADGES_KEY = 'user_badges';
    this.STREAKS_KEY = 'user_streaks';
    this.ACHIEVEMENTS_KEY = 'user_achievements';
  }

  // Points System
  async getPoints() {
    try {
      const points = await AsyncStorage.getItem(this.POINTS_KEY);
      return points ? parseInt(points) : 0;
    } catch (error) {
      return 0;
    }
  }

  async addPoints(amount, reason = '') {
    try {
      const currentPoints = await this.getPoints();
      const newPoints = currentPoints + amount;
      await AsyncStorage.setItem(this.POINTS_KEY, newPoints.toString());
      
      // Check for level up
      const newLevel = this.calculateLevel(newPoints);
      const oldLevel = this.calculateLevel(currentPoints);
      
      return {
        points: newPoints,
        levelUp: newLevel > oldLevel,
        newLevel,
        reason
      };
    } catch (error) {
      return { points: 0, levelUp: false };
    }
  }

  calculateLevel(points) {
    return Math.floor(points / 100) + 1;
  }

  getProgressToNextLevel(points) {
    const currentLevel = this.calculateLevel(points);
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progress = points - pointsForCurrentLevel;
    const total = pointsForNextLevel - pointsForCurrentLevel;
    
    return {
      progress,
      total,
      percentage: (progress / total) * 100
    };
  }

  // Badges System
  async getBadges() {
    try {
      const badges = await AsyncStorage.getItem(this.BADGES_KEY);
      return badges ? JSON.parse(badges) : [];
    } catch (error) {
      return [];
    }
  }

  async unlockBadge(badgeId) {
    try {
      const badges = await this.getBadges();
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        await AsyncStorage.setItem(this.BADGES_KEY, JSON.stringify(badges));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Streaks System
  async getStreak() {
    try {
      const streak = await AsyncStorage.getItem(this.STREAKS_KEY);
      return streak ? JSON.parse(streak) : { current: 0, best: 0, lastDate: null };
    } catch (error) {
      return { current: 0, best: 0, lastDate: null };
    }
  }

  async updateStreak() {
    try {
      const streak = await this.getStreak();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (streak.lastDate === today) {
        return streak; // Already updated today
      }
      
      if (streak.lastDate === yesterday) {
        // Continue streak
        streak.current += 1;
      } else {
        // Reset streak
        streak.current = 1;
      }
      
      streak.best = Math.max(streak.best, streak.current);
      streak.lastDate = today;
      
      await AsyncStorage.setItem(this.STREAKS_KEY, JSON.stringify(streak));
      return streak;
    } catch (error) {
      return { current: 0, best: 0, lastDate: null };
    }
  }

  // Achievements
  getAvailableAchievements() {
    return [
      { id: 'first_login', name: 'Primeiro Passo', description: 'Fez seu primeiro login', icon: 'star', points: 10 },
      { id: 'week_streak', name: 'Dedicado', description: '7 dias consecutivos', icon: 'flame', points: 50 },
      { id: 'month_streak', name: 'Comprometido', description: '30 dias consecutivos', icon: 'trophy', points: 200 },
      { id: 'points_100', name: 'Iniciante', description: '100 pontos conquistados', icon: 'medal', points: 0 },
      { id: 'points_500', name: 'Experiente', description: '500 pontos conquistados', icon: 'ribbon', points: 0 },
      { id: 'points_1000', name: 'Mestre', description: '1000 pontos conquistados', icon: 'diamond', points: 0 },
    ];
  }

  async checkAchievements(userStats) {
    const achievements = this.getAvailableAchievements();
    const unlockedBadges = await this.getBadges();
    const newUnlocks = [];

    for (const achievement of achievements) {
      if (unlockedBadges.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_login':
          shouldUnlock = true;
          break;
        case 'week_streak':
          shouldUnlock = userStats.streak >= 7;
          break;
        case 'month_streak':
          shouldUnlock = userStats.streak >= 30;
          break;
        case 'points_100':
          shouldUnlock = userStats.points >= 100;
          break;
        case 'points_500':
          shouldUnlock = userStats.points >= 500;
          break;
        case 'points_1000':
          shouldUnlock = userStats.points >= 1000;
          break;
      }

      if (shouldUnlock) {
        await this.unlockBadge(achievement.id);
        if (achievement.points > 0) {
          await this.addPoints(achievement.points, `Conquista: ${achievement.name}`);
        }
        newUnlocks.push(achievement);
      }
    }

    return newUnlocks;
  }

  // Daily Actions
  async completeActivity(activityType = 'general') {
    const pointsMap = {
      'exercise': 20,
      'therapy': 30,
      'education': 25,
      'social': 15,
      'general': 10
    };

    const points = pointsMap[activityType] || 10;
    const result = await this.addPoints(points, `Atividade: ${activityType}`);
    const streak = await this.updateStreak();
    
    const achievements = await this.checkAchievements({
      points: result.points,
      streak: streak.current
    });

    return {
      ...result,
      streak,
      newAchievements: achievements
    };
  }
}

export const gamificationService = new GamificationService();