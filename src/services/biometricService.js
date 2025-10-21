import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BiometricService {
  constructor() {
    this.BIOMETRIC_KEY = 'biometric_enabled';
    this.USER_CREDENTIALS_KEY = 'user_credentials';
  }

  async isAvailable() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        available: hasHardware && isEnrolled,
        hasHardware,
        isEnrolled,
        supportedTypes,
        hasFaceID: supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION),
        hasFingerprint: supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return { available: false };
    }
  }

  async authenticate(reason = 'Acesse sua conta com biometria') {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });

      return {
        success: result.success,
        error: result.error,
        warning: result.warning,
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Erro na autenticação biométrica',
      };
    }
  }

  async enableBiometric(userCredentials) {
    try {
      await AsyncStorage.setItem(this.BIOMETRIC_KEY, 'true');
      await AsyncStorage.setItem(this.USER_CREDENTIALS_KEY, JSON.stringify(userCredentials));
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  }

  async disableBiometric() {
    try {
      await AsyncStorage.removeItem(this.BIOMETRIC_KEY);
      await AsyncStorage.removeItem(this.USER_CREDENTIALS_KEY);
      return true;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  }

  async isBiometricEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(this.BIOMETRIC_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  async getSavedCredentials() {
    try {
      const credentials = await AsyncStorage.getItem(this.USER_CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting saved credentials:', error);
      return null;
    }
  }

  getBiometricType(supportedTypes) {
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Impressão Digital';
    }
    return 'Biometria';
  }
}

export const biometricService = new BiometricService();