import { Dimensions, StyleProp, ViewStyle, Appearance } from 'react-native';
import { Theme } from 'react-native-calendars/src/types';

export const getCalendarTheme = (): Theme => {
  const isDark = Appearance.getColorScheme() === 'dark';
  
  return {
    dotStyle: {
      width: '9px',
      height: '9px',
      transform: 'translateY(8px)',
      borderRadius: 4.5,
    },
    textDayStyle: {columnGap: 20},
    backgroundColor: isDark ? '#373D59' : '#ffffff',
    calendarBackground: isDark ? '#373D59' : '#ffffff',
    textSectionTitleColor: isDark ? '#9DA3A9' : '#b6c1cd',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    textDayFontWeight: '400',
    dayTextColor: isDark ? '#9DA3A9' : '#2d4150',
    textDisabledColor: isDark ? '#6E8DBB' : '#9fa3a6',
  };
};

export const CalendarTheme: Theme = getCalendarTheme();

export const Calendarstyle: StyleProp<ViewStyle> = {
  position: 'relative',
  width: Dimensions.get('window').width - 50,
  borderRadius: 28,
  height: Dimensions.get('window').height * 0.4
};
