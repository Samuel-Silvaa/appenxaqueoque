import { Image, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card from '../form/card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { appStateSelector } from 'src/infra/app/selectors';
import { TimeInputWithValidation } from 'src/modules/shared/components/timeInput';
import { format, isValid, parse } from 'date-fns';
import { sharedEpisodeStyleSheet } from "../../shared/SharedEpisodeStyleSheet";

const stylesheet = {
  calendarWrapper:
    'flex-col w-full items-center overflow-hidden dark:bg-d-blue-primary',
  calendar: {
    wrapper: 'h-full pt-14 ',
    img: 'absolute right-5 top-[-45px] z-30 flex-row items-center justify-between',
  },
};

const durationSchema = yup
  .object<{ start: Date | null; end: Date | null }>()
  .shape({
    start: yup.date().nullable(),
    end: yup
      .date()
      .nullable()
      .test(
        'is-valid-time',
        'Horário de término deve ser maior que horário de início',
        function (value) {
          const { start } = this.parent;
          if (!start || !value) return true;

          return value > start;
        }
      ),
  });

const EpisodeDuration = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const {
    formState: { errors },
    setValue,
    control,
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(durationSchema),
    mode: 'onChange',
    defaultValues: {
      start: appState.episode.start
        ? parse(appState.episode.start, 'HH:mm', new Date())
        : null,
      end: appState.episode.end
        ? parse(appState.episode.end, 'HH:mm', new Date())
        : null,
    },
  });

  const endTime = watch('end');

  const handleStartTimeChange = (time: Date) => {
    if (!isValid(time)) return;

    const formattedTime = format(time, 'HH:mm');
    setValue('start', time);
    dispatch(handleFormChanging({ start: formattedTime }));

    if (endTime) {
      trigger('end');
    }
  };

  const handleEndTimeChange = (time: Date) => {
    if (!isValid(time)) return;

    const formattedTime = format(time, 'HH:mm');
    setValue('end', time);

    trigger('end').then((valid) => {
      if (valid) {
        dispatch(handleFormChanging({ end: formattedTime }));
      }
    });
  };

  return (
    <View className="h-full w-full">
       <View className={stylesheet.calendar.wrapper}>
   
      <View className={stylesheet.calendar.img}>
             <Text className={sharedEpisodeStyleSheet.timepicker.title.concat(' text-md w-2/3 mb-2')}>
          Quanto tempo durou a crise ?
        </Text>
        <Image
          resizeMode='cover'
          className="w-[90px] h-[140px] "
          source={require('src/assets/victor_bear.png')}
        />
        
      </View>
       <Wrapper>
        <Card
          children={
            <View className="w-full">
              <TimeInputWithValidation  
                label="Horário de Início:"
                name="start"
                control={control}
                setValue={setValue}
                errors={errors}
                mode="time"
                format="24h"
                onTimeChange={handleStartTimeChange}
              />

              <TimeInputWithValidation
                label="Horário de Término:"
                name="end"
                setValue={setValue}
                errors={errors}
                mode="time"
                format="24h"
                control={control}
                onTimeChange={handleEndTimeChange}
              />
            </View>
          }
        />
       </Wrapper>
      
    </View>
    </View>
  );
};

export default EpisodeDuration;
