import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { dataService } from './dataService';
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
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
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
      await dataService.updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set dynamically
  },
  header: {
    // backgroundColor will be set dynamically from theme.colors.surface
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // backgroundColor will be set dynamically
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // backgroundColor will be set dynamically
    borderRadius: 16,
    padding: 8,
  },
  roleTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 16,
    // color will be set dynamically
    fontWeight: '600',
  },
  form: {
    // backgroundColor will be set dynamically
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    // color will be set dynamically
    marginBottom: 8,
  },
  input: {
    // backgroundColor, borderColor, color will be set dynamically
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    // color will be set dynamically
    paddingVertical: 8,
  },
  actions: {
    padding: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    // backgroundColor will be set dynamically
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    // color will be set dynamically
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: designTokens.colors.neutral[500], // Using a neutral color from designTokens
    flex: 0.45,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    // color will be set dynamically
    fontWeight: '600',
  },
  saveButton: {
    // backgroundColor will be set dynamically
    flex: 0.45,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    // color will be set dynamically
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProfilePage;