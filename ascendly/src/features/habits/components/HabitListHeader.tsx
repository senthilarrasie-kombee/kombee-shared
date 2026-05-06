import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppText from '@shared/components/AppText';
import { FontFamily, FontSize, useTheme } from '@shared/theme';
import { Habit } from '../types/habit';

const { width } = Dimensions.get('window');

const HabitListHeader = ({ 
  habits = [], 
  selectedDate, 
  onDateSelect 
}: { 
  habits: Habit[], 
  selectedDate: string, 
  onDateSelect: (date: string) => void 
}) => {
  const { colors, isDark } = useTheme();

  // Generate 7 days centered around the selected date
  const days = React.useMemo(() => {
    const list = [];
    const [year, month, day] = selectedDate.split('-').map(Number);
    const centerDate = new Date(year, month - 1, day);
    
    // We show 3 days before and 3 days after the selected date
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      list.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        fullDate: dateStr,
        isToday: dateStr === todayStr,
      });
    }
    return list;
  }, [selectedDate]);

  // The 'habits' prop is already filtered for the selected date (including dayTarget, startDate, and endDate)
  const todaysHabits = habits;
  
  // Calculate completed habits for the selected date
  const completedCount = todaysHabits.filter(h => 
    h.completions.some(c => c.date === selectedDate)
  ).length;

  const totalHabits = todaysHabits.length || 0;
  
  // Check if the selected date is today (local time)
  const isToday = React.useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return selectedDate === todayStr;
  }, [selectedDate]);

  // Format the selected date for display: May 5, 2026 (Tuesday)
  const formattedDate = React.useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const datePart = d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    return `${datePart} (${dayName})`;
  }, [selectedDate]);

  // Progress Circle Constants
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = totalHabits > 0 ? completedCount / totalHabits : 0;
  const dashOffset = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      {/* Selected Date Display */}
      <View style={styles.selectedDateContainer}>
        <AppText style={[styles.selectedDateLabel, { color: colors.primary }]}>
          {formattedDate}
        </AppText>
      </View>

      {/* Horizontal Calendar */}
      <View style={styles.calendarContainer}>
        {days.map((item, index) => {
          const isSelected = item.fullDate === selectedDate;
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => onDateSelect(item.fullDate)}
              style={[
                styles.dayItem, 
                isSelected && { backgroundColor: isDark ? colors.primary + '30' : colors.primary + '15' }
              ]}
            >
              <AppText style={[
                styles.dayText, 
                { color: isDark ? colors.textSecondary : '#94A3B8' },
                isSelected && { color: colors.primary }
              ]}>
                {item.day}
              </AppText>
              <View style={[
                styles.dateCircle, 
                { borderColor: isDark ? colors.border : '#E2E8F0' },
                isSelected && { borderColor: colors.primary, borderWidth: 2, backgroundColor: isDark ? colors.background : '#FFFFFF' }
              ]}>
                <AppText style={[
                  styles.dateText, 
                  { color: colors.textPrimary },
                  isSelected && { color: colors.primary }
                ]}>
                  {item.date}
                </AppText>
              </View>
              {item.isToday && !isSelected && <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Progress Card - Shown if any habits are scheduled for this day of the week */}
      {totalHabits > 0 && (
        <View style={[
          styles.progressCard, 
          { backgroundColor: isDark ? colors.background : colors.primary + '08' }
        ]}>
          <View style={styles.progressCircleContainer}>
            <Svg width={size} height={size}>
              {/* Background Track */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isDark ? colors.primary + '20' : colors.primary + '15'}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Stroke */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={colors.primary}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.progressTextWrapper}>
              <AppText style={[styles.progressValue, { color: colors.primary }]}>
                {completedCount}/{totalHabits}
              </AppText>
            </View>
          </View>
          <View style={styles.progressInfo}>
            <AppText style={[styles.progressTitle, { color: colors.textPrimary }]}>
              {isToday ? "Today's Progress" : "Day's Progress"}
            </AppText>
            <AppText style={[styles.progressSubtext, { color: colors.textSecondary }]}>
              {completedCount === totalHabits 
                ? "All done! Great job! 🎉" 
                : "👋 Keep going!"}
            </AppText>
          </View>
        </View>
      )}

      {/* Section Title */}
      <AppText style={[styles.sectionTitle, { color: isDark ? colors.textSecondary : '#94A3B8' }]}>
        {isToday ? "Today's Habits" : "Scheduled Habits"}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default HabitListHeader;
