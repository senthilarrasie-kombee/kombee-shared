import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainStack } from './navigationTypes';
import Login from '@/features/login';
import Dashboard from '@/features/dashboard';
import HabitsList from '@/features/habits/presentation/screens/HabitsList';
import Profile from '@/features/profile/presentation/screens/Profile';
import Settings from '@/features/settings/presentation/screens/Settings';
import { ROUTES } from '@/constants/routes';

const Tab = createBottomTabNavigator<MainStack>();

const TabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Tab.Screen 
                name={ROUTES.DASHBOARD} 
                component={Dashboard} 
                options={{ 
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />
                }} 
            />
            <Tab.Screen 
                name={ROUTES.HABITS_LISTING} 
                component={HabitsList} 
                options={{ 
                    title: "Habits",
                    tabBarIcon: ({ color, size }) => <Icon name="checkmark-circle-outline" color={color} size={size} />
                }} 
            />
            <Tab.Screen 
                name={ROUTES.PROFILE} 
                component={Profile} 
                options={{ 
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Icon name="person-outline" color={color} size={size} />
                }} 
            />
            <Tab.Screen 
                name={ROUTES.SETTINGS} 
                component={Settings} 
                options={{ 
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => <Icon name="settings-outline" color={color} size={size} />
                }} 
            />
        </Tab.Navigator>
    );
}
export default TabNavigation;
