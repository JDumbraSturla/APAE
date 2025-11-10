import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { designTokens } from '../theme/tokens';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = ({ user, onLogout }) => {
  const { theme, isDark, toggleTheme, isSystemTheme, setSystemTheme } = useTheme();
  
  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const settingsOptions = [
    { icon: 'notifications', title: 'Notificações', subtitle: 'Gerenciar alertas' },
    { icon: 'lock-closed', title: 'Privacidade', subtitle: 'Configurações de privacidade' },
    { icon: 'accessibility', title: 'Acessibilidade', subtitle: 'Opções de acessibilidade' },
    { icon: 'help-circle', title: 'Ajuda', subtitle: 'Central de ajuda' },
    { icon: 'information-circle', title: 'Sobre', subtitle: 'Versão e informações' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Configurações</Text>
      </View>
      
      <View style={styles.content}>
        {/* Theme Settings */}
        <Card style={[styles.optionsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Aparência</Text>
          
          <View style={styles.themeOption}>
            <View style={styles.optionIcon}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={designTokens.colors.primary[500]} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>Tema Escuro</Text>
              <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>Ativar modo escuro</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: designTokens.colors.neutral[300], true: designTokens.colors.primary[500] }}
              thumbColor={isDark ? '#ffffff' : '#ffffff'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={setSystemTheme}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="phone-portrait" size={20} color={designTokens.colors.primary[500]} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>Seguir Sistema</Text>
              <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>Usar tema do dispositivo</Text>
            </View>
            {isSystemTheme && (
              <Ionicons name="checkmark" size={20} color={designTokens.colors.primary[500]} />
            )}
          </TouchableOpacity>
        </Card>
        
        <Card style={[styles.optionsCard, { backgroundColor: theme.colors.surface }]}>
          {settingsOptions.map((option, index) => (
            <View key={index} style={[styles.optionItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={20} color={designTokens.colors.primary[500]} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{option.title}</Text>
                <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </View>
          ))}
        </Card>
        
        <Button 
          variant="outline" 
          style={[styles.logoutButton, { borderColor: designTokens.colors.semantic.error }]}
          onPress={handleLogout}
        >
          <Text style={{ color: designTokens.colors.semantic.error }}>Sair da Conta</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[50],
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.lg,
  },
  title: {
    fontSize: designTokens.typography.fontSizes['2xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
    color: designTokens.colors.neutral[800],
  },
  content: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  optionsCard: {
    marginBottom: designTokens.spacing.xl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.neutral[100],
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designTokens.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.neutral[800],
  },
  optionSubtitle: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: designTokens.colors.neutral[600],
    marginTop: 2,
  },
  logoutButton: {
    marginTop: designTokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
    marginBottom: designTokens.spacing.md,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.neutral[100],
  },
});

export default SettingsScreen;