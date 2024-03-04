import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './landingPage/LandingPage';
import Login from './login/Login';
import UserType from './userType/UserType';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='landingPage' component={LandingPage}></Stack.Screen>
      <Stack.Screen name='login' component={Login}></Stack.Screen>
      <Stack.Screen name='userType' component={UserType}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Routes;
