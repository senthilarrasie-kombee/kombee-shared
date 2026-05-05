import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, FontFamily, FontSize, Spacing } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import { ROUTES } from '@app/routes';
import { MainStack } from '@app/navigation/navigationTypes';
import habitsData from '../data/habits.json';
import { Habit } from '../types/habit';
import HabitCard from '../components/HabitCard';

type NavigationProp = StackNavigationProp<MainStack>;

const HabitsListScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // useMemo - memoize the habits list
  const habits = useMemo(() => habitsData as Habit[], []);

  // useMemo - avoid recalculating active count on every render
  const activeHabitsCount = useMemo(() => 
    habits.filter(h => h.status === 'active').length, 
  [habits]);

  // useCallback - keep function reference stable to avoid re-rendering children (HabitCard)
  const handleHabitPress = useCallback((habit: Habit) => {
    navigation.navigate(ROUTES.HABIT_DETAILS, { habit });
  }, [navigation]);

  // Stable render function for FlatList
  const renderHabitItem = useCallback(({ item }: { item: Habit }) => (
    <HabitCard item={item} onPress={handleHabitPress} />
  ), [handleHabitPress]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader 
        title="My Habits" 
        rightElement={
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.content}>
        <AppText style={styles.welcomeText}>
          Keep up the good work! 👋
        </AppText>
        <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
          You have {activeHabitsCount} active habits today.
        </AppText>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHabitItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.semiBold,
    marginTop: 10,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: 4,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  separator: {
    height: 16,
  },
  headerIconButton: {
    padding: 4,
  },
});

export default HabitsListScreen;

