import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './src/app/App';
import { name as appName } from './app.json';
import { firebaseBackgroundHandler, handleNotificationTap } from './src/core/firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(firebaseBackgroundHandler);

// Handle background events for Notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    handleNotificationTap(detail.notification);
  }
});

AppRegistry.registerComponent(appName, () => App);
