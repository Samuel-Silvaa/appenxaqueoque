import { ScrollView, Text, View } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';

import * as yup from 'yup';
import { Controller, Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { requestCreatePatient } from 'src/infra/app/reducers/auth.reducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { TimeInput } from 'src/modules/shared/components/timeInput';
import SelectContainer from 'src/modules/shared/components/selectContainer/SelectContainer';

interface PatientSchemaProps {
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
  kinship: string;
  height: string;
  weight: string;
}

const patientSchema = yup.object<PatientSchemaProps>().shape({
  name: yup
    .string()
    .required('Preencha seu nome')
    .min(5, 'O Nome precisa ter no mínimo 5 letras'),
  email: yup.string().email().required('Preencha seu email'),
  birthDate: yup
    .date()
    .required('Preencha a data de nascimento')
    .default(new Date()),
  gender: yup.string().required('Preencha o sexo'),
  kinship: yup.string().required('Preencha o parentesco'),
  height: yup.string().required('Preencha a altura').min(3, 'Mínimo 3 digitos'),
  weight: yup.string().required('Preencha o peso'),
  avatar: yup.string().optional(),
});

const Patient = () => {
  const dispatchAsync = useAsyncAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [birthDate, setBirthDate] = useState<Date>(new Date());

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    reValidateMode: 'onSubmit',
    mode: 'onSubmit',
    defaultValues: { email: route.params?.email },
    resolver: yupResolver(patientSchema),
  });

  const onSubmitHandler = useCallback(async (data: PatientSchemaProps) => {
    console.log(data);
    const res = await dispatchAsync(
      requestCreatePatient({
        ...data,
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        birthDate: format(data.birthDate, 'yyyy-MM-dd'),
      })
    );

    if (res.meta.requestStatus == 'fulfilled') {
      (navigation as any).navigate('welcome');
    }
  }, []);

  useEffect(() => {
    if (route.params) {
      reset({ email: route.params.email });
    }
  }, [route.params]);

  useEffect(() => {
    setValue('birthDate', birthDate);
  }, [birthDate]);

  const Content = () => {
    return (
      <>
        <Text className={sharedStyleSheet.title}>Informações da conta</Text>
        <Text className={sharedStyleSheet.subtitle}>
          Insira as informações da criança
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          className='w-full h-[85%]'
        >
          <InputContainer
            className='opacity-45 bg-white drop-shadow-sm'
            keyboardType='email-address'
            label='E-mail'
            defaultValue={route.params?.email ?? ''}
            editable={false}
            name='email'
            style={{ opacity: 0.6 }}
            value={route.params?.email}
            errors={errors}
          />
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <InputContainer
                keyboardType='default'
                label='Nome da criança'
                onChangeText={field.onChange}
                {...field}
                name='name'
                errors={errors}
              />
            )}
          />

          <TimeInput
            label='Data de nascimento'
            mode='date'
            placeholder='Selecione a data de nascimento'
            value={birthDate}
            onChange={(date) => {
              setBirthDate(date);
            }}
            name='birthDate'
            errors={errors}
            maximumDate={new Date()}
          />

          <SelectContainer
            control={control}
            label='Gênero'
            placeholder='Selecione o sexo'
            options={[
              { title: 'Masculino', value: 'male' },
              { title: 'Feminino', value: 'female' },
            ]}
            name='gender'
            setValue={setValue}
            errors={errors}
          />

          <SelectContainer
            control={control}
            label='Parentesco'
            placeholder='Escolha o parentesco do responsável'
            setValue={setValue}
            options={[
              { title: 'Pai', value: 'father' },
              { title: 'Mãe', value: 'mother' },
              { title: 'Eu', value: 'patient' },
            ]}
            name='kinship'
            errors={errors}
          />
          <View className='flex-row justify-between items-center'>
            <View className='w-[45%]'>
              <Controller
                control={control}
                name='weight'
                render={({ field }) => (
                  <InputContainer
                    keyboardType='numeric'
                    label='Peso da criança'
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    errors={errors}
                    mask='999.9'
                    placeholder='0.0'
                    name='weight'
                  />
                )}
              />
            </View>

            <View className='w-[45%]'>
              <Controller
                control={control}
                name='height'
                render={({ field }) => (
                  <InputContainer
                    keyboardType='numeric'
                    label='Altura da criança'
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    errors={errors}
                    mask='9.99'
                    placeholder='0.00'
                    name='height'
                  />
                )}
              />
            </View>
          </View>
          <View className='h-[100px] w-full'></View>
        </ScrollView>
      </>
    );
  };

  return (
    <AuthScaffold
      alignment='start'
      ctaPrimaryText='Cadastrar'
      ctaPrimary={handleSubmit(onSubmitHandler)}
    >
      <Content />
    </AuthScaffold>
  );
};

export default Patient;
