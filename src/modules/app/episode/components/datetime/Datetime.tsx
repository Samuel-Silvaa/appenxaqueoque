import { useCallback } from 'react';
import { Image, ImageBackground, Pressable, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CalendarComponent from 'src/modules/app/shared/components/calendar/CalendarComponent';
import { sharedEpisodeStyleSheet } from '../../shared/SharedEpisodeStyleSheet';
import { DateData } from 'react-native-calendars';
import { useApp } from 'src/infra/app/app';
import { Time } from 'src/infra/@types/app.types';

const data = [
  {
    label: 'De manhã',
    value: Time.MORNING,
    img: require('assets/morning.png'),
  },
  {
    label: 'De tarde',
    value: Time.EVENING,
    img: require('assets/evening.png'),
  },
  {
    label: 'De noite',
    value: Time.NIGHT,
    img: require('assets/night.png'),
  },
  {
    label: 'De madrugada',
    value: Time.MIDNIGHT,
    img: require('assets/midnight.png'),
  },
];

const stylesheet = {
  calendarWrapper: 'flex-col w-full items-center overflow-hidden',
  timepicker: {
    container: 'w-full bg-white rounded-[44px] p-2 items-center',
    title: 'font-semibold text-lg',
    divider: 'w-1/5 border border-gray-light h-[1px]',
    timeIndicatorContainer: 'w-full h-[100px] rounded-[40px] flex',
    timeIndicatorBg: 'w-full h-full bg-contain',
    timeIndicatorRadioContainer:
      'absolute left-4 top-1/3 flex-row items-center',
    timeIndicatorRadioLabel: 'text-white font-semibold',
  },
  calendar: {
    wrapper: 'h-full pt-14',
    img: 'absolute right-5 top-[-18px] z-30',
  },
};

const Timepicker = () => {
  const { episodeFormState, handleFormChange } = useApp();

  return (
    <RadioButton.Group
      onValueChange={(value) => handleFormChange({ time: value })}
      value={episodeFormState.time}
    >
      <View className={sharedEpisodeStyleSheet.timepicker.container}>
        <Text className={sharedEpisodeStyleSheet.timepicker.title}>
          Em qual horário aconteceu a crise?
        </Text>
        <View className={sharedEpisodeStyleSheet.timepicker.divider}></View>

        {data.map((time, index) => (
          <Pressable
            onPress={() => handleFormChange({ time: time.value })}
            key={index}
            className={
              sharedEpisodeStyleSheet.timepicker.timeIndicatorContainer
            }
          >
            <ImageBackground
              source={time.img}
              className={sharedEpisodeStyleSheet.timepicker.timeIndicatorBg}
            >
              <View
                className={
                  sharedEpisodeStyleSheet.timepicker.timeIndicatorRadioContainer
                }
              >
                <RadioButton
                  value={time.value}
                  color='#CEB0FA'
                  uncheckedColor='#d0edfc'
                />
                <Text
                  className={
                    sharedEpisodeStyleSheet.timepicker.timeIndicatorRadioLabel
                  }
                >
                  {time.label}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </RadioButton.Group>
  );
};

const Datetime = () => {
  const { episodeFormState, handleFormChange } = useApp();

  const handleSelectDate = useCallback((date: DateData) => {
    if (!Object.keys(episodeFormState.dates).includes(date.dateString)) {
      handleFormChange({
        dates: {
          ...episodeFormState.dates,
          [date.dateString]: {
            selected: true,
            marked: true,
            selectedColor: '#9194E9',
          },
        },
      });
    }
  }, []);

  return (
    <View className={stylesheet.calendar.wrapper}>
      <View className={stylesheet.calendar.img}>
        <Image
          width={38}
          height={38}
          resizeMode='cover'
          source={require('assets/boy_phone.png')}
        />
      </View>
      <View className={stylesheet.calendarWrapper}>
        <CalendarComponent
          markedDates={episodeFormState.dates}
          onDayPress={(date) => handleSelectDate(date)}
        />
      </View>
      <Timepicker />
    </View>
  );
};

export default Datetime;
