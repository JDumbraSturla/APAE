import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
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
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
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
          Alert.alert('Email já cadastrado', 'Este email já está em uso.');
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
        setFormData(prev => ({ ...prev, schoolName: result.schoolName }));
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
      const response = await axios.get(`https://seu-backend.com/users/check-email?email=${encodeURIComponent(email)}`);
      if (response.data.exists) {
        setEmailError('Este email já está cadastrado. Tente fazer login.');
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('https://seu-backend.com/users/register', formData);
      const user = response.data;
      Alert.alert(
        '🎉 Bem-vindo à Família APAE!', 
        'Seu cadastro foi realizado com sucesso!',
        [{ text: 'Continuar', onPress: () => onRegister(user) }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Ops!', 'Algo deu errado. ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Estudante', value: 'student' },
    { label: 'Professor/Educador', value: 'teacher' },
  ];

  // ... Resto do componente permanece igual (renderStep1-4, renderCurrentStep, JSX)

};

export default RegisterPageNew;
