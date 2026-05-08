import { StyleSheet } from 'react-native';
import { LightColors } from '@shared/theme';

export const createStyles = (colors: typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  quoteContainer: {
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 15,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
});
