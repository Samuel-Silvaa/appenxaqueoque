import React from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TimeInput, TimeInputWithValidation } from './index';

// Example schema for validation
const timeSchema = yup
  .object({
    startTime: yup.date().required('Horário de início é obrigatório'),
    endTime: yup.date().required('Horário de fim é obrigatório'),
    appointmentDate: yup.date().required('Data do compromisso é obrigatória'),
    meetingDateTime: yup
      .date()
      .required('Data e hora da reunião são obrigatórios'),
  })
  .test(
    'endTime',
    'Horário de fim deve ser depois do início',
    function (value) {
      if (value.startTime && value.endTime) {
        return value.endTime > value.startTime;
      }
      return true;
    }
  );

const TimeInputExample = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(timeSchema),
    defaultValues: {
      startTime: undefined,
      endTime: undefined,
      appointmentDate: undefined,
      meetingDateTime: undefined,
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  const watchedValues = watch();

  return (
    <View className='p-4 space-y-4'>
      <Text className='text-xl font-bold mb-4'>Exemplos de TimeInput</Text>

      {/* Basic TimeInput */}
      <View>
        <Text className='text-lg font-semibold mb-2'>TimeInput Básico</Text>
        <TimeInput
          label='Horário de Início'
          name='startTime'
          setValue={setValue}
          errors={errors}
          placeholder='Selecione o horário de início'
          mode='time'
          format='24h'
          minuteInterval={15}
        />
      </View>

      {/* TimeInput with 12h format */}
      <View>
        <Text className='text-lg font-semibold mb-2'>TimeInput 12h</Text>
        <TimeInput
          label='Horário de Fim'
          name='endTime'
          setValue={setValue}
          errors={errors}
          placeholder='Selecione o horário de fim'
          mode='time'
          format='12h'
          minuteInterval={30}
        />
      </View>

      {/* Date Input */}
      <View>
        <Text className='text-lg font-semibold mb-2'>Date Input</Text>
        <TimeInput
          label='Data do Compromisso'
          name='appointmentDate'
          setValue={setValue}
          errors={errors}
          placeholder='Selecione a data'
          mode='date'
        />
      </View>

      {/* DateTime Input */}
      <View>
        <Text className='text-lg font-semibold mb-2'>DateTime Input</Text>
        <TimeInput
          label='Data e Hora da Reunião'
          name='meetingDateTime'
          setValue={setValue}
          errors={errors}
          placeholder='Selecione data e hora'
          mode='datetime'
          format='24h'
        />
      </View>

      {/* TimeInput with Validation */}
      <View>
        <Text className='text-lg font-semibold mb-2'>
          TimeInput com Validação
        </Text>
        <TimeInputWithValidation
          label='Horário Obrigatório'
          name='requiredTime'
          control={control}
          setValue={setValue}
          errors={errors}
          placeholder='Selecione um horário'
          required={true}
          mode='time'
          format='24h'
        />
      </View>

      {/* Disabled TimeInput */}
      <View>
        <Text className='text-lg font-semibold mb-2'>
          TimeInput Desabilitado
        </Text>
        <TimeInput
          label='Horário Desabilitado'
          name='disabledTime'
          setValue={setValue}
          errors={errors}
          placeholder='Este campo está desabilitado'
          disabled={true}
          mode='time'
          format='24h'
        />
      </View>

      {/* Current Values Display */}
      <View className='mt-6 p-4 bg-gray-100 rounded-lg'>
        <Text className='text-lg font-semibold mb-2'>Valores Atuais:</Text>
        <Text>
          Início:{' '}
          {watchedValues.startTime
            ? watchedValues.startTime.toLocaleTimeString()
            : 'Não selecionado'}
        </Text>
        <Text>
          Fim:{' '}
          {watchedValues.endTime
            ? watchedValues.endTime.toLocaleTimeString()
            : 'Não selecionado'}
        </Text>
        <Text>
          Data:{' '}
          {watchedValues.appointmentDate
            ? watchedValues.appointmentDate.toLocaleDateString()
            : 'Não selecionado'}
        </Text>
        <Text>
          Data/Hora:{' '}
          {watchedValues.meetingDateTime
            ? watchedValues.meetingDateTime.toLocaleString()
            : 'Não selecionado'}
        </Text>
      </View>

      {/* Submit Button */}
      <View className='mt-4'>
        <Text
          className='bg-blue-500 text-white p-3 rounded-lg text-center'
          onPress={handleSubmit(onSubmit)}
        >
          Enviar Formulário
        </Text>
      </View>
    </View>
  );
};

export default TimeInputExample;
