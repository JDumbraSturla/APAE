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
  const [editingActivity, setEditingActivity] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newHora, setNewHora] = useState('12:00');
  const [saving, setSaving] = useState(false);

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');

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
      setActivities(data || []);
    } catch (err) {
      console.error('Erro ao buscar atividades:', err);
      setError('Erro ao carregar atividades: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Busca alunos
  const fetchAlunos = async () => {
    try {
      const data = await dataService.getAlunos();
      setAlunos(data || []);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    }
  };

  // Busca professores
  const fetchProfessores = async () => {
    try {
      const data = await dataService.getProfessores();
      setProfessores(data || []);
    } catch (err) {
      console.error('Erro ao buscar professores:', err);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchAlunos();
    if (user?.admin) {
      fetchProfessores();
    }
    setSelectedProfessor(user?.id || '');
  }, [user]);

  // Criar/Editar atividade
  const handleAddActivity = async () => {
    if (!newTitle.trim() || !newDescription.trim() || !newDate || !newHora) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setSaving(true);
      if (editingActivity) {
        await dataService.updateAtividade(editingActivity.id, {
          titulo: newTitle.trim(),
          descricao: newDescription.trim(),
          data: newDate,
          hora: newHora,
          professorId: selectedProfessor,
        });
        Alert.alert('Sucesso', 'Atividade atualizada com sucesso!');
      } else {
        await dataService.registerAtividade({
          titulo: newTitle.trim(),
          descricao: newDescription.trim(),
          data: newDate,
          hora: newHora,
          professorId: selectedProfessor,
        });
        Alert.alert('Sucesso', 'Atividade criada com sucesso!');
      }

      setModalVisible(false);
      setEditingActivity(null);
      setNewTitle('');
      setNewDescription('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setNewHora('12:00');
      setSelectedProfessor(user?.id || '');
      fetchActivities();
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
      Alert.alert('Erro', 'Não foi possível salvar a atividade: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Editar atividade
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setNewTitle(activity.titulo);
    setNewDescription(activity.descricao);
    setNewDate(activity.data);
    setNewHora(activity.hora);
    setModalVisible(true);
  };

  // Associar alunos
  const handleAssignStudents = async () => {
    if (selectedAlunos.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um aluno');
      return;
    }

    try {
      for (const alunoId of selectedAlunos) {
        await dataService.assignAlunoToAtividade(selectedActivity.id, alunoId);
      }
      Alert.alert('Sucesso', 'Alunos associados com sucesso!');
      setAssignModalVisible(false);
      setSelectedAlunos([]);
      fetchActivities();
    } catch (err) {
      console.error('Erro ao associar alunos:', err);
      Alert.alert('Erro', 'Não foi possível associar os alunos');
    }
  };

  // Remover aluno da atividade
  const handleRemoveStudent = async (activityId, alunoId) => {
    try {
      await dataService.removeAlunoFromAtividade(activityId, alunoId);
      fetchActivities();
    } catch (err) {
      console.error('Erro ao remover aluno:', err);
      Alert.alert('Erro', 'Não foi possível remover o aluno');
    }
  };

  // Toggle aluno selection
  const toggleAlunoSelection = (alunoId) => {
    setSelectedAlunos(prev => 
      prev.includes(alunoId) 
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
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
            <Text style={{ fontWeight: '600', fontSize: 16, color: theme.colors.text }}>{activity.titulo}</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{activity.descricao}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }}>
              {activity.data ? new Date(activity.data).toLocaleDateString('pt-BR') : '-'} às {activity.hora || '-'}
            </Text>
            {activity.professor && (
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                Professor: {activity.professor.nome} {activity.professor.sobrenome}
              </Text>
            )}
            {activity.aluno && activity.aluno.length > 0 && (
              <View style={{ marginTop: 4 }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Alunos:</Text>
                {activity.aluno.map(aluno => (
                  <View key={aluno.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                      • {aluno.nome} {aluno.sobrenome}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveStudent(activity.id, aluno.id)}>
                      <Ionicons name="close-circle" size={16} color={theme.colors.error || "red"} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 12 }}>
              <TouchableOpacity onPress={() => handleEditActivity(activity)}>
                <Ionicons name="pencil-outline" size={24} color={getRoleColor()} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedActivity(activity); setAssignModalVisible(true); }}>
                <Ionicons name="person-add-outline" size={24} color={getRoleColor()} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteActivity(activity.id)}>
                <Ionicons name="trash-outline" size={24} color={theme.colors.error || "red"} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Botão para criar nova atividade */}
      
        <View style={{ padding: 16 }}>
          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 16, 
              borderRadius: 12, 
              backgroundColor: getRoleColor(),
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '600' }}>Nova Atividade</Text>
          </TouchableOpacity>
        </View>

      {/* Modal de nova atividade */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.5)', padding:20 }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius:12, padding:20 }}>
            <Text style={{ fontSize: 18, fontWeight:'bold', marginBottom:16, color: theme.colors.text }}>{editingActivity ? 'Editar Atividade' : 'Nova Atividade'}</Text>
            <TextInput
              placeholder="Título"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{ borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:12, padding:12, color: theme.colors.text, backgroundColor: theme.colors.background }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              placeholder="Descrição"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={3}
              style={{ borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:12, padding:12, color: theme.colors.text, backgroundColor: theme.colors.background, textAlignVertical: 'top' }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              placeholder="Data (AAAA-MM-DD)"
              value={newDate}
              onChangeText={setNewDate}
              style={{ borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:12, padding:12, color: theme.colors.text, backgroundColor: theme.colors.background }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              placeholder="Hora (HH:MM)"
              value={newHora}
              onChangeText={setNewHora}
              style={{ borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:12, padding:12, color: theme.colors.text, backgroundColor: theme.colors.background }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            {user?.admin && (
              <ScrollView style={{ maxHeight: 100, borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:16 }}>
                {professores.map((prof) => (
                  <TouchableOpacity
                    key={prof.id}
                    onPress={() => setSelectedProfessor(prof.id)}
                    style={{
                      padding: 12,
                      backgroundColor: selectedProfessor === prof.id ? getRoleColor() + '20' : 'transparent',
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border
                    }}
                  >
                    <Text style={{ color: selectedProfessor === prof.id ? getRoleColor() : theme.colors.text }}>
                      {prof.nome} {prof.sobrenome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
              onPress={handleAddActivity}
              disabled={saving}
              style={{ backgroundColor: getRoleColor(), padding:14, borderRadius:8, alignItems:'center', marginBottom:8 }}
            >
              <Text style={{ color:'#fff', fontWeight:'600' }}>{saving ? 'Salvando...' : (editingActivity ? 'Atualizar' : 'Criar Atividade')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEditingActivity(null);
                setNewTitle('');
                setNewDescription('');
                setNewDate(new Date().toISOString().split('T')[0]);
                setNewHora('12:00');
                setSelectedProfessor(user?.id || '');
              }}
              style={{ padding:12, alignItems:'center' }}
            >
              <Text style={{ color: getRoleColor(), fontWeight:'500' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para associar aluno */}
      <Modal visible={assignModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.5)', padding:20 }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius:12, padding:20 }}>
            <Text style={{ fontSize: 18, fontWeight:'bold', marginBottom:16, color: theme.colors.text }}>Associar Aluno</Text>
            <Text style={{ color: theme.colors.textSecondary, marginBottom:12 }}>Atividade: {selectedActivity?.titulo}</Text>
            
            <ScrollView style={{ maxHeight: 150, borderWidth:1, borderColor: theme.colors.border, borderRadius:8, marginBottom:16 }}>
              {alunos.map((aluno) => (
                <TouchableOpacity
                  key={aluno.id}
                  onPress={() => toggleAlunoSelection(aluno.id)}
                  style={{
                    padding: 12,
                    backgroundColor: selectedAlunos.includes(aluno.id) ? getRoleColor() + '20' : 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Ionicons 
                    name={selectedAlunos.includes(aluno.id) ? "checkbox" : "square-outline"} 
                    size={20} 
                    color={selectedAlunos.includes(aluno.id) ? getRoleColor() : theme.colors.textSecondary} 
                  />
                  <Text style={{ color: selectedAlunos.includes(aluno.id) ? getRoleColor() : theme.colors.text, marginLeft: 8 }}>
                    {aluno.nome} {aluno.sobrenome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={handleAssignStudents}
              style={{ backgroundColor: getRoleColor(), padding:14, borderRadius:8, alignItems:'center', marginBottom:8 }}
            >
              <Text style={{ color:'#fff', fontWeight:'600' }}>Associar Alunos ({selectedAlunos.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAssignModalVisible(false);
                setSelectedAlunos([]);
              }}
              style={{ padding:12, alignItems:'center' }}
            >
              <Text style={{ color: getRoleColor(), fontWeight:'500' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ActivitiesPage;
