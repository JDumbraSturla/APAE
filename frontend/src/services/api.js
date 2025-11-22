import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.7:3000';
console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

export default api;