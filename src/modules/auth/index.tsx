import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './landingPage/LandingPage';
import Login from './login/Login';
import UserType from './registration/userType/UserType';
import Tenant from './registration/tenant/Tenant';
import Welcome from './welcome/Welcome';

const Stack = createNativeStackNavigator();

const AuthRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F7F7F7' },
        headerBackImageSource: require('assets/arrowback.png'),
        headerShadowVisible: false,
        headerTitle: () => '',
      }}
    >
      <Stack.Screen name='landingPage' component={LandingPage}></Stack.Screen>
      <Stack.Screen name='login' component={Login}></Stack.Screen>
      <Stack.Screen name='userType' component={UserType}></Stack.Screen>
      <Stack.Screen name='tenant' component={Tenant}></Stack.Screen>
      <Stack.Screen name='welcome' component={Welcome}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthRoutes;
