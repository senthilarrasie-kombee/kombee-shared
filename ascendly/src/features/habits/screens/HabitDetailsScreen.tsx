import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import { MainStack } from '@app/navigation/navigationTypes';
import { ROUTES } from '@app/routes';
import { createHabitDetailsStyles } from './HabitDetailsStyles';

type HabitDetailsRouteProp = RouteProp<MainStack, typeof ROUTES.HABIT_DETAILS>;

const HabitDetailsScreen = () => {
  const { colors, isDark } = useTheme();
  const route = useRoute<HabitDetailsRouteProp>();
  const { habit } = route.params;

  const styles = useMemo(() => createHabitDetailsStyles(colors, isDark), [colors, isDark]);

  const isActive = habit.status === 'active';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader title="Habit Details" showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="fitness" size={40} color={colors.primary} />
          </View>
          <AppText style={styles.title}>{habit.title}</AppText>
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
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Description</AppText>
          <AppText style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {habit.description}
          </AppText>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}>
            <Icon name="flame" size={24} color="#FF5722" />
            <AppText style={styles.statValue}>{habit.streak}</AppText>
            <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Current Streak</AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E26' : '#F8FAFC' }]}>
            <Icon name="calendar" size={24} color={colors.primary} />
            <AppText style={styles.statValue}>{habit.completedDates.length}</AppText>
            <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Days Completed</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Goal</AppText>
          <View style={[styles.goalCard, { backgroundColor: isDark ? '#1E1E26' : '#F0F4FF' }]}>
            <Icon name="ribbon-outline" size={24} color={colors.primary} style={styles.goalIcon} />
            <AppText style={[styles.goalText, { color: colors.textPrimary }]}>
              {habit.goal}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Target Days</AppText>
          <View style={styles.daysContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const isTarget = habit.daysTarget.includes(day) || habit.daysTarget.includes('Daily') || (habit.daysTarget.includes('Monday') && day === 'Mon') || (habit.daysTarget.includes('Tuesday') && day === 'Tue') || (habit.daysTarget.includes('Wednesday') && day === 'Wed') || (habit.daysTarget.includes('Thursday') && day === 'Thu') || (habit.daysTarget.includes('Friday') && day === 'Fri') || (habit.daysTarget.includes('Saturday') && day === 'Sat') || (habit.daysTarget.includes('Sunday') && day === 'Sun');
              
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.editButton, { borderColor: colors.primary }]}>
          <AppText style={[styles.editButtonText, { color: colors.primary }]}>Edit Habit</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.completeButton, { backgroundColor: colors.primary }]}>
          <AppText style={styles.completeButtonText}>Mark as Done</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HabitDetailsScreen;

