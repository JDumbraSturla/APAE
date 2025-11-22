import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/services/api"; // Axios configurado com baseURL do backend

export const dataService = {

  // LOGIN DO PROFESSOR
  async loginProfessor(email, senha) {
    try {
      const response = await api.post("/professor/login", { email, senha });
      const professor = response.data?.professor;

      if (!professor || !professor.id) {
        console.error("Resposta de login sem ID:", response.data);
        throw new Error("Resposta inesperada da API no login");
      }

      await AsyncStorage.setItem("professor_id", String(professor.id));
      await AsyncStorage.setItem("professor_data", JSON.stringify(professor));

      console.log("Professor salvo:", professor.id);
      return professor;
    } catch (err) {
      console.error("Erro no dataService.loginProfessor:", err);
      throw err;
    }
  },

  // SALVAR DADOS DO USUÁRIO
  async saveUser(user) {
    if (!user || !user.id) {
      console.error("Tentativa de salvar usuário sem ID:", user);
      return;
    }
    await AsyncStorage.setItem("professor_id", String(user.id));
    await AsyncStorage.setItem("professor_data", JSON.stringify(user));
    console.log("Usuário salvo no AsyncStorage:", user.id);
  },

  // PEGAR USUÁRIO SALVO
  async getSavedUser() {
    try {
      const json = await AsyncStorage.getItem("professor_data");
      if (!json) return null;
      return JSON.parse(json);
    } catch (err) {
      console.error("Erro ao carregar usuário salvo:", err);
      return null;
    }
  },

  // PEGAR USUÁRIO ATUAL
  async getCurrentUser() {
    return await this.getSavedUser();
  },

  // DESLOGAR
  async logout() {
    await AsyncStorage.removeItem("professor_id");
    await AsyncStorage.removeItem("professor_data");
    console.log("Logout completo, dados removidos");
  },

  // BUSCAR ATIVIDADES
  async getAtividades() {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      console.log('Fetching atividades for professor:', professor.id);
      const params = professor.admin ? { admin: true } : { professorId: professor.id };
      console.log('Request params:', params);
      const response = await api.get("/atividade", { params });
      console.log('Atividades response:', response.data);

      // Garante que cada atividade tenha professor e alunos definidos
      const atividades = response.data.map(a => ({
        ...a,
        professor: a.professor || null,
        aluno: a.aluno || [], // Note: backend uses 'aluno', not 'alunos'
      }));

      return atividades;
    } catch (err) {
      console.error("Erro no dataService.getAtividades:", err);
      console.error("Error details:", err.response?.data);
      throw err;
    }
  },

  // CRIAR ATIVIDADE
  async registerAtividade({ titulo, descricao, data, hora, professorId }) {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.post("/atividade", {
        titulo,
        descricao,
        data,
        hora,
        professorId: professorId || professor.id,
      });

      return response.data;
    } catch (err) {
      console.error("Erro no dataService.registerAtividade:", err);
      throw err;
    }
  },

  // DELETAR ATIVIDADE
  async deleteAtividade(id) {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.delete(`/atividade/${id}`);
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.deleteAtividade:", err);
      throw err;
    }
  },

  // ATUALIZAR ATIVIDADE
  async updateAtividade(id, { titulo, descricao, data, hora, professorId }) {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.patch(`/atividade/${id}`, {
        titulo,
        descricao,
        data,
        hora,
        professorId,
      });
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.updateAtividade:", err);
      throw err;
    }
  },

  // ASSOCIAR ALUNO À ATIVIDADE
  async assignAlunoToAtividade(atividadeId, alunoId) {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.post(`/atividade/${atividadeId}/assign`, {
        alunoId: alunoId,
      });
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.assignAlunoToAtividade:", err);
      throw err;
    }
  },

  // REMOVER ALUNO DA ATIVIDADE
  async removeAlunoFromAtividade(atividadeId, alunoId) {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.delete(`/atividade/${atividadeId}/assign/${alunoId}`);
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.removeAlunoFromAtividade:", err);
      throw err;
    }
  },

  // BUSCAR ALUNOS
  async getAlunos() {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.get("/aluno");
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.getAlunos:", err);
      throw err;
    }
  },

  // BUSCAR PROFESSORES
  async getProfessores() {
    try {
      const professor = await this.getSavedUser();
      if (!professor) throw new Error("Usuário não autenticado");

      const response = await api.get("/professor");
      return response.data;
    } catch (err) {
      console.error("Erro no dataService.getProfessores:", err);
      throw err;
    }
  },
};
