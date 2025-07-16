import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { TimeInput } from 'src/modules/shared/components/timeInput';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectContainer from 'src/modules/shared/components/selectContainer/SelectContainer';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { authSelector } from "src/infra/app/selectors";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { requestCreatePatient } from "src/infra/app/reducers/auth.reducer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format, parse } from "date-fns";

interface PatientSchemaProps {
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
  kinship: string;
  height: number;
  weight: number;
}

const patientSchema = yup.object<PatientSchemaProps>().shape({
  name: yup.string().required('Preencha seu nome').default('Samuel'),
  email: yup.string().email().required('Preencha seu email'),
  birthDate: yup
    .date()
    .required('Preencha a data de nascimento')
    .default(new Date('2010-10-10')),
  gender: yup.string().required('Preencha o sexo').default('female'),
  kinship: yup.string().required('Preencha o parentesco').default('mother'),
  height: yup.number().required('Preencha a altura').default(1.5),
  weight: yup.number().required('Preencha o peso').default(40),
  avatar: yup.string().optional(),
});

const Patient = () => {
  const dispatch   = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(patientSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (auth.sessionEmail) setValue('email', auth.sessionEmail);
    
    // Check if avatar URI was passed from avatar selection
    const params = route.params as { avatar?: string };
    if (params?.email) {
      setValue('email', auth?.sessionEmail ?? route.params!.email ?? '')
    }
  }, [auth.sessionEmail, route.params]);

  const onSubmitHandler =  async (data: PatientSchemaProps) => {
   try {
    console.log({...data, birthDate: format(data.birthDate, 'yyyy-MM-dd')}, auth);
    const res = await dispatch(requestCreatePatient({
      ...data, 
      birthDate: format(data.birthDate, 'yyyy-MM-dd'),
    }));

    if(res.meta.requestStatus == 'fulfilled') {
      (navigation as any).navigate('welcome');
    } 

   }catch(err) {
    console.log(err)
   }
  };


  return (
    <AuthScaffold
      alignment='start'
      ctaPrimaryText='Cadastrar'
      ctaPrimary={handleSubmit(onSubmitHandler)}
    >
      <Text className={sharedStyleSheet.title}>Informações da conta</Text>
      <Text className={sharedStyleSheet.subtitle}>
        Insira as informações da criança
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='w-full p-4 pt-[20px] h-[80%]'
      >
        {watchedValues.avatar && (
        <View className="items-start mb-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
            <Image
              source={{ uri: watchedValues.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-sm text-gray-600 mt-1">Foto selecionada</Text>
        </View>
      )}
        <InputContainer
          className='opacity-45 bg-white drop-shadow-sm'
          keyboardType='email-address'
          label='E-mail'
          defaultValue={auth?.sessionEmail ?? route.params!.email ?? ''}
          name='email'
          editable={false}
          setValue={setValue}
          errors={errors}
        ></InputContainer>

        <InputContainer
          keyboardType='default'
          label='Nome da criança'
          setValue={setValue}
          name='name'
          errors={errors}
        ></InputContainer>
        <TimeInput
          label='Data de nascimento'
          name='birthDate'
          setValue={setValue}
          errors={errors}
          placeholder='Selecione a data de nascimento'
          mode='date'
          value={watchedValues.birthDate}
          maximumDate={new Date()}
        />
        <SelectContainer
          label='Gênero'
          placeholder='Selecione o sexo'
          name='gender'
          options={[
            { title: 'Masculino', value: 'male' },
            { title: 'Feminino', value: 'female' },
          ]}
          setValue={setValue}
          errors={errors}
        ></SelectContainer>
        <SelectContainer
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
        ></SelectContainer>
        <View className='flex-row justify-between items-center '>
          <View className='w-[45%]'>
            <InputContainer
              keyboardType='numeric'
              label='Peso da criança'
              setValue={setValue}
              name='weight'
              errors={errors}
              mask='999.9'
              placeholder='0.0'
            ></InputContainer>
          </View>

          <View className='w-[45%]'>
            <InputContainer
              keyboardType='numeric'
              label='Altura da criança'
              setValue={setValue}
              name='height'
              errors={errors}
              mask='9.99'
              placeholder='0.00'
            ></InputContainer>
          </View>
        </View>
        <View className='h-[100px] w-full'></View>
      </ScrollView>
    </AuthScaffold>
  );
};

export default Patient;
