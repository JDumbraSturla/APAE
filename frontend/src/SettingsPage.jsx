import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ onLogout, user }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  // Ensure we always have a valid primary color (fallback to theme primary)
  const rolePrimary = ((user && user.role === 'teacher') ? (theme.colors.teacherPrimary || theme.colors.primary) : (theme.colors.studentPrimary || theme.colors.primary)) || theme.colors.primary;
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedHighContrast = await AsyncStorage.getItem('highContrast');
      const savedReducedMotion = await AsyncStorage.getItem('reducedMotion');
      
      if (savedFontSize) setFontSize(savedFontSize);
      if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
      if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleFontSizeChange = async (size) => {
    setFontSize(size);
    await AsyncStorage.setItem('fontSize', size);
  };

  const handleHighContrastChange = async (value) => {
    setHighContrast(value);
    await AsyncStorage.setItem('highContrast', JSON.stringify(value));
  };

  const handleReducedMotionChange = async (value) => {
    setReducedMotion(value);
    await AsyncStorage.setItem('reducedMotion', JSON.stringify(value));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Configurações</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Aparência</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Tema Escuro</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: rolePrimary }}
              thumbColor='#ffffff'
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Tamanho da Fonte</Text>
            <View style={styles.fontButtons}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontButton,
                    { backgroundColor: fontSize === size ? theme.colors.primary : theme.colors.border },
                  ]}
                  onPress={() => handleFontSizeChange(size)}
                >
                  <Text style={[
                    styles.fontButtonText,
                    { color: fontSize === size ? '#ffffff' : theme.colors.text }
                  ]}>
                    {size === 'small' ? 'P' : size === 'medium' ? 'M' : 'G'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Acessibilidade</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Alto Contraste</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Melhora a visibilidade do texto</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={handleHighContrastChange}
              trackColor={{ false: theme.colors.border, true: rolePrimary }}
              thumbColor='#ffffff'
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Movimento Reduzido</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Reduz animações e transições</Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={handleReducedMotionChange}
              trackColor={{ false: theme.colors.border, true: rolePrimary }}
              thumbColor='#ffffff'
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: rolePrimary }]} onPress={onLogout}>
            <Ionicons name="log-out" size={20} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  settingInfo: {
    flex: 1,
  },
  fontButtons: {
    flexDirection: 'row',
  },
  fontButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  fontButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default SettingsPage;