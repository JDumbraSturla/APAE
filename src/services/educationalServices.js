import * as Speech from 'expo-speech';

class EducationalServices {
  // API do MEC - Validar dados escolares
  async validateSchoolData(inep) {
    try {
      const response = await fetch(`https://educacao.dadosabertos.gov.br/api/escolas/${inep}`);
      const data = await response.json();
      
      if (data && data.nome) {
        return {
          valid: true,
          schoolName: data.nome,
          city: data.municipio,
          state: data.uf,
          type: data.categoria_administrativa
        };
      }
      return { valid: false };
    } catch (error) {
      console.error('Erro ao validar escola:', error);
      return { valid: false, error: 'Não foi possível validar os dados da escola' };
    }
  }

  // Libras API - Tradução para linguagem de sinais
  async translateToLibras(text) {
    try {
      // API VLibras do Governo Federal
      const response = await fetch('https://vlibras.gov.br/app/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'pt-BR'
        })
      });
      
      const data = await response.json();
      return {
        success: true,
        videoUrl: data.videoUrl,
        translation: data.translation
      };
    } catch (error) {
      console.error('Erro na tradução para Libras:', error);
      return { success: false, error: 'Não foi possível traduzir para Libras' };
    }
  }

  // Text-to-Speech - Acessibilidade para deficientes visuais
  async speakText(text, options = {}) {
    try {
      const speechOptions = {
        language: 'pt-BR',
        pitch: options.pitch || 1.0,
        rate: options.rate || 0.8,
        voice: options.voice || null,
        ...options
      };

      await Speech.speak(text, speechOptions);
      return { success: true };
    } catch (error) {
      console.error('Erro no Text-to-Speech:', error);
      return { success: false, error: 'Não foi possível reproduzir o áudio' };
    }
  }

  // Parar reprodução de áudio
  stopSpeaking() {
    Speech.stop();
  }

  // Verificar se está falando
  isSpeaking() {
    return Speech.isSpeakingAsync();
  }

  // Obter vozes disponíveis
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter(voice => voice.language.startsWith('pt'));
    } catch (error) {
      console.error('Erro ao obter vozes:', error);
      return [];
    }
  }
}

export const educationalServices = new EducationalServices();