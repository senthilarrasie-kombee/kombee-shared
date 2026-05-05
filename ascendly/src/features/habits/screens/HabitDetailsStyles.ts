import { StyleSheet } from 'react-native';
import { LightColors, FontFamily, FontSize } from '@shared/theme';

export const createHabitDetailsStyles = (colors: typeof LightColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.semiBold,
    marginBottom: 8,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  sectionContent: {
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 0.48,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.semiBold,
    marginTop: 8,
    marginBottom: 4,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  goalCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  goalIcon: {
    marginRight: 12,
  },
  goalText: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    fontStyle: 'italic',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  editButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  editButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
  completeButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
});
