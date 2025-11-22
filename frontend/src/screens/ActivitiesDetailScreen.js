import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { dataService } from '../dataService';

export default function ActivityDetailScreen({ route }) {
  // Recebemos o ID da atividade que foi clicada
  const { activityId } = route.params;
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const details = await dataService.getActivityById(activityId);
        if (details) {
          setActivity(details);
        } else {
          Alert.alert('Erro', 'Atividade não encontrada.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da atividade.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activityId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#3b82f6" style={styles.centered} />;
  }

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text>Atividade não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Aluno:</Text>
          <Text style={styles.value}>{activity.studentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Professor:</Text>
          <Text style={styles.value}>{activity.teacherName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Criada em:</Text>
          <Text style={styles.value}>{new Date(activity.createdAt).toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <Text style={styles.descriptionLabel}>Descrição da Atividade</Text>
      <Text style={styles.descriptionText}>{activity.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  infoCard: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 20, elevation: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 16, color: '#6b7280', fontWeight: '500' },
  value: { fontSize: 16, color: '#1f2937', fontWeight: '600' },
  descriptionLabel: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  descriptionText: { fontSize: 16, color: '#374151', lineHeight: 24 },
});