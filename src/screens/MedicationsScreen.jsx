import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const MedicationsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>Medicamentos</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>Aqui aparecerão informações sobre medicamentos.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  placeholder: { fontSize: 16 }
});

export default MedicationsScreen;
