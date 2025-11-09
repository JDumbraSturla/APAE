import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const dataService = new DataService();