import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainStack } from './navigationTypes';
import { ROUTES } from '@app/routes';
import TabNavigation from './tabNavigation';
import HabitsList from '@features/habits/screens/HabitsListScreen';
import AllHabits from '@features/habits/screens/AllHabitsScreen';
import Profile from '@features/profile/screens/ProfileScreen';
import { useTheme } from '@shared/theme';

const Drawer = createDrawerNavigator<MainStack>();

const DrawerNavigation = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primary + '15',
        drawerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name={ROUTES.HOME}
        component={TabNavigation}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={ROUTES.ACCOUNT}
        component={Profile}
        options={{
          drawerLabel: 'Account',
          drawerIcon: ({ color, size }) => (
            <Icon name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={ROUTES.ALL_HABITS}
        component={AllHabits}
        options={{
          drawerLabel: 'History',
          drawerIcon: ({ color, size }) => (
            <Icon name="list-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
