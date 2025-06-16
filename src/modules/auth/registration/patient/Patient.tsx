import { ScrollView, Text, View } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/infra/auth/auth';
import { AuthenticationActions } from 'src/infra/auth/auth.actions';
import SelectContainer from 'src/modules/shared/components/selectContainer/SelectContainer';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { authSelector } from "src/infra/app/selectors";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { requestCreatePatient } from "src/infra/app/reducers/auth.reducer";
import { useNavigation } from "@react-navigation/native";

interface PatientSchemaProps {
  name: string;
  email: string;
  birthDate: string;
  gender: string;
  kinship: string;
  height: number;
  weight: number;
}

const patientSchema = yup.object<PatientSchemaProps>().shape({
  name: yup.string().required('Preencha seu nome').default('Samuel'),
  email: yup.string().email().required('Preencha seu email'),
  birthDate: yup
    .string()
    .required('Preencha a data de nascimento')
    .default('2010-10-10'),
  gender: yup.string().required('Preencha o sexo').default('female'),
  kinship: yup.string().required('Preencha o parentesco').default('mother'),
  height: yup.number().required('Preencha a altura').default(1.5),
  weight: yup.number().required('Preencha o peso').default(40),
});

const Patient = () => {
  const dispatch   = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const navigation = useNavigation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(patientSchema),
  });

  useEffect(() => {
    if (auth.sessionEmail) setValue('email', auth.sessionEmail);
  }, [auth.sessionEmail]);

  const onSubmitHandler =  async (data: PatientSchemaProps) => {
    const res = await dispatch(requestCreatePatient(data));

    if(res.meta.requestStatus == 'fulfilled') {
      navigation.navigate('welcome' as any as never);
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
        className='w-full p-4 pt-[40px] h-[70%]'
      >
        <InputContainer
          className='opacity-45 bg-white drop-shadow-sm'
          keyboardType='email-address'
          label='E-mail'
          defaultValue={auth?.sessionEmail ?? ''}
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
        <InputContainer
          keyboardType='default'
          label='Data de nascimento'
          setValue={setValue}
          name='birthDate'
          errors={errors}
        ></InputContainer>
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
            ></InputContainer>
          </View>

          <View className='w-[45%]'>
            <InputContainer
              keyboardType='numeric'
              label='Altura da criança'
              setValue={setValue}
              name='height'
              errors={errors}
            ></InputContainer>
          </View>
        </View>
        <View className='h-[100px] w-full'></View>
      </ScrollView>
    </AuthScaffold>
  );
};

export default Patient;
