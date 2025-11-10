import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from '../WelcomeScreen';
import LoginPage from '../LoginPage';
import RegisterPageNew from '../RegisterPageNew';
import DashboardTabs from './DashboardTabs';
import { designTokens } from '../theme/tokens';

const Stack = createStackNavigator();

const AppNavigator = ({ currentUser, onLogin, onLogout }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {currentUser ? (
          <Stack.Screen name="Dashboard">
            {(props) => (
              <DashboardTabs 
                {...props} 
                user={currentUser} 
                onLogout={onLogout} 
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Welcome">
              {(props) => (
                <WelcomeScreen
                  {...props}
                  onGoToLogin={() => props.navigation.navigate('Login')}
                  onGoToRegister={() => props.navigation.navigate('Register')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginPage
                  {...props}
                  onLogin={onLogin}
                  onGoToRegister={() => props.navigation.navigate('Register')}
                  onGoBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterPageNew
                  {...props}
                  onRegister={onLogin}
                  onGoToLogin={() => props.navigation.navigate('Login')}
                  onGoBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;