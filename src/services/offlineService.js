import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineService {
  constructor() {
    this.OFFLINE_QUEUE_KEY = 'offline_queue';
    this.CACHED_DATA_KEY = 'cached_data';
    this.isOnline = true;
    this.listeners = [];
    this.offlineQueue = [];
    
    this.init();
  }

  init() {
    // Monitor network status
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected;
      
      // Notify listeners
      this.listeners.forEach(listener => listener(this.isOnline));
      
      // Process offline queue when back online
      if (wasOffline && this.isOnline) {
        this.processOfflineQueue();
      }
    });
    
    // Load offline queue on startup
    this.loadOfflineQueue();
  }

  addNetworkListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  async getNetworkStatus() {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    };
  }

  // Cache data for offline use
  async cacheData(key, data) {
    try {
      const cachedData = await this.getCachedData();
      cachedData[key] = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.CACHED_DATA_KEY, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  async getCachedData(key = null) {
    try {
      const cached = await AsyncStorage.getItem(this.CACHED_DATA_KEY);
      const cachedData = cached ? JSON.parse(cached) : {};
      
      if (key) {
        return cachedData[key] || null;
      }
      
      return cachedData;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return key ? null : {};
    }
  }

  // Queue operations for when back online
  async queueOperation(operation) {
    try {
      this.offlineQueue.push({
        ...operation,
        timestamp: Date.now(),
        id: Date.now().toString(),
      });
      
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error queuing operation:', error);
    }
  }

  async loadOfflineQueue() {
    try {
      const queue = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY);
      this.offlineQueue = queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading offline queue:', error);
      this.offlineQueue = [];
    }
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    console.log(`Processing ${this.offlineQueue.length} offline operations...`);
    
    const processedOperations = [];
    
    for (const operation of this.offlineQueue) {
      try {
        // Here you would implement the actual API calls
        // For now, we'll just simulate processing
        console.log('Processing operation:', operation.type);
        processedOperations.push(operation.id);
      } catch (error) {
        console.error('Error processing operation:', operation, error);
      }
    }
    
    // Remove processed operations
    this.offlineQueue = this.offlineQueue.filter(
      op => !processedOperations.includes(op.id)
    );
    
    await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(this.offlineQueue));
  }

  // Simulate offline-capable data operations
  async getData(key, fallbackToCache = true) {
    if (this.isOnline) {
      try {
        // Simulate API call
        const data = await this.fetchFromAPI(key);
        // Cache the fresh data
        await this.cacheData(key, data);
        return data;
      } catch (error) {
        console.error('API call failed:', error);
        if (fallbackToCache) {
          const cached = await this.getCachedData(key);
          return cached ? cached.data : null;
        }
        throw error;
      }
    } else {
      // Return cached data when offline
      const cached = await this.getCachedData(key);
      return cached ? cached.data : null;
    }
  }

  async saveData(key, data) {
    // Always cache locally first
    await this.cacheData(key, data);
    
    if (this.isOnline) {
      try {
        // Try to sync immediately
        await this.syncToAPI(key, data);
      } catch (error) {
        console.error('Sync failed, queuing for later:', error);
        await this.queueOperation({
          type: 'SAVE_DATA',
          key,
          data,
        });
      }
    } else {
      // Queue for when back online
      await this.queueOperation({
        type: 'SAVE_DATA',
        key,
        data,
      });
    }
  }

  // Simulate API methods (replace with real implementations)
  async fetchFromAPI(key) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { key, data: 'API data', timestamp: Date.now() };
  }

  async syncToAPI(key, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Synced to API:', key, data);
  }

  getQueueSize() {
    return this.offlineQueue.length;
  }

  clearCache() {
    return AsyncStorage.removeItem(this.CACHED_DATA_KEY);
  }

  clearQueue() {
    this.offlineQueue = [];
    return AsyncStorage.removeItem(this.OFFLINE_QUEUE_KEY);
  }
}

export const offlineService = new OfflineService();