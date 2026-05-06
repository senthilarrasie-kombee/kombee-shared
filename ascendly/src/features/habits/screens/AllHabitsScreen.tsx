import React, { useMemo, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, FontFamily, FontSize, Spacing } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import AppButton from '@shared/components/AppButton';
import { useAppSelector, useAppDispatch } from '@store';
import { fetchHabits } from '@store/reducers/rootSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ROUTES } from '@app/routes';
import { MainStack } from '@app/navigation/navigationTypes';
import HabitCard from '../components/HabitCard';
import { Habit } from '../types/habit';
import Icon from 'react-native-vector-icons/Ionicons';
import categoriesData from '../data/categories.json';

type NavigationProp = StackNavigationProp<MainStack>;

interface Filters {
  categoryId: string | null;
  priority: string | null;
  status: string | null;
  isOneTime: boolean | null;
}

const AllHabitsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const allHabits = useAppSelector((state) => state.root.habits);
  const isRefreshing = useAppSelector((state) => state.root.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categoryId: null,
    priority: null,
    status: null,
    isOneTime: null,
  });

  const onRefresh = useCallback(() => {
    dispatch(fetchHabits(true));
  }, [dispatch]);

  // Combined search and filter logic
  const filteredHabits = useMemo(() => {
    let result = [...allHabits];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.title.toLowerCase().includes(query) || 
        h.description.toLowerCase().includes(query)
      );
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
    if (filters.isOneTime !== null) {
      result = result.filter(h => h.isOneTime === filters.isOneTime);
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
      isOneTime: null,
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <HabitCard 
      item={item} 
      onPress={(h) => navigation.navigate(ROUTES.HABIT_DETAILS, { habit: h })}
      selectedDate={new Date().toISOString().split('T')[0]}
      showAction={false}
    />
  );

  const FilterChip = ({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.chip, 
        { 
          backgroundColor: isSelected ? colors.primary : (isDark ? '#2A2A35' : '#F0F0F5'),
          borderColor: isSelected ? colors.primary : colors.border
        }
      ]}
    >
      <AppText style={[styles.chipText, { color: isSelected ? 'white' : colors.textSecondary }]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F2F2F7' }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader 
        title="Habits" 
        showBack={false}
        leftElement={
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: activeFilterCount > 0 ? colors.primary + '20' : 'transparent' }]}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Icon name="options-outline" size={24} color={activeFilterCount > 0 ? colors.primary : colors.textPrimary} />
            {activeFilterCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            )}
          </TouchableOpacity>
        }
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border }]}>
            <Icon name="search-outline" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search habits..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.resultsHeader}>
            <AppText style={[styles.resultsCount, { color: colors.textSecondary }]}>
              Found {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}
            </AppText>
          </View>
        </View>

        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id.toString()}
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
              <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>
                {allHabits.length === 0 ? "No habits created yet." : "No habits match your filters."}
              </AppText>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={resetFilters} style={{ marginTop: 12 }}>
                  <AppText style={{ color: colors.primary, fontFamily: FontFamily.semiBold }}>Clear all filters</AppText>
                </TouchableOpacity>
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
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setIsFilterModalVisible(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <AppText style={[styles.modalTitle, { color: colors.textPrimary }]}>Filters</AppText>
                <TouchableOpacity onPress={resetFilters}>
                  <AppText style={{ color: colors.primary, fontFamily: FontFamily.semiBold }}>Reset</AppText>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, { color: colors.textPrimary }]}>Category</AppText>
                <View style={styles.chipContainer}>
                  {categoriesData.map(cat => (
                    <FilterChip 
                      key={cat.id}
                      label={cat.name}
                      isSelected={filters.categoryId === cat.id}
                      onPress={() => setFilters(prev => ({ ...prev, categoryId: prev.categoryId === cat.id ? null : cat.id }))}
                    />
                  ))}
                </View>
              </View>

              {/* Priority Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, { color: colors.textPrimary }]}>Priority</AppText>
                <View style={styles.chipContainer}>
                  {['low', 'medium', 'high'].map(p => (
                    <FilterChip 
                      key={p}
                      label={p.charAt(0).toUpperCase() + p.slice(1)}
                      isSelected={filters.priority === p}
                      onPress={() => setFilters(prev => ({ ...prev, priority: prev.priority === p ? null : p }))}
                    />
                  ))}
                </View>
              </View>

              {/* Status Filter */}
              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, { color: colors.textPrimary }]}>Status</AppText>
                <View style={styles.chipContainer}>
                  {['active', 'inactive'].map(s => (
                    <FilterChip 
                      key={s}
                      label={s.charAt(0).toUpperCase() + s.slice(1)}
                      isSelected={filters.status === s}
                      onPress={() => setFilters(prev => ({ ...prev, status: prev.status === s ? null : s }))}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <AppText style={[styles.filterLabel, { color: colors.textPrimary }]}>Type</AppText>
                <View style={{ paddingBottom: 40 }}>
                  <View style={styles.chipContainer}>
                    <FilterChip 
                      label="One-time Task"
                      isSelected={filters.isOneTime === true}
                      onPress={() => setFilters(prev => ({ ...prev, isOneTime: prev.isOneTime === true ? null : true }))}
                    />
                    <FilterChip 
                      label="Recurring Habit"
                      isSelected={filters.isOneTime === false}
                      onPress={() => setFilters(prev => ({ ...prev, isOneTime: prev.isOneTime === false ? null : false }))}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <AppButton 
                title={`Show ${filteredHabits.length} results`}
                onPress={() => setIsFilterModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 8,
    fontFamily: FontFamily.semiBold,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    paddingVertical: 8,
  },
  resultsHeader: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  listContent: {
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FontFamily.display,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    paddingBottom: 40,
  },
});

export default AllHabitsScreen;
