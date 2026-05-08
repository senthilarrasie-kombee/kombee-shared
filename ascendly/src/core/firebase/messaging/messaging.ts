import messaging, {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission as requestFcmPermission,
  isDeviceRegisteredForRemoteMessages,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import {FCM_CONSTANTS} from '../../../shared/constants/firebase';
import {ROUTES} from '@app/routes';
import {navigate} from '../../../app/navigation/navigationService';

const messagingInstance = getMessaging();

export const requestPermission = async (): Promise<boolean> => {
  try {
    let granted = false;

    if (Platform.OS === 'ios') {
      const authStatus = await requestFcmPermission(messagingInstance);
      granted = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

      await notifee.requestPermission();
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      granted = result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      granted = true;
    }

    return granted;
  } catch (error) {
    console.error('[FCM] requestPermission error:', error);
    return false;
  }
};

export const getFcmToken = async (): Promise<string | undefined> => {
  try {
    if (!isDeviceRegisteredForRemoteMessages(messagingInstance)) {
      await registerDeviceForRemoteMessages(messagingInstance);
    }
    const token = await getToken(messagingInstance);
    return token;
  } catch (error) {
    console.error('[FCM] getFcmToken error:', error);
  }
};

export const createNotificationChannel = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    return await notifee.createChannel({
      id: FCM_CONSTANTS.CHANNEL_ID,
      name: FCM_CONSTANTS.CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }
  return 'ios';
};

export const displayLocalNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  const channelId = await createNotificationChannel();

  const title = remoteMessage.notification?.title || remoteMessage.data?.title;
  const body = remoteMessage.notification?.body || remoteMessage.data?.body;

  await notifee.displayNotification({
    title: title as string,
    body: body as string,
    data: remoteMessage.data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
    },
    ios: {
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
};

export const handleNotificationTap = (message: FirebaseMessagingTypes.RemoteMessage | any) => {
  if (!message) return;
  console.log('[FCM] Notification tapped:', message);

  // Navigate to nested screen: Drawer -> Home (Tab) -> Habits Listing
  navigate(ROUTES.DRAWER, {
    screen: ROUTES.HOME,
    params: {
      screen: ROUTES.HABITS_LISTING,
    },
  });
};

export const firebaseBackgroundHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('[FCM] Background message received:', remoteMessage);

  if (!remoteMessage.notification) {
    await displayLocalNotification(remoteMessage);
  }
};

export const listenToForegroundMessages = () => {
  const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
    console.log('[FCM] Foreground message received:', remoteMessage);
    await displayLocalNotification(remoteMessage);
  });

  return unsubscribe;
};

export const setupNotificationListeners = () => {
  onNotificationOpenedApp(messagingInstance, remoteMessage => {
    handleNotificationTap(remoteMessage);
  });

  getInitialNotification(messagingInstance).then(remoteMessage => {
    if (remoteMessage) {
      handleNotificationTap(remoteMessage);
    }
  });

  const unsubscribeForeground = notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      handleNotificationTap(detail.notification);
    }
  });

  return () => {
    unsubscribeForeground();
  };
};
