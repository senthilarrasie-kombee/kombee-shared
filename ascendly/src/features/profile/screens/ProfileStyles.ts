import { StyleSheet, Dimensions } from 'react-native';
import { LightColors, FontFamily, Spacing } from '@shared/theme';

const { width } = Dimensions.get('window');

export const createProfileStyles = (colors: typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  name: {
    fontSize: 24,
    fontFamily: FontFamily.display,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.textPrimary,
  },
  username: {
    fontSize: 14,
    color: '#9E9EB8',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: '#9E9EB8',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 2,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  blob: {
    position: 'absolute',
  }
});

export const createEditProfileStyles = (colors: typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#7FB5FF',
  },
  changeAvatarButton: {
    paddingVertical: 5,
  },
  changeAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    color: '#9E9EB8',
    marginLeft: 4,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  updateButton: {
    marginTop: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: FontFamily.regular,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
