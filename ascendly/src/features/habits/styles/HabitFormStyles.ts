import { StyleSheet, Dimensions } from 'react-native';
import { LightColors, FontFamily, FontSize } from '@shared/theme';

const { width } = Dimensions.get('window');

export const createHabitFormStyles = (colors: typeof LightColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  input: {
    color: colors.textPrimary,
    paddingTop: 14,
    paddingBottom: 10,
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E26' : '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: isDark ? colors.primary + '10' : '#FFFFFF',
  },
  inputIcon: {
    marginRight: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: FontSize.xs,
    marginTop: 4,
    marginLeft: 4,
  },
  hintText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.primary,
    marginTop: 6,
    marginLeft: 4,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  
  // Category Picker Styles
  categoryList: {
    paddingVertical: 8,
  },
  categoryItem: {
    width: 80,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },

  // Priority Selector Styles
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityItem: {
    flex: 0.3,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
  },
  priorityText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  
  // Frequency Selector Styles
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  frequencyItem: {
    width: (width - 48) / 3, // 3 items per row
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 4,
    backgroundColor: isDark ? '#1E1E26' : '#F1F5F9',
  },
  horizontalFrequencyItem: {
    flexDirection: 'row',
    width: (width - 48) / 2, // 2 items per row for better horizontal layout
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 4,
    backgroundColor: isDark ? '#1E1E26' : '#F1F5F9',
    paddingHorizontal: 8,
  },
  frequencyText: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    marginTop: 4,
  },
  frequencyIcon: {
    marginBottom: 2,
  },

  // Switch Styles
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1E1E26' : '#F1F5F9',
    padding: 16,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: colors.textPrimary,
  },
  switchSublabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Days Picker Styles
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  dayButton: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
  },
  dayButtonText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  
  // Dates Grid Styles
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 8, // Consistent spacing between items
  },
  dateGridButton: {
    width: (width - 32 - (6 * 8)) / 7, // Adjust for 16*2 padding and 6 gaps of 8px
    height: (width - 32 - (6 * 8)) / 7,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0, // Vertical spacing handled by gap (if supported) or rowGap
    borderWidth: 1,
  },
  dateGridButtonText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
  },
  
  // Specific Dates Styles
  specificDatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  specificDateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  specificDateTagText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    marginRight: 4,
  },
  addDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 12,
  },
  addDateButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    marginLeft: 8,
  },

  // Date Pickers
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 0.48,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E26' : '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.textPrimary,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'transparent',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
  },
  deleteButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EF444430',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
  // Additional Component Styles
  gap12: {
    gap: 12,
  },
  debugLabel: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deselectText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: FontFamily.semiBold,
  },
  startDateBadge: {
    flexDirection: 'row',
    marginTop: 4,
  },
  startDateTagContainer: {
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  startDateText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  clearEndDateButton: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  clearEndDateText: {
    fontSize: 10,
    color: '#EF4444',
  },
  debugContainer: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugErrorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },
  deleteIcon: {
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
    marginRight: -8, // Compensate for padding to align with other elements
  },
  noteCard: {
    backgroundColor: isDark ? '#1E1E26' : '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  noteDateText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
    marginBottom: 8,
  },
  noteInput: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    padding: 0,
    minHeight: 40,
    textAlignVertical: 'top',
  },
});
