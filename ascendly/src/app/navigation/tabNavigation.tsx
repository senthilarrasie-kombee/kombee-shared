import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome6';
import {MainStack} from './navigationTypes';
import Login from '@features/auth/screens/LoginScreen';
import Dashboard from '@features/dashboard/screens/DashboardScreen';
import HabitsList from '@features/habits/screens/HabitsListScreen';
import AllHabits from '@features/habits/screens/AllHabitsScreen';
import Profile from '@features/profile/screens/ProfileScreen';
import {ROUTES} from '@app/routes';

import {STRINGS} from '@shared/constants/strings';

const Tab = createBottomTabNavigator<MainStack>();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name={ROUTES.DASHBOARD}
        component={Dashboard}
        options={{
          title: STRINGS.NAV.HOME,
          tabBarIcon: ({color, size}) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.HABITS_LISTING}
        component={HabitsList}
        options={{
          title: STRINGS.NAV.TODAY,
          tabBarIcon: ({color, size}) => <MIcon name="bullseye-arrow" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.ALL_HABITS}
        component={AllHabits}
        options={{
          title: STRINGS.NAV.HABITS,
          tabBarIcon: ({color, size}) => <FAIcon name="person-running" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.ACCOUNT}
        component={Profile}
        options={{
          title: STRINGS.NAV.ACCOUNT,
          tabBarIcon: ({color, size}) => <Icon name="person-circle-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigation;
