import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import ActivitiesPage from './ActivitiesPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';
import BottomMenu from './BottomMenu';
import TeacherDashboard from './TeacherDashboard';
import GuardianDashboard from './GuardianDashboard';
import LandingPage from './LandingPage';
import { dataService } from './dataService';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await dataService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setCurrentPage('home');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const goToLogin = () => setCurrentPage('login');
  const goToRegister = () => setCurrentPage('register');
  const goToHome = () => setCurrentPage('landing');
  
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setCurrentPage('home');
  };
  
  const handleLogout = async () => {
    await dataService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (isLoading) {
    return null; // Ou um componente de loading
  }

  if (!isLoggedIn) {
    if (currentPage === 'login') {
      return (
        <NavigationContainer>
          <LoginPage 
            onGoToRegister={goToRegister} 
            onLogin={handleLogin} 
            onGoToHome={goToHome} 
          />
          <StatusBar style="auto" />
        </NavigationContainer>
      );
    }
    if (currentPage === 'register') {
      return (
        <NavigationContainer>
          <RegisterPage 
            onGoToLogin={goToLogin} 
            onGoToHome={goToHome} 
          />
          <StatusBar style="auto" />
        </NavigationContainer>
      );
    }
    return (
      <NavigationContainer>
        <LandingPage 
          onGoToLogin={goToLogin} 
          onGoToRegister={goToRegister} 
        />
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }

  const renderPage = () => {
    // Renderiza dashboard específico baseado no role do usuário
    if (currentPage === 'home') {
      switch (currentUser?.role) {
        case 'teacher':
          return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
        case 'guardian':
          return <GuardianDashboard user={currentUser} onLogout={handleLogout} />;
        case 'admin':
          return <LandingPage onGoToLogin={goToLogin} onGoToRegister={goToRegister} isLoggedIn={true} onLogout={handleLogout} />;
        default: // student
          return <LandingPage onGoToLogin={goToLogin} onGoToRegister={goToRegister} isLoggedIn={true} onLogout={handleLogout} />;
      }
    }
    
    switch (currentPage) {
      case 'profile': 
        return <ProfilePage user={currentUser} onUserUpdate={handleUserUpdate} onLogout={handleLogout} />;
      case 'activities': 
        return <ActivitiesPage userRole={currentUser?.role} />;
      case 'notifications': 
        return <NotificationsPage userRole={currentUser?.role} />;
      case 'settings': 
        return <SettingsPage userRole={currentUser?.role} />;
      default: 
        return <LandingPage onGoToLogin={goToLogin} onGoToRegister={goToRegister} isLoggedIn={true} onLogout={handleLogout} />;
    }
  };

  return (
    <NavigationContainer>
      <SettingsProvider>
        <>
          {renderPage()}
          <BottomMenu 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
            userRole={currentUser?.role} 
          />
          <StatusBar style="auto" />
        </>
      </SettingsProvider>
    </NavigationContainer>
  );
}

export default App;