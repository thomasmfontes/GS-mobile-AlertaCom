import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const CHANNEL_ID = 'alertacom-alerts';

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: 'AlertaCom - Alertas e Ocorrências',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#EA580C',
            sound: 'default',
          });
        } catch {
          // No Expo Go Android a criação manual de canal pode lançar erro e não deve impedir a permissão
        }
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch {
      return false;
    }
  },

  async sendLocalNotification(title: string, body: string): Promise<string | null> {
    try {
      const granted = await this.requestPermissions();
      if (!granted) return null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
      return id;
    } catch (error) {
      console.warn('Não foi possível exibir notificação local:', error);
      return null;
    }
  },
};
