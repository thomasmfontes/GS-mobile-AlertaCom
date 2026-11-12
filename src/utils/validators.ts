import { onlyDigits } from './masks';

/**
 * Validadores puros para os formulários do AlertaCom
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Valida CPF brasileiro (11 dígitos + dígitos verificadores)
 */
export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10], 10);
}

export function isValidPhone(phone: string): boolean {
  const digits = onlyDigits(phone);
  return digits.length === 0 || digits.length === 10 || digits.length === 11;
}

export interface IncidentValidationInput {
  titulo: string;
  descricao: string;
  endereco: string;
  bairro: string;
}

export type IncidentFormErrors = Partial<Record<keyof IncidentValidationInput, string>>;

export function validateIncidentForm(input: IncidentValidationInput): IncidentFormErrors {
  const errors: IncidentFormErrors = {};

  if (!input.titulo.trim()) {
    errors.titulo = 'Informe um título para a ocorrência.';
  } else if (input.titulo.trim().length < 5) {
    errors.titulo = 'O título deve ter pelo menos 5 caracteres.';
  }

  if (!input.descricao.trim()) {
    errors.descricao = 'Descreva a situação presenciada.';
  } else if (input.descricao.trim().length < 10) {
    errors.descricao = 'A descrição deve ter pelo menos 10 caracteres.';
  }

  if (!input.endereco.trim()) {
    errors.endereco = 'Informe o endereço ou ponto de referência.';
  } else if (input.endereco.trim().length < 5) {
    errors.endereco = 'Informe um endereço mais completo.';
  }

  if (!input.bairro.trim()) {
    errors.bairro = 'Informe o bairro da ocorrência.';
  } else if (input.bairro.trim().length < 3) {
    errors.bairro = 'Nome do bairro inválido.';
  }

  return errors;
}

export interface RegisterValidationInput {
  nome: string;
  username: string;
  email: string;
  cpf: string;
  bairro: string;
  telefone: string;
  password: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterValidationInput, string>>;

export function validateRegisterForm(input: RegisterValidationInput): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!input.nome.trim() || input.nome.trim().length < 3) {
    errors.nome = 'Informe seu nome completo (mín. 3 caracteres).';
  }

  if (!input.username.trim() || input.username.trim().length < 3) {
    errors.username = 'Usuário deve ter pelo menos 3 caracteres.';
  } else if (/\s/.test(input.username)) {
    errors.username = 'Usuário não pode conter espaços.';
  }

  if (!input.email.trim()) {
    errors.email = 'Informe seu e-mail.';
  } else if (!isValidEmail(input.email)) {
    errors.email = 'Formato de e-mail inválido.';
  }

  if (!input.cpf.trim()) {
    errors.cpf = 'Informe seu CPF.';
  } else if (!isValidCpf(input.cpf)) {
    errors.cpf = 'CPF inválido. Verifique os 11 dígitos.';
  }

  if (!input.bairro.trim() || input.bairro.trim().length < 3) {
    errors.bairro = 'Informe seu bairro (mín. 3 caracteres).';
  }

  if (!isValidPhone(input.telefone)) {
    errors.telefone = 'Telefone deve ter 10 ou 11 dígitos com DDD.';
  }

  if (!input.password) {
    errors.password = 'Informe uma senha.';
  } else if (input.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  }

  return errors;
}
