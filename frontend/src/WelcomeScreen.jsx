import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Logo from './components/Logo';

const WelcomeScreen = ({ onGoToLogin, onGoToRegister }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />
      
      <LinearGradient
        colors={['#15803d', '#16a34a', '#22c55e']}
        style={styles.gradient}
      >
        {/* Header com Logo */}
        <View style={styles.header}>
          <Logo size="large" variant="light" />
        </View>

        {/* Hero Content */}
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Bem-vindo à{'\n'}Família APAE
          </Text>
          <Text style={styles.heroSubtitle}>
            Conectando pessoas especiais com cuidado, educação e amor
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Ionicons name="heart" size={24} color="#fbbf24" />
              <Text style={styles.featureText}>Cuidado especializado</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="school" size={24} color="#fbbf24" />
              <Text style={styles.featureText}>Educação inclusiva</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="people" size={24} color="#fbbf24" />
              <Text style={styles.featureText}>Comunidade acolhedora</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onGoToRegister}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Começar Agora</Text>
              <Ionicons name="arrow-forward" size={20} color="#15803d" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onGoToLogin}>
            <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomText}>
            Mais de 2.200 unidades em todo o Brasil
          </Text>
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={16} color="#bbf7d0" />
              <Text style={styles.trustText}>Seguro</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="lock-closed" size={16} color="#bbf7d0" />
              <Text style={styles.trustText}>Privado</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="accessibility" size={16} color="#bbf7d0" />
              <Text style={styles.trustText}>Acessível</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#d1fae5',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    maxWidth: 300,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    fontWeight: '500',
  },
  actionContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#d1fae5',
    fontWeight: '500',
  },
  bottomInfo: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#bbf7d0',
    marginBottom: 16,
    textAlign: 'center',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: '#bbf7d0',
    marginLeft: 4,
  },
});

export default WelcomeScreen;