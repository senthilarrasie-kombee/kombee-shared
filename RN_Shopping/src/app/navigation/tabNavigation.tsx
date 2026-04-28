import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStack } from './navigationTypes';
import Login from '@/features/login';
import Dashboard from '@/features/dashboard';
import ProductsListing from '@/features/products_listing';
import { ROUTES } from '@/constants/routes';

const Tab = createBottomTabNavigator<MainStack>();

const TabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Tab.Screen name={ROUTES.DASHBOARD} component={Dashboard} options={{ headerTitle: "Home" }} />
            <Tab.Screen name={ROUTES.PRODUCTS_LISTING} component={ProductsListing} options={{ headerTitle: "Products" }} />
        </Tab.Navigator>
    );
}
export default TabNavigation;
