import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import { Theme } from 'react-native-calendars/src/types';

export const CalendarTheme: Theme = {
  dotStyle: {
    width: '9px',
    height: '9px',
    transform: 'translateY(8px)',
    borderRadius: 4.5,
  },
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  textDayFontWeight: '400',
  dayTextColor: '#2d4150',
  textDisabledColor: '#9fa3a6',
};

export const Calendarstyle: StyleProp<ViewStyle> = {
  position: 'relative',
  width: Dimensions.get('window').width - 50,
  borderRadius: 28,
};
