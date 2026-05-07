import React, { useMemo } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppText from '@shared/components/AppText';
import { useTheme } from '@shared/theme';
import { Habit } from '@shared/types/habit';
import { createHabitListHeaderStyles } from '../styles/HabitListHeaderStyles';

interface HabitListHeaderProps {
  habits: Habit[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const HabitListHeader = ({ habits = [], selectedDate, onDateSelect }: HabitListHeaderProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createHabitListHeaderStyles(colors, isDark), [colors, isDark]);

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

export default HabitListHeader;
