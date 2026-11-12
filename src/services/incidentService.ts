import api from './api';
import { Ocorrencia, OcorrenciaFormData, StatusOcorrencia } from '../types/incident';

export interface PageResultResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const incidentService = {
  async getPaged(pageIndex = 1, pageSize = 20, status?: string, tipoRisco?: string, bairro?: string): Promise<PageResultResponse<Ocorrencia>> {
    const params: Record<string, any> = { pageIndex, pageSize };
    if (status) params.status = status;
    if (tipoRisco) params.tipoRisco = tipoRisco;
    if (bairro) params.bairro = bairro;

    try {
      const response = await api.get<PageResultResponse<Ocorrencia>>('/api/ocorrencias', { params });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { items: [], pageIndex, pageSize, totalCount: 0, totalPages: 0 };
      }
      throw err;
    }
  },

  async getMyIncidents(): Promise<Ocorrencia[]> {
    try {
      const response = await api.get<Ocorrencia[]>('/api/ocorrencias/minhas');
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  async getById(id: number): Promise<Ocorrencia> {
    const response = await api.get<Ocorrencia>(`/api/ocorrencias/${id}`);
    return response.data;
  },

  async create(data: OcorrenciaFormData, idempotencyKey?: string): Promise<Ocorrencia> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await api.post<Ocorrencia>('/api/ocorrencias', data, { headers });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/ocorrencias/${id}`);
  },

  async updateStatus(id: number, novoStatus: StatusOcorrencia, parecerTecnico?: string): Promise<Ocorrencia> {
    const response = await api.patch<Ocorrencia>(`/api/ocorrencias/${id}/status`, { novoStatus, parecerTecnico });
    return response.data;
  },
};
