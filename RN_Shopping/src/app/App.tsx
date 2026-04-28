import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import MainStackNavigation from './navigation';
import AppProviders from './providers/AppProviders';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppProviders>
      <MainStackNavigation />
    </AppProviders>
  );
}

export default App;
