import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home/HomePage';
import { Image, Pressable, Text, View } from 'react-native';
import EpisodePage from './episode/Episode';
import CalendarPage from './calendar/Calendar';
import ProfilePage from './profile/Profile';
import AppHeader from '../shared/components/AppHeader/AppHeader';
import ReportStackNavigation from './report/Report';

const stylesheet = {
  calendarBtnContainer:
    'bg-blue-secondary rounded-full w-13 h-13 flex items-center justify-center translate-y-[-15px]',
};

const Tab = createBottomTabNavigator();

const TabsRoutes = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#f7f7f7' },
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
                    {route.name}
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
                    {route.name}
                  </Text>
                </>
              );
            case 'Episode':
              return (
                <View className={stylesheet.calendarBtnContainer}>
                  <Image source={require('assets/plus.svg')} />
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
                    {route.name}
                  </Text>
                </>
              );
            case 'Profile':
              return (
                <>
                  <Image
                    tintColor={focused ? '#8FD7FF' : '#262D33'}
                    source={require('assets/user.svg')}
                  />
                  <Text
                    className={
                      focused
                        ? 'text-[#8FD7FF]'
                        : 'text-[#262D33]' + ' text-[9px]'
                    }
                  >
                    {route.name}
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

export default TabsRoutes;
