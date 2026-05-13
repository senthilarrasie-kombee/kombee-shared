import React, {useCallback} from 'react';
import {View, FlatList, StatusBar, TextInput, TouchableOpacity, Modal, ScrollView, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontFamily} from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import AppButton from '@shared/components/AppButton';
import {ROUTES} from '@app/routes';
import HabitCard from '../components/HabitCard';
import Icon from 'react-native-vector-icons/Ionicons';
import {CATEGORIES_DATA as categoriesData} from '@shared/constants/categories';
import {STRINGS} from '@shared/constants/strings';

import {Habit, HabitPriority, HabitStatus, HabitFrequency, HabitTimeOfDay} from '@shared/types/habit';

import {useAllHabits, Filters} from '../hooks/useAllHabits';

const AllHabitsScreen = () => {
  const {
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
  } = useAllHabits();

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
            style={[styles.searchBar, {backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: isSearchFocused ? colors.primary : colors.border}]}>
            <Icon name="search-outline" size={20} color={isSearchFocused ? colors.primary : colors.textSecondary} style={{marginRight: 10}} />
            <TextInput
              placeholder={STRINGS.HABITS.ALL_HABITS.SEARCH_PLACEHOLDER}
              placeholderTextColor={colors.textSecondary + '80'}
              style={[styles.searchInput, {color: colors.textPrimary}]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Delay blur to allow clicking on recent search item
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              onSubmitEditing={() => saveSearchQuery(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          {isSearchFocused && searchQuery.length === 0 && recentSearches.length > 0 && (
            <View style={[styles.recentSearchesContainer, {backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border}]}>
              <View style={styles.recentSearchesHeader}>
                <AppText style={styles.recentSearchesTitle}>Recent Searches</AppText>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <AppText style={{color: colors.primary, fontSize: 12}}>Clear</AppText>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentSearchItem}
                  onPress={() => {
                    setSearchQuery(item);
                    setIsSearchFocused(false);
                  }}
                >
                  <Icon name="time-outline" size={16} color={colors.textSecondary} style={{marginRight: 10}} />
                  <AppText style={{color: colors.textPrimary}}>{item}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
