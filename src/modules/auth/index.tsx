import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './landingPage/LandingPage';
import Login from './login/Login';
import UserType from './registration/userType/UserType';
import Tenant from './registration/tenant/Tenant';
import Welcome from './welcome/Welcome';
import { Image, TouchableOpacity, View } from 'react-native';
import Patient from './registration/patient/Patient';

const Stack = createNativeStackNavigator();

const AuthRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F7F7F7' },
        headerBackImageSource: require('assets/arrowback.png'),
        headerShadowVisible: false,
        header: (bottomTabsProps) => {
          return (
            <View className='w-full py-8 pl-4 flex flex-row justify-between items-center bg-primary'>
              {bottomTabsProps.navigation.canGoBack() ? (
                <TouchableOpacity
                  onPress={() => {
                    bottomTabsProps.navigation.goBack();
                  }}
                >
                  <Image source={require('assets/arrowback.png')} />
                </TouchableOpacity>
              ) : (
                <Image></Image>
              )}
            </View>
          );
        },
      }}
    >
      <Stack.Screen name='landingPage' component={LandingPage}></Stack.Screen>
      <Stack.Screen name='login' component={Login}></Stack.Screen>
      <Stack.Screen name='userType' component={UserType}></Stack.Screen>
      <Stack.Screen name='tenant' component={Tenant}></Stack.Screen>
      <Stack.Screen name='patient' component={Patient}></Stack.Screen>
      <Stack.Screen name='welcome' component={Welcome}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthRoutes;
