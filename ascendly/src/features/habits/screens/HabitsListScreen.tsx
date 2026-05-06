import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, StatusBar, RefreshControl, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, FontFamily, FontSize, Spacing } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import { ROUTES } from '@app/routes';
import { MainStack } from '@app/navigation/navigationTypes';
import { useAppDispatch, useAppSelector } from '@store';
import { fetchHabits, updateHabit } from '@store/reducers/rootSlice';
import HabitCard from '../components/HabitCard';
import HabitListHeader from '../components/HabitListHeader';
import { createHabitsListStyles } from './HabitsListStyles';
import { Habit } from '../types/habit';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type NavigationProp = StackNavigationProp<MainStack>;

const HabitsListScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createHabitsListStyles(colors, isDark), [colors, isDark]);

  // State for selected date from calendar
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Get habits and loading state from Redux
  const allHabits = useAppSelector((state) => state.root.habits);
  const isRefreshing = useAppSelector((state) => state.root.loading);

  // Helper to get local YYYY-MM-DD string
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter habits based on the Full Schedule for the selected date
  const habits = useMemo(() => {
    // Manually parse YYYY-MM-DD to get the correct day name without timezone shift
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return allHabits.filter(h => {
      // 1. Check if the selected date is within the habit's active date range
      const habitStart = h.startDate?.split('T')[0];
      const habitEnd = h.endDate?.split('T')[0];
      const isInDateRange = (!habitStart || selectedDate >= habitStart) &&
                           (!habitEnd || selectedDate <= habitEnd);
      if (!isInDateRange) return false;

      // 3. Handle different frequencies
      if (h.frequency === 'daily') return true;

      if (h.frequency === 'weekly') {
        // If specific days are targeted (e.g., "Monday")
        if (h.daysTarget && h.daysTarget.length > 0) {
          return h.daysTarget.includes(dayName);
        }
        // If it's a flexible weekly target (e.g., "3 times a week"), show it every day
        // until we implement a more complex "available today" check.
        return true;
      }

      if (h.frequency === 'monthly') {
        // If specific dates are targeted (e.g., "5th of the month")
        if (h.datesTarget && h.datesTarget.length > 0) {
          return h.datesTarget.includes(day);
        }
        // If it's a flexible monthly target (e.g., "3 times a month"), show it every day
        return true;
      }

      // Default fallback (compatible with old data)
      return h.daysTarget.includes(dayName);
    }).sort((a, b) => {
      // Sort by isFavorite first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [allHabits, selectedDate]);

  // Group habits by Time of Day
  const habitSections = useMemo(() => {
    const morning = habits.filter(h => h.timeOfDay === 'morning');
    const afternoon = habits.filter(h => h.timeOfDay === 'afternoon');
    const evening = habits.filter(h => h.timeOfDay === 'evening');
    const night = habits.filter(h => h.timeOfDay === 'night');
    const anytime = habits.filter(h => h.timeOfDay === 'anytime');

    const sections = [];
    if (morning.length > 0) sections.push({ title: 'Morning', icon: 'sunny-outline', data: morning });
    if (afternoon.length > 0) sections.push({ title: 'Afternoon', icon: 'partly-sunny-outline', data: afternoon });
    if (evening.length > 0) sections.push({ title: 'Evening', icon: 'moon-outline', data: evening });
    if (night.length > 0) sections.push({ title: 'Night', icon: 'bed-outline', data: night });
    if (anytime.length > 0) sections.push({ title: 'Anytime', icon: 'infinite-outline', data: anytime });

    return sections;
  }, [habits]);

  const onRefresh = useCallback(() => {
    dispatch(fetchHabits(true));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchHabits(false));
  }, [dispatch]);

  // useMemo - avoid recalculating active count on every render
  const activeHabitsCount = useMemo(() => 
    habits.filter(h => h.status === 'active').length, 
  [habits]);

  // useCallback - keep function reference stable to avoid re-rendering children (HabitCard)
  const handleHabitPress = useCallback((habit: Habit) => {
    navigation.navigate(ROUTES.HABIT_DETAILS, { habit });
  }, [navigation]);

  // Bottom Sheet State
  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = React.useState<Habit | null>(null);
  const [reflectionNote, setReflectionNote] = React.useState('');

  const handleActionPress = useCallback((habit: Habit) => {
    setSelectedHabitForNote(habit);
    const existingCompletion = habit.completions.find(c => c.date === selectedDate);
    setReflectionNote(existingCompletion?.note || '');
    setIsBottomSheetVisible(true);
  }, [selectedDate]);

  const handleSaveReflection = () => {
    if (!selectedHabitForNote) return;

    const updatedCompletions = [...selectedHabitForNote.completions];
    const todayIndex = updatedCompletions.findIndex(c => c.date === selectedDate);

    if (todayIndex > -1) {
      updatedCompletions[todayIndex] = { ...updatedCompletions[todayIndex], note: reflectionNote };
    } else {
      updatedCompletions.push({ date: selectedDate, note: reflectionNote });
    }

    const updatedHabit = {
      ...selectedHabitForNote,
      completions: updatedCompletions,
    };

    dispatch(updateHabit(updatedHabit));
    setIsBottomSheetVisible(false);
    setSelectedHabitForNote(null);
    setReflectionNote('');
  };

  // Stable render function for FlatList
  const renderHabitItem = useCallback(({ item }: { item: Habit }) => (
    <HabitCard 
      item={item} 
      onPress={handleHabitPress} 
      onActionPress={handleActionPress}
      selectedDate={selectedDate} 
    />
  ), [handleHabitPress, handleActionPress, selectedDate]);

  const renderSectionHeader = useCallback(({ section: { title, icon } }: any) => (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={18} color={colors.textSecondary} style={styles.sectionHeaderIcon} />
      <AppText style={[styles.sectionHeaderText, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </AppText>
    </View>
  ), [colors, styles]);

  // Date Picker state
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    
    // Only update if the user actually selected a date (type 'set' on Android, change on iOS)
    if (event.type === 'set' && date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    } else if (Platform.OS === 'ios' && date) {
      // iOS spinner updates continuously
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.themedContainer]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader 
        title="My Habits" 
        alignLeft
        titleStyle={[styles.headerTitle, { color: colors.textPrimary }]}
        rightElement={
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.dashboardIconButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.statsButton, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="stats-chart" size={16} color={colors.primary} />
              <AppText style={[styles.statsButtonText, { color: colors.primary }]}>Stats</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.createButtonBox, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate(ROUTES.HABIT_FORM, {})}
            >
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        }
      />
      
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <AppText style={[styles.welcomeText, { color: colors.textPrimary }]}>
            Keep up the good work! 👋
          </AppText>
          <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
            You have {activeHabitsCount} active habits today.
          </AppText>
        </View>

        <SectionList
          sections={habitSections}
          extraData={selectedDate}
          ListHeaderComponent={
            <HabitListHeader 
              habits={habits} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHabitItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
              <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No habits found for this day.
              </AppText>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={allHabits.length > 0 && isRefreshing} 
              onRefresh={onRefresh} 
              colors={[colors.primary]} 
              tintColor={colors.primary}
            />
          }
        />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(selectedDate.split('-').map(Number)[0], selectedDate.split('-').map(Number)[1] - 1, selectedDate.split('-').map(Number)[2])}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Reflection Bottom Sheet */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBottomSheetVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsBottomSheetVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHandle} />
              <AppText style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                Today's Reflection
              </AppText>
              <AppText style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>
                {selectedHabitForNote?.title}
              </AppText>
            </View>

            <View style={styles.sheetContent}>
              <TextInput
                style={[
                  styles.sheetInput, 
                  { color: colors.textPrimary }
                ]}
                placeholder="How did it go today? (Optional)"
                placeholderTextColor={colors.textSecondary}
                value={reflectionNote}
                onChangeText={setReflectionNote}
                multiline
                numberOfLines={4}
                autoFocus
              />

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveReflection}
              >
                <AppText style={styles.saveButtonText}>Save Reflection</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
export default HabitsListScreen;

