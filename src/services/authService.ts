import api from './api';
import { LoginResponse, User } from '../types/auth';

export const authService = {
  async login(username: string, password: string):Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { username, password });
    return response.data;
  },

  async register(data: {
    username: string;
    password: string;
    nome: string;
    email: string;
    cpf: string;
    bairro: string;
    telefone?: string;
  }): Promise<User> {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/api/auth/profile');
    return response.data;
  },
};
