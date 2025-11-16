import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dataService } from './dataService';

export default function ActivitiesPage({ user, navigation }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userActivities = await dataService.getActivitiesForUser(user.id, user.role);
      setActivities(userActivities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Adiciona um "ouvinte" que chama fetchActivities quando a tela é focada
    const unsubscribe = navigation.addListener('focus', fetchActivities);

    // Retorna uma função de limpeza para remover o ouvinte quando a tela é desmontada
    return unsubscribe;
  }, [user, navigation]);

  const handleOpenCreateActivity = () => {
    navigation.navigate('CreateActivity', { user });
  };

  const handleViewDetails = (activityId) => {
    navigation.navigate('ActivityDetail', { activityId });
  };

  const handleDeleteActivity = (activityId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja apagar esta atividade? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await dataService.deleteActivity(activityId);
              // Atualiza a lista removendo o item apagado, sem precisar de uma nova busca
              setActivities(prevActivities => prevActivities.filter(act => act.id !== activityId));
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar a atividade.");
            }
          },
        },
      ]
    );
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity style={styles.activityCard} onPress={() => handleViewDetails(item.id)}>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.activitySubtitle}>Aluno: {item.studentName}</Text>
      </View>
      {user?.role === 'teacher' && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteActivity(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="file-tray-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyText}>Nenhuma atividade encontrada</Text>
      {user?.role === 'teacher' && (
        <Text style={styles.emptySubText}>Clique no botão + para criar a primeira.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Atividades</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}

      {/* Botão para abrir o formulário de nova atividade */}
      {user?.role === 'teacher' && (
        <TouchableOpacity style={styles.fab} onPress={handleOpenCreateActivity}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1f2937', marginTop: 20 },
  activityCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  activitySubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute', right: 30, bottom: 30, width: 60, height: 60,
    borderRadius: 30, backgroundColor: '#3b82f6', justifyContent: 'center',
    alignItems: 'center', elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});