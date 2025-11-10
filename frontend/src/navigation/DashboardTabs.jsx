import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { designTokens } from '../theme/tokens';

import DashboardScreen from '../screens/DashboardScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const DashboardTabs = ({ user, onLogout }) => {
  const { theme, isDark } = useTheme();

  const getTabIcon = (routeName, focused, color, size) => {
    let iconName;
    
    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Activities':
        iconName = focused ? 'library' : 'library-outline';
        break;
      case 'Analytics':
        iconName = focused ? 'analytics' : 'analytics-outline';
        break;
      case 'Notifications':
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'Settings':
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = 'circle';
    }
    
    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => 
          getTabIcon(route.name, focused, color, size),
        tabBarActiveTintColor: designTokens.colors.primary[500],
        tabBarInactiveTintColor: designTokens.colors.neutral[400],
        tabBarStyle: { // @ts-ignore
          backgroundColor: isDark ? theme.colors.surface : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? theme.colors.border : designTokens.colors.neutral[200],
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: designTokens.typography.fontSizes.xs,
          fontWeight: designTokens.typography.fontWeights.medium,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ tabBarLabel: 'Início' }}
      >
        {(props) => <DashboardScreen {...props} user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Activities" 
        options={{ tabBarLabel: 'Atividades' }}
      >
        {(props) => <ActivitiesScreen {...props} user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Analytics" 
        options={{ tabBarLabel: 'Progresso' }}
      >
        {(props) => <AnalyticsScreen {...props} user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Notifications" 
        options={{ tabBarLabel: 'Avisos' }}
      >
        {(props) => <NotificationsScreen {...props} user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Profile" 
        options={{ tabBarLabel: 'Perfil' }}
      >
        {(props) => <ProfileScreen {...props} user={user} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Settings" 
        options={{ tabBarLabel: 'Configurações' }}
      >
        {(props) => <SettingsScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default DashboardTabs;