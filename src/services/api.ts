import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PRODUCTION_API_URL = 'https://gs-dotnet-alertacomapi.onrender.com';

// Em desenvolvimento (Expo Go), descobre automaticamente o IP do PC; em build/APK usa o Render (HTTPS)
const debuggerHost = Constants.expoConfig?.hostUri;
const dynamicHost = debuggerHost ? debuggerHost.split(':')[0] : null;

const LOCAL_URL = Platform.select({
  web: 'http://localhost:5208',
  android: dynamicHost ? `http://${dynamicHost}:5208` : PRODUCTION_API_URL,
  ios: dynamicHost ? `http://${dynamicHost}:5208` : PRODUCTION_API_URL,
  default: PRODUCTION_API_URL,
});

const DEFAULT_URL = __DEV__ ? LOCAL_URL : PRODUCTION_API_URL;

export const api = axios.create({
  baseURL: DEFAULT_URL,
  timeout: 60000, // 60s para suportar cold start do plano gratuito do Render
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar JWT Bearer em todas as requisições autenticadas
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@alertacom:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Adiciona chave de idempotência automática em POSTs se não definida
      if (config.method?.toUpperCase() === 'POST' && !config.headers['Idempotency-Key']) {
        const generatedKey = `MOB-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        config.headers['Idempotency-Key'] = generatedKey;
      }
    } catch (e) {
      console.warn('Erro ao obter token do AsyncStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de respostas e 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.multiRemove(['@alertacom:token', '@alertacom:user']);
    }
    return Promise.reject(error);
  }
);

export const resolveImageUrl = (fotoUrl?: string | null): string | undefined => {
  if (!fotoUrl) return undefined;
  if (fotoUrl.startsWith('http://') || fotoUrl.startsWith('https://') || fotoUrl.startsWith('file://') || fotoUrl.startsWith('content://')) {
    return fotoUrl;
  }
  const base = api.defaults.baseURL || '';
  return `${base}${fotoUrl.startsWith('/') ? '' : '/'}${fotoUrl}`;
};

export default api;
