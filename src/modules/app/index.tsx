import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home/HomePage';
import { Appearance, Image, Text, View, Animated } from 'react-native';
import EpisodePage from './episode/Episode';
import CalendarPage from './calendar/Calendar';
import ReportStackNavigation from './report/Report';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Success from './success/Success';
import {
  clearEpisodeState,
  handleFetchClinicalOptions,
  handleFecthPatient,
  handleFetchEpisodes,
  setPageTitle,
} from 'src/infra/app/reducers/app.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { appStateSelector, authSelector } from 'src/infra/app/selectors';
import ProfileStackNavigation from './profile/ProfileStack';
import AvatarSelection from '../auth/registration/avatar/AvatarSelection';
import Patient from '../auth/registration/patient/Patient';
import EpisodeDetailsPage from './episode/components/episodeDetailsPage/EpisodeDetailsPage';
import AppHeader from '../shared/components/appHeader/AppHeader';

const stylesheet = {
  calendarBtnContainer:
    'bg-blue-secondary dark:bg-d-blue-primary rounded-full w-16 h-16 flex items-center justify-center translate-y-[-20px]',
};

const Tab = createBottomTabNavigator();

const TabsRoutes = () => {
  const dispatch = useDispatch();
  const asyncDispatch = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);
  const [colorScheme, setColorScheme] = React.useState(
    Appearance.getColorScheme()
  );

  // Animated values for each tab
  const homeScale = React.useRef(new Animated.Value(1)).current;
  const reportScale = React.useRef(new Animated.Value(1)).current;
  const episodeScale = React.useRef(new Animated.Value(1)).current;
  const calendarScale = React.useRef(new Animated.Value(1)).current;
  const profileScale = React.useRef(new Animated.Value(1)).current;

  // Animated opacity values for each tab
  const homeOpacity = React.useRef(new Animated.Value(1)).current;
  const reportOpacity = React.useRef(new Animated.Value(1)).current;
  const episodeOpacity = React.useRef(new Animated.Value(1)).current;
  const calendarOpacity = React.useRef(new Animated.Value(1)).current;
  const profileOpacity = React.useRef(new Animated.Value(1)).current;

  // Enhanced animation function for tab press
  const animateTabPress = React.useMemo(() => {
    return (scaleValue: Animated.Value, opacityValue: Animated.Value) => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 0.85,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.7,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 70,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };
  }, []); // Empty dependency array since the function doesn't depend on any props or state

  React.useEffect(() => {
    try {
      Appearance.addChangeListener((a) => {
        setColorScheme(a.colorScheme);
      });
      if (auth.user) {
        asyncDispatch(handleFecthPatient(auth.user.id!));
        asyncDispatch(handleFetchClinicalOptions());
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    if (appState.patient)
      asyncDispatch(handleFetchEpisodes(appState.patient!.id!));
  }, [appState.patient]);

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
      return focused ? 'text-[#8FD7FF] text-[12px]' : 'text-[#262D33]' + ' text-[8px]';
    if (colorScheme == 'dark')
      return focused ? 'text-[#8FD7FF] text-[12px]' : 'text-[#9DA3A9]' + ' text-[8px]';
  };

  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          if (e.data?.state) {
            const currentIndex = e.data.state.index;
            dispatch(setPageTitle(getHeaderName(currentIndex)));
            if (currentIndex != 2 && appState.currentEpStep != 0) {
              dispatch(setPageTitle(''));
              dispatch(clearEpisodeState());
            }
            if (currentIndex == 0) {
              dispatch(setPageTitle(''));
            }
          }
        },
        tabPress: (e) => {
          const routeName = e.target?.split('-')[0];

          switch (routeName) {
            case 'Home':
              animateTabPress(homeScale, homeOpacity);
              break;
            case 'Report':
              animateTabPress(reportScale, reportOpacity);
              break;
            case 'Episode':
              animateTabPress(episodeScale, episodeOpacity);
              break;
            case 'Calendar':
              animateTabPress(calendarScale, calendarOpacity);
              break;
            case 'Profile':
              animateTabPress(profileScale, profileOpacity);
              break;
          }
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
                <Animated.View
                  style={{
                    transform: [{ scale: homeScale }],
                    opacity: homeOpacity,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    className='w-5 h-5'
                    source={require('src/assets/home.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Início</Text>
                </Animated.View>
              );
            case 'Report':
              return (
                <Animated.View
                  style={{
                    transform: [{ scale: reportScale }],
                    opacity: reportOpacity,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    className='w-5 h-5'
                    source={require('src/assets/stats.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Relatório</Text>
                </Animated.View>
              );
            case 'Episode':
              return (
                <Animated.View
                  style={{
                    transform: [{ scale: episodeScale }],
                    opacity: episodeOpacity,
                  }}
                >
                  <View className={stylesheet.calendarBtnContainer}>
                    <Image
                      className='w-8 h-8'
                      source={require('src/assets/plus-white.png')}
                    />
                  </View>
                </Animated.View>
              );
            case 'Calendar':
              return (
                <Animated.View
                  style={{
                    transform: [{ scale: calendarScale }],
                    opacity: calendarOpacity,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    tintColor={colorSchemeApproachHex(focused)}
                    className='w-5 h-5'
                    source={require('src/assets/calendar.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Calendário</Text>
                </Animated.View>
              );
            case 'Profile':
              return (
                <Animated.View
                  style={{
                    transform: [{ scale: profileScale }],
                    opacity: profileOpacity,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    resizeMode='contain'
                    className='w-5 h-5'
                    tintColor={colorSchemeApproachHex(focused)}
                    source={require('src/assets/user.png')}
                  />
                  <Text className={tabTextStyle(focused)}>Perfil</Text>
                </Animated.View>
              );
          }
        },
        header: (bottomTabsProps) =>
          bottomTabsProps.route.name != 'Report' &&
            bottomTabsProps.route.name != 'Profile' ? (
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
      <Tab.Screen name='Profile' component={ProfileStackNavigation} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const LoggedPages = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={TabsRoutes} />
      <Stack.Screen name='Success' component={Success} />
      <Stack.Screen name='AvatarSelection' component={AvatarSelection} />
      <Stack.Screen name='Patient' component={Patient}></Stack.Screen>
      <Stack.Screen
        name='EpisodeDetails'
        component={EpisodeDetailsPage}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default LoggedPages;
