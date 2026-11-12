import api from './api';
import { AlertaClimatico } from '../types/incident';

export const alertService = {
  async getAlertasAtivos(pageIndex = 1, pageSize = 20): Promise<AlertaClimatico[]> {
    try {
      const response = await api.get<any>('/api/alertas', {
        params: { pageIndex, pageSize },
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data?.items || [];
    } catch (err: any) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },
};
