import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, FlatList } from 'react-native';
import EmptyState from './components/ui/EmptyState';
import { designTokens } from './theme/tokens';
import { animations } from './theme/animations';
import { useTheme } from './contexts/ThemeContext';
import { dataService } from './dataService';

const NotificationsPage = ({ user }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleColor = () => {
    switch (user?.role) {
      case 'teacher': return designTokens.colors.semantic.info;
      default: return designTokens.colors.primary[600];
    }
  };

  useEffect(() => {
    animations.fadeIn(fadeAnim, 400).start();

    const fetchNotifications = async () => {
      try {
        const data = await dataService.getNotifications(user.id);
        setNotifications(data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationCard, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.notificationText, { color: theme.colors.textSecondary }]}>{item.message}</Text>
      <Text style={[styles.notificationDate, { color: theme.colors.textSecondary }]}>
        {new Date(item.date).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: getRoleColor() }]}>Avisos</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Fique por dentro das novidades</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {loading ? (
          <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="notifications-outline"
            title="Nenhum aviso por aqui"
            subtitle="Suas notificações e alertas importantes aparecerão nesta tela."
            iconContainerBackgroundColor={isDark ? theme.colors.border : designTokens.colors.neutral[100]}
            titleStyle={{ color: theme.colors.text }}
            subtitleStyle={{ color: theme.colors.textSecondary }}
            iconColor={theme.colors.textSecondary}
          />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNotification}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
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
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
  },
});

export default NotificationsPage;
