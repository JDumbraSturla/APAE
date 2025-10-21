import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { dataService } from './dataService';
import CustomSelect from './components/CustomSelect';
import LoadingSpinner from './components/LoadingSpinner';

const RegisterPage = ({ onRegister, onGoToLogin, onGoToHome }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [ra, setRa] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [careType, setCareType] = useState('');
  const [medication, setMedication] = useState('');
  const [userRole, setUserRole] = useState('student');
  
  const [guardianFirstName, setGuardianFirstName] = useState('');
  const [guardianLastName, setGuardianLastName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [guardianAge, setGuardianAge] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRoleOptions = [
    { value: 'student', label: 'Aluno' },
    { value: 'teacher', label: 'Professor/Terapeuta' }
  ];

  const careTypeOptions = [
    { value: '', label: 'Selecione (opcional)' },
    { value: 'deficiencia-intelectual', label: 'Deficiência Intelectual' },
    { value: 'sindrome-down', label: 'Síndrome de Down' },
    { value: 'autismo', label: 'Transtorno do Espectro Autista (TEA)' },
    { value: 'multiplas-deficiencias', label: 'Múltiplas Deficiências' },
    { value: 'paralisia-cerebral', label: 'Paralisia Cerebral' },
    { value: 'deficiencia-fisica', label: 'Deficiência Física' },
    { value: 'outros', label: 'Outros' },
    { value: 'nao-informar', label: 'Prefiro não informar' }
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const userData = {
        firstName, lastName, cpf, ra, email, password, phone, photo, careType, medication,
        role: userRole,
        guardian: userRole === 'student' ? {
          firstName: guardianFirstName,
          lastName: guardianLastName,
          relation: guardianRelation,
          age: guardianAge,
          phone: guardianPhone,
          email: guardianEmail
        } : null
      };
      const user = await dataService.register(userData);
      setSuccess(true);
      setTimeout(() => onRegister(user), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onGoToHome}>
        <Ionicons name="chevron-back" size={20} color="#6b7280" />
        <Text style={styles.backButtonText}>Voltar ao início</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {/* Seção CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Já faz parte?</Text>
          <Text style={styles.ctaSubtitle}>
            Se você já tem uma conta, basta fazer o login. Estamos esperando por você!
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={onGoToLogin}>
            <Text style={styles.ctaButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        {/* Formulário de Cadastro */}
        <View style={styles.formSection}>
          <Text style={styles.title}>CRIE SUA CONTA</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Conta criada com sucesso! Redirecionando para login...
              </Text>
            </View>
          ) : null}

          {/* Tipo de Usuário */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de Usuário</Text>
            <CustomSelect
              value={userRole}
              onChange={setUserRole}
              options={userRoleOptions}
              placeholder="Selecione o tipo de usuário"
            />
          </View>

          {/* Dados Pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {userRole === 'student' ? 'Dados do Aluno' : 'Dados Pessoais'}
            </Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Nome"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Sobrenome</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Sobrenome"
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  value={cpf}
                  onChangeText={setCpf}
                  placeholder="000.000.000-00"
                />
              </View>
              {userRole === 'student' && (
                <View style={styles.halfInput}>
                  <Text style={styles.label}>RA</Text>
                  <TextInput
                    style={styles.input}
                    value={ra}
                    onChangeText={setRa}
                    placeholder="Registro Acadêmico"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Contato e Acesso */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contato e Acesso</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu.email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                />
              </View>
            </View>
            
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Foto do Perfil */}
          <View style={styles.section}>
            <Text style={styles.label}>Foto do Perfil (opcional)</Text>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={32} color="#9ca3af" />
                </View>
              )}
              <Text style={styles.photoText}>Clique para adicionar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Informações Médicas - apenas para alunos */}
          {userRole === 'student' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Médicas</Text>
              
              <Text style={styles.label}>Tipo de Atendimento</Text>
              <CustomSelect
                value={careType}
                onChange={setCareType}
                options={careTypeOptions}
                placeholder="Selecione o tipo de atendimento"
              />
              
              <Text style={styles.label}>Medicações (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={medication}
                onChangeText={setMedication}
                placeholder="Descreva medicações em uso, dosagens e horários..."
                multiline
                numberOfLines={3}
              />
            </View>
          )}
          
          {/* Dados do Responsável - apenas para alunos */}
          {userRole === 'student' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Responsável</Text>
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={guardianFirstName}
                    onChangeText={setGuardianFirstName}
                    placeholder="Nome"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Sobrenome</Text>
                  <TextInput
                    style={styles.input}
                    value={guardianLastName}
                    onChangeText={setGuardianLastName}
                    placeholder="Sobrenome"
                  />
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Parentesco</Text>
                  <CustomSelect
                    value={guardianRelation}
                    onChange={setGuardianRelation}
                    options={[
                      { value: '', label: 'Selecione' },
                      { value: 'pai', label: 'Pai' },
                      { value: 'mae', label: 'Mãe' },
                      { value: 'avo', label: 'Avô/Avó' },
                      { value: 'tio', label: 'Tio/Tia' },
                      { value: 'irmao', label: 'Irmão/Irmã' },
                      { value: 'tutor', label: 'Tutor Legal' },
                      { value: 'outro', label: 'Outro' }
                    ]}
                    placeholder="Selecione o parentesco"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Idade</Text>
                  <TextInput
                    style={styles.input}
                    value={guardianAge}
                    onChangeText={setGuardianAge}
                    placeholder="Idade"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={guardianPhone}
                    onChangeText={setGuardianPhone}
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={guardianEmail}
                    onChangeText={setGuardianEmail}
                    placeholder="responsavel@exemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#9ca3af', '#9ca3af'] : ['#4ade80', '#16a34a']}
              style={styles.submitGradient}
            >
              {isLoading && <LoadingSpinner size="sm" color="#ffffff" />}
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginTop: 60,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ctaSection: {
    backgroundColor: '#166534',
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  ctaButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  ctaButtonText: {
    color: '#15803d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSection: {
    padding: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#16a34a',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPreview: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  submitButton: {
    marginTop: 16,
  },
  submitGradient: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RegisterPage;