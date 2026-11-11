export interface User {
  id: number;
  username: string;
  nome: string;
  email: string;
  cpf: string;
  bairro: string;
  role: string;
  dataCriacao?: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nome: string;
  email: string;
  role: string;
  expiresAt: string;
}
