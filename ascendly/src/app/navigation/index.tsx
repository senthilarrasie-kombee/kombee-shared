import { createStackNavigator } from '@react-navigation/stack';
import { MainStack } from './navigationTypes';
import { NavigationContainer } from '@react-navigation/native';
import Login from '@features/auth/screens/LoginScreen';
import EditProfile from '@features/profile/screens/EditProfileScreen';
import DrawerNavigation from './drawerNavigation';
import HabitDetails from '@features/habits/screens/HabitDetailsScreen';
import { ROUTES } from '@app/routes';

const Stack = createStackNavigator<MainStack>();

const MainStackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.LOGIN}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={ROUTES.LOGIN}
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigation} />
        <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
        <Stack.Screen name={ROUTES.HABIT_DETAILS} component={HabitDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStackNavigation;
