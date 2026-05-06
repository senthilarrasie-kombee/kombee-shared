import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from './colors';
import { useAppSelector } from '@store';

export const useTheme = () => {
  const systemIsDark = useColorScheme() === 'dark';
  const reduxIsDark = useAppSelector((state) => state.root.isDarkMode);
  
  // You can decide if you want system default or manual toggle to take precedence.
  // Here we'll use the Redux state as the source of truth.
  const isDark = reduxIsDark; 
  const colors = isDark ? DarkColors : LightColors;
  
  return { colors, isDark };
};
