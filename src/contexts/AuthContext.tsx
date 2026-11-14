import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@alertacom:token');
        const storedUser = await AsyncStorage.getItem('@alertacom:user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (username: string, password: string) => {
    const data: LoginResponse = await authService.login(username, password);
    const loggedUser: User = {
      id: 1, // ID inferido pelo token
      username: data.username,
      nome: data.nome,
      email: data.email,
      cpf: '',
      bairro: '',
      role: data.role,
    };

    setToken(data.token);
    setUser(loggedUser);

    await AsyncStorage.setItem('@alertacom:token', data.token);
    await AsyncStorage.setItem('@alertacom:user', JSON.stringify(loggedUser));
  };

  const register = async (registerData: any) => {
    await authService.register(registerData);
    // Realiza login automático após cadastro
    await login(registerData.username, registerData.password);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['@alertacom:token', '@alertacom:user']);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
