import { Calendar } from 'react-native-calendars';
import { getCalendarTheme, Calendarstyle } from './CalendarStyle';
import { Image, Text, View } from 'react-native';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { sharedEpisodeStyleSheet } from 'src/modules/app/episode/shared/SharedEpisodeStyleSheet';

const stylesheet = {
  container: 'bg-white dark:bg-d-blue-primary rounded-[32px] m-2 ',
  body: 'flex-row flex-wrap justify-evenly items-start w-full rounded-[28px] p-1 bg-white dark:bg-d-blue-primary ',
};

const CalendarComponent = ({
  markedDates,
  onDayPress,
  displayMessage,
}: {
  markedDates?: MarkedDates;
  onDayPress: (date: DateData) => void;
  displayMessage?: boolean;
}) => {
  return (
    <View className='relative w-full'>
      <View className='bg-blue-four dark:bg-d-blue-primary rounded-[28px] absolute top-0 h-2/5 w-full'></View>
      <View className={stylesheet.container}>
        <View className={stylesheet.body}>
          <Calendar
            style={Calendarstyle}
            onDayPress={(date) => onDayPress(date)}
            markedDates={markedDates}
            theme={getCalendarTheme()}
          />

          {displayMessage && (
            <View className='flex items-center p-4'>
              <View
                className={sharedEpisodeStyleSheet.timepicker.divider}
              ></View>

              <View className='rounded-full w-full bg-beige-primary/50 dark:bg-d-blue-primary/50 flex-row justify-center items-center p-2 m-auto mb-4'>
                <Image source={require('src/assets/arrowup.png')}></Image>
                <Text className='font-xs p-2 dark:text-d-text-gray'>
                  Escolha a data do episódio que deseja visualizar ou editar
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CalendarComponent;
