import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { educationalServices } from '../services/educationalServices';
import { useTheme } from '../contexts/ThemeContext';
import { designTokens } from '../theme/tokens';

const AccessibilityButton = ({ text, style }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { theme } = (() => {
    try { return useTheme(); } catch (e) { return { theme: null }; }
  })();

  const primary = theme?.colors?.primary || designTokens.colors.primary[500];
  const iconBg = theme?.colors?.primaryLight || designTokens.colors.primary[50];
  const borderCol = theme?.colors?.primaryLight || designTokens.colors.primary[100];

  const handleSpeak = async () => {
    if (!text) {
      Alert.alert('Aviso', 'Não há texto disponível para leitura.');
      return;
    }

    if (!educationalServices || typeof educationalServices.speakText !== 'function') {
      Alert.alert('Indisponível', 'Serviço de áudio não está disponível.');
      return;
    }

    if (isSpeaking) {
      try {
        if (typeof educationalServices.stopSpeaking === 'function') educationalServices.stopSpeaking();
      } catch (e) {
        // swallow — stop is best-effort
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const result = await educationalServices.speakText(text);
      if (result && result.success === false) {
        Alert.alert('Erro', result.error || 'Falha ao reproduzir áudio');
      }
    } catch (err) {
      Alert.alert('Erro', err?.message || 'Erro ao tentar falar o texto');
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: iconBg, borderColor: borderCol }, style]}
      onPress={handleSpeak}
      accessibilityLabel="Ouvir texto"
      accessibilityHint="Toque para ouvir o texto em voz alta"
      accessibilityState={{ busy: isSpeaking, disabled: !text }}
      disabled={!text || isSpeaking}
    >
      <Ionicons 
        name={isSpeaking ? 'stop' : 'volume-high'}
        size={20}
        color={primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default AccessibilityButton;