import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from './theme/tokens';
import { useTheme } from './contexts/ThemeContext';
import { dataService } from './dataService';

const ActivitiesPage = ({ user }) => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]); // formato YYYY-MM-DD
  const [newHora, setNewHora] = useState('12:00'); // hora inicial
  const [saving, setSaving] = useState(false);

  const getRoleColor = () => user?.role === 'teacher' ? designTokens.colors.semantic.info : designTokens.colors.primary[600];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'pending': return '#f59e0b';
      case 'upcoming': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'upcoming': return 'Próxima';
      default: return 'Indefinido';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'homework': return 'book';
      case 'therapy': return 'medical';
      case 'creative': return 'color-palette';
      default: return 'document';
    }
  };

  // Busca atividades do backend
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dataService.getAtividades();
      setActivities(data);
    } catch (err) {
      console.error('Erro ao buscar atividades:', err);
      setError('Não foi possível carregar as atividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Criar nova atividade
  const handleAddActivity = async () => {
    if (!newTitle || !newDescription || !newDate || !newHora) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setSaving(true);
      await dataService.registerAtividade({
        titulo: newTitle,
        descricao: newDescription,
        data: newDate,
        hora: newHora,
      });

      setModalVisible(false);
      setNewTitle('');
      setNewDescription('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setNewHora('12:00');
      fetchActivities(); // Atualiza lista
    } catch (err) {
      console.error('Erro ao criar atividade:', err);
      Alert.alert('Erro', 'Não foi possível criar a atividade');
    } finally {
      setSaving(false);
    }
  };

  // Deletar atividade
  const handleDeleteActivity = async (id) => {
    Alert.alert('Confirmar', 'Deseja realmente deletar esta atividade?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Deletar', style: 'destructive', 
        onPress: async () => {
          try {
            await dataService.deleteAtividade(id);
            fetchActivities();
          } catch (err) {
            console.error('Erro ao deletar atividade:', err);
            Alert.alert('Erro', 'Não foi possível deletar a atividade');
          }
        } 
      }
    ]);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
        <Text style={{ color: theme.colors.text }}>Usuário não autenticado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: getRoleColor() }}>Atividades</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Acompanhe suas atividades e tarefas</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={getRoleColor()} style={{ padding: 16 }} />
      ) : error ? (
        <Text style={{ color: 'red', padding: 16 }}>{error}</Text>
      ) : activities.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Ionicons name="document-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.text }}>Nenhuma atividade</Text>
        </View>
      ) : (
        activities.map((activity) => (
          <View key={activity.id} style={{ margin: 16, padding: 16, borderRadius: 12, backgroundColor: theme.colors.surface }}>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>{activity.titulo}</Text>
            <Text style={{ color: '#6b7280' }}>{activity.descricao}</Text>
            <Text style={{ color: '#9ca3af' }}>{activity.data ? new Date(activity.data).toLocaleDateString('pt-BR') : '-'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity onPress={() => handleDeleteActivity(activity.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 16, borderRadius: 12, backgroundColor: getRoleColor() }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 8 }}>Nova Atividade</Text>
      </TouchableOpacity>

      {/* Modal de nova atividade */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex:1, justifyContent:'center', backgroundColor:'#00000080', padding:16 }}>
          <View style={{ backgroundColor: theme.colors.background, borderRadius:12, padding:16 }}>
            <Text style={{ fontSize: 18, fontWeight:'bold', marginBottom:8 }}>Nova Atividade</Text>
            <TextInput
              placeholder="Título"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:8, padding:8 }}
            />
            <TextInput
              placeholder="Descrição"
              value={newDescription}
              onChangeText={setNewDescription}
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:8, padding:8 }}
            />
            <TextInput
              placeholder="Data (AAAA-MM-DD)"
              value={newDate}
              onChangeText={setNewDate}
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:8, padding:8 }}
            />
            <TextInput
              placeholder="Hora (HH:MM)"
              value={newHora}
              onChangeText={setNewHora}
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:8, padding:8 }}
            />
            <TouchableOpacity
              onPress={handleAddActivity}
              disabled={saving}
              style={{ backgroundColor: getRoleColor(), padding:12, borderRadius:8, alignItems:'center' }}
            >
              <Text style={{ color:'#fff' }}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop:8, alignItems:'center' }}
            >
              <Text style={{ color:theme.colors.primary[500] }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ActivitiesPage;
