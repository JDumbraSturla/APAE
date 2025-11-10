import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [themeValue, setThemeValue] = useState(null);

  // Este useEffect garante que o tema seja recalculado sempre que as configurações mudarem.
  useEffect(() => {
    if (!settingsLoading) {
      updateTheme();
    }
  }, [settings, settingsLoading]);

  // Função para obter as cores do tema com base nas configurações
  const getThemeColors = () => {
    const isDark = settings.theme === 'dark';
    const isHighContrast = settings.highContrast;

    if (isHighContrast) {
      return {
        background: isDark ? '#000000' : '#ffffff',
        surface: isDark ? '#000000' : '#ffffff',
        text: isDark ? '#ffffff' : '#000000',
        textSecondary: isDark ? '#ffffff' : '#000000',
        border: isDark ? '#ffffff' : '#000000',
        primary: isDark ? '#ffff00' : '#000000',
        primaryText: isDark ? '#000000' : '#ffffff',
        success: isDark ? '#ffff00' : '#000000',
        warning: isDark ? '#ffff00' : '#000000',
        error: isDark ? '#ffff00' : '#000000',
      };
    }

    if (isDark) {
      return {
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        primary: '#22c55e',
        primaryText: '#ffffff',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      };
    }

    return {
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      primary: '#15803d',
      primaryText: '#ffffff',
      success: '#16a34a',
      warning: '#f59e0b',
      error: '#dc2626',
    };
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 14;
      case 'large': return 18;
      case 'extra-large': return 22;
      default: return 16;
    }
  };

  // Função para calcular o valor completo do tema
  const updateTheme = () => {
    const value = {
      theme: {
        colors: getThemeColors(),
        fontSize: getFontSize(),
      },
      isDark: settings.theme === 'dark',
    };
    setThemeValue(value);
  };

  // Ponto crucial: Se as configurações ainda estão carregando ou o tema ainda não foi calculado, não renderiza nada.
  if (settingsLoading || !themeValue) {
    return null; // Aguarda o tema ser calculado
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};