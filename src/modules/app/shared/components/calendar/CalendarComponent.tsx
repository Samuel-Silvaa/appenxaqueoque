import { Calendar } from 'react-native-calendars';
import { CalendarTheme, Calendarstyle } from './CalendarStyle';
import { View } from 'react-native';

const stylesheet = {
  container: 'w-full h-[40%] bg-blue-tertiary rounded-[44px] p-2 ',
  body: 'flex-row flex-wrap justify-evenly items-start w-full p-1',
};

const CalendarComponent = () => {
  return (
    <View className={stylesheet.container}>
      <View className={stylesheet.body}>
        <Calendar
          style={Calendarstyle}
          onDayPress={(day) => {
            console.log(day);
          }}
          markedDates={{
            '2024-03-10': {
              selected: true,
              marked: true,
              selectedColor: '#FFCACD',
              dotColor: '#FFCACD',
            },
            '2024-03-14': {
              selected: true,
              marked: true,
              selectedColor: '#ADEECF',
              dotColor: '#ADEECF',
            },
            '2024-03-15': {
              selected: true,
              marked: true,
              selectedColor: '#FFCBA6',
              dotColor: '#FFCBA6',
            },
          }}
          theme={CalendarTheme}
        />
      </View>
    </View>
  );
};

export default CalendarComponent;
