import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home/HomePage';
import { Image, Text, View } from 'react-native';
import EpisodePage from './episode/Episode';
import CalendarPage from './calendar/Calendar';
import ProfilePage from './profile/Profile';
import AppHeader from '../shared/components/appHeader/AppHeader';
import ReportStackNavigation from './report/Report';
import { useApp } from 'src/infra/app/app';
import { AppActions } from 'src/infra/app/actions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Success from './success/Success';

const stylesheet = {
  calendarBtnContainer:
    'bg-blue-secondary rounded-full w-13 h-13 flex items-center justify-center translate-y-[-15px]',
};

const Tab = createBottomTabNavigator();

const TabsRoutes = () => {
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
        return 'Relatório';
      case 2:
        return 'Data e horário';
      case 3:
        return 'Calenário';
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
        headerStyle: { backgroundColor: '#edf1f8' },
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/home.svg')}
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
            case 'Report':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/stats.svg')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    Relatório
                  </Text>
                </>
              );
            case 'Episode':
              return (
                <View className={stylesheet.calendarBtnContainer}>
                  <Image source={require('assets/plus-white.png')} />
                </View>
              );
            case 'Calendar':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/calendar.svg')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    Calenário
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
        header: (bottomTabsProps) =>
          bottomTabsProps.route.name != 'Report' ? (
            <AppHeader {...bottomTabsProps} />
          ) : (
            <></>
          ),

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
            }}
          />
        ),
        tabBarStyle: {
          display: route.name == 'Episode' ? 'none' : 'flex',
          borderWidth: 0,
          backgroundColor: '#F7F7F7',
          position: 'absolute',
          bottom: 15,
        },
      })}
    >
      <Tab.Screen name='Home' component={HomePage} />
      <Tab.Screen name='Report' component={ReportStackNavigation} />
      <Tab.Screen name='Episode' component={EpisodePage} />
      <Tab.Screen name='Calendar' component={CalendarPage} />
      <Tab.Screen name='Profile' component={ProfilePage} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const LoggedPages = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={TabsRoutes} />
      <Stack.Screen name='Success' component={Success} />
    </Stack.Navigator>
  );
};

export default LoggedPages;
