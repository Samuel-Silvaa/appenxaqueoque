import { Calendar } from 'react-native-calendars';
import { CalendarTheme, Calendarstyle } from './CalendarStyle';
import { Image, Text, View } from 'react-native';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { sharedEpisodeStyleSheet } from 'src/modules/app/episode/shared/SharedEpisodeStyleSheet';

const stylesheet = {
  container: 'bg-white rounded-[32px] m-2',
  body: 'flex-row flex-wrap justify-evenly items-start w-full rounded-[28px] p-1 bg-white',
};

const CalendarComponent = ({
  markedDates,
  onDayPress,
}: {
  markedDates?: MarkedDates;
  onDayPress: (date: DateData) => void;
}) => {
  return (
    <View className='relative w-full'>
      <View className='bg-blue-tertiary rounded-[28px] absolute top-0 h-2/5 w-full'></View>
      <View className={stylesheet.container}>
        <View className={stylesheet.body}>
          <Calendar
            style={Calendarstyle}
            onDayPress={(date) => onDayPress(date)}
            markedDates={markedDates}
            theme={CalendarTheme}
          />

          <View className={sharedEpisodeStyleSheet.timepicker.divider}></View>

          <View className='rounded-full w-full h-[50px] bg-beige-primary/50 flex-row justify-center items-center p-2 m-auto mb-4'>
            <Image source={require('assets/arrowup.png')}></Image>
            <Text className='font-xs'>
              Escolha a data do episódio que deseja vizualizar ou editar
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CalendarComponent;
