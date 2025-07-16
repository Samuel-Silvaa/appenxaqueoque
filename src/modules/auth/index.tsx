import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './landingPage/LandingPage';
import Login from './login/Login';
import UserType from './registration/userType/UserType';
import Tenant from './registration/tenant/Tenant';
import Welcome from './welcome/Welcome';
import { Image, TouchableOpacity, View } from 'react-native';
import Patient from './registration/patient/Patient';
import SendEmailConfirmation from './emailConfirmation/SendEmailConfirmation';
import ConfirmEmail from './emailConfirmation/ConfirmEmail';
import AvatarSelection from './registration/avatar/AvatarSelection';

const Stack = createNativeStackNavigator();

const AuthRoutes = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F7F7F7' },
        headerBackImageSource: require('src/assets/arrowback.png'),
        headerShadowVisible: false,
        header: (bottomTabsProps) => {
          return (
            <View className='w-full py-8 pl-4 flex flex-row justify-between items-center bg-primary dark:bg-d-blue-primary-dark'>
              {bottomTabsProps.navigation.canGoBack() ? (
                <TouchableOpacity
                  className='p-3'
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => {
                    bottomTabsProps.navigation.goBack();
                  }}
                >
                  <Image source={require('src/assets/arrowback.png')} />
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
      <Stack.Screen name='sendEmailConfirmation' component={SendEmailConfirmation}></Stack.Screen>
      <Stack.Screen name='confirmEmail' component={ConfirmEmail}></Stack.Screen>
      <Stack.Screen name='avatarSelection' component={AvatarSelection}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthRoutes;
