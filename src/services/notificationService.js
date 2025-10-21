import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.SETTINGS_KEY = 'notification_settings';
    this.init();
  }

  async init() {
    await this.requestPermissions();
  }

  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        dailyReminder: true,
        streakReminder: true,
        achievements: true,
        activities: true,
        motivational: true,
      };
    } catch (error) {
      return {
        dailyReminder: true,
        streakReminder: true,
        achievements: true,
        activities: true,
        motivational: true,
      };
    }
  }

  async updateSettings(newSettings) {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
      await this.scheduleAllNotifications();
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  // Schedule daily reminder
  async scheduleDailyReminder() {
    const settings = await this.getSettings();
    if (!settings.dailyReminder) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌟 Hora de brilhar!',
        body: 'Que tal completar uma atividade hoje? Sua jornada APAE te espera!',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }

  // Schedule streak reminder
  async scheduleStreakReminder() {
    const settings = await this.getSettings();
    if (!settings.streakReminder) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Mantenha sua sequência!',
        body: 'Você está indo muito bem! Não perca sua sequência de dias consecutivos.',
        data: { type: 'streak_reminder' },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
  }

  // Motivational messages
  async scheduleMotivationalMessage() {
    const settings = await this.getSettings();
    if (!settings.motivational) return;

    const messages = [
      { title: '💪 Você é incrível!', body: 'Cada pequeno passo conta na sua jornada de crescimento.' },
      { title: '🌈 Continue assim!', body: 'Seu progresso inspira toda a comunidade APAE.' },
      { title: '⭐ Acredite em você!', body: 'Você tem o poder de alcançar seus objetivos.' },
      { title: '🎯 Foco no objetivo!', body: 'Cada atividade te aproxima dos seus sonhos.' },
      { title: '🚀 Rumo ao sucesso!', body: 'Sua dedicação faz toda a diferença.' },
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        data: { type: 'motivational' },
      },
      trigger: {
        seconds: Math.random() * 3600 + 1800, // Random between 30min and 90min
      },
    });
  }

  // Achievement notification
  async showAchievementNotification(achievement) {
    const settings = await this.getSettings();
    if (!settings.achievements) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Nova Conquista Desbloqueada!',
        body: `Parabéns! Você conquistou: ${achievement.name}`,
        data: { type: 'achievement', achievement },
      },
      trigger: null, // Show immediately
    });
  }

  // Level up notification
  async showLevelUpNotification(newLevel) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Level Up!',
        body: `Incrível! Você alcançou o nível ${newLevel}!`,
        data: { type: 'level_up', level: newLevel },
      },
      trigger: null,
    });
  }

  // Activity reminder
  async scheduleActivityReminder(activityName, date) {
    const settings = await this.getSettings();
    if (!settings.activities) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 Lembrete de Atividade',
        body: `Não esqueça: ${activityName} está agendado para hoje!`,
        data: { type: 'activity_reminder', activity: activityName },
      },
      trigger: {
        date: new Date(date),
      },
    });
  }

  // Schedule all notifications
  async scheduleAllNotifications() {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule new ones
    await this.scheduleDailyReminder();
    await this.scheduleStreakReminder();
    await this.scheduleMotivationalMessage();
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get scheduled notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Listen to notifications
  addNotificationListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export const notificationService = new NotificationService();