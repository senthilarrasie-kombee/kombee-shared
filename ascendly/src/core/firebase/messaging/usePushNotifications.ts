import { useEffect } from 'react';
import {
  requestPermission,
  getFcmToken,
  listenToForegroundMessages,
  setupNotificationListeners,
  createNotificationChannel,
} from './messaging';
import { setInAppMessagesEnabled, setupInAppMessagingListeners } from './inAppMessaging';

export const usePushNotifications = () => {
  useEffect(() => {
    const initPushNotifications = async () => {
      await setInAppMessagesEnabled(true);
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await createNotificationChannel();
        const token = await getFcmToken();
        if (token) {
          console.log('[FCM] Token:', token);
          // Persist token to MMKV
          const { storage } = require('../../storage');
          const { STORAGE_KEYS } = require('../../storage/keys');
          storage.set(STORAGE_KEYS.FCM.TOKEN, token);
        }
      }
    };

    initPushNotifications();

    const unsubscribeForeground = listenToForegroundMessages();
    const unsubscribeListeners = setupNotificationListeners();
    const unsubscribeInApp = setupInAppMessagingListeners();

    return () => {
      unsubscribeForeground();
      unsubscribeListeners();
      unsubscribeInApp();
    };
  }, []);
};
