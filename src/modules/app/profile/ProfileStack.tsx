import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import Profile from './Profile';
import PrivacyPolicy from './privacy/PrivacyPolicy';
import Terms from "./terms/Terms";
import AboutUs from "./aboutus/AboutUs";
import Help from "./help/Help";

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigation = () => {
  return (
    <ProfileStack.Navigator >
      <ProfileStack.Screen
        options={{...screenOptions, headerShown: false}}
        name='ProfileMain'
        component={Profile}
      />
      <ProfileStack.Screen
        options={{...screenOptions, headerShown: false}  }
        name='PrivacyPolicy'
        component={PrivacyPolicy}
      />
      <ProfileStack.Screen
        options={{...screenOptions, headerShown: false}  }
        name='Terms'
        component={Terms}
      />
      <ProfileStack.Screen
        
        options={{...screenOptions, headerShown: false, }  }
        name='AboutUs'
        component={AboutUs}
      />
      <ProfileStack.Screen
        options={{...screenOptions, headerShown: false}  }
        name='Help'
        component={Help}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigation; 