import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { designTokens } from '../theme/tokens';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightTheme = {
  colors: {
    primary: designTokens.colors.primary[500],
    primaryLight: designTokens.colors.primary[100],
    secondary: designTokens.colors.secondary[500],
    // use a subtle off-white background so surface/card (white) stand out as rectangles
    background: designTokens.colors.neutral[50] || '#f9fafb',
    surface: '#ffffff',
    card: '#ffffff',
    text: designTokens.colors.neutral[900],
    textSecondary: designTokens.colors.neutral[600],
    border: designTokens.colors.neutral[200],
    notification: designTokens.colors.semantic.error,
    // role specific
    teacherPrimary: designTokens.colors.role.teacher[500],
    studentPrimary: designTokens.colors.role.student[500],
    teacherPrimaryLight: designTokens.colors.role.teacher[600],
    studentPrimaryLight: designTokens.colors.role.student[600],
  info: designTokens.colors.semantic.info,
    success: designTokens.colors.semantic.success,
    warning: designTokens.colors.semantic.warning,
    error: designTokens.colors.semantic.error,
  },
  dark: false,
};

const darkTheme = {
  colors: {
    // Use token keys that exist in tokens.js to avoid undefined colors
  primary: designTokens.colors.primary[600] || designTokens.colors.primary[500],
    // primaryLight should be a lighter tint usable as highlights on dark surfaces
    primaryLight: designTokens.colors.primary[100] || designTokens.colors.primary[500],
    secondary: designTokens.colors.secondary[500],
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    border: '#475569',
    notification: '#ef4444',
    info: designTokens.colors.semantic.info,
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  // role specific softened for dark mode
  teacherPrimary: '#3b6bff',
  studentPrimary: '#1e8f3e',
  teacherPrimaryLight: '#6b8bff',
  studentPrimaryLight: '#3fb558',
  },
  dark: true,
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isSystemTheme) {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, [isSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      const savedSystemTheme = await AsyncStorage.getItem('system_theme');
      
      if (savedSystemTheme !== null) {
        const useSystem = JSON.parse(savedSystemTheme);
        setIsSystemTheme(useSystem);
        
        if (useSystem) {
          setIsDark(Appearance.getColorScheme() === 'dark');
        } else if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        }
      } else {
        setIsDark(Appearance.getColorScheme() === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    setIsSystemTheme(false);
    
    try {
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('system_theme', 'false');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setSystemTheme = async () => {
    setIsSystemTheme(true);
    setIsDark(Appearance.getColorScheme() === 'dark');
    
    try {
      await AsyncStorage.setItem('system_theme', 'true');
    } catch (error) {
      console.error('Error saving system theme preference:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider 
      value={{ 
        theme,
        typography: designTokens.typography,
        isDark, 
        isSystemTheme,
        toggleTheme, 
        setSystemTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};