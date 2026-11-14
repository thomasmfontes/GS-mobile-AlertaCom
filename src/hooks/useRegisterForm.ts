import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { formatCpfMask, formatPhoneMask } from '../utils/masks';
import { validateRegisterForm, RegisterFormErrors } from '../utils/validators';

/**
 * Hook que encapsula estado, máscaras, validação campo a campo e cadastro de cidadão
 */
export function useRegisterForm() {
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: keyof RegisterFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (globalError) setGlobalError('');
  };

  const submit = async () => {
    const validationErrors = validateRegisterForm({
      nome,
      username,
      email,
      cpf,
      bairro,
      telefone,
      password,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGlobalError('Revise os campos destacados abaixo.');
      return;
    }

    try {
      setLoading(true);
      setGlobalError('');
      await register({
        nome: nome.trim(),
        username: username.trim(),
        email: email.trim(),
        cpf: cpf.trim(),
        bairro: bairro.trim(),
        telefone: telefone.trim(),
        password,
      });
      Alert.alert('Cadastro concluído', 'Sua conta foi criada com sucesso.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Falha ao cadastrar. Tente novamente.';
      setGlobalError(msg);
      Alert.alert('Erro no cadastro', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    nome,
    setNome: (v: string) => { setNome(v); clearFieldError('nome'); },
    username,
    setUsername: (v: string) => { setUsername(v); clearFieldError('username'); },
    email,
    setEmail: (v: string) => { setEmail(v); clearFieldError('email'); },
    cpf,
    setCpf: (v: string) => { setCpf(formatCpfMask(v)); clearFieldError('cpf'); },
    bairro,
    setBairro: (v: string) => { setBairro(v); clearFieldError('bairro'); },
    telefone,
    setTelefone: (v: string) => { setTelefone(formatPhoneMask(v)); clearFieldError('telefone'); },
    password,
    setPassword: (v: string) => { setPassword(v); clearFieldError('password'); },
    showPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    errors,
    globalError,
    loading,
    submit,
  };
}
