import { ScrollView, Text, View } from 'react-native';

import * as yup from 'yup';
import { Controller, Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, appStateSelector } from 'src/infra/app/selectors';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { requestUpdatePatient } from 'src/infra/app/reducers/auth.reducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format, subMonths } from 'date-fns';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { TimeInput } from 'src/modules/shared/components/timeInput';
import SelectContainer from 'src/modules/shared/components/selectContainer/SelectContainer';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { useCallback, useEffect, useState } from 'react';
import { ToastOptions, useToast } from 'react-native-toast-notifications';
import { setPatientData } from 'src/infra/app/reducers/app.reducer';

interface PatientSchemaProps {
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
  kinship: string;
  height: string;
  weight: string;
}

interface RouteParams {
  avatar?: string;
  email?: string;
  isEditMode?: boolean;
}

const patientSchema = yup.object<PatientSchemaProps>().shape({
  name: yup
    .string()
    .required('Preencha seu nome')
    .min(5, 'O Nome precisa ter no mínimo 5 letras'),
  email: yup.string().email().required('Preencha seu email'),
  birthDate: yup.date().required('Preencha a data de nascimento').default(),
  gender: yup.string().required('Preencha o sexo'),
  kinship: yup.string().required('Preencha o parentesco'),
  height: yup.string().required('Preencha a altura').min(3, 'Mínimo 3 digitos'),
  weight: yup.string().required('Preencha o peso').min(2, 'Mínimo 2 digitos'),
  avatar: yup.string().optional(),
});

const Patient = () => {
  const dispatchAsync = useAsyncAppDispatch();
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);
  const navigation = useNavigation();
  const route = useRoute();
  const patientData = appState.patient;

  // Check if we're in edit mode
  const routeParams = route.params as RouteParams;

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    reValidateMode: 'onSubmit',
    defaultValues: { email: auth!.sessionEmail! },
    resolver: yupResolver(patientSchema),
  });
  const [birthDate, setBirthDate] = useState<Date>(new Date());

  const toast = useToast();

  const onSubmitHandler = useCallback(async (data: PatientSchemaProps) => {
    if (patientData!.id) {
      console.log({
        ...data,
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        birthDate: format(data.birthDate, 'yyyy-MM-dd'),
        id: patientData!.id,
      });
      const res = await dispatchAsync(
        requestUpdatePatient({
          ...data,
          weight: parseFloat(data.weight),
          height: parseFloat(data.height),
          birthDate: format(data.birthDate, 'yyyy-MM-dd'),
          id: patientData!.id,
        })
      );

      if (res.meta.requestStatus == 'rejected') {
        toast.hideAll();
        const toastOptions: ToastOptions = {
          type: 'danger',
        };
        toast.show(
          `Error inesperado ao  ${
            appState.episode.isEdition ? 'editar' : 'cadastrar'
          } paciente. Entre em contato com nosso suporte!`,
          toastOptions
        );
        return;
      } else if (res.meta.requestStatus == 'fulfilled') {
        toast.hideAll();
        const toastOptions: ToastOptions = {
          type: 'success',
        };
        toast.show(`Dados editados com sucesso.`, toastOptions);
        dispatch(setPatientData(res.meta.arg));
        (navigation as any).goBack();
      }
    }
  }, []);

  useEffect(() => {
    if (auth.sessionEmail) {
      reset({ email: auth.sessionEmail });
    }
    if (patientData?.birthDate) {
      reset({ birthDate: new Date(patientData.birthDate) });
      setValue('birthDate', new Date(patientData.birthDate));
    }
  }, [auth.sessionEmail, patientData]);

  const Content = useCallback(() => {
    return (
      <>
        <Text className={sharedStyleSheet.title}>Editar informações</Text>
        <Text className={sharedStyleSheet.subtitle}>
          Atualize as informações da criança
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          className='w-full h-[85%]'
        >
          <Controller
            control={control}
            defaultValue={auth.sessionEmail!}
            name='email'
            render={({ field }) => (
              <InputContainer
                className='opacity-45 bg-white drop-shadow-sm'
                keyboardType='email-address'
                label='E-mail'
                editable={false}
                style={{ opacity: 0.6 }}
                onChangeText={field.onChange}
                {...field}
                errors={errors}
              />
            )}
          />

          <Controller
            control={control}
            name='name'
            defaultValue={patientData!.name}
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

          <Controller
            control={control}
            name='birthDate'
            defaultValue={new Date(patientData!.birthDate)}
            render={({ field }) => (
              <TimeInput
                {...field}
                label='Data de nascimento'
                name='birthDate'
                setValue={setValue}
                errors={errors}
                placeholder='Selecione a data de nascimento'
                mode='date'
                maximumDate={subMonths(new Date(), 48)}
              />
            )}
          />

          <SelectContainer
            control={control}
            label='Gênero'
            placeholder='Selecione o sexo'
            defaultValue={patientData!.gender}
            name='gender'
            options={[
              { title: 'Masculino', value: 'male' },
              { title: 'Feminino', value: 'female' },
            ]}
            setValue={setValue}
            errors={errors}
          />

          <SelectContainer
            control={control}
            label='Parentesco'
            placeholder='Escolha o parentesco do responsável'
            setValue={setValue}
            defaultValue={patientData!.kinship}
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
                defaultValue={patientData!.weight.toString()}
                name='weight'
                render={({ field }) => (
                  <InputContainer
                    keyboardType='numeric'
                    label='Peso da criança'
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    errors={errors}
                    mask='999.9'
                    name='weight'
                    placeholder='0.0'
                  />
                )}
              />
            </View>

            <View className='w-[45%]'>
              <Controller
                control={control}
                defaultValue={patientData!.height.toString()}
                name='height'
                render={({ field }) => (
                  <InputContainer
                    keyboardType='numeric'
                    label='Altura da criança'
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    name='height'
                    errors={errors}
                    mask='9.99'
                    placeholder='0.00'
                  />
                )}
              />
            </View>
          </View>
          <View className='h-[100px] w-full'></View>
        </ScrollView>
      </>
    );
  }, [control, errors, setValue, auth, routeParams]);

  return (
    <AppPageScaffold hasArrowBack={true}>
      <Content></Content>
      <ExPressable title='Salvar' onPress={handleSubmit(onSubmitHandler)} />
    </AppPageScaffold>
  );
};

export default Patient;
