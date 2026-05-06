import { StyleSheet, Dimensions, Platform } from 'react-native';
import { LightColors, FontFamily, FontSize } from '@shared/theme';

const { width } = Dimensions.get('window');

export const createHabitsListStyles = (colors: typeof LightColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  themedContainer: {
    backgroundColor: isDark ? '#121212' : '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
  },
  dashboardIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    height: 36,
  },
  statsButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.semiBold,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  separator: {
    height: 16,
  },
  createButtonBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginTop: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  sectionHeaderIcon: {
    marginRight: 8,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
    backgroundColor: isDark ? '#1E1E26' : '#FFFFFF',
  },
  sheetHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
  },
  sheetSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: 4,
  },
  sheetContent: {
    paddingVertical: 10,
  },
  sheetInput: {
    borderRadius: 16,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginBottom: 20,
    backgroundColor: isDark ? '#2D2D3A' : '#F1F5F9',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
});
