import {useState, useEffect, useMemo, useCallback} from 'react';
import {useAppSelector, useAppDispatch} from '@store';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStack} from '@app/navigation/navigationTypes';
import {useTheme} from '@shared/theme';
import {
  fetchHabits,
  updateHabitAsync,
  updateUserProfileAsync,
} from '@store/reducers/rootSlice';
import {Habit, HabitPriority, HabitStatus, HabitFrequency, HabitTimeOfDay} from '@shared/types/habit';
import {asyncStorage, ASYNC_STORAGE_KEYS} from '@core/storage';
import {createAllHabitsStyles} from '../styles/AllHabitsStyles';

type NavigationProp = StackNavigationProp<MainStack>;

export interface Filters {
  categoryId: string | null;
  priority: HabitPriority | null;
  status: HabitStatus | null;
  frequency: HabitFrequency | null;
  timeOfDay: HabitTimeOfDay | null;
  isOneTime: boolean | null;
  isFavorite: boolean | null;
}

export const useAllHabits = () => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createAllHabitsStyles(colors, isDark), [colors, isDark]);
  
  const allHabits = useAppSelector(state => state.root.habits);
  const isRefreshing = useAppSelector(state => state.root.loading);
  const user = useAppSelector(state => state.root.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  // Bottom Sheet State for Reflections
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = useState<Habit | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  const onRefresh = useCallback(() => {
    dispatch(fetchHabits(true));
  }, [dispatch]);

  useEffect(() => {
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

  const clearSearchHistory = async () => {
    setRecentSearches([]);
    await asyncStorage.removeItem(ASYNC_STORAGE_KEYS.SEARCH_HISTORY);
  };

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

  const filteredHabits = useMemo(() => {
    let result = [...allHabits];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.title.toLowerCase().includes(query) || 
        h.description.toLowerCase().includes(query) ||
        h.goal?.toLowerCase().includes(query)
      );
    }

    if (filters.categoryId) result = result.filter(h => h.categoryId === filters.categoryId);
    if (filters.priority) result = result.filter(h => h.priority === filters.priority);
    if (filters.status) result = result.filter(h => h.status === filters.status);
    if (filters.frequency) result = result.filter(h => h.frequency === filters.frequency);
    if (filters.timeOfDay) result = result.filter(h => h.timeOfDay === filters.timeOfDay);
    if (filters.isOneTime !== null) result = result.filter(h => h.isOneTime === filters.isOneTime);
    if (filters.isFavorite !== null) result = result.filter(h => h.isFavorite === filters.isFavorite);

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

  return {
    colors,
    isDark,
    styles,
    navigation,
    allHabits,
    filteredHabits,
    isRefreshing,
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    recentSearches,
    saveSearchQuery,
    clearSearchHistory,
    isFilterModalVisible,
    setIsFilterModalVisible,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    onRefresh,
    handleActionPress,
    isBottomSheetVisible,
    setIsBottomSheetVisible,
    selectedHabitForNote,
    reflectionNote,
    setReflectionNote,
    handleSaveReflection,
  };
};
