import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View } from 'react-native';
import AppHeader from '../shared/components/appHeader/AppHeader';
import { useApp } from 'src/infra/app/app';
import { AppActions } from 'src/infra/app/actions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './home/HomePage';
import PatientPage from './patient/PatientPage';
import ProfilePage from '../app/profile/Profile';

const stylesheet = {
  calendarBtnContainer:
    'bg-blue-secondary rounded-full w-13 h-13 flex items-center justify-center translate-y-[-15px]',
};

const Tab = createBottomTabNavigator();

const PhysicianTabsRoutes = () => {
  const { patient, dispatch, setPageTitle, validateStepForward } = useApp();

  React.useEffect(() => {
    if (!patient) dispatch(AppActions.REQUEST_FETCH_PATIENT, {});
  }, []);

  React.useEffect(() => {
    dispatch(AppActions.REQUEST_FETCH_EPISODES);
  }, []);

  const getHeaderName = (routeIndex: number) => {
    switch (routeIndex) {
      case 1:
        return 'Pacientes';
      case 2:
        return 'Perfil';
      default:
        return '';
    }
  };

  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          validateStepForward(0);
          if (setPageTitle && e.data?.state)
            setPageTitle(getHeaderName(e.data?.state.index));
        },
      }}
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/home.png')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    Início
                  </Text>
                </>
              );
            case 'Patient':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/user.png')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    Pacientes
                  </Text>
                </>
              );
            case 'Profile':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/user.png')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    Perfil
                  </Text>
                </>
              );
          }
        },
        header: (bottomTabsProps) => <AppHeader {...bottomTabsProps} />,
        tabBarBackground: () => (
          <Image
            style={{
              backgroundColor: '#fff',
              width: '95%',
              height: '100%',
              borderRadius: 50,
              alignSelf: 'center',
              shadowColor: '#C5C5C5',
              shadowOpacity: 0.3,
              shadowOffset: { height: 3, width: 3 },
              shadowRadius: 50,
              overflow: 'visible',
            }}
          />
        ),
        tabBarStyle: {
          display: route.name == 'Episode' ? 'none' : 'flex',
          borderWidth: 0,
          borderStyle: 'dashed',
          backgroundColor: '#transparent',
          position: 'absolute',
          bottom: 15,
        },
      })}
    >
      <Tab.Screen name='Home' component={HomePage} />
      <Tab.Screen name='Patient' component={PatientPage} />
      <Tab.Screen name='Profile' component={ProfilePage} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const LoggedPages = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={PhysicianTabsRoutes} />
    </Stack.Navigator>
  );
};

export default LoggedPages;
