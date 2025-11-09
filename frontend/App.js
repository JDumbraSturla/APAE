import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { dataService } from './src/dataService';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import LandingPage from './src/LandingPage';
import LoginPage from './src/LoginPage';
import RegisterPageNew from './src/RegisterPageNew';
import WelcomeScreen from './src/WelcomeScreen';
import ProfilePage from './src/ProfilePage';
import SettingsPage from './src/SettingsPage';
import TeacherDashboard from './src/TeacherDashboard';
import StudentDashboard from './src/StudentDashboard';
import ActivitiesPage from './src/ActivitiesPage';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import BottomMenu from './src/BottomMenu';
import TeacherStudents from './src/TeacherStudents';
import TeacherReports from './src/TeacherReports';
import TeacherCalendar from './src/TeacherCalendar';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await dataService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.log('No authenticated user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await dataService.logout();
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    const dashboardProps = {
      user: currentUser,
      onGoToLanding: () => setCurrentPage('landing'),
      onNavigate: (page) => setCurrentPage(page),
    };

    switch (currentUser.role) {
      case 'teacher':
        return <TeacherDashboard {...dashboardProps} />;
      case 'student':
      default:
        return <StudentDashboard {...dashboardProps} />;
    }
  };

  const renderCurrentPage = () => {
    if (!currentUser) {
      // Se não estiver logado, mostrar welcome/login/register
      switch (currentPage) {
        case 'register':
          return (
            <RegisterPageNew
              onRegister={handleLogin}
              onGoToLogin={() => setCurrentPage('login')}
            />
          );
        case 'login':
          return (
            <LoginPage
              onLogin={handleLogin}
              onGoToRegister={() => setCurrentPage('register')}
              onGoBack={() => setCurrentPage('welcome')}
            />
          );
        case 'welcome':
        default:
          return (
            <WelcomeScreen
              onGoToLogin={() => setCurrentPage('login')}
              onGoToRegister={() => setCurrentPage('register')}
            />
          );
      }
    }

    // Se estiver logado, mostrar as páginas do app
    switch (currentPage) {
      case 'landing':
        return (
          <View style={{ flex: 1 }}>
            <LandingPage
              isLoggedIn={!!currentUser}
              onGoToLogin={() => setCurrentPage('login')}
              onGoToRegister={() => setCurrentPage('register')}
              onLogout={handleLogout}
              onGoHome={() => setCurrentPage('dashboard')}
            />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'profile':
        return (
          <View style={{ flex: 1 }}>
            <ProfilePage user={currentUser} />
            <BottomMenu
              currentPage="profile"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'activities':
        return (
          <View style={{ flex: 1 }}>
            <ActivitiesPage user={currentUser} />
            <BottomMenu
              currentPage="activities"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'notifications':
        return (
          <View style={{ flex: 1 }}>
            <NotificationsScreen user={currentUser} />
            <BottomMenu
              currentPage="notifications"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'reports':
        return (
          <View style={{ flex: 1 }}>
            <ReportsScreen user={currentUser} />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'medications':
        return (
          <View style={{ flex: 1 }}>
            <MedicationsScreen user={currentUser} />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'settings':
        return (
          <View style={{ flex: 1 }}>
            <SettingsPage onLogout={handleLogout} user={currentUser} />
            <BottomMenu
              currentPage="settings"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'teacher_students':
        return (
          <View style={{ flex: 1 }}>
            <TeacherStudents user={currentUser} />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'teacher_reports':
        return (
          <View style={{ flex: 1 }}>
            <TeacherReports user={currentUser} />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'teacher_calendar':
        return (
          <View style={{ flex: 1 }}>
            <TeacherCalendar user={currentUser} />
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
            />
          </View>
        );
      case 'dashboard':
      default:
        return (
          <View style={{ flex: 1 }}>
            {renderDashboard()}
            <BottomMenu
              currentPage="dashboard"
              onPageChange={setCurrentPage}
              userRole={currentUser?.role}
              onGoToLanding={() => setCurrentPage('landing')}
            />
          </View>
        );
    }
  };

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#f3f4f6' }} />;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        {renderCurrentPage()}
      </ThemeProvider>
    </SettingsProvider>
  );
}