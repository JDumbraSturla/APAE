import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native'; // View pode ser removido se não usar o isLoading
import { NavigationContainer } from '@react-navigation/native';
import { dataService } from './src/dataService';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await dataService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.log('No authenticated user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = user => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await dataService.logout();
    setCurrentUser(null);
  };

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#f3f4f6' }} />;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <NavigationContainer>
          <AppNavigator user={currentUser} onLogin={handleLogin} onLogout={handleLogout} />
        </NavigationContainer>
      </ThemeProvider>
    </SettingsProvider>
  );
}