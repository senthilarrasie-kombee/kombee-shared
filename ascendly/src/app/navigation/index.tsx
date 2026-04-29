import { createStackNavigator } from '@react-navigation/stack';
import { MainStack } from './navigationTypes';
import { NavigationContainer } from '@react-navigation/native';
import Login from '@features/auth/screens/LoginScreen';
import TabNavigation from './tabNavigation';
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
        <Stack.Screen name={ROUTES.MAIN_TAB} component={TabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStackNavigation;
