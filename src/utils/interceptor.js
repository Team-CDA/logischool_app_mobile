import axios from 'axios';
import {HOST_API_KEY} from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://9c78-31-33-81-5.ngrok-free.app',
  headers: {'Content-Type': 'application/json'},
});

axiosInstance.interceptors.response.use(
  response => {
    if (response.data && response.data.error) {
      // ajouter un message d'erreur personnalisé à la réponse
      response.data.errorMessage = "Une erreur s'est produite.";
    }
    return response;
  },
  async error => {
    console.log('error', error);
    Promise.reject(
      (error.response && error.response.data) || 'Le serveur est injoignable',
    );
  },
);

axiosInstance.interceptors.request.use(
  config => {
    const token = AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
