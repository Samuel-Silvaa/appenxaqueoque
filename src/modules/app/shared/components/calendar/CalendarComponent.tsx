import { Calendar } from 'react-native-calendars';
import { getCalendarTheme, Calendarstyle } from './CalendarStyle';
import { Image, Text, View } from 'react-native';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { sharedEpisodeStyleSheet } from 'src/modules/app/episode/shared/SharedEpisodeStyleSheet';

const stylesheet = {
  container: 'bg-white dark:bg-d-blue-primary rounded-[32px] m-2 mt-4',
  body: 'flex-row flex-wrap justify-evenly items-start w-full rounded-[28px] p-1 bg-white dark:bg-d-blue-primary shadow-lg',
  calendar: {
    img: 'absolute right-5 top-[-65px] z-30 flex-row items-center justify-between',
    duck: 'absolute left-5 top-[-65px] z-30 flex-row items-center justify-between',
  },
};

const CalendarComponent = ({
  markedDates,
  onDayPress,
  displayMessage,
  displayheader = true
}: {
  markedDates?: MarkedDates;
  onDayPress: (date: DateData) => void;
  displayMessage?: boolean;
  displayheader?: boolean
}) => {
  return (
    <View className={displayheader ? ' mt-14' : '' + ' relative w-full'}>
      {displayheader && (
        <>
          <View className={stylesheet.calendar.duck}>
            <Image
              resizeMode='contain'
              className='w-[100px] h-[100px] '
              source={require('src/assets/duck.png')}
            />
          </View>
          <View className={stylesheet.calendar.img}>
            <Image
              resizeMode='contain'
              className='w-[100px] h-[100px] '
              source={require('src/assets/baby_book.png')}
            />
          </View>
        </>
      )}
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
