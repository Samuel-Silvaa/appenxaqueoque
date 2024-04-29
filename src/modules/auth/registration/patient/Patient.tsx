import { ScrollView, Text, View } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/infra/auth/auth';
import { AuthenticationActions } from 'src/infra/auth/auth.actions';
import SelectContainer from 'src/modules/shared/components/SelectContainer/SelectContainer';
import { useEffect } from 'react';

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
  name: yup.string().required('Preencha seu nome').default('Mariana'),
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
  const { dispatch, form } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(patientSchema),
  });

  useEffect(() => {
    if (form.user) setValue('email', form.user.email);
  });

  const onSubmitHandler = (data: PatientSchemaProps) => {
    console.log(data);
    dispatch(AuthenticationActions.REQUEST_CREATE_PATIENT, data);
  };

  return (
    <AuthScaffold
      alignment='start'
      ctaPrimaryText='Continuar'
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
          className='opacity-25 bg-white drop-shadow-sm'
          keyboardType='email-address'
          label='E-mail'
          defaultValue={(form as { user: any; session: object }).user.email}
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
