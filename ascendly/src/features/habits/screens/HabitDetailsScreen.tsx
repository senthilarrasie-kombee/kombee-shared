import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import ConfirmModal from '@shared/components/ConfirmModal';
import { MainStack } from '@app/navigation/navigationTypes';
import { ROUTES } from '@app/routes';
import { createHabitDetailsStyles } from './HabitDetailsStyles';
import { calculateStreak } from '../utils/habitUtils';
import { useDispatch } from 'react-redux';
import { deleteHabitAsync } from '@store/reducers/rootSlice';

type HabitDetailsRouteProp = RouteProp<MainStack, typeof ROUTES.HABIT_DETAILS>;
type NavigationProp = StackNavigationProp<MainStack>;

import categoriesData from '../data/categories.json';

const HabitDetailsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HabitDetailsRouteProp>();
  const { habit } = route.params;

  const styles = useMemo(() => createHabitDetailsStyles(colors, isDark), [colors, isDark]);
  const dispatch = useDispatch<any>();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const formatDisplayDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${monthName}, ${day}, ${year}`;
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!habit?.id) return;
    setIsDeleteModalVisible(false);
    try {
      await dispatch(deleteHabitAsync(habit.id)).unwrap();
      navigation.navigate(ROUTES.HABITS_LISTING);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const isActive = habit.status === 'active';
  const category = categoriesData.find(c => c.id === habit.categoryId) || categoriesData[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader 
        title="Habit Details" 
        showBack 
        rightElement={
          <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
            <Icon name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
            <Icon name={category.icon} size={40} color={category.color} />
          </View>
          <AppText style={styles.title}>{habit.title}</AppText>
          <View style={styles.badgeContainer}>
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
                {habit.status.charAt(0).toUpperCase() + habit.status.slice(1)}
              </AppText>
            </View>

            <View style={[
              styles.priorityBadge, 
              { backgroundColor: habit.priority === 'high' ? '#FFEBEB' : habit.priority === 'medium' ? '#FFF8E1' : '#E3F2FD' }
            ]}>
              <AppText style={[
                styles.priorityText, 
                { color: habit.priority === 'high' ? '#D32F2F' : habit.priority === 'medium' ? '#F57F17' : '#1976D2' }
              ]}>
                {habit.priority.toUpperCase()}
              </AppText>
            </View>

            {habit.isOneTime && (
              <View style={[styles.taskBadge, { backgroundColor: colors.primary + '15' }]}>
                <AppText style={[styles.taskBadgeText, { color: colors.primary }]}>TASK</AppText>
              </View>
            )}

            {habit.isFavorite && (
              <View style={[styles.priorityBadge, { backgroundColor: '#FFEBEB', flexDirection: 'row', alignItems: 'center' }]}>
                <Icon name="heart" size={10} color="#EF4444" />
                <AppText style={[styles.priorityText, { color: '#EF4444', marginLeft: 4 }]}>FAVORITE</AppText>
              </View>
            )}

            <View style={[styles.timeBadge, { backgroundColor: isDark ? '#2D2D3A' : '#F1F5F9' }]}>
              <Icon 
                name={
                  habit.timeOfDay === 'morning' ? 'sunny-outline' :
                  habit.timeOfDay === 'afternoon' ? 'partly-sunny-outline' :
                  habit.timeOfDay === 'evening' ? 'moon-outline' :
                  habit.timeOfDay === 'night' ? 'bed-outline' : 'infinite-outline'
                } 
                size={12} 
                color={colors.textSecondary} 
              />
              <AppText style={[styles.statusText, { color: colors.textSecondary, marginLeft: 4 }]}>
                {habit.timeOfDay.toUpperCase()}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Description</AppText>
          <AppText style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {habit.description}
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}>
            <Icon name="flame" size={24} color="#FF5722" />
            <AppText style={styles.statValue}>{habit.isOneTime ? '-' : calculateStreak(habit)}</AppText>
            <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Current Streak</AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}>
            <Icon name="calendar" size={24} color={colors.primary} />
            <AppText style={styles.statValue}>{habit.completions.length}</AppText>
            <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Days Completed</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Goal & Tracking</AppText>
          <View style={[styles.goalCard, { backgroundColor: isDark ? '#1E1E26' : '#F0F4FF' }]}>
            <Icon name="ribbon-outline" size={24} color={colors.primary} style={styles.goalIcon} />
            <View style={{ flex: 1 }}>
              <AppText style={[styles.goalText, { color: colors.textPrimary }]}>
                {habit.goal}
              </AppText>
              {habit.durationType !== 'none' && (
                <AppText style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                  Target: {habit.duration} {habit.durationType}
                </AppText>
              )}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Schedule</AppText>
          <View style={[styles.goalCard, { backgroundColor: isDark ? '#1E1E26' : '#F5F3FF' }]}>
            <Icon name="calendar-outline" size={24} color="#8B5CF6" style={styles.goalIcon} />
            <AppText style={[styles.goalText, { color: colors.textPrimary }]}>
              {habit.scheduleDescription || habit.frequency.toUpperCase()}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        {!habit.isOneTime && habit.daysTarget && habit.daysTarget.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Selected Days</AppText>
            <View style={styles.daysContainer}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const fullDays = {
                  'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 
                  'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
                };
                const isTarget = habit.daysTarget.includes(fullDays[day as keyof typeof fullDays]);
                
                return (
                  <View 
                    key={day} 
                    style={[
                      styles.dayCircle, 
                      { 
                        backgroundColor: isTarget ? colors.primary : (isDark ? '#2D2D3A' : '#E2E8F0'),
                        borderColor: isTarget ? colors.primary : 'transparent'
                      }
                    ]}
                  >
                    <AppText style={[
                      styles.dayText, 
                      { color: isTarget ? '#FFFFFF' : (isDark ? '#9E9EB8' : '#64748B') }
                    ]}>
                      {day[0]}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Timeline</AppText>
          <View style={[styles.timelineContainer, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}>
            <View style={styles.timelineItem}>
              <Icon name="add-circle-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, { color: colors.textSecondary }]}>Created on:</AppText>
              <AppText style={[styles.timelineValue, { color: colors.textPrimary }]}>{formatDisplayDate(habit.createdDate || habit.startDate)}</AppText>
            </View>
            <View style={styles.timelineItem}>
              <Icon name="play-circle-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, { color: colors.textSecondary }]}>Started on:</AppText>
              <AppText style={[styles.timelineValue, { color: colors.textPrimary }]}>{formatDisplayDate(habit.startDate)}</AppText>
            </View>
            {habit.endDate && (
              <View style={styles.timelineItem}>
                <Icon name="stop-circle-outline" size={18} color={colors.textSecondary} />
                <AppText style={[styles.timelineLabel, { color: colors.textSecondary }]}>Ends on:</AppText>
                <AppText style={[styles.timelineValue, { color: colors.textPrimary }]}>{formatDisplayDate(habit.endDate)}</AppText>
              </View>
            )}
            <View style={[styles.timelineItem, { borderBottomWidth: 0 }]}>
              <Icon name="sync-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, { color: colors.textSecondary }]}>Last updated:</AppText>
              <AppText style={[styles.timelineValue, { color: colors.textPrimary }]}>{formatDisplayDate(habit.updatedAt)}</AppText>
            </View>
          </View>
        </View>

        {habit.completions.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>History</AppText>
              <View style={styles.historyContainer}>
                {[...habit.completions]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((c, index) => {
                    const formatted = formatDisplayDate(c.date);
                    const parts = formatted.split(',');
                    return (
                      <View 
                        key={`${c.date}-${index}`} 
                        style={[
                          styles.historyChip, 
                          { 
                            backgroundColor: colors.primary + '10',
                            borderColor: colors.primary + '30'
                          }
                        ]}
                      >
                        <AppText style={[styles.historyChipText, { color: colors.primary }]}>
                          {parts[0]} {parts[1]}
                        </AppText>
                      </View>
                    );
                  })}
              </View>
            </View>
          </>
        )}

        {habit.completions.some(c => c.note) && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Notes</AppText>
            {habit.completions
              .filter(c => c.note)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((c, index) => (
                <View 
                  key={`${c.date}-${index}`} 
                  style={[styles.noteItem, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}
                >
                  <AppText style={[styles.noteDate, { color: colors.primary }]}>
                    {formatDisplayDate(c.date)}
                  </AppText>
                  <AppText style={[styles.noteText, { color: colors.textPrimary }]}>
                    {c.note}
                  </AppText>
                </View>
              ))}
          </View>
        </>
      )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate(ROUTES.HABIT_FORM, { habit })}
        >
          <AppText style={[styles.editButtonText, { color: colors.primary }]}>Edit Habit</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.completeButton, { backgroundColor: colors.primary }]}>
          <AppText style={styles.completeButtonText}>Mark as Done</AppText>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        isVisible={isDeleteModalVisible}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone and you will lose all progress recorded so far."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HabitDetailsScreen;

