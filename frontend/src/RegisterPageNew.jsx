import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dataService } from './dataService';
import CustomSelect from './components/CustomSelect';
import LoadingSpinner from './components/LoadingSpinner';
import ProgressBar from './components/ProgressBar';
import AccessibilityButton from './components/AccessibilityButton';
import { educationalServices } from './services/educationalServices';

const RegisterPageNew = ({ onRegister, onGoToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
    address: '',
    city: '',
    zipCode: '',
    state: '',
    neighborhood: '',
    cpf: '',
    emergencyContact: '',
    medicalInfo: '',
    schoolInep: '',
    schoolName: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);

  const stepTitles = ['Dados Pessoais', 'Endereço', 'Perfil de Saúde', 'Confirmação'];
  const totalSteps = 4;

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      animateTransition();
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    animateTransition();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    console.log('Validating step:', currentStep, 'Form data:', formData);
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          Alert.alert('Atenção', 'Por favor, informe seu nome completo.');
          return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
          Alert.alert('Atenção', 'Por favor, informe um email válido.');
          return false;
        }
        if (emailError) {
          Alert.alert('Email já cadastrado', 'Este email já está em uso. Tente fazer login ou use outro email.');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Atenção', 'As senhas não coincidem.');
          return false;
        }
        return true;
      case 2:
        if (!formData.address.trim()) {
          Alert.alert('Atenção', 'Por favor, informe seu endereço.');
          return false;
        }
        if (!formData.city.trim()) {
          Alert.alert('Atenção', 'Por favor, informe sua cidade.');
          return false;
        }
        return true;
      case 3:
        if (!formData.role) {
          Alert.alert('Atenção', 'Por favor, selecione seu perfil.');
          return false;
        }
        return true;
      case 4:
        if (!formData.acceptTerms) {
          Alert.alert('Atenção', 'Por favor, aceite os termos de uso.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const fetchAddressByCep = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro ? `${data.logradouro}, ` : '',
          city: data.localidade || '',
          state: data.uf || '',
          neighborhood: data.bairro || ''
        }));
        // Focar no campo de endereço para o usuário adicionar o número
        setTimeout(() => {
          Alert.alert(
            'Endereço encontrado! 📍',
            `${data.logradouro}\n${data.bairro} - ${data.localidade}/${data.uf}\n\nAgora adicione o número da sua residência.`
          );
        }, 500);
      } else {
        Alert.alert('CEP não encontrado', 'Verifique o CEP digitado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o endereço.');
    } finally {
      setLoadingCep(false);
    }
  };

  const validateSchool = async (inep) => {
    const cleanInep = inep.replace(/\D/g, '');
    if (cleanInep.length !== 8) return;

    setLoadingSchool(true);
    try {
      const result = await educationalServices.validateSchoolData(cleanInep);
      if (result.valid) {
        setFormData(prev => ({
          ...prev,
          schoolName: result.schoolName
        }));
        Alert.alert('Escola encontrada!', `${result.schoolName} - ${result.city}/${result.state}`);
      } else {
        Alert.alert('Escola não encontrada', 'Verifique o código INEP digitado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível validar a escola.');
    } finally {
      setLoadingSchool(false);
    }
  };

  const checkEmailExists = async (email) => {
    if (!email.includes('@')) return;
    
    setCheckingEmail(true);
    setEmailError('');
    
    try {
      const exists = await dataService.checkEmailExists(email);
      
      if (exists) {
        setEmailError('Este email já está cadastrado. Tente fazer login.');
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async () => {
    console.log('Submit clicked, current step:', currentStep);
    console.log('Form data:', formData);
    
    if (!validateCurrentStep()) {
      console.log('Validation failed');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling dataService.register...');
      const user = await dataService.register(formData);
      console.log('Registration successful:', user);
      Alert.alert(
        '🎉 Bem-vindo à Família APAE!', 
        'Seu cadastro foi realizado com sucesso. Estamos felizes em tê-lo conosco!',
        [{ text: 'Continuar', onPress: () => onRegister(user) }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Ops!', 'Algo deu errado. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Estudante', value: 'student' },
    { label: 'Professor/Educador', value: 'teacher' },
    // Removido 'guardian' e 'admin'
  ];

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>Vamos começar! 😊</Text>
        <AccessibilityButton text="Vamos começar! Conte-nos um pouco sobre você" />
      </View>
      <Text style={styles.stepSubtitle}>Conte-nos um pouco sobre você</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
        placeholderTextColor="#9ca3af"
      />
      
      <View style={styles.emailContainer}>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => {
            setFormData({...formData, email: text});
            setEmailError('');
            // Verificar email após 1 segundo de pausa na digitação
            clearTimeout(window.emailTimeout);
            window.emailTimeout = setTimeout(() => {
              if (text.includes('@') && text.includes('.')) {
                checkEmailExists(text);
              }
            }, 1000);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9ca3af"
        />
        {checkingEmail && (
          <View style={styles.emailLoader}>
            <LoadingSpinner size="small" color="#15803d" />
          </View>
        )}
      </View>
      
      {emailError && (
        <View style={styles.emailErrorContainer}>
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.emailErrorText}>{emailError}</Text>
        </View>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={formData.phone}
        onChangeText={(text) => setFormData({...formData, phone: text})}
        keyboardType="phone-pad"
        placeholderTextColor="#9ca3af"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>Onde você mora? 🏠</Text>
        <AccessibilityButton text="Onde você mora? Precisamos saber sua localização" />
      </View>
      <Text style={styles.stepSubtitle}>Precisamos saber sua localização</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Rua e número (ex: Rua das Flores, 123)"
        value={formData.address}
        onChangeText={(text) => setFormData({...formData, address: text})}
        placeholderTextColor="#9ca3af"
      />
      
      <View style={styles.row}>
        <View style={styles.cityInput}>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View style={styles.stateInput}>
          <TextInput
            style={styles.input}
            placeholder="UF"
            value={formData.state}
            onChangeText={(text) => setFormData({...formData, state: text.toUpperCase()})}
            placeholderTextColor="#9ca3af"
            maxLength={2}
          />
        </View>
      </View>
      
      <View style={styles.cepContainer}>
        <TextInput
          style={[styles.input, styles.cepInput]}
          placeholder="CEP (00000-000)"
          value={formData.zipCode}
          onChangeText={(text) => {
            const formatted = text.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
            setFormData({...formData, zipCode: formatted});
            if (formatted.length === 9) {
              fetchAddressByCep(formatted);
            }
          }}
          keyboardType="numeric"
          placeholderTextColor="#9ca3af"
          maxLength={9}
        />
        {loadingCep && (
          <View style={styles.cepLoader}>
            <LoadingSpinner size="small" color="#15803d" />
          </View>
        )}
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={formData.neighborhood}
        onChangeText={(text) => setFormData({...formData, neighborhood: text})}
        placeholderTextColor="#9ca3af"
      />
      
      <TextInput
        style={styles.input}
        placeholder="CPF (000.000.000-00)"
        value={formData.cpf}
        onChangeText={(text) => {
          const formatted = text.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          setFormData({...formData, cpf: formatted});
        }}
        keyboardType="numeric"
        placeholderTextColor="#9ca3af"
        maxLength={14}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>Qual é o seu perfil? 👥</Text>
        <AccessibilityButton text="Qual é o seu perfil? Isso nos ajuda a personalizar sua experiência" />
      </View>
      <Text style={styles.stepSubtitle}>Isso nos ajuda a personalizar sua experiência</Text>
      
      <CustomSelect
        options={roleOptions}
        selectedValue={formData.role}
        onValueChange={(value) => setFormData({...formData, role: value})}
        placeholder="Selecione seu perfil"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contato de emergência (opcional)"
        value={formData.emergencyContact}
        onChangeText={(text) => setFormData({...formData, emergencyContact: text})}
        keyboardType="phone-pad"
        placeholderTextColor="#9ca3af"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Informações médicas ou observações importantes (opcional)"
        value={formData.medicalInfo}
        onChangeText={(text) => setFormData({...formData, medicalInfo: text})}
        multiline
        numberOfLines={4}
        placeholderTextColor="#9ca3af"
      />
      
      {formData.role === 'student' && (
        <>
          <View style={styles.schoolContainer}>
            <TextInput
              style={[styles.input, styles.schoolInput]}
              placeholder="Código INEP da escola (opcional)"
              value={formData.schoolInep}
              onChangeText={(text) => {
                setFormData({...formData, schoolInep: text});
                if (text.length === 8) {
                  validateSchool(text);
                }
              }}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
              maxLength={8}
            />
            {loadingSchool && (
              <View style={styles.schoolLoader}>
                <LoadingSpinner size="small" color="#15803d" />
              </View>
            )}
          </View>
          
          {formData.schoolName && (
            <Text style={styles.schoolName}>🏫 {formData.schoolName}</Text>
          )}
        </>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>Quase lá! 🎉</Text>
        <AccessibilityButton text="Quase lá! Revise suas informações e finalize" />
      </View>
      <Text style={styles.stepSubtitle}>Revise suas informações e finalize</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do seu cadastro:</Text>
        <Text style={styles.summaryItem}>📧 {formData.email}</Text>
        <Text style={styles.summaryItem}>👤 {roleOptions.find(r => r.value === formData.role)?.label}</Text>
        <Text style={styles.summaryItem}>📍 {formData.city}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setFormData({...formData, acceptTerms: !formData.acceptTerms})}
      >
        <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
          {formData.acceptTerms && <Ionicons name="checkmark" size={16} color="#ffffff" />}
        </View>
        <Text style={styles.checkboxText}>
          Aceito os termos de uso e política de privacidade da APAE
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoToLogin}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text style={styles.title}>Cadastro APAE</Text>
      </View>

      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        stepTitles={stepTitles} 
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
            <Text style={styles.prevButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.buttonSpacer} />
        
        {currentStep < totalSteps ? (
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>Continuar</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Finalizar Cadastro</Text>
                <Ionicons name="checkmark" size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.loginLink} onPress={onGoToLogin}>
        <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#15803d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
    paddingVertical: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cepContainer: {
    position: 'relative',
  },
  cepInput: {
    paddingRight: 50,
  },
  cepLoader: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  cityInput: {
    flex: 0.7,
    marginRight: 8,
  },
  stateInput: {
    flex: 0.25,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolContainer: {
    position: 'relative',
  },
  schoolInput: {
    paddingRight: 50,
  },
  schoolLoader: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  schoolName: {
    fontSize: 14,
    color: '#15803d',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  emailContainer: {
    position: 'relative',
  },
  emailLoader: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  emailErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  emailErrorText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 4,
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  prevButtonText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  buttonSpacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginRight: 8,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default RegisterPageNew;