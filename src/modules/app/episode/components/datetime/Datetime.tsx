import { useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CalendarComponent from 'src/modules/app/shared/components/calendar/CalendarComponent';
import { sharedEpisodeStyleSheet } from '../../shared/SharedEpisodeStyleSheet';

const data = [
  {
    label: 'De manhã',
    value: 'morning',
    img: require('assets/morning.png'),
  },
  {
    label: 'De tarde',
    value: 'evening',
    img: require('assets/evening.png'),
  },
  {
    label: 'De noite',
    value: 'night',
    img: require('assets/night.png'),
  },
  {
    label: 'De madrugada',
    value: 'midnight',
    img: require('assets/midnight.png'),
  },
];

const stylesheet = {
  calendarWrapper: 'flex-col w-full items-center overflow-hidden',
  timepicker: {
    container: 'w-full bg-white rounded-[44px] p-2 items-center',
    title: 'font-semibold text-lg',
    divider: 'w-1/5 border border-gray h-[1px]',
    timeIndicatorContainer: 'w-full h-[100px] rounded-[40px] flex',
    timeIndicatorBg: 'w-full h-full bg-contain',
    timeIndicatorRadioContainer:
      'absolute left-4 top-1/3 flex-row items-center',
    timeIndicatorRadioLabel: 'text-white font-semibold',
  },
};

const Timepicker = () => {
  const [selectedValue, setSelectedValue] = useState('morning');
  return (
    <RadioButton.Group
      onValueChange={(value) => setSelectedValue(value)}
      value={selectedValue}
    >
      <View className={sharedEpisodeStyleSheet.timepicker.container}>
        <Text className={sharedEpisodeStyleSheet.timepicker.title}>
          Em qual horário aconteceu a crise?
        </Text>
        <View className={sharedEpisodeStyleSheet.timepicker.divider}></View>

        {data.map((time, index) => (
          <Pressable
            onPress={() => setSelectedValue(time.value)}
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
  return (
    <View className='h-full'>
      <View className={stylesheet.calendarWrapper}>
        <CalendarComponent />
      </View>
      <Timepicker />
    </View>
  );
};

export default Datetime;
