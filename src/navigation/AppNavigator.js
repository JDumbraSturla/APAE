import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas de Autenticação
import WelcomeScreen from '../WelcomeScreen';
import LoginPage from '../LoginPage';
import RegisterPageNew from '../RegisterPageNew';

// Telas Principais (após login)
import TeacherDashboard from '../TeacherDashboard';
import StudentDashboard from '../StudentDashboard';
import ProfilePage from '../ProfilePage';
import ActivitiesPage from '../ActivitiesPage';
import SettingsPage from '../SettingsPage';
import NotificationsScreen from '../screens/NotificationsScreen';

// Telas específicas do Professor
import TeacherStudents from '../TeacherStudents';
import TeacherReports from '../TeacherReports';
import TeacherCalendar from '../TeacherCalendar';

// Nova tela para criar atividades
import CreateActivityScreen from '../screens/CreateActivityScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador para as telas de autenticação (antes do login)
const AuthStack = ({ onLogin }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login">
      {(props) => <LoginPage {...props} onLogin={onLogin} />}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {(props) => <RegisterPageNew {...props} onRegister={onLogin} />}
    </Stack.Screen>
  </Stack.Navigator>
);

// Navegador principal com abas (após o login)
const MainTabNavigator = ({ user, onLogout }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Activities') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard">
      {(props) => {
        const DashboardComponent = user.role === 'teacher' ? TeacherDashboard : StudentDashboard;
        // Passando explicitamente a navigation para os componentes filhos
        return <DashboardComponent {...props} user={user} navigation={props.navigation} />;
      }}
    </Tab.Screen>
    <Tab.Screen name="Activities">
      {(props) => (
        // Passando explicitamente a navigation
        <ActivitiesPage
          {...props}
          user={user}
          navigation={props.navigation}
        />
      )}
    </Tab.Screen>
    <Tab.Screen name="Profile">
      {(props) => <ProfilePage {...props} user={user} />}
    </Tab.Screen>
    <Tab.Screen name="Settings">
      {(props) => <SettingsPage {...props} user={user} onLogout={onLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);

// Navegador raiz que agrupa tudo
const AppNavigator = ({ user, onLogin, onLogout }) => {
  if (!user) {
    return <AuthStack onLogin={onLogin} />;
  }

  // Se o usuário está logado, mostramos um Stack que contém
  // o navegador de abas e todas as outras telas.
  return (
    <Stack.Navigator>
      {/* O Tab Navigator é a tela principal */}
      <Stack.Screen
        name="Main"
        options={{ headerShown: false }}
      >
        {(props) => <MainTabNavigator {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>

      {/* Telas que são abertas por cima das abas */}
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notificações' }}
      />
      <Stack.Screen
        name="CreateActivity"
        component={CreateActivityScreen}
        options={{ title: 'Criar Nova Atividade', presentation: 'modal' }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: 'Detalhes da Atividade' }}
      />

      {/* Telas específicas do professor */}
      <Stack.Screen
        name="TeacherStudents"
        component={TeacherStudents}
        options={{ title: 'Meus Alunos' }}
      />
      <Stack.Screen
        name="TeacherReports"
        component={TeacherReports}
        options={{ title: 'Relatórios' }}
      />
      <Stack.Screen
        name="TeacherCalendar"
        component={TeacherCalendar}
        options={{ title: 'Calendário' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;