import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './contexts/ThemeContext';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const TeacherReports = ({ user }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }] }>
        <Text style={[styles.title, { color: theme.colors.info }]}>Relatórios</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Gerar e exportar relatórios</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Card>
          <View style={{ padding: 8 }}>
            <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Exportar os dados dos seus alunos em CSV.</Text>
            <Button onPress={() => { /* future export */ }}>Exportar CSV</Button>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
});

export default TeacherReports;
