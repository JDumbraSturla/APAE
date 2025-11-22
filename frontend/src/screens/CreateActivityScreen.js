import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { dataService } from '../dataService';

export default function CreateActivityScreen({ navigation, route }) {
  const { user } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dataService.getStudentsForTeacher();
        setStudents(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar alunos.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!title || !description || !selectedStudentId) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setIsSaving(true);

    try {
      await dataService.createActivity({
        title,
        description,
        teacherId: user.id,
        studentId: selectedStudentId,
      });

      Alert.alert("Sucesso", "Atividade criada.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert("Erro", "Falha ao criar atividade.");
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
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <>
          <Text style={styles.label}>Atribuir para o Aluno</Text>
          <View style={styles.picker}>
            {students.map((s) => (
              <Button
                key={s.id}
                title={s.name}
                onPress={() => setSelectedStudentId(s.id)}
                color={selectedStudentId === s.id ? "#3b82f6" : "gray"}
              />
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Professor Responsável</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={user.name} editable={false} />

      <View style={styles.saveButton}>
        <Button
          title={isSaving ? "Salvando..." : "Salvar Atividade"}
          onPress={handleSave}
          disabled={isSaving}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#888' },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
  saveButton: { marginTop: 30 },
});
