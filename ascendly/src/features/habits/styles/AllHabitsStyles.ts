import {StyleSheet, Platform} from 'react-native';
import {LightColors, FontFamily, FontSize} from '@shared/theme';

export const createAllHabitsStyles = (colors: typeof LightColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    filterBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterBadgeText: {
      color: 'white',
      fontSize: 8,
      fontFamily: FontFamily.semiBold,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      borderRadius: 15,
      paddingHorizontal: 15,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: FontFamily.regular,
      paddingVertical: 8,
    },
    resultsHeader: {
      marginTop: 12,
      paddingHorizontal: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    resultsCount: {
      fontSize: 14,
      fontFamily: FontFamily.semiBold,
    },
    listContent: {
      paddingBottom: 40,
    },
    separator: {
      height: 10,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: FontFamily.regular,
      textAlign: 'center',
      marginTop: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalDismissArea: {
      flex: 1,
    },
    modalContent: {
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      maxHeight: '85%',
    },
    modalHeader: {
      alignItems: 'center',
      paddingTop: 12,
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#E0E0E0',
      marginBottom: 20,
    },
    modalTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: FontFamily.display,
      fontWeight: 'bold',
    },
    modalBody: {
      paddingHorizontal: 24,
    },
    filterSection: {
      marginBottom: 24,
    },
    filterLabel: {
      fontSize: 16,
      fontFamily: FontFamily.semiBold,
      marginBottom: 12,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      margin: 4,
    },
    chipText: {
      fontSize: 14,
      fontFamily: FontFamily.semiBold,
    },
    modalFooter: {
      padding: 24,
      borderTopWidth: 1,
      paddingBottom: 40,
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
