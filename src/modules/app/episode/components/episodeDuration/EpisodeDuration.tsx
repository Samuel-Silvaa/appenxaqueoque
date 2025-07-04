import { View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card from '../form/card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { appStateSelector } from 'src/infra/app/selectors';
import { TimeInput, TimeInputWithValidation } from 'src/modules/shared/components/timeInput';
import { format, isValid, parse } from "date-fns";
import { id } from "date-fns/locale";

const durationSchema = yup.object<{ start: Date | null; end: Date | null }>().shape({
  start: yup.date().nullable(),
  end: yup.date().nullable().test('is-valid-time', 'Horário de término deve ser maior que horário de início', function(value) {
    const { start } = this.parent;
    if (!start || !value) return true;
    
    return value > start;
  }),
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
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      start: appState.episode.start ? parse(appState.episode.start, 'HH:mm', new Date()) : null,
      end: appState.episode.end ? parse(appState.episode.end, 'HH:mm', new Date()) : null,
    }
  });

  // Watch both start and end times for validation
  const startTime = watch('start');
  const endTime = watch('end');

  const handleStartTimeChange = (time: Date) => {
    const formattedTime = format(time, 'HH:mm');
    setValue('start', time);
    dispatch(handleFormChanging({ start: formattedTime }));
    
    // Trigger validation for end time when start time changes
    if (endTime) {
      trigger('end');
    }
  };

  const handleEndTimeChange = (time: Date) => {
    const formattedTime = format(time, 'HH:mm');
    setValue('end', time);
    
    // Validate end time immediately
    trigger('end').then((isValid) => {
      if (isValid) {
        dispatch(handleFormChanging({ end: formattedTime }));
      }
    });
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Quanto tempo durou a dor ?'>
        <Card
          children={
            <View className='w-full'>
              <TimeInputWithValidation
                label='Horário de Início:'
                name='start'
                control={control}
                setValue={setValue}
                errors={errors}
                mode='time'
                format='24h'
                onTimeChange={handleStartTimeChange}
              />

              <TimeInputWithValidation
                label='Horário de Término:'
                name='end'
                setValue={setValue}
                errors={errors}
                mode='time'
                format='24h'
                control={control}
                onTimeChange={handleEndTimeChange}
              />
            </View>
          }
        ></Card>
      </Wrapper>
    </View>
  );
};

export default EpisodeDuration;
