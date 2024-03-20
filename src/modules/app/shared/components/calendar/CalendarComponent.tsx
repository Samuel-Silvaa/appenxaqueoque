import { Calendar } from 'react-native-calendars';
import { CalendarTheme, Calendarstyle } from './CalendarStyle';
import { View } from 'react-native';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';

const stylesheet = {
  container: 'w-full h-[40%] bg-blue-tertiary rounded-[44px] p-2 ',
  body: 'flex-row flex-wrap justify-evenly items-start w-full p-1',
};

const CalendarComponent = ({
  markedDates,
  onDayPress,
}: {
  markedDates?: MarkedDates;
  onDayPress: (date: DateData) => void;
}) => {
  return (
    <View className={stylesheet.container}>
      <View className={stylesheet.body}>
        <Calendar
          style={Calendarstyle}
          onDayPress={(date) => onDayPress(date)}
          markedDates={markedDates}
          theme={CalendarTheme}
        />
      </View>
    </View>
  );
};

export default CalendarComponent;
