import { useState } from 'react';
import { Alert } from 'react-native';
import { incidentService } from '../services/incidentService';
import { TipoRisco, NivelSeveridade } from '../types/incident';
import { validateIncidentForm, IncidentFormErrors } from '../utils/validators';
import { useNotifications } from './useNotifications';

interface UseIncidentFormOptions {
  fotoUri: string | null;
  onSuccess: () => void;
}

/**
 * Hook que encapsula estado, validação campo a campo e envio de ocorrência
 */
export function useIncidentForm({ fotoUri, onSuccess }: UseIncidentFormOptions) {
  const { notify } = useNotifications(true);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoRisco, setTipoRisco] = useState<TipoRisco>('Alagamento');
  const [severidade, setSeveridade] = useState<NivelSeveridade>('Media');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [errors, setErrors] = useState<IncidentFormErrors>({});
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: keyof IncidentFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setEndereco('');
    setBairro('');
    setErrors({});
  };

  const submit = async () => {
    const validationErrors = validateIncidentForm({ titulo, descricao, endereco, bairro });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert('Revise os campos', 'Corrija os campos destacados antes de enviar.');
      return;
    }

    try {
      setLoading(true);
      const created = await incidentService.create({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipoRisco,
        severidade,
        latitude: -23.5874,
        longitude: -46.5821,
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        fotoUrl: fotoUri || undefined,
      });

      await notify(
        '🚨 Ocorrência registrada',
        `Protocolo ${created.protocolo} enviado à Defesa Civil (${created.bairro}).`
      );

      Alert.alert(
        'Ocorrência registrada',
        'Seu relato foi enviado à central da Defesa Civil.',
        [
          {
            text: 'Ver chamados',
            onPress: () => {
              resetForm();
              onSuccess();
            },
          },
        ]
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Falha ao registrar ocorrência.';
      Alert.alert('Erro no envio', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    titulo,
    setTitulo: (v: string) => { setTitulo(v); clearFieldError('titulo'); },
    descricao,
    setDescricao: (v: string) => { setDescricao(v); clearFieldError('descricao'); },
    tipoRisco,
    setTipoRisco,
    severidade,
    setSeveridade,
    endereco,
    setEndereco: (v: string) => { setEndereco(v); clearFieldError('endereco'); },
    bairro,
    setBairro: (v: string) => { setBairro(v); clearFieldError('bairro'); },
    errors,
    loading,
    submit,
  };
}
