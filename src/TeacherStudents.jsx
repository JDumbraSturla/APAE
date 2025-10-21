import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { dataService } from './dataService';
import { useTheme } from './contexts/ThemeContext';
import EmptyState from './components/ui/EmptyState';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const TeacherStudents = ({ user, onOpenStudent }) => {
  const { theme } = useTheme();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const users = await dataService.getUsers();
        // If students have a teacherId field, filter by it; otherwise fallback to role === 'student'
        let filtered = users.filter(u => u.role === 'student');
        if (users.some(u => u.teacherId)) {
          filtered = users.filter(u => u.teacherId === user?.id);
        }
        if (mounted) setStudents(filtered);
      } catch (error) {
        console.error('Error loading students', error);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const renderItem = ({ item }) => (
    <Card style={{ marginBottom: 12 }}>
      <TouchableOpacity style={[styles.itemRow]} onPress={() => onOpenStudent?.(item)}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{item.name || item.firstName || 'Sem nome'}</Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{item.email || ''}</Text>
        </View>
        <Button variant="ghost" onPress={() => onOpenStudent?.(item)}>Ver</Button>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }] }>
          <Text style={[styles.title, { color: theme.colors.info }]}>Meus Alunos</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Lista de alunos associados</Text>
        </View>

      {students.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Nenhum aluno encontrado"
          subtitle="Ainda não há alunos atribuídos ao seu cadastro."
          iconContainerBackgroundColor={theme.colors.surface}
          titleStyle={{ color: theme.colors.text }}
          subtitleStyle={{ color: theme.colors.textSecondary }}
        />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(i) => i.id?.toString() || i.email}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', margin: 16, borderRadius: 8, padding: 24 },
  item: { padding: 16, borderRadius: 10, marginBottom: 12, elevation: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 4 },
});

export default TeacherStudents;
