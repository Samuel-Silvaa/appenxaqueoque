import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import Profile from './Profile';
import PrivacyPolicy from './privacy/PrivacyPolicy';
import Terms from './terms/Terms';
import AboutUs from './aboutus/AboutUs';
import Help from './help/Help';
import Patient from './edittion/Patient';
import ResetPassword from './security/ResetPasswprd';

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigation = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        options={screenOptions}
        name='ProfileMain'
        component={Profile}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='PatientLogged'
        component={Patient}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='PrivacyPolicy'
        component={PrivacyPolicy}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='Terms'
        component={Terms}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='ResetPassword'
        component={ResetPassword}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='AboutUs'
        component={AboutUs}
      />
      <ProfileStack.Screen
        options={screenOptions}
        name='Help'
        component={Help}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigation;
