import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoSection}>
          <Text style={styles.appName}>📱 APAE Digital</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Sobre</Text>
          <Text style={styles.text}>
            App desenvolvido para facilitar a comunicação entre professores e estudantes da APAE.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Tecnologia</Text>
          <Text style={styles.tech}>React Native com Expo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Desenvolvido por</Text>
          <Text style={styles.developer}>Gustavo - Sistemas de Informação</Text>
          <Text style={styles.university}>Universidade [Nome da Universidade]</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💚 Feito com carinho para a comunidade APAE
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#15803d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  feature: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 24,
  },
  tech: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '500',
    marginBottom: 4,
  },
  developer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  university: {
    fontSize: 16,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '500',
  },
});

export default AboutScreen;