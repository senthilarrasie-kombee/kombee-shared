import { StyleSheet } from 'react-native';
import { LightColors } from '@shared/theme';

export const createStyles = (colors: typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  counterText: {
    fontSize: 48,
    color: colors.primary,
    marginBottom: 30,
  },
});
