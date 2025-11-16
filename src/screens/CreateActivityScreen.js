import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { dataService } from '../dataService';
import { ActivityIndicator } from 'react-native';

export default function CreateActivityScreen({ navigation, route }) {
  // O usuário (professor) é passado via parâmetros de rota
  const { user } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const fetchedStudents = await dataService.getStudentsForTeacher();
        setStudents(fetchedStudents);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [user]);

  const handleSave = async () => {
    if (!title || !description || !selectedStudentId) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setIsSaving(true);
    try {
      const newActivity = {
        title,
        description,
        studentId: selectedStudentId,
        teacherId: user.id,
      };
      await dataService.createActivity(newActivity);
      Alert.alert('Sucesso!', 'Atividade criada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a atividade.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título da Atividade</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Leitura e interpretação"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Detalhes da atividade..."
        multiline
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <>
      <Text style={styles.label}>Atribuir para o Aluno</Text>
      {/* Para um seletor melhor, considere usar uma biblioteca como 'react-native-picker-select' */}
      <View style={styles.picker}>
        {students.map((student) => (
          <Button
            key={student.id}
            title={student.name}
            onPress={() => setSelectedStudentId(student.id)}
            color={selectedStudentId === student.id ? '#3b82f6' : 'gray'}
          />
        ))}
      </View>
        </>
      )}

      <Text style={styles.label}>Professor Responsável</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user.name} // Nome do professor logado
        editable={false}
      />

      <View style={styles.saveButton}>
        <Button title={isSaving ? "Salvando..." : "Salvar Atividade"} onPress={handleSave} disabled={isSaving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#888' },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    marginTop: 30,
  },
});