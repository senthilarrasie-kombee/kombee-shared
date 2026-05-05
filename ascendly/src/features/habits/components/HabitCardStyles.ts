import { StyleSheet } from 'react-native';
import { FontFamily, FontSize } from '@shared/theme';

export const styles = StyleSheet.create({
  habitCard: {
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  habitTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    marginLeft: 4,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#FF5722',
  },
  description: {
    fontSize: FontSize.sm,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDaysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  targetDaysText: {
    fontSize: FontSize.xs,
    marginLeft: 6,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
