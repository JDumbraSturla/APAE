import AsyncStorage from '@react-native-async-storage/async-storage';

class DataService {
  constructor() {
    this.storageKey = 'apae_users';
    this.activitiesKey = 'apae_activities';
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

  // --- Métodos para Atividades ---

  async getActivities() {
    try {
      const activities = await AsyncStorage.getItem(this.activitiesKey);
      return activities ? JSON.parse(activities) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  async getActivitiesForUser(userId, userRole) {
    const allActivities = await this.getActivities();
    const allUsers = await this.getUsers();

    if (userRole === 'teacher') {
      // Para professores, retorna atividades que eles criaram
      return allActivities
        .filter(act => act.teacherId === userId)
        .map(act => {
          const student = allUsers.find(u => u.id === act.studentId);
          return { ...act, studentName: student ? student.name : 'Aluno não encontrado' };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mais recentes primeiro
    } else {
      // Para alunos, retorna atividades atribuídas a eles
      return allActivities
        .filter(act => act.studentId === userId)
        .map(act => {
          const teacher = allUsers.find(u => u.id === act.teacherId);
          return { ...act, teacherName: teacher ? teacher.name : 'Professor não encontrado' };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  async getActivityById(activityId) {
    const allActivities = await this.getActivities();
    const activity = allActivities.find(act => act.id === activityId);
    if (!activity) {
      return null;
    }
    // Adiciona os nomes para exibição
    const allUsers = await this.getUsers();
    const student = allUsers.find(u => u.id === activity.studentId);
    const teacher = allUsers.find(u => u.id === activity.teacherId);
    return {
      ...activity,
      studentName: student ? student.name : 'Aluno não encontrado',
      teacherName: teacher ? teacher.name : 'Professor não encontrado',
    };
  }

  async createActivity(activityData) {
    const activities = await this.getActivities();
    const newActivity = {
      id: Date.now().toString(),
      ...activityData,
      createdAt: new Date().toISOString(),
    };
    activities.push(newActivity);
    await AsyncStorage.setItem(this.activitiesKey, JSON.stringify(activities));
    return newActivity;
  }

  async deleteActivity(activityId) {
    let activities = await this.getActivities();
    activities = activities.filter(act => act.id !== activityId);
    await AsyncStorage.setItem(this.activitiesKey, JSON.stringify(activities));
  }

  async getStudentsForTeacher() {
    const users = await this.getUsers();
    return users.filter(user => user.role === 'student');
  }
}

export const dataService = new DataService();