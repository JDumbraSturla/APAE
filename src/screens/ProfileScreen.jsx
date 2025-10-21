import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { designTokens } from '../theme/tokens';
import { useTheme } from '../contexts/ThemeContext';

const ProfileScreen = ({ user }) => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name="person" size={40} color={designTokens.colors.primary[500]} />
        </View>
        <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
      </View>
      
      <View style={styles.content}>
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Informações Pessoais</Text>
          <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Nome:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.name}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.email}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Perfil:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.role}</Text>
          </View>
        </Card>
        
        <Button variant="outline" style={[styles.editButton, { borderColor: theme.colors.border }]}>
          Editar Perfil
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: designTokens.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  name: {
    fontSize: designTokens.typography.fontSizes['2xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
  },
  email: {
    fontSize: designTokens.typography.fontSizes.base,
  },
  content: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
  },
  infoCard: {
    marginBottom: designTokens.spacing.lg,
  },
  cardTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.typography.fontWeights.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: designTokens.spacing.sm,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  infoValue: {
    fontSize: designTokens.typography.fontSizes.base,
  },
  editButton: {
    marginTop: designTokens.spacing.md,
  },
});

export default ProfileScreen;