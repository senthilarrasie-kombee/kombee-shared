import React, {useMemo, useState, useCallback} from 'react';
import {View, FlatList, StatusBar, TextInput, TouchableOpacity, Modal, ScrollView, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, FontFamily, FontSize, Spacing} from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import AppButton from '@shared/components/AppButton';
import {useAppSelector, useAppDispatch} from '@store';
import {
  fetchHabits,
  updateHabitAsync,
  setToast,
  updateUserProfileAsync,
} from '@store/reducers/rootSlice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '@app/routes';
import {MainStack} from '@app/navigation/navigationTypes';
import HabitCard from '../components/HabitCard';
import Icon from 'react-native-vector-icons/Ionicons';
import {CATEGORIES_DATA as categoriesData} from '@shared/constants/categories';
import {createAllHabitsStyles} from '../styles/AllHabitsStyles';
import {asyncStorage, ASYNC_STORAGE_KEYS} from '@core/storage';
import {STRINGS} from '@shared/constants/strings';

type NavigationProp = StackNavigationProp<MainStack>;

import {Habit, HabitPriority, HabitStatus, HabitFrequency, HabitTimeOfDay} from '@shared/types/habit';

interface Filters {
  categoryId: string | null;
  priority: HabitPriority | null;
  status: HabitStatus | null;
  frequency: HabitFrequency | null;
  timeOfDay: HabitTimeOfDay | null;
  isOneTime: boolean | null;
  isFavorite: boolean | null;
}

const AllHabitsScreen = () => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createAllHabitsStyles(colors, isDark), [colors, isDark]);
  const allHabits = useAppSelector(state => state.root.habits);
  const isRefreshing = useAppSelector(state => state.root.loading);
  const user = useAppSelector(state => state.root.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categoryId: null,
    priority: null,
    status: null,
    frequency: null,
    timeOfDay: null,
    isOneTime: null,
    isFavorite: null,
  });

  const onRefresh = useCallback(() => {
    dispatch(fetchHabits(true));
  }, [dispatch]);

  React.useEffect(() => {
    if (allHabits.length === 0) {
      dispatch(fetchHabits(false));
    }
    loadSearchHistory();
  }, [dispatch, allHabits.length]);

  const loadSearchHistory = async () => {
    const history = await asyncStorage.getObject<string[]>(ASYNC_STORAGE_KEYS.SEARCH_HISTORY);
    if (history) setRecentSearches(history);
  };

  const saveSearchQuery = async (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newHistory);
    await asyncStorage.setObject(ASYNC_STORAGE_KEYS.SEARCH_HISTORY, newHistory);
  };

  // Bottom Sheet State for Reflections
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = useState<Habit | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  const handleActionPress = useCallback((habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedHabitForNote(habit);
    const existingCompletion = habit.completions.find(c => c.date === today);
    setReflectionNote(existingCompletion?.note || '');
    setIsBottomSheetVisible(true);
  }, []);

  const handleSaveReflection = () => {
    if (!selectedHabitForNote) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedCompletions = [...selectedHabitForNote.completions];
    const todayIndex = updatedCompletions.findIndex(c => c.date === today);

    if (todayIndex > -1) {
      updatedCompletions[todayIndex] = {...updatedCompletions[todayIndex], note: reflectionNote};
    } else {
      updatedCompletions.push({date: today, note: reflectionNote});
    }

    const updatedHabit = {
      ...selectedHabitForNote,
      completions: updatedCompletions,
    };

    dispatch(updateHabitAsync(updatedHabit));

    // Update User Reflection Stats
    dispatch(
      updateUserProfileAsync({
        lastReflectionAt: new Date().toISOString(),
        totalReflections: (user?.totalReflections || 0) + 1,
      })
    );

    setIsBottomSheetVisible(false);
    setSelectedHabitForNote(null);
    setReflectionNote('');
  };

  // Combined search and filter logic
  const filteredHabits = useMemo(() => {
    let result = [...allHabits];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h => h.title.toLowerCase().includes(query) || h.description.toLowerCase().includes(query));
    }

    // Advanced filters
    if (filters.categoryId) {
      result = result.filter(h => h.categoryId === filters.categoryId);
    }
    if (filters.priority) {
      result = result.filter(h => h.priority === filters.priority);
    }
    if (filters.status) {
      result = result.filter(h => h.status === filters.status);
    }
    if (filters.frequency) {
      result = result.filter(h => h.frequency === filters.frequency);
    }
    if (filters.timeOfDay) {
      result = result.filter(h => h.timeOfDay === filters.timeOfDay);
    }
    if (filters.isOneTime !== null) {
      result = result.filter(h => h.isOneTime === filters.isOneTime);
    }
    if (filters.isFavorite !== null) {
      result = result.filter(h => h.isFavorite === filters.isFavorite);
    }

    // Sort by createdDate (latest first)
    return result.sort((a, b) => {
      const dateA = new Date(a.createdDate || '2000-01-01').getTime();
      const dateB = new Date(b.createdDate || '2000-01-01').getTime();
      return dateB - dateA;
    });
  }, [allHabits, searchQuery, filters]);

  const resetFilters = () => {
    setFilters({
      categoryId: null,
      priority: null,
      status: null,
      frequency: null,
      timeOfDay: null,
      isOneTime: null,
      isFavorite: null,
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  const renderHabitItem = useCallback(
    ({item}: {item: Habit}) => (
      <HabitCard
        item={item}
        onPress={h => navigation.navigate(ROUTES.HABIT_DETAILS, {habit: h})}
        onActionPress={handleActionPress}
        selectedDate={new Date().toISOString().split('T')[0]}
        showAction={true}
      />
    ),
    [handleActionPress, navigation]
  );

  const FilterChip = ({label, isSelected, onPress}: {label: string; isSelected: boolean; onPress: () => void}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : isDark ? '#2A2A35' : '#F0F0F5',
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}>
      <AppText style={[styles.chipText, {color: isSelected ? 'white' : colors.textSecondary}]}>{label}</AppText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F2F2F7'}]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader
        title={STRINGS.HABITS.ALL_TITLE}
        showBack={false}
        leftElement={
          <TouchableOpacity
            style={[
              styles.headerButton,
              {backgroundColor: activeFilterCount > 0 ? colors.primary + '20' : 'transparent'},
            ]}
            onPress={() => setIsFilterModalVisible(true)}>
            <Icon
              name="options-outline"
              size={24}
              color={activeFilterCount > 0 ? colors.primary : colors.textPrimary}
            />
            {activeFilterCount > 0 && (
              <View style={[styles.filterBadge, {backgroundColor: colors.primary}]}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            )}
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity style={styles.headerButton} onPress={onRefresh} disabled={isRefreshing}>
            <Icon name="refresh-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View
            style={[styles.searchBar, {backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border}]}>
            <Icon name="search-outline" size={20} color={colors.textSecondary} style={{marginRight: 10}} />
            <TextInput
              placeholder={STRINGS.HABITS.ALL_HABITS.SEARCH_PLACEHOLDER}
              placeholderTextColor={colors.textSecondary + '80'}
              style={[styles.searchInput, {color: colors.textPrimary}]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => saveSearchQuery(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.resultsHeader}>
            <AppText style={[styles.resultsCount, {color: colors.textSecondary}]}>
              {STRINGS.HABITS.ALL_HABITS.RESULTS_COUNT(filteredHabits.length)}
            </AppText>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={resetFilters}>
                <AppText style={{color: colors.primary, fontFamily: FontFamily.semiBold, fontSize: 12}}>
                  {STRINGS.HABITS.ALL_HABITS.CLEAR_FILTERS}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredHabits}
          keyExtractor={item => item.id.toString()}
          renderItem={renderHabitItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search-outline" size={60} color={colors.textSecondary} />
              <AppText style={[styles.emptyText, {color: colors.textSecondary}]}>
                {allHabits.length === 0
                  ? STRINGS.HABITS.ALL_HABITS.EMPTY_ALL
                  : STRINGS.HABITS.ALL_HABITS.EMPTY_SEARCH}
              </AppText>
              {allHabits.length === 0 ? (
                <View style={{marginTop: 24, width: '100%'}}>
                  <AppButton
                    title={STRINGS.HABITS.ALL_HABITS.CREATE_NEW}
                    onPress={() => navigation.navigate(ROUTES.HABIT_FORM, {habit: undefined})}
                  />
                </View>
              ) : (
                activeFilterCount > 0 && (
                  <TouchableOpacity onPress={resetFilters} style={{marginTop: 12}}>
                    <AppText style={{color: colors.primary, fontFamily: FontFamily.semiBold}}>
                      {STRINGS.HABITS.ALL_HABITS.CLEAR_FILTERS.toLowerCase()}
                    </AppText>
                  </TouchableOpacity>
                )
              )}
            </View>
          }
        />
      </View>

      {/* Filter Bottom Sheet */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setIsFilterModalVisible(false)}
          />
          <View style={[styles.modalContent, {backgroundColor: isDark ? '#1C1C27' : '#FFFFFF'}]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <AppText style={[styles.modalTitle, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.FILTER_TITLE}</AppText>
                <TouchableOpacity onPress={resetFilters}>
                  <AppText style={{color: colors.primary, fontFamily: FontFamily.semiBold}}>{STRINGS.HABITS.ALL_HABITS.RESET}</AppText>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.CATEGORY}</AppText>
                <View style={styles.chipContainer}>
                  {categoriesData.map(cat => (
                    <FilterChip
                      key={cat.id}
                      label={cat.name}
                      isSelected={filters.categoryId === cat.id}
                      onPress={() =>
                        setFilters(prev => ({...prev, categoryId: prev.categoryId === cat.id ? null : cat.id}))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Priority Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.PRIORITY}</AppText>
                <View style={styles.chipContainer}>
                  {['low', 'medium', 'high'].map(p => (
                    <FilterChip
                      key={p}
                      label={STRINGS.HABITS.LABELS[p.toUpperCase() as keyof typeof STRINGS.HABITS.LABELS]}
                      isSelected={filters.priority === p}
                      onPress={() =>
                        setFilters(prev => ({...prev, priority: prev.priority === p ? null : (p as HabitPriority)}))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Status Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.LABELS.STATUS}</AppText>
                <View style={styles.chipContainer}>
                  {['active', 'paused', 'completed'].map(s => (
                    <FilterChip
                      key={s}
                      label={STRINGS.HABITS.LABELS[s.toUpperCase() as keyof typeof STRINGS.HABITS.LABELS]}
                      isSelected={filters.status === s}
                      onPress={() =>
                        setFilters(prev => ({...prev, status: prev.status === s ? null : (s as HabitStatus)}))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Frequency Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.FREQUENCY}</AppText>
                <View style={styles.chipContainer}>
                  {['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly', 'custom'].map(f => (
                    <FilterChip
                      key={f}
                      label={STRINGS.HABITS.FORM.LABELS.FREQUENCY[f.toUpperCase().replace('-', '_') as keyof typeof STRINGS.HABITS.FORM.LABELS.FREQUENCY] || f}
                      isSelected={filters.frequency === f}
                      onPress={() =>
                        setFilters(prev => ({...prev, frequency: prev.frequency === f ? null : (f as HabitFrequency)}))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Time of Day Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.TIME_OF_DAY}</AppText>
                <View style={styles.chipContainer}>
                  {['morning', 'afternoon', 'evening', 'night', 'anytime'].map(t => (
                    <FilterChip
                      key={t}
                      label={STRINGS.HABITS.FORM.LABELS.TIME_OF_DAY[t.toUpperCase() as keyof typeof STRINGS.HABITS.FORM.LABELS.TIME_OF_DAY]}
                      isSelected={filters.timeOfDay === t}
                      onPress={() =>
                        setFilters(prev => ({...prev, timeOfDay: prev.timeOfDay === t ? null : (t as HabitTimeOfDay)}))
                      }
                    />
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, {color: colors.textPrimary}]}>{STRINGS.HABITS.ALL_HABITS.PREFERENCES}</AppText>
                <View style={{paddingBottom: 40}}>
                  <View style={styles.chipContainer}>
                    <FilterChip
                      label={STRINGS.HABITS.ALL_HABITS.ONE_TIME_TASK}
                      isSelected={filters.isOneTime === true}
                      onPress={() => setFilters(prev => ({...prev, isOneTime: prev.isOneTime === true ? null : true}))}
                    />
                    <FilterChip
                      label={STRINGS.HABITS.ALL_HABITS.RECURRING_HABIT}
                      isSelected={filters.isOneTime === false}
                      onPress={() =>
                        setFilters(prev => ({...prev, isOneTime: prev.isOneTime === false ? null : false}))
                      }
                    />
                    <FilterChip
                      label={STRINGS.HABITS.ALL_HABITS.FAVORITES}
                      isSelected={filters.isFavorite === true}
                      onPress={() =>
                        setFilters(prev => ({...prev, isFavorite: prev.isFavorite === true ? null : true}))
                      }
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, {borderTopColor: colors.border}]}>
              <AppButton
                title={STRINGS.HABITS.ALL_HABITS.SHOW_RESULTS(filteredHabits.length)}
                onPress={() => setIsFilterModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Reflection Bottom Sheet */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBottomSheetVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsBottomSheetVisible(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHandle} />
              <AppText style={[styles.sheetTitle, {color: colors.textPrimary}]}>{STRINGS.HABITS.LIST.REFLECTION_TITLE}</AppText>
              <AppText style={[styles.sheetSubtitle, {color: colors.textSecondary}]}>
                {selectedHabitForNote?.title}
              </AppText>
            </View>

            <View style={styles.sheetContent}>
              <TextInput
                style={[
                  styles.sheetInput,
                  {color: colors.textPrimary, backgroundColor: isDark ? '#2D2D3A' : '#F1F5F9'},
                ]}
                placeholder={STRINGS.HABITS.LIST.REFLECTION_PLACEHOLDER}
                placeholderTextColor={colors.textSecondary}
                value={reflectionNote}
                onChangeText={setReflectionNote}
                multiline
                numberOfLines={4}
                autoFocus
              />

              <TouchableOpacity
                style={[styles.saveButton, {backgroundColor: colors.primary}]}
                onPress={handleSaveReflection}>
                <AppText style={styles.saveButtonText}>{STRINGS.HABITS.LIST.SAVE_REFLECTION}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
export default AllHabitsScreen;
