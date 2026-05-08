import React from 'react';
import {useColorScheme} from 'react-native';
import MainStackNavigation from './navigation';
import AppProviders from './providers/AppProviders';
import {usePushNotifications} from '../core/firebase/messaging';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize Push Notifications
  usePushNotifications();

  return (
    <AppProviders>
      <MainStackNavigation />
    </AppProviders>
  );
}

export default App;
