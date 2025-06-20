import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home/HomePage';
import { Appearance, Image, Text, View } from 'react-native';
import EpisodePage from './episode/Episode';
import CalendarPage from './calendar/Calendar';
import ProfilePage from './profile/Profile';
import AppHeader from '../shared/components/appHeader/AppHeader';
import ReportStackNavigation from './report/Report';
import { useApp } from 'src/infra/app/app';
import { AppActions } from 'src/infra/app/actions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Success from './success/Success';
import { setPageTitle } from "src/infra/app/reducers/app.reducer";
import { useDispatch } from "react-redux";

const stylesheet = {
  calendarBtnContainer:
    'bg-blue-secondary dark:bg-d-blue-primary rounded-full w-16 h-16 flex items-center justify-center translate-y-[-20px]',
};

const Tab = createBottomTabNavigator();

const TabsRoutes = () => {
  const { patient, dispatch: appdispatch, validateStepForward } = useApp();
  const dispatch = useDispatch();
  const [colorScheme, setColorScheme] = React.useState(
    Appearance.getColorScheme()
  );

  React.useEffect(() => {
    Appearance.addChangeListener((a) => {
      setColorScheme(a.colorScheme);
    });
    if (!patient) appdispatch(AppActions.REQUEST_FETCH_PATIENT, {});
    appdispatch(AppActions.REQUEST_FETCH_EPISODES);
  }, []);

  const getHeaderName = (routeIndex: number) => {
    switch (routeIndex) {
      case 1:
        return 'Relatório';
      case 2:
        return 'Data e horário';
      case 3:
        return 'Calendário';
      default:
        return '';
    }
  };

  const colorSchemeApproachHex = (focused: boolean) => {
    if (colorScheme == 'light') return focused ? '#8FD7FF' : '#262D33';
    if (colorScheme == 'dark') return focused ? '#8FD7FF' : '#9DA3A9';
  };

  const tabTextStyle = (focused: boolean) => {
    if (colorScheme == 'light')
      return focused ? 'text-[#8FD7FF]' : 'text-[#262D33]' + ' text-[9px]';
    if (colorScheme == 'dark')
      return focused ? 'text-[#8FD7FF]' : 'text-[#9DA3A9]' + ' text-[9px]';
  };

  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          validateStepForward(0);
          if (e.data?.state)
            dispatch(setPageTitle(getHeaderName(e.data?.state.index)));
        },
      }}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colorScheme == 'light' ? '#edf1f8' : '#23263F',
        },
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return (
                <>
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    source={require('src/assets/home.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Início</Text>
                </>
              );
            case 'Report':
              return (
                <>
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    source={require('src/assets/stats.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Relatório</Text>
                </>
              );
            case 'Episode':
              return (
                <View className={stylesheet.calendarBtnContainer}>
                  <Image source={require('src/assets/plus-white.png')} />
                </View>
              );
            case 'Calendar':
              return (
                <>
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    source={require('src/assets/calendar.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Calenário</Text>
                </>
              );
            case 'Profile':
              return (
                <>
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    source={require('src/assets/user.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Perfil</Text>
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
              backgroundColor: colorScheme == 'light' ? '#fff' : '#1F2035',
              width: '95%',
              height: '100%',
              borderRadius: 50,
              alignSelf: 'center',
              overflow: 'visible',
            }}
          />
        ),
        tabBarStyle: {
          display: route.name == 'Episode' ? 'none' : 'flex',
          borderWidth: 0,
          borderColor: 'transparent',
          borderRadius: 50,
          height: 60,
          borderStyle: 'dashed',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 15,
          shadowColor: '#C5C5C5',
          shadowOpacity: 0.3,
          shadowOffset: { height: 10, width: 10 },
          shadowRadius: 50,
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
