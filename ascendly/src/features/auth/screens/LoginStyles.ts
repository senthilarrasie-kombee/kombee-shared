import { StyleSheet, Dimensions, Platform } from 'react-native';
import { LightColors, FontFamily, Spacing } from '@shared/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (colors: typeof LightColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.25,
    paddingBottom: 40,
  },
  title: {
    fontSize: 42,
    color: colors.textPrimary,
    fontFamily: FontFamily.display,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: Spacing.s1,
    marginBottom: 40,
    fontFamily: FontFamily.regular,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, height: 48, 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
includeFontPadding: false, 

  },
  bigBubble: {
    position: 'absolute',
    top: -170,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: colors.primary,
    borderRadius: 150,
  },
  lightBlob: {
    position: 'absolute',
    top: -250,
    left: -70,
    width: 450,
    height: 450,
    backgroundColor: colors.blob1,
    borderRadius: 225,
    opacity: 0.6,
  },
  lightBlob2: {
    position: 'absolute',
    bottom: -300,
    right: -200,
    width: 450,
    height: 450,
    backgroundColor: colors.blob2,
    borderRadius: 225,
    opacity: 0.6,
  },
  smallBubble: {
    position: 'absolute',
    right: -40,
    top: 220,
    width: 120,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 60,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -Spacing.s3,
    marginBottom: Spacing.s3,
    marginLeft: Spacing.s1,
    fontFamily: FontFamily.regular,
  },
});
