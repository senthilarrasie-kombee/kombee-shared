import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Habit } from '../types/habit';
import { useTheme } from '@shared/theme';
import AppText from '@shared/components/AppText';
import { styles } from './HabitCardStyles';

interface HabitCardProps {
  item: Habit;
  onPress: (habit: Habit) => void;
}

/**
 * HabitCard component - Memoized to prevent re-renders when parent state changes 
 * but this specific habit data hasn't changed.
 */
const HabitCard: React.FC<HabitCardProps> = ({ item, onPress }) => {
  const { colors, isDark } = useTheme();
  const isActive = item.status === 'active';

  return (
    <TouchableOpacity 
      style={[
        styles.habitCard, 
        { 
          backgroundColor: isDark ? '#1E1E26' : '#FFFFFF',
          shadowColor: colors.primary,
        }
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <AppText style={[styles.habitTitle, { color: colors.textPrimary }]}>
            {item.title}
          </AppText>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: isActive ? '#E1F9F1' : '#FFF3E0' }
          ]}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isActive ? '#10B981' : '#F59E0B' }
            ]} />
            <AppText style={[
              styles.statusText, 
              { color: isActive ? '#065F46' : '#92400E' }
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </AppText>
          </View>
        </View>
        <View style={styles.streakContainer}>
          <Icon name="flame" size={18} color="#FF5722" />
          <AppText style={styles.streakText}>{item.streak}</AppText>
        </View>
      </View>

      <AppText style={[styles.description, { color: colors.textSecondary }]}>
        {item.description}
      </AppText>

      <View style={styles.cardFooter}>
        <View style={styles.targetDaysContainer}>
          <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
          <AppText style={[styles.targetDaysText, { color: colors.textSecondary }]}>
            {item.daysTarget.join(', ')}
          </AppText>
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Icon name="checkmark" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Use React.memo to optimize performance
export default memo(HabitCard);
