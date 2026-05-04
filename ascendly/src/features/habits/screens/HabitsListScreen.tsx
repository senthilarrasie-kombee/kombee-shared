import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
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

type NavigationProp = StackNavigationProp<MainStack>;

const HabitsListScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const habits = habitsData as Habit[];

  const handleHabitPress = (habit: Habit) => {
    navigation.navigate(ROUTES.HABIT_DETAILS, { habit });
  };

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const isActive = item.status === 'active';

    return (
      <TouchableOpacity 
        style={[
          styles.habitCard, 
          { 
            backgroundColor: isDark ? '#1E1E26' : '#FFFFFF',
            shadowColor: colors.primary,
          }
        ]}
        activeOpacity={0.7}
        onPress={() => handleHabitPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <AppText style={[styles.habitTitle, { color: colors.textPrimary }]}>
              {item.title}
            </AppText>
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
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </AppText>
            </View>
          </View>
          <View style={styles.streakContainer}>
            <Icon name="flame" size={18} color="#FF5722" />
            <AppText style={styles.streakText}>{item.streak}</AppText>
          </View>
        </View>

        <AppText style={[styles.description, { color: colors.textSecondary }]}>
          {item.description}
        </AppText>

        <View style={styles.cardFooter}>
          <View style={styles.targetDaysContainer}>
            <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
            <AppText style={[styles.targetDaysText, { color: colors.textSecondary }]}>
              {item.daysTarget.join(', ')}
            </AppText>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Icon name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          You have {habits.filter(h => h.status === 'active').length} active habits today.
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
  habitCard: {
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  habitTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    marginLeft: 4,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#FF5722',
  },
  description: {
    fontSize: FontSize.sm,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDaysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  targetDaysText: {
    fontSize: FontSize.xs,
    marginLeft: 6,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButton: {
    padding: 4,
  },
});

export default HabitsListScreen;

