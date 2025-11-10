import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { dataService } from './dataService';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './contexts/ThemeContext';
import Logo from './components/Logo';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import { designTokens } from './theme/tokens';
import { animations } from './theme/animations';
import { biometricService } from './services/biometricService';

const LoginPage = ({ onLogin, onGoToRegister, onGoBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const { theme, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      animations.fadeIn(fadeAnim, 600),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const biometric = await biometricService.isAvailable();
    const isEnabled = await biometricService.isBiometricEnabled();
    
    if (biometric.available && isEnabled) {
      setBiometricAvailable(true);
      setBiometricType(biometricService.getBiometricType(biometric.supportedTypes));
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await biometricService.authenticate();
      
      if (result.success) {
        const credentials = await biometricService.getSavedCredentials();
        if (credentials) {
          const user = await dataService.login(credentials.email, credentials.password);
          onLogin(user);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const user = await dataService.login(email, password);
      onLogin(user);
    } catch (error) {
      setError('Não conseguimos fazer seu login. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[designTokens.colors.neutral[50], '#ffffff']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              <Ionicons name="chevron-back" size={24} color={designTokens.colors.neutral[600]} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Logo size="medium" />
            </View>
          </View>

          {/* Main Content */}
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>Bem-vindo de volta!</Text>
              <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={designTokens.colors.semantic.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
              />

              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <Button
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
              >
                Entrar
              </Button>
              
              {biometricAvailable && (
                <TouchableOpacity 
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                >
                  <Ionicons 
                    name={biometricType.includes('Face') ? 'scan' : 'finger-print'} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <Text style={[styles.biometricText, { color: theme.colors.primary }]}>
                    Entrar com {biometricType}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Register Link */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={onGoToRegister}>
                <Text style={styles.registerLink}>Cadastre-se aqui</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: designTokens.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: designTokens.spacing.xl,
  },
  backButton: {
    padding: designTokens.spacing.sm,
    marginRight: designTokens.spacing.md,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // Compensar o botão de voltar
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: designTokens.spacing['2xl'],
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: designTokens.spacing['2xl'],
  },
  title: {
    fontSize: designTokens.typography.fontSizes['3xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
    color: designTokens.colors.neutral[800],
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    color: designTokens.colors.neutral[600],
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.semantic.error + '10',
    borderWidth: 1,
    borderColor: designTokens.colors.semantic.error + '30',
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
  },
  errorText: {
    color: designTokens.colors.semantic.error,
    fontSize: designTokens.typography.fontSizes.sm,
    marginLeft: designTokens.spacing.sm,
    flex: 1,
  },
  form: {
    marginBottom: designTokens.spacing.xl,
  },
  loginButton: {
    marginTop: designTokens.spacing.md,
  },
  registerSection: {
    alignItems: 'center',
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.neutral[200],
  },
  registerText: {
    fontSize: designTokens.typography.fontSizes.base,
    color: designTokens.colors.neutral[600],
    marginBottom: designTokens.spacing.sm,
  },
  registerLink: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.semibold,
    color: designTokens.colors.primary[500],
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.md,
    marginTop: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: designTokens.colors.primary[500] + '30',
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary[500] + '10',
  },
  biometricText: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    marginLeft: designTokens.spacing.sm,
  },
});

export default LoginPage;