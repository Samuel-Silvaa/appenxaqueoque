import { Calendar } from 'react-native-calendars';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import './locale';

const stylesheet = {
  innerHomeContainer: {
    container: 'w-full max-h-[220] bg-blue-tertiary rounded-[30px] p-2 ',
    header: 'w-full h-[10%] flex items-center ',
    body: 'flex-row flex-wrap justify-evenly items-start w-full h-[90%] p-1',
  },
};

const CustomCalendar = () => {
  return (
    <Calendar
      style={{
        position: 'relative',
        width: window.screen.width - 50,
        minHeight: 400,
        borderRadius: 30,
      }}
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
      theme={{
        dotStyle: {
          width: '9px',
          height: '9px',
          transform: 'translateY(8px)',
          borderRadius: '50%',
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
      }}
    ></Calendar>
  );
};

const InnerHomeContainer = () => {
  return (
    <View className={stylesheet.innerHomeContainer.container}>
      <View className={stylesheet.innerHomeContainer.body}>
        <CustomCalendar />
      </View>
    </View>
  );
};

const CalendarPage = () => {
  return (
    <AppPageScaffold>
      <ScrollView className='w-full flex'>
        <InnerHomeContainer />
      </ScrollView>
    </AppPageScaffold>
  );
};

export default CalendarPage;
