import { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import CalendarComponent from 'src/modules/app/shared/components/calendar/CalendarComponent';
import { sharedEpisodeStyleSheet } from '../../shared/SharedEpisodeStyleSheet';
import { DateData } from 'react-native-calendars';
import { Time } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";
import { isFuture } from "date-fns";
import { useToast } from "react-native-toast-notifications";

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
    img: 'absolute right-5 top-[-45px] z-30 flex-row items-center justify-between',
  },
};

const Timepicker = () => {

  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const theme = useTheme();
  const hasClinicalOptions = appState.clinicalOptions.length > 0;

  const optionIdFor = (label: Time): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === 'TIME' && option.label === label,
    )?.id;

  const selectedTime = hasClinicalOptions
    ? appState.episode.timeOptionId ??
      optionIdFor(appState.episode.time as Time)
    : appState.episode.time;

  const selectTime = (value: string) => {
    const selectedOption = hasClinicalOptions
      ? appState.clinicalOptions.find((option) => option.id === value)
      : undefined;

    dispatch(
      handleFormChanging(
        selectedOption
          ? { timeOptionId: selectedOption.id }
          : { time: value },
      ),
    );
  };

  return (
    <RadioButton.Group
      onValueChange={selectTime}
      value={selectedTime ?? ''}
    >
      <View className={sharedEpisodeStyleSheet.timepicker.container}>
        <Text className={sharedEpisodeStyleSheet.timepicker.title}>
          Em qual horário aconteceu a crise?
        </Text>
        <View className={sharedEpisodeStyleSheet.timepicker.divider}></View>

        {data.map((time, index) => (
          <TouchableOpacity
            onPress={() => selectTime(optionIdFor(time.value) ?? time.value)}
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
                  value={optionIdFor(time.value) ?? time.value}
                  color={theme.colors.secondary}
                  uncheckedColor={theme.colors.primary}
                />
                <Text
                  className={
                    sharedEpisodeStyleSheet.timepicker.timeIndicatorRadioLabel
                  }
                  style={{ flexWrap: 'wrap', flex: 1, flexShrink: 1 }}
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
  const appState = useSelector(appStateSelector);
  const theme = useTheme();
  const toast = useToast();

  const handleSelectDate = useCallback((date: DateData) => {
    if (!Object.keys(appState.episode.dates).includes(date.dateString)) {
      dispatch(handleFormChanging(({
        dates: {
          [date.dateString]: {
            selected: true,
            marked: true,
            selectedColor: theme.colors.secondary,
          },
        },
      })));
    }
  }, [dispatch, theme.colors.secondary]);

  return (
    <View className={stylesheet.calendar.wrapper}>

      <View className={stylesheet.calendar.img}>
        <Text className={sharedEpisodeStyleSheet.timepicker.title.concat(' text-md w-2/3')}>
          Escolha a data da crise
        </Text>
        <Image
          resizeMode='cover'
          className="w-[90px] h-[140px] "
          source={require('src/assets/victor_bear.png')}
        />
      </View>
      <CalendarComponent
        displayheader={false}
        markedDates={appState.episode.dates}
        onDayPress={(date) => {
          if (isFuture(date.dateString)) {
            toast.hideAll()
            toast.show('Selecione uma data válida!', { type: 'warning' })
            return
          }
          handleSelectDate(date)
        }}
      />
      <Timepicker />
    </View>
  );
};

export default Datetime;
