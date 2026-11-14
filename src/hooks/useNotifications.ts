import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';

/**
 * Hook para gerenciar permissões e disparo de notificações locais
 */
export function useNotifications(requestOnMount = false) {
  useEffect(() => {
    if (requestOnMount) {
      notificationService.requestPermissions();
    }
  }, [requestOnMount]);

  const notify = async (title: string, body: string) => {
    await notificationService.sendLocalNotification(title, body);
  };

  return { notify };
}
