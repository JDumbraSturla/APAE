import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { dataService } from './src/dataService';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import NetworkStatus from './src/components/ui/NetworkStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if first time user
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // Check auth status
      const user = await dataService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      
      // Show onboarding for new users
      if (!hasSeenOnboarding && !user) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.log('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await dataService.logout();
    setCurrentUser(null);
  };

  if (showSplash) {
    return (
      <ThemeProvider>
        <SplashScreen onFinish={handleSplashFinish} />
      </ThemeProvider>
    );
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#f3f4f6' }} />;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <NetworkStatus />
          <AppNavigator 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </View>
      </ThemeProvider>
    </SettingsProvider>
  );
}