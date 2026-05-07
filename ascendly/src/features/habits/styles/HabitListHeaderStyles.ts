import { StyleSheet, Dimensions } from 'react-native';
import { FontFamily, FontSize } from '@shared/theme';

const { width } = Dimensions.get('window');

export const createHabitListHeaderStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  selectedDateContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  selectedDateLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 0.5,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 8,
    width: (width - 48) / 7,
    borderRadius: 16,
  },
  dayText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: '#94A3B8',
    marginBottom: 8,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#1E293B',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E5BFF',
    position: 'absolute',
    bottom: 2,
  },
  progressCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  progressCircleContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#1E5BFF',
  },
  progressInfo: {
    marginLeft: 16,
    flex: 1,
  },
  progressTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: '#1E293B',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: '#94A3B8',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});
