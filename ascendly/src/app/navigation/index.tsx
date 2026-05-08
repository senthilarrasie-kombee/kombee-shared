import {createStackNavigator} from '@react-navigation/stack';
import {MainStack} from './navigationTypes';
import {NavigationContainer} from '@react-navigation/native';
import Login from '@features/auth/screens/LoginScreen';
import EditProfile from '@features/profile/screens/EditProfileScreen';
import DrawerNavigation from './drawerNavigation';
import HabitDetails from '@features/habits/screens/HabitDetailsScreen';
import HabitForm from '@features/habits/screens/HabitFormScreen';
import {AxiosExampleScreen, AxiosPokemonScreen, AxiosProductsScreen, AxiosWeatherScreen} from '@features/dashboard';
import {ROUTES} from '@app/routes';
import {navigationRef} from './navigationService';
import {getInitialRoute} from '@shared/utils/sessionUtils';

const Stack = createStackNavigator<MainStack>();

const MainStackNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={getInitialRoute()} screenOptions={{headerShown: false}}>
        <Stack.Screen name={ROUTES.LOGIN} component={Login} options={{headerShown: false}} />
        <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigation} />
        <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
        <Stack.Screen name={ROUTES.HABIT_DETAILS} component={HabitDetails} />
        <Stack.Screen name={ROUTES.HABIT_FORM} component={HabitForm} />
        <Stack.Screen name={ROUTES.AXIOS_EXAMPLE} component={AxiosExampleScreen} />
        <Stack.Screen name={ROUTES.AXIOS_POKEMON} component={AxiosPokemonScreen} />
        <Stack.Screen name={ROUTES.AXIOS_PRODUCTS} component={AxiosProductsScreen} />
        <Stack.Screen name={ROUTES.AXIOS_WEATHER} component={AxiosWeatherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStackNavigation;
