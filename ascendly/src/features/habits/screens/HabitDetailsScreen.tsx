import React, {useMemo, useState} from 'react';
import {View, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import ConfirmModal from '@shared/components/ConfirmModal';
import {STRINGS} from '@shared/constants/strings';
import {MainStack} from '@app/navigation/navigationTypes';
import {ROUTES} from '@app/routes';
import {createHabitDetailsStyles} from '../styles/HabitDetailsStyles';
import {calculateStreak, formatDisplayDate} from '@shared/utils/habitUtils';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '@store';
import {deleteHabitAsync} from '@store/reducers/rootSlice';

type HabitDetailsRouteProp = RouteProp<MainStack, typeof ROUTES.HABIT_DETAILS>;
type NavigationProp = StackNavigationProp<MainStack>;

import {CATEGORIES_DATA as categoriesData} from '@shared/constants/categories';

const HabitDetailsScreen = () => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HabitDetailsRouteProp>();
  const initialHabit = route.params.habit;

  // Select the latest habit data from Redux to ensure we see updates after editing
  const allHabits = useAppSelector(state => state.root.habits);
  const habit = allHabits.find(h => h.id === initialHabit.id) || initialHabit;

  const styles = useMemo(() => createHabitDetailsStyles(colors, isDark), [colors, isDark]);
  const dispatch = useDispatch<any>();

  // Group completions by Month for history display
  const monthlyHistory = useMemo(() => {
    const groups: {[key: string]: string[]} = {};
    
    [...habit.completions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach(c => {
        // Date format from habits.ts is YYYY-MM-DD
        const [year, month, day] = c.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const key = `${monthName} ${year}`;
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(day.toString());
      });
      
    return Object.entries(groups);
  }, [habit.completions]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!habit?.id) return;
    setIsDeleteModalVisible(false);
    try {
      await dispatch(deleteHabitAsync(habit.id)).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const isActive = habit.status === 'active';
  const category = categoriesData.find(c => c.id === habit.categoryId) || categoriesData[0];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader
        title={STRINGS.HABITS.DETAILS_TITLE}
        showBack
        rightElement={
          <TouchableOpacity onPress={handleDelete} style={{padding: 8}}>
            <Icon name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, {backgroundColor: category.color + '15'}]}>
            <Icon name={category.icon} size={40} color={category.color} />
          </View>
          <AppText style={styles.title}>{habit.title}</AppText>
          <View style={styles.badgeContainer}>
            <View style={[styles.statusBadge, {backgroundColor: isActive ? '#E1F9F1' : '#FFF3E0'}]}>
              <View style={[styles.statusDot, {backgroundColor: isActive ? '#10B981' : '#F59E0B'}]} />
              <AppText style={[styles.statusText, {color: isActive ? '#065F46' : '#92400E'}]}>
                {STRINGS.HABITS.LABELS[habit.status.toUpperCase() as keyof typeof STRINGS.HABITS.LABELS]}
              </AppText>
            </View>

            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    habit.priority === 'high' ? '#FFEBEB' : habit.priority === 'medium' ? '#FFF8E1' : '#E3F2FD',
                },
              ]}>
                <AppText
                  style={[
                    styles.priorityText,
                    {color: habit.priority === 'high' ? '#D32F2F' : habit.priority === 'medium' ? '#F57F17' : '#1976D2'},
                  ]}>
                  {STRINGS.HABITS.LABELS[habit.priority.toUpperCase() as keyof typeof STRINGS.HABITS.LABELS]}
                </AppText>
            </View>

            {habit.isOneTime && (
              <View style={[styles.taskBadge, {backgroundColor: colors.primary + '15'}]}>
                <AppText style={[styles.taskBadgeText, {color: colors.primary}]}>TASK</AppText>
              </View>
            )}

            {habit.isFavorite && (
              <View
                style={[
                  styles.priorityBadge,
                  {backgroundColor: '#FFEBEB', flexDirection: 'row', alignItems: 'center'},
                ]}>
                <Icon name="heart" size={10} color="#EF4444" />
                <AppText style={[styles.priorityText, {color: '#EF4444', marginLeft: 4}]}>FAVORITE</AppText>
              </View>
            )}

            <View style={[styles.timeBadge, {backgroundColor: isDark ? '#2D2D3A' : '#F1F5F9'}]}>
              <Icon
                name={
                  habit.timeOfDay === 'morning'
                    ? 'sunny-outline'
                    : habit.timeOfDay === 'afternoon'
                      ? 'partly-sunny-outline'
                      : habit.timeOfDay === 'evening'
                        ? 'moon-outline'
                        : habit.timeOfDay === 'night'
                          ? 'bed-outline'
                          : 'infinite-outline'
                }
                size={12}
                color={colors.textSecondary}
              />
              <AppText style={[styles.statusText, {color: colors.textSecondary, marginLeft: 4}]}>
                {habit.timeOfDay.toUpperCase()}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Description</AppText>
          <AppText style={[styles.sectionContent, {color: colors.textSecondary}]}>{habit.description}</AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={[styles.statCard, {backgroundColor: isDark ? '#1E1E26' : '#F8FAFC'}]}>
            <Icon name="flame" size={24} color="#FF5722" />
            <AppText style={styles.statValue}>{habit.isOneTime ? '-' : calculateStreak(habit)}</AppText>
            <AppText style={[styles.statLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.CURRENT_STREAK}</AppText>
          </View>
          <View style={[styles.statCard, {backgroundColor: isDark ? '#1E1E26' : '#F8FAFC'}]}>
            <Icon name="calendar" size={24} color={colors.primary} />
            <AppText style={styles.statValue}>{habit.completions.length}</AppText>
            <AppText style={[styles.statLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.DAYS_COMPLETED}</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>{STRINGS.HABITS.LABELS.GOAL_TRACKING}</AppText>
          <View style={[styles.goalCard, {backgroundColor: isDark ? '#1E1E26' : '#F0F4FF'}]}>
            <Icon name="ribbon-outline" size={24} color={colors.primary} style={styles.goalIcon} />
            <View style={{flex: 1}}>
              <AppText style={[styles.goalText, {color: colors.textPrimary}]}>{habit.goal}</AppText>
              {habit.durationType !== 'none' && (
                <AppText style={{fontSize: 12, color: colors.textSecondary, marginTop: 2}}>
                  {STRINGS.HABITS.LABELS.TARGET}: {habit.duration} {habit.durationType}
                </AppText>
              )}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Schedule</AppText>
          <View style={[styles.goalCard, {backgroundColor: isDark ? '#1E1E26' : '#F5F3FF'}]}>
            <Icon name="calendar-outline" size={24} color="#8B5CF6" style={styles.goalIcon} />
            <AppText style={[styles.goalText, {color: colors.textPrimary}]}>
              {habit.scheduleDescription || habit.frequency.toUpperCase()}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        {!habit.isOneTime && habit.daysTarget && habit.daysTarget.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>{STRINGS.HABITS.LABELS.SELECTED_DAYS}</AppText>
            <View style={styles.daysContainer}>
              {STRINGS.DAYS.SHORT.map(day => {
                const fullDays: any = STRINGS.DAYS.FULL;
                const isTarget = habit.daysTarget.includes(fullDays[day as keyof typeof fullDays]);

                return (
                  <View
                    key={day}
                    style={[
                      styles.dayCircle,
                      {
                        backgroundColor: isTarget ? colors.primary : isDark ? '#2D2D3A' : '#E2E8F0',
                        borderColor: isTarget ? colors.primary : 'transparent',
                      },
                    ]}>
                    <AppText style={[styles.dayText, {color: isTarget ? '#FFFFFF' : isDark ? '#9E9EB8' : '#64748B'}]}>
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
          <AppText style={styles.sectionTitle}>{STRINGS.HABITS.LABELS.TIMELINE}</AppText>
          <View style={[styles.timelineContainer, {backgroundColor: isDark ? '#1E1E26' : '#F8FAFC'}]}>
            <View style={styles.timelineItem}>
              <Icon name="add-circle-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.CREATED_ON}</AppText>
              <AppText style={[styles.timelineValue, {color: colors.textPrimary}]}>
                {formatDisplayDate(habit.createdDate || habit.startDate)}
              </AppText>
            </View>
            <View style={styles.timelineItem}>
              <Icon name="play-circle-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.STARTED_ON}</AppText>
              <AppText style={[styles.timelineValue, {color: colors.textPrimary}]}>
                {formatDisplayDate(habit.startDate)}
              </AppText>
            </View>
            {habit.endDate && (
              <View style={styles.timelineItem}>
                <Icon name="stop-circle-outline" size={18} color={colors.textSecondary} />
                <AppText style={[styles.timelineLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.ENDS_ON}</AppText>
                <AppText style={[styles.timelineValue, {color: colors.textPrimary}]}>
                  {formatDisplayDate(habit.endDate)}
                </AppText>
              </View>
            )}
            <View style={[styles.timelineItem, {borderBottomWidth: 0}]}>
              <Icon name="sync-outline" size={18} color={colors.textSecondary} />
              <AppText style={[styles.timelineLabel, {color: colors.textSecondary}]}>{STRINGS.HABITS.LABELS.LAST_UPDATED}</AppText>
              <AppText style={[styles.timelineValue, {color: colors.textPrimary}]}>
                {formatDisplayDate(habit.updatedAt)}
              </AppText>
            </View>
          </View>
        </View>

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
                    style={[styles.noteItem, {backgroundColor: isDark ? '#1E1E26' : '#F8FAFC'}]}>
                    <View style={styles.noteHeader}>
                      <Icon name="calendar-outline" size={14} color={colors.primary} style={{marginRight: 6}} />
                      <AppText style={[styles.noteDate, {color: colors.primary}]}>{formatDisplayDate(c.date)}</AppText>
                    </View>
                    <AppText style={[styles.noteText, {color: colors.textPrimary}]}>{c.note}</AppText>
                  </View>
                ))}
            </View>
          </>
        )}

        {monthlyHistory.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>{STRINGS.HABITS.LABELS.HISTORY}</AppText>
              <View style={styles.historyContainer}>
                {monthlyHistory.map(([monthYear, days], index) => (
                  <View
                    key={`${monthYear}-${index}`}
                    style={[
                      styles.historyMonthCard,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0',
                      },
                    ]}>
                    <View style={styles.historyMonthHeader}>
                      <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
                      <AppText style={[styles.historyMonthTitle, {color: colors.textPrimary}]}>
                        {monthYear}
                      </AppText>
                    </View>
                    <View style={styles.historyDaysGrid}>
                      {days.map((day, dIdx) => (
                        <View
                          key={`day-${day}-${dIdx}`}
                          style={[
                            styles.historyDayBadge,
                            {
                              backgroundColor: '#10B98120',
                              borderColor: '#10B98140',
                            },
                          ]}>
                          <AppText style={[styles.historyDayText, {color: '#10B981'}]}>
                            {day}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.editButton, {borderColor: colors.primary}]}
          onPress={() => navigation.navigate(ROUTES.HABIT_FORM, {habit})}>
          <AppText style={[styles.editButtonText, {color: colors.primary}]}>{STRINGS.HABITS.LABELS.EDIT_HABIT}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.completeButton, {backgroundColor: colors.primary}]}>
          <AppText style={styles.completeButtonText}>{STRINGS.HABITS.LABELS.MARK_DONE}</AppText>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        isVisible={isDeleteModalVisible}
        title={STRINGS.HABITS.DELETE.TITLE}
        message={STRINGS.HABITS.DELETE.MESSAGE}
        confirmText={STRINGS.HABITS.DELETE.CONFIRM}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HabitDetailsScreen;
