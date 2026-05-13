import {StyleSheet, Dimensions} from 'react-native';
import {LightColors} from '@shared/theme';

const {width} = Dimensions.get('window');

export const createStyles = (colors: typeof LightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      marginLeft: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.border + '50',
      borderRadius: 12,
      padding: 4,
      marginVertical: 16,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    activeToggleButton: {
      backgroundColor: colors.primary,
    },
    toggleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeToggleText: {
      color: '#FFFFFF',
    },
    completionCard: {
      backgroundColor: colors.primary + '05',
      borderRadius: 20,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.primary + '10',
    },
    progressContainer: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    progressText: {
      position: 'absolute',
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    completionInfo: {
      flex: 1,
    },
    completionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    completionSub: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    completionTrend: {
      fontSize: 14,
      color: '#4CAF50', // Success green
      fontWeight: '600',
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      backgroundColor: colors.primary + '05',
      borderRadius: 16,
      padding: 16,
      width: (width - 48) / 3,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '10',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    chartCard: {
      backgroundColor: colors.primary + '05',
      borderRadius: 20,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.primary + '10',
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    calendarTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    dayBox: {
      width: (width - 64) / 7,
      aspectRatio: 1,
      borderRadius: 8,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    heatmapContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    miniMonth: {
      width: (width - 48) / 3,
      marginBottom: 16,
    },
    miniMonthTitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    miniGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    miniDay: {
      width: (width - 48) / (3 * 7) - 2,
      height: (width - 48) / (3 * 7) - 2,
      borderRadius: 2,
      margin: 1,
    },
  });
