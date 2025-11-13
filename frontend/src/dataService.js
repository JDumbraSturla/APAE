import axios from "axios";

const API_BASE_URL = "http://192.168.15.7:3000";

// Cria instância do Axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

class DataService {
  // ============ PROFESSOR ============
  async registerProfessor(data) {
    try {
      const response = await api.post("/professor", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar professor:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Falha no registro do professor");
    }
  }

  async loginProfessor(email, senha) {
    try {
      const response = await api.post("/professor/login", { email, senha });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Falha no login");
    }
  }

  async getProfessores() {
    const response = await api.get("/professor");
    return response.data;
  }

  async getProfessorById(id) {
    const response = await api.get(`/professor/${id}`);
    return response.data;
  }

  async updateProfessor(id, data) {
    const response = await api.put(`/professor/${id}`, data);
    return response.data;
  }

  async deleteProfessor(id) {
    await api.delete(`/professor/${id}`);
  }

  // ============ RESPONSÁVEL ============
  async registerResponsavel(data) {
    const response = await api.post("/responsavel", data);
    return response.data;
  }

  async getResponsaveis() {
    const response = await api.get("/responsavel");
    return response.data;
  }

  async getResponsavelById(id) {
    const response = await api.get(`/responsavel/${id}`);
    return response.data;
  }

  async updateResponsavel(id, data) {
    const response = await api.put(`/responsavel/${id}`, data);
    return response.data;
  }

  async deleteResponsavel(id) {
    await api.delete(`/responsavel/${id}`);
  }

  // ============ ALUNO ============
  async getAlunos() {
    const response = await api.get("/aluno");
    return response.data;
  }

  async getAlunoById(id) {
    const response = await api.get(`/aluno/${id}`);
    return response.data;
  }

  async registerAluno(data) {
    const response = await api.post("/aluno", data);
    return response.data;
  }

  async updateAluno(id, data) {
    const response = await api.put(`/aluno/${id}`, data);
    return response.data;
  }

  async deleteAluno(id) {
    await api.delete(`/aluno/${id}`);
  }

  // ============ ATIVIDADE ============
  async getAtividades() {
    const response = await api.get("/atividade");
    return response.data;
  }

  async getAtividadeById(id) {
    const response = await api.get(`/atividade/${id}`);
    return response.data;
  }

  async registerAtividade(data) {
    const response = await api.post("/atividade", data);
    return response.data;
  }

  async updateAtividade(id, data) {
    const response = await api.put(`/atividade/${id}`, data);
    return response.data;
  }

  async deleteAtividade(id) {
    await api.delete(`/atividade/${id}`);
  }
}

export const dataService = new DataService();

/*import AsyncStorage from '@react-native-async-storage/async-storage';

class DataService {
  constructor() {
    this.storageKey = 'apae_users';
    this.currentUserKey = 'apae_current_user';
  }

  async getUsers() {
    try {
      const users = await AsyncStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async checkEmailExists(email) {
    try {
      const users = await this.getUsers();
      return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  async saveUsers(users) {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async register(userData) {
    try {
      console.log('Registering user:', userData);
      const users = await this.getUsers();
      
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      console.log('New user created:', newUser);
      users.push(newUser);
      await this.saveUsers(users);
      await AsyncStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
      
      console.log('User registered successfully');
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    await AsyncStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return user;
  }

  async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(this.currentUserKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(this.currentUserKey);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async updateUser(updatedUser) {
    const users = await this.getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      await this.saveUsers(users);
      await AsyncStorage.setItem(this.currentUserKey, JSON.stringify(users[userIndex]));
      return users[userIndex];
    }
    
    throw new Error('Usuário não encontrado');
  }
}

export const dataService = new DataService();*/