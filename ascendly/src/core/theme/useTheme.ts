import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from './colors';

export const useTheme = () => {

  // dev: predefined hook used here useColorScheme
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DarkColors : LightColors;
  
  return { colors, isDark };
};
