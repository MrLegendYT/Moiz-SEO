
import { storageService } from './storageService';

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  send: (title: string, options?: NotificationOptions, type?: string) => {
    const settings = storageService.getSettings();
    
    // Check if the specific notification type is enabled in user settings
    if (type) {
      const typeKey = type === 'volatility' ? 'email_alerts' : 
                      type === 'summary' ? 'weekly_report' : 
                      type === 'feature' ? 'product_updates' : '';
      
      if (typeKey && !settings[typeKey]) return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
        ...options,
      });
    }
  }
};
