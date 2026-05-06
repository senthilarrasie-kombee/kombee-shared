import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Habit } from '../types/habit';
import { useTheme } from '@shared/theme';
import AppText from '@shared/components/AppText';
import { styles } from './HabitCardStyles';
import { calculateStreak } from '../utils/habitUtils';

import categoriesData from '../data/categories.json';

interface HabitCardProps {
  item: Habit;
  onPress: (habit: Habit) => void;
  onActionPress?: (habit: Habit) => void;
  selectedDate: string;
  showAction?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ item, onPress, onActionPress, selectedDate, showAction = true }) => {
  const { colors, isDark } = useTheme();
  const isActive = item.status === 'active';
  const isCompletedOnDate = item.completions.some(c => c.date === selectedDate);
  const currentStreak = calculateStreak(item);
  
  // Find category details
  const category = categoriesData.find(c => c.id === item.categoryId) || categoriesData[0];

  return (
    <TouchableOpacity 
      style={[
        styles.habitCard, 
        { 
          backgroundColor: isDark ? '#1E1E26' : '#FFFFFF',
          shadowColor: category.color,
        }
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      {item.priority === 'high' && (
        <View style={[styles.highPriorityTag, { backgroundColor: colors.primary }]}>
          <AppText style={[styles.highPriorityText, { color: '#FFFFFF' }]}>IMPORTANT</AppText>
        </View>
      )}
      <View style={styles.mainContainer}>
        {/* Left Column: Large Icon */}
        <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
          <Icon name={category.icon} size={32} color={category.color} />
          {item.isFavorite && (
            <View style={{ 
              position: 'absolute', 
              bottom: -4, 
              right: -4, 
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              padding: 2,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}>
              <Icon name="heart" size={14} color="#FF4B4B" />
            </View>
          )}
        </View>

        {/* Right Column: Title and Badges */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <AppText style={[styles.habitTitle, { color: colors.textPrimary }]}>
              {item.title}
            </AppText>
            {!item.isOneTime && (
              <View style={styles.streakContainer}>
                <Icon name="flame" size={16} color="#FF5722" />
                <AppText style={styles.streakText}>{currentStreak}</AppText>
              </View>
            )}
          </View>
          <View style={styles.badgeRow}>
            <View style={[
              styles.priorityBadge, 
              { backgroundColor: item.priority === 'high' ? '#FFEBEB' : item.priority === 'medium' ? '#FFF8E1' : '#E3F2FD' }
            ]}>
              <AppText style={[
                styles.priorityText, 
                { color: item.priority === 'high' ? '#D32F2F' : item.priority === 'medium' ? '#F57F17' : '#1976D2' }
              ]}>
                {item.priority.toUpperCase()}
              </AppText>
            </View>

            {item.isOneTime && (
              <View style={[styles.oneTimeBadge, { backgroundColor: colors.primary + '15' }]}>
                <AppText style={[styles.oneTimeText, { color: colors.primary }]}>TASK</AppText>
              </View>
            )}
          </View>
        </View>
      </View>

      <AppText style={[styles.description, { color: colors.textSecondary }]}>
        {item.description}
      </AppText>

      <View style={styles.cardFooter}>
        <View style={{ flex: 1 }}>
          <View style={styles.targetDaysContainer}>
            <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
            <AppText style={[styles.targetDaysText, { color: colors.textSecondary }]}>
              {item.scheduleDescription || (() => {
                if (item.frequency === 'daily') return 'Daily';
                if (item.frequency === 'weekly') {
                  if (item.daysTarget && item.daysTarget.length > 0) {
                    return item.daysTarget.map(d => d.substring(0, 3)).join(', ');
                  }
                  return `${item.targetPerWeek} times per week`;
                }
                if (item.frequency === 'monthly') {
                  if (item.datesTarget && item.datesTarget.length > 0) {
                    return `Every ${item.datesTarget.join(', ')}${item.datesTarget.length === 1 ? 'th' : ''} of the month`;
                  }
                  return `${item.targetPerMonth} times per month`;
                }
                if (item.frequency === 'quarterly') return 'Every Quarter';
                if (item.frequency === 'half-yearly') return 'Every 6 Months';
                if (item.frequency === 'yearly') return 'Once a Year';
                return item.daysTarget?.join(', ') || 'Custom';
              })()}
            </AppText>
          </View>

          <View style={[styles.targetDaysContainer, { marginTop: 4 }]}>
            <Icon name="time-outline" size={14} color={colors.textSecondary} />
            <AppText style={[styles.targetDaysText, { color: colors.textSecondary }]}>
              Created: {item.createdDate?.split('T')[0] || item.startDate?.split('T')[0]}
            </AppText>
          </View>

          <View style={[styles.badgeRow, { marginTop: 8 }]}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isActive ? '#E8F5E9' : '#FFF3E0' }
            ]}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: isActive ? '#4CAF50' : '#FF9800' }
              ]} />
              <AppText style={[
                styles.statusText, 
                { color: isActive ? '#2E7D32' : '#E65100' }
              ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </AppText>
            </View>

            <View style={[
              styles.frequencyBadge, 
              { 
                backgroundColor: item.frequency === 'daily' ? '#E8EAF6' : 
                                item.frequency === 'weekly' ? '#F3E5F5' : 
                                item.frequency === 'monthly' ? '#E0F2F1' : 
                                (item.frequency === 'yearly' || item.frequency === 'half-yearly' || item.frequency === 'quarterly') ? '#FFF3E0' : '#F5F5F5' 
              }
            ]}>
              <AppText style={[
                styles.frequencyText, 
                { 
                  color: item.frequency === 'daily' ? '#3F51B5' : 
                         item.frequency === 'weekly' ? '#9C27B0' : 
                         item.frequency === 'monthly' ? '#009688' : 
                         (item.frequency === 'yearly' || item.frequency === 'half-yearly' || item.frequency === 'quarterly') ? '#E65100' : '#616161' 
                }
              ]}>
                {item.frequency.toUpperCase()}
              </AppText>
            </View>

            <View style={[
              styles.frequencyBadge, 
              { 
                backgroundColor: item.timeOfDay === 'morning' ? '#FFF9C4' : 
                                item.timeOfDay === 'afternoon' ? '#E1F5FE' : 
                                item.timeOfDay === 'evening' ? '#EDE7F6' : '#F5F5F5' 
              }
            ]}>
              <Icon 
                name={
                  item.timeOfDay === 'morning' ? 'sunny-outline' : 
                  item.timeOfDay === 'afternoon' ? 'partly-sunny-outline' : 
                  item.timeOfDay === 'evening' ? 'moon-outline' : 'infinite-outline'
                } 
                size={12} 
                color={
                  item.timeOfDay === 'morning' ? '#FBC02D' : 
                  item.timeOfDay === 'afternoon' ? '#0288D1' : 
                  item.timeOfDay === 'evening' ? '#5E35B1' : '#616161'
                } 
                style={{ marginRight: 4 }}
              />
              <AppText style={[
                styles.frequencyText, 
                { 
                  color: item.timeOfDay === 'morning' ? '#FBC02D' : 
                         item.timeOfDay === 'afternoon' ? '#0288D1' : 
                         item.timeOfDay === 'evening' ? '#5E35B1' : '#616161',
                  marginTop: 0
                }
              ]}>
                {item.timeOfDay.toUpperCase()}
              </AppText>
            </View>
          </View>
        </View>
        {showAction && (
          <TouchableOpacity 
            style={[
              styles.addButton, 
              { backgroundColor: isCompletedOnDate ? '#4CAF50' : colors.primary }
            ]}
            onPress={() => onActionPress && onActionPress(item)}
          >
            <Icon 
              name={isCompletedOnDate ? "checkmark-circle" : "add"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Use React.memo to optimize performance
export default memo(HabitCard);
