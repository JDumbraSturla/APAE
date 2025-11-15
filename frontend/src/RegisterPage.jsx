import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useTheme } from './contexts/ThemeContext';
import { designTokens } from './theme/tokens';
import LoadingSpinner from './components/LoadingSpinner';

const ProfilePage = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
  });

  const { theme, isDark } = useTheme();

  // Busca dados atualizados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://seu-backend.com/users/${user.id}`);
        const updatedUser = response.data;
        setFormData({
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          photo: updatedUser.photo || '',
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...formData };
      await axios.put(`https://seu-backend.com/users/${user.id}`, updatedUser);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || error.message || 'Não foi possível atualizar o perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'teacher': return designTokens.colors.semantic.info;
      default: return designTokens.colors.primary[600];
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'teacher': return 'Professor/Terapeuta';
      default: return 'Aluno';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity style={styles.photoContainer} onPress={isEditing ? pickImage : null}>
          {formData.photo ? (
            <Image source={{ uri: formData.photo }} style={styles.profilePhoto} />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: designTokens.colors.neutral[200] }]}>
              <Ionicons name="person" size={40} color={theme.colors.textSecondary} />
            </View>
          )}
          {isEditing && (
            <View style={[styles.photoOverlay, { backgroundColor: getRoleColor() }]}>
              <Ionicons name="camera" size={24} color={theme.colors.textInverse} />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={[styles.roleTag, { backgroundColor: getRoleColor() }]}>
          <Text style={[styles.roleText, { color: theme.colors.textInverse }]}>{getRoleLabel()}</Text>
        </View>
      </View>

      <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Nome</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="Nome"
                placeholderTextColor="#9ca3af"
              />
            ) : (
              <Text style={[styles.value, { color: theme.colors.text }]}>{formData.firstName}</Text>
            )}
          </View>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Sobrenome</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Sobrenome"
                placeholderTextColor="#9ca3af"
              />
            ) : (
              <Text style={[styles.value, { color: theme.colors.text }]}>{formData.lastName}</Text>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          ) : (
            <Text style={[styles.value, { color: theme.colors.text }]}>{formData.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Telefone</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Telefone"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
          ) : (
            <Text style={[styles.value, { color: theme.colors.text }]}>{formData.phone || 'Não informado'}</Text>
          )}
        </View>

        {user?.role === 'student' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>CPF</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{user?.cpf || 'Não informado'}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>RA</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{user?.ra || 'Não informado'}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actions}>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  photo: user?.photo || '',
                });
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.textInverse }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: getRoleColor() }, isLoading && styles.disabledButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner size="sm" color={theme.colors.textInverse} />}
              <Text style={[styles.saveButtonText, { color: theme.colors.textInverse }]}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.editButton, { backgroundColor: getRoleColor() }]} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={20} color={theme.colors.textInverse} />
            <Text style={[styles.editButtonText, { color: theme.colors.textInverse }]}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
