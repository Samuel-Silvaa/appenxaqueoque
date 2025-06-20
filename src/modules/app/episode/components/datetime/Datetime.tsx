import { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import CalendarComponent from 'src/modules/app/shared/components/calendar/CalendarComponent';
import { sharedEpisodeStyleSheet } from '../../shared/SharedEpisodeStyleSheet';
import { DateData } from 'react-native-calendars';
import { Time } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

const data = [
  {
    label: 'De manhã',
    value: Time.MORNING,
    img: require('src/assets/morning.png'),
  },
  {
    label: 'De tarde',
    value: Time.EVENING,
    img: require('src/assets/evening.png'),
  },
  {
    label: 'De noite',
    value: Time.NIGHT,
    img: require('src/assets/night.png'),
  },
  {
    label: 'De madrugada',
    value: Time.MIDNIGHT,
    img: require('src/assets/midnight.png'),
  },
];

const stylesheet = {
  calendarWrapper:
    'flex-col w-full items-center overflow-hidden dark:bg-d-blue-primary',
  calendar: {
    wrapper: 'h-full pt-14 ',
    img: 'absolute right-5 top-[-18px] z-30',
  },
};

const Timepicker = () => {

  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  return (
    <RadioButton.Group
      onValueChange={(value) => dispatch(handleFormChanging({ time: value }))}
      value={appState.episode.time!}
    >
      <View className={sharedEpisodeStyleSheet.timepicker.container}>
        <Text className={sharedEpisodeStyleSheet.timepicker.title}>
          Em qual horário aconteceu a crise?
        </Text>
        <View className={sharedEpisodeStyleSheet.timepicker.divider}></View>

        {data.map((time, index) => (
          <TouchableOpacity
            onPress={() => dispatch(handleFormChanging(({ time: time.value })))}
            key={index}
            className={
              sharedEpisodeStyleSheet.timepicker.timeIndicatorContainer
            }
          >
            <ImageBackground
              source={time.img}
              resizeMode='contain'
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
          </TouchableOpacity>
        ))}
      </View>
    </RadioButton.Group>
  );
};

const Datetime = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector)

  const handleSelectDate = useCallback((date: DateData) => {
    if (!Object.keys(appState.episode.dates).includes(date.dateString)) {
      dispatch(handleFormChanging(({
        dates: {
          ...appState.episode.dates,
          [date.dateString]: {
            selected: true,
            marked: true,
            selectedColor: '#9194E9',
          },
        },
      })));
    }
  }, []);

  return (
    <View className={stylesheet.calendar.wrapper}>
      <View className={stylesheet.calendar.img}>
        <Image
          width={38}
          height={38}
          resizeMode='cover'
          source={require('src/assets/victor_bear.png')}
        />
      </View>
      <CalendarComponent
        markedDates={appState.episode.dates}
        onDayPress={(date) => handleSelectDate(date)}
      />
      <Timepicker />
    </View>
  );
};

export default Datetime;
